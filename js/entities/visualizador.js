const BAR_COUNT = 36;
const BAR_LENGTH_FACTOR = 1;
const MAX_PIXEL_RATIO = 1.5;
const MOBILE_MAX_PIXEL_RATIO = 1;
const VISUALIZER_FRAME_DURATION = 1000 / 30;
const FREQUENCY_MIN = 45;
const FREQUENCY_MAX = 11000;
const FREQUENCY_NYQUIST = 22050;

// ───────── Fondo reactivo (ajusta estos valores a tu gusto) ─────────
// El color representa la intensidad: matiz 232 (azul, suave) -> magenta -> rojo -> naranja (intenso).
const BG_HUE_QUIET = 232; // matiz de la música más suave (0-360)
const BG_HUE_SPAN = 163; // cuánto se desplaza el matiz hacia la intensidad máxima
const BG_MAX_ALPHA = 0.4; // visibilidad del resplandor base (0 = apagado)
const BG_COLOR_RISE = 0.18; // qué tan rápido el color sube (0.05 lento, 0.6 brusco)
const BG_COLOR_FALL = 0.05; // qué tan rápido el color baja

// Ondas: una por cada golpe de graves, nacen en el anillo y se expanden.
const WAVE_DURATION_MS = 2600; // cuánto tarda una onda en llegar al borde
const WAVE_MAX_COUNT = 6; // máximo de ondas a la vez (también cuida el rendimiento)
const WAVE_ALPHA = 0.32; // opacidad máxima de cada onda
const WAVE_THICKNESS = 0.14; // grosor de la onda (fracción del tamaño de pantalla)
const WAVE_LIGHTNESS = 46; // brillo del color de la onda (0-100)
const WAVE_FALLBACK_MS = 1800; // si no hay beats, lanza una onda suave cada tanto (0 = nunca)

// Detección de ritmo
const BEAT_MIN_INTERVAL = 190; // ms mínimos entre ondas
const BEAT_SENSITIVITY = 1.12; // menor = más ondas (1.05 sensible, 1.3 exigente)

let canvas = null;
let context = null;
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
let ultimoRender = 0;
let colorIntensity = 0;
let energyPeak = 0;
let bassAverage = 0;
let previousBass = 0;
let ultimoBeat = 0;
const waves = [];

function ajustarCanvas() {
  if (!canvas || !context) return;
  const maxPixelRatio = window.matchMedia(
    "(max-width: 600px) and (pointer: coarse)",
  ).matches
    ? MOBILE_MAX_PIXEL_RATIO
    : MAX_PIXEL_RATIO;
  const nextRatio = Math.min(maxPixelRatio, window.devicePixelRatio || 1);
  currentWidth = window.innerWidth;
  currentHeight = window.innerHeight;
  const width = Math.max(1, Math.round(currentWidth * nextRatio));
  const height = Math.max(1, Math.round(currentHeight * nextRatio));
  if (width === canvas.width && height === canvas.height) {
    dibujarAnillo(0, false);
    return;
  }

  canvas.width = width;
  canvas.height = height;
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

function nivelAHue(nivel) {
  return Math.round((BG_HUE_QUIET + nivel * BG_HUE_SPAN) % 360);
}

function lanzarOnda(ahora, fuerza) {
  if (waves.length >= WAVE_MAX_COUNT) waves.shift();
  // La onda conserva el color que tenía la música cuando nació.
  waves.push({ inicio: ahora, hue: nivelAHue(colorIntensity), fuerza });
}

function actualizarColor(energia, bajos, ahora) {
  // Intensidad relativa a lo más fuerte que ha sonado, con un piso para que
  // los pasajes suaves se queden en azul/violeta y no se "inflen" hasta el rojo.
  energyPeak = Math.max(energia, energyPeak * 0.996);
  const relativa = Math.min(1, energia / Math.max(energyPeak, 0.5));
  const objetivo = Math.pow(relativa, 1.35);
  colorIntensity +=
    (objetivo - colorIntensity) *
    (objetivo > colorIntensity ? BG_COLOR_RISE : BG_COLOR_FALL);

  // Beat: subida de los graves por encima de su promedio reciente.
  const esBeat =
    bajos > 0.28 &&
    bajos > bassAverage * BEAT_SENSITIVITY + 0.04 &&
    bajos > previousBass &&
    ahora - ultimoBeat > BEAT_MIN_INTERVAL;
  if (esBeat) {
    ultimoBeat = ahora;
    lanzarOnda(ahora, 0.55 + 0.45 * Math.min(1, bajos));
  } else if (
    WAVE_FALLBACK_MS > 0 &&
    energia > 0.12 &&
    ahora - ultimoBeat > WAVE_FALLBACK_MS
  ) {
    // Música sin golpes marcados (pads, ambient): una onda tenue de vez en cuando.
    ultimoBeat = ahora;
    lanzarOnda(ahora, 0.4);
  }
  bassAverage += (bajos - bassAverage) * 0.06;
  previousBass = bajos;
}

function dibujarOndas(ahora, centerX, centerY, radioAnillo, alcance) {
  const visualizerSize = Math.min(currentWidth, currentHeight);
  const duracion = WAVE_DURATION_MS * (reducedMotion ? 1.6 : 1);
  const alfaMax = WAVE_ALPHA * (reducedMotion ? 0.6 : 1);

  for (let i = waves.length - 1; i >= 0; i -= 1) {
    const onda = waves[i];
    const progreso = (ahora - onda.inicio) / duracion;
    if (progreso >= 1) {
      waves.splice(i, 1);
      continue;
    }

    // Sale rápido del anillo y va frenando suavemente hacia el borde.
    const avance = 1 - Math.pow(1 - progreso, 2.2);
    const centro = radioAnillo + avance * (alcance - radioAnillo);
    const mitad = visualizerSize * WAVE_THICKNESS * (0.5 + progreso * 0.9);
    const interior = Math.max(0, centro - mitad);
    const exterior = centro + mitad;

    // Entra con un fundido corto y se desvanece al expandirse.
    const entrada = Math.min(1, progreso / 0.08);
    const salida = Math.pow(1 - progreso, 1.6);
    const alfa = alfaMax * onda.fuerza * entrada * salida;
    if (alfa < 0.004) continue;

    const color = `hsla(${onda.hue}, 85%, ${WAVE_LIGHTNESS}%, `;
    const gradient = context.createRadialGradient(
      centerX,
      centerY,
      interior,
      centerX,
      centerY,
      exterior,
    );
    gradient.addColorStop(0, `${color}0)`);
    gradient.addColorStop(0.55, `${color}${alfa.toFixed(3)})`);
    gradient.addColorStop(1, `${color}0)`);
    context.fillStyle = gradient;
    context.fillRect(
      centerX - exterior,
      centerY - exterior,
      exterior * 2,
      exterior * 2,
    );
  }
}

function dibujarFondo(animado) {
  if (!animado) return;

  const nivel = colorIntensity;
  const hue = nivelAHue(nivel);
  const saturation = Math.round(70 + nivel * 18);
  const lightness = 14 + nivel * 20;
  const alpha = BG_MAX_ALPHA * (0.3 + nivel * 0.7);

  const centerX = currentWidth / 2;
  const centerY = currentHeight / 3;
  const alcance = Math.hypot(centerX, currentHeight - centerY);
  const visualizerSize = Math.min(currentWidth, currentHeight);

  // Resplandor base: cambia de color despacio con la intensidad (sin destellos).
  const reach = alcance * (0.7 + nivel * 0.3);
  const gradient = context.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    reach,
  );
  gradient.addColorStop(
    0,
    `hsla(${hue}, ${saturation}%, ${lightness.toFixed(1)}%, ${alpha.toFixed(3)})`,
  );
  gradient.addColorStop(
    0.55,
    `hsla(${hue}, ${saturation}%, ${(lightness * 0.7).toFixed(1)}%, ${(alpha * 0.55).toFixed(3)})`,
  );
  gradient.addColorStop(
    1,
    `hsla(${hue}, ${saturation}%, ${(lightness * 0.4).toFixed(1)}%, 0)`,
  );
  context.fillStyle = gradient;
  context.fillRect(0, 0, currentWidth, currentHeight);

  dibujarOndas(ultimoRender, centerX, centerY, visualizerSize * 0.1, alcance);
}

function dibujarAnillo(energia, animado) {
  if (!context || !currentWidth || !currentHeight) return;

  const centerX = currentWidth / 2;
  const centerY = currentHeight / 3;
  const visualizerSize = Math.min(currentWidth, currentHeight);
  const radius = visualizerSize * 0.1;
  const baseLength = visualizerSize * 0.02 * (0.82 + energia * 0.55);
  const sensitivity = reducedMotion ? 0.58 : 1;
  const lineWidth = Math.max(1, visualizerSize * 0.012);
  const maxLength = Math.max(
    0,
    Math.min(centerX, centerY) - radius - lineWidth / 2,
  );
  context.clearRect(0, 0, currentWidth, currentHeight);
  dibujarFondo(animado);
  context.lineWidth = lineWidth;
  context.lineCap = "round";

  for (let bar = 0; bar < BAR_COUNT; bar += 1) {
    const bin = frequencyBins[bar];
    const sample = animado ? frequencyData[bin] / 255 : 0;
    const length = Math.min(
      maxLength,
      baseLength + sample * maxLength * BAR_LENGTH_FACTOR * sensitivity,
    );
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
  if (!active) dibujarAnillo(0, false);
}

export function inicializarVisualizador() {
  if (canvas) return Boolean(context);

  canvas = document.getElementById("audio-visualizer");
  if (!canvas) return false;

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
    observer.observe(canvas);
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
  if (!context) return;
  if (!musicaActiva || !analyser) {
    if (requestedActive) pausarVisualizador();
    return;
  }
  if (!active || document.hidden) return;

  const ahora = performance.now();
  if (ahora - ultimoRender < VISUALIZER_FRAME_DURATION) return;
  ultimoRender = ahora;

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
  actualizarColor(energy, bass, ahora);
  dibujarAnillo(smoothedEnergy, true);
}

export function pausarVisualizador() {
  requestedActive = false;
  active = false;
  analyser = null;
  smoothedEnergy = 0;
  ultimoRender = 0;
  colorIntensity = 0;
  energyPeak = 0;
  bassAverage = 0;
  previousBass = 0;
  ultimoBeat = 0;
  waves.length = 0;
  dibujarAnillo(0, false);
}

export function limpiarVisualizador() {
  pausarVisualizador();
}
