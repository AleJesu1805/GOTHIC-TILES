const sonidos = {
  0: "./assets/audio/piano5.mp3",
  1: "./assets/audio/piano6.mp3",
  2: "./assets/audio/piano3.mp3",
  3: "./assets/audio/piano4.mp3",
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const buffers = {};

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

export function reproducirSonido(nombre, volumen = 0.5) {
  if (!buffers[nombre]) return;

  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();

  source.buffer = buffers[nombre];
  gainNode.gain.value = volumen;

  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start(0);
}

for (let [number, sound] of Object.entries(sonidos)) {
  cargarSonido(String(number), sound);
}

document.addEventListener(
  "touchstart",
  () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
  },
  { once: true },
);
