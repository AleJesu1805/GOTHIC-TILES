const CACHE_NAME = "gothic-tiles-cache-v1";
const descargasCompletasEnCurso = new Map();

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((nombresCache) =>
        Promise.all(
          nombresCache
            .filter((nombre) => nombre !== CACHE_NAME)
            .map((nombre) => caches.delete(nombre)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Descarga (o reusa si ya esta en cache) la version COMPLETA del archivo,
// sin encabezado Range, y la guarda en cache. Es la unica forma de que un
// audio/video pedido por rangos termine cacheado entero.
async function obtenerVersionCompleta(url) {
  const peticionCompleta = new Request(url, { method: "GET" });

  const enCache = await caches.match(peticionCompleta);
  if (enCache) return enCache;

  if (descargasCompletasEnCurso.has(url)) {
    return descargasCompletasEnCurso.get(url);
  }

  const promesa = fetch(peticionCompleta)
    .then(async (respuesta) => {
      if (respuesta && respuesta.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(peticionCompleta, respuesta.clone());
      }
      return respuesta;
    })
    .finally(() => descargasCompletasEnCurso.delete(url));

  descargasCompletasEnCurso.set(url, promesa);
  return promesa;
}

// Dado el archivo completo (cacheado o recien bajado) y el encabezado
// Range original, recorta a mano los bytes pedidos y arma una respuesta
// 206 igual a la que daria un servidor real.
async function recortarPorRango(respuestaCompleta, encabezadoRange) {
  const buffer = await respuestaCompleta.clone().arrayBuffer();
  const total = buffer.byteLength;

  const coincidencia = /bytes=(\d*)-(\d*)/.exec(encabezadoRange || "");
  let inicio =
    coincidencia && coincidencia[1] !== ""
      ? parseInt(coincidencia[1], 10)
      : null;
  let fin =
    coincidencia && coincidencia[2] !== ""
      ? parseInt(coincidencia[2], 10)
      : null;

  if (inicio === null && fin !== null) {
    // Formato "bytes=-500": los ultimos 500 bytes del archivo.
    inicio = Math.max(total - fin, 0);
    fin = total - 1;
  } else {
    if (inicio === null) inicio = 0;
    if (fin === null || fin > total - 1) fin = total - 1;
  }

  const trozo = buffer.slice(inicio, fin + 1);

  return new Response(trozo, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type":
        respuestaCompleta.headers.get("Content-Type") ||
        "application/octet-stream",
      "Content-Range": `bytes ${inicio}-${fin}/${total}`,
      "Content-Length": String(trozo.byteLength),
      "Accept-Ranges": "bytes",
    },
  });
}

async function servirPeticionPorRango(request) {
  try {
    const completa = await obtenerVersionCompleta(request.url);
    if (!completa || !completa.ok) return completa;
    return await recortarPorRango(completa, request.headers.get("range"));
  } catch (error) {
    console.warn("[SW] no se pudo servir por rango", request.url, error);
    return undefined;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo interceptamos peticiones GET del mismo origen (los archivos
  // propios del proyecto). Todo lo demas (POST, peticiones a otros
  // dominios, extensiones, etc.) se deja pasar sin tocar.
  if (
    request.method !== "GET" ||
    new URL(request.url).origin !== self.location.origin
  ) {
    return;
  }

  // Peticiones por rango de bytes (audio/video pidiendo pedazos): se
  // resuelven bajando/reusando el archivo completo cacheado y recortando
  // el pedazo pedido a mano, porque la Cache API no admite guardar
  // respuestas 206 directamente.
  if (request.headers.has("range")) {
    event.respondWith(servirPeticionPorRango(request));
    return;
  }

  event.respondWith(
    fetch(request)
      .then((respuestaRed) => {
        // Si la red responde bien, esa es la version mas nueva:
        // se guarda (o se sobreescribe) en cache para uso offline.
        if (respuestaRed && respuestaRed.ok) {
          const copia = respuestaRed.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, copia);
            })
            .catch((error) =>
              console.warn("[SW] no se pudo cachear", request.url, error),
            );
        }
        return respuestaRed;
      })
      .catch(() =>
        // Sin conexion: se busca en cache. Si es una navegacion
        // (el usuario abriendo la pagina) y no hay nada guardado
        // para esa URL exacta, se cae de vuelta al index.html cacheado.
        caches.match(request).then((cacheado) => {
          if (cacheado) return cacheado;
          if (request.mode === "navigate") return caches.match("./index.html");
          return undefined;
        }),
      ),
  );
});
