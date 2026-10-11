const BAR_COUNT = 48;
const MAX_PIXEL_RATIO = 1.5;
const FREQUENCY_MIN = 45;
const FREQUENCY_MAX = 11000;
const FREQUENCY_NYQUIST = 22050;

let canvas = null;
let context = null;
let brand = null;
let analyser = null;
let frequencyData = null;
let frequencyBins = null;
let observer = null;
let active = false;
let requestedActive = false;
let reducedMotion = false;
let currentWidth = 0;
let currentHeight = 0;
let pixelRatio = 1;
let smoothedEnergy = 0;

function ajustarCanvas() {
  if (!canvas || !context) return;
  const bounds = canvas.getBoundingClientRect();
  const nextRatio = Math.min(MAX_PIXEL_RATIO, window.devicePixelRatio || 1);
  const width = Math.max(1, Math.round(bounds.width * nextRatio));
  const height = Math.max(1, Math.round(bounds.height * nextRatio));
  if (width === canvas.width && height === canvas.height) return;

  canvas.width = width;
  canvas.height = height;
  currentWidth = bounds.width;
  currentHeight = bounds.height;
  pixelRatio = nextRatio;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  dibujarAnillo(0, false);
}

function obtenerNivel(inicio, fin) {
  let total = 0;
  let cantidad = 0;
  for (let indice = inicio; indice < fin; indice += 1) {
    total += frequencyData[indice] / 255;
    cantidad += 1;
  }
  return cantidad ? total / cantidad : 0;
}

function dibujarAnillo(energia, animado) {
  if (!context || !currentWidth || !currentHeight) return;

  const centerX = currentWidth / 2;
  const centerY = currentHeight / 2;
  const radius = Math.min(currentWidth, currentHeight) * 0.35;
  const baseLength =
    Math.min(currentWidth, currentHeight) * 0.018 * (0.82 + energia * 0.55);
  const sensitivity = reducedMotion ? 0.58 : 1;
  context.clearRect(0, 0, currentWidth, currentHeight);
  context.lineWidth = Math.max(1, currentWidth * 0.012);
  context.lineCap = "round";

  for (let bar = 0; bar < BAR_COUNT; bar += 1) {
    const bin = frequencyBins[bar];
    const sample = animado ? frequencyData[bin] / 255 : 0;
    const length = baseLength + sample * currentWidth * 0.17 * sensitivity;
    const angle = (bar / BAR_COUNT) * Math.PI * 2 - Math.PI / 2;
    const innerRadius = radius;
    const outerRadius = radius + length;
    context.strokeStyle =
      sample > 0.58 ? "#dc3947" : sample > 0.28 ? "#a52734" : "#737579";
    context.globalAlpha = 0.48 + sample * 0.52;
    context.beginPath();
    context.moveTo(
      centerX + Math.cos(angle) * innerRadius,
      centerY + Math.sin(angle) * innerRadius,
    );
    context.lineTo(
      centerX + Math.cos(angle) * outerRadius,
      centerY + Math.sin(angle) * outerRadius,
    );
    context.stroke();
  }
  context.globalAlpha = 1;
}

function cambiarVisibilidad() {
  active = requestedActive && !document.hidden;
  brand?.classList.toggle("is-visible", requestedActive);
  brand?.classList.toggle("is-active", active);
  if (!active) dibujarAnillo(0, false);
}

export function inicializarVisualizador() {
  if (canvas) return Boolean(context);

  canvas = document.getElementById("audio-visualizer");
  brand = document.getElementById("audio-brand");
  if (!canvas || !brand) return false;

  context = canvas.getContext("2d", { alpha: true });
  if (!context) return false;

  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  frequencyData = new Uint8Array(1024);
  frequencyBins = new Uint16Array(BAR_COUNT);
  for (let bar = 0; bar < BAR_COUNT; bar += 1) {
    const progress = bar / (BAR_COUNT - 1);
    const frequency =
      FREQUENCY_MIN * Math.pow(FREQUENCY_MAX / FREQUENCY_MIN, progress);
    frequencyBins[bar] = Math.min(
      frequencyData.length - 1,
      Math.round((frequency / FREQUENCY_NYQUIST) * frequencyData.length),
    );
  }

  if ("ResizeObserver" in window) {
    observer = new ResizeObserver(ajustarCanvas);
    observer.observe(brand);
  }
  window.addEventListener("resize", ajustarCanvas, { passive: true });
  document.addEventListener("visibilitychange", cambiarVisibilidad);
  window.addEventListener(
    "pagehide",
    () => {
      observer?.disconnect();
      observer = null;
      window.removeEventListener("resize", ajustarCanvas);
      document.removeEventListener("visibilitychange", cambiarVisibilidad);
    },
    { once: true },
  );
  ajustarCanvas();
  return true;
}

export function activarVisualizador(nuevoAnalyser) {
  if (!context || !nuevoAnalyser) {
    pausarVisualizador();
    return;
  }

  analyser = nuevoAnalyser;
  if (frequencyData.length !== analyser.frequencyBinCount) {
    frequencyData = new Uint8Array(analyser.frequencyBinCount);
    for (let bar = 0; bar < BAR_COUNT; bar += 1) {
      const progress = bar / (BAR_COUNT - 1);
      const frequency =
        FREQUENCY_MIN * Math.pow(FREQUENCY_MAX / FREQUENCY_MIN, progress);
      frequencyBins[bar] = Math.min(
        frequencyData.length - 1,
        Math.round((frequency / FREQUENCY_NYQUIST) * frequencyData.length),
      );
    }
  }
  requestedActive = true;
  cambiarVisibilidad();
}

export function renderizarVisualizador(musicaActiva) {
  if (!context || !brand) return;
  if (!musicaActiva || !analyser) {
    if (requestedActive) pausarVisualizador();
    return;
  }
  if (!active || document.hidden) return;

  analyser.getByteFrequencyData(frequencyData);
  const bassEnd = Math.max(
    2,
    Math.floor((frequencyData.length * 250) / FREQUENCY_NYQUIST),
  );
  const midEnd = Math.max(
    bassEnd + 1,
    Math.floor((frequencyData.length * 2000) / FREQUENCY_NYQUIST),
  );
  const highEnd = Math.min(
    frequencyData.length,
    Math.floor((frequencyData.length * FREQUENCY_MAX) / FREQUENCY_NYQUIST),
  );
  const bass = obtenerNivel(0, bassEnd);
  const mids = obtenerNivel(bassEnd, midEnd);
  const highs = obtenerNivel(midEnd, highEnd);
  const energy = Math.min(1, bass * 0.52 + mids * 0.33 + highs * 0.15);
  const attack = energy > smoothedEnergy ? 0.62 : 0.14;
  smoothedEnergy += (energy - smoothedEnergy) * attack;
  dibujarAnillo(smoothedEnergy, true);
}

export function pausarVisualizador() {
  requestedActive = false;
  active = false;
  analyser = null;
  smoothedEnergy = 0;
  brand?.classList.remove("is-active");
  dibujarAnillo(0, false);
}

export function limpiarVisualizador() {
  pausarVisualizador();
  brand?.classList.remove("is-visible");
}
