const sonidos = {
  0: "./assets/audio/teclas/archivos-audio/piano5.mp3",
  1: "./assets/audio/teclas/archivos-audio/piano6.mp3",
  2: "./assets/audio/teclas/archivos-audio/piano3.mp3",
  3: "./assets/audio/teclas/archivos-audio/piano4.mp3",
};

const sonidosJson = {
  0: "./assets/audio/teclas/archivos-json/random.json",
  1: "./assets/audio/teclas/archivos-json/random.json",
  2: "./assets/audio/teclas/archivos-json/random.json",
  3: "./assets/audio/teclas/archivos-json/random.json",
};

let musicaActual = null;

export const canciones = {
  Boom_BEP: "./assets/audio/canciones/Boom Boom Pow.mp3",
  Hump_BEP: "./assets/audio/canciones/My Humps.mp3",
  NoRemorse_Slayer:
    "./assets/audio/canciones/No Remorse (I Wanna Die)(MP3_160K).mp3",
  sweetDreams_MarylinManson:
    "./assets/audio/canciones/MarilynMansonVEVO - Marilyn Manson - Sweet Dreams (Are Made Of This) (Alt. Version).mp3",
  async reproducirCancion(ruta, volumen = 1, segundoInicio = 0) {
    musicaActual?.pause();
    musicaActual = new Audio(ruta);
    musicaActual.preload = "auto";
    musicaActual.volume = Math.min(1, Math.max(0, volumen));
    musicaActual.currentTime = Math.max(0, segundoInicio);
    try {
      await musicaActual.play();
      return true;
    } catch (error) {
      console.error("No se pudo iniciar la canción:", error);
      return false;
    }
  },
  pausarCancion() {
    musicaActual?.pause();
  },
  reanudarCancion() {
    if (musicaActual?.paused) void musicaActual.play();
  },
};

export const audioCtx = new (
  window.AudioContext || window.webkitAudioContext
)();
const buffers = {};
const fuentesActivas = new Map();
const buffersJson = new Map();
const cargasJson = new Map();
const audioSistema = globalThis.ytgame?.system;
let audioHabilitado = audioSistema?.isAudioEnabled?.() ?? true;
const gananciaMaestra = audioCtx.createGain();
gananciaMaestra.gain.value = audioHabilitado ? 1 : 0;
gananciaMaestra.connect(audioCtx.destination);

function actualizarAudio(habilitado) {
  audioHabilitado = habilitado;
  gananciaMaestra.gain.setValueAtTime(habilitado ? 1 : 0, audioCtx.currentTime);
}

audioSistema?.onAudioEnabledChange?.(actualizarAudio);
actualizarAudio(audioSistema?.isAudioEnabled?.() ?? true);

const worker = new Worker(new URL("../workers/worker.js", import.meta.url));

worker.onmessage = async (e) => {
  const { nombre, arrayBuffer, ok, error } = e.data;
  if (!ok) {
    console.error(`Error al cargar el sonido ${nombre}: ${error}`);
    return;
  }

  try {
    buffers[nombre] = await audioCtx.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error(`No se pudo decodificar el sonido ${nombre}:`, error);
  }
};

function cargarSonido(nombre, url) {
  const urlAbsoluta = new URL(url, document.baseURI).href;
  worker.postMessage({ nombre, url: urlAbsoluta });
}

export function reproducirSonido(nombre, volumen = 0.5, segundoInicio = 0) {
  if (!audioHabilitado || !buffers[nombre]) return;

  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();

  source.buffer = buffers[nombre];
  gainNode.gain.value = volumen;

  source.connect(gainNode);
  gainNode.connect(gananciaMaestra);
  fuentesActivas.set(nombre, source);
  source.addEventListener(
    "ended",
    () => {
      if (fuentesActivas.get(nombre) === source) fuentesActivas.delete(nombre);
    },
    { once: true },
  );
  source.start(0, segundoInicio);
}

function crearBufferDesdeParametros(parametros) {
  const sampleRate = Number(parametros.sample_rate) || audioCtx.sampleRate;
  const ataque = Math.pow(Number(parametros.p_env_attack) || 0, 2) * 100000;
  const sostenido = Math.pow(Number(parametros.p_env_sustain) || 0, 2) * 100000;
  const decaimiento = Math.pow(Number(parametros.p_env_decay) || 0, 2) * 100000;
  const totalMuestras = Math.max(
    1,
    Math.min(Math.ceil(ataque + sostenido + decaimiento), sampleRate * 10),
  );
  const buffer = audioCtx.createBuffer(1, totalMuestras, sampleRate);
  const muestras = buffer.getChannelData(0);
  const tipoOnda = Number(parametros.wave_type) || 0;
  const frecuenciaParametro = Number(parametros.p_base_freq);
  const frecuenciaBase = Number.isFinite(frecuenciaParametro)
    ? frecuenciaParametro
    : 0.3;
  const barrido = Number(parametros.p_freq_ramp) || 0;
  const volumenParametro = Number(parametros.sound_vol);
  const volumen = Math.min(
    1,
    Math.max(0, Number.isFinite(volumenParametro) ? volumenParametro : 0.5),
  );
  const punch = Math.max(0, Number(parametros.p_env_punch) || 0);
  let semilla = 1;

  for (let indice = 0; indice < totalMuestras; indice += 1) {
    const tiempo = indice / sampleRate;
    const periodoBase = 100 / (frecuenciaBase * frecuenciaBase + 0.001);
    const frecuencia = Math.min(
      sampleRate * 0.45,
      Math.max(
        20,
        (sampleRate / periodoBase) * Math.pow(1 - barrido * 0.01, indice),
      ),
    );
    let envolvente;

    if (indice < ataque) {
      envolvente = indice / Math.max(1, ataque);
    } else if (indice < ataque + sostenido) {
      const progreso = (indice - ataque) / Math.max(1, sostenido);
      envolvente = 1 + punch * (1 - progreso);
    } else {
      const progreso = (indice - ataque - sostenido) / Math.max(1, decaimiento);
      envolvente = 1 - progreso;
    }

    const fase = (tiempo * frecuencia) % 1;
    let muestra;
    if (tipoOnda === 1) {
      muestra = 1 - 2 * fase;
    } else if (tipoOnda === 2) {
      muestra = Math.sin(2 * Math.PI * fase);
    } else if (tipoOnda === 3) {
      semilla = (semilla * 16807) % 2147483647;
      muestra = semilla / 1073741823.5 - 1;
    } else {
      muestra = fase < 0.5 ? 1 : -1;
    }

    muestras[indice] = muestra * Math.max(0, envolvente) * volumen * 0.5;
  }

  return buffer;
}

export async function cargarSonidoJson(ruta, clave) {
  if (typeof ruta !== "string" || typeof clave !== "string") {
    throw new TypeError("La ruta y la clave deben ser cadenas de texto.");
  }

  if (buffersJson.has(clave)) return buffersJson.get(clave);

  const url = new URL(ruta, document.baseURI).href;
  let carga = cargasJson.get(url);
  if (!carga) {
    carga = fetch(url)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error(
            `No se pudo cargar el sonido JSON: HTTP ${respuesta.status}`,
          );
        }
        return respuesta.json();
      })
      .then((parametros) => {
        return crearBufferDesdeParametros(parametros);
      })
      .finally(() => cargasJson.delete(url));
    cargasJson.set(url, carga);
  }

  const buffer = await carga;
  buffersJson.set(clave, buffer);
  return buffer;
}

export function reproducirSonidoJson(clave) {
  if (typeof clave !== "string") {
    throw new TypeError("La clave debe ser una cadena de texto.");
  }
  if (!audioHabilitado) return false;

  const buffer = buffersJson.get(clave);
  if (!buffer) {
    console.warn(`El sonido JSON aún no está cargado: ${clave}`);
    return false;
  }

  void audioCtx.resume();
  detenerSonido(clave);
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  source.connect(gananciaMaestra);
  fuentesActivas.set(clave, source);
  source.addEventListener(
    "ended",
    () => {
      if (fuentesActivas.get(clave) === source) fuentesActivas.delete(clave);
    },
    { once: true },
  );
  source.start();
  return true;
}

export function detenerSonido(nombre) {
  const source = fuentesActivas.get(nombre);
  if (!source) return;

  fuentesActivas.delete(nombre);
  source.stop();
}

for (let [number, sound] of Object.entries(sonidos)) {
  cargarSonido(String(number), sound);
}

for (let [number, sound] of Object.entries(sonidosJson)) {
  cargarSonidoJson(sound, String(number)).catch((error) => {
    console.error(`No se pudo precargar el sonido JSON ${number}:`, error);
  });
}
