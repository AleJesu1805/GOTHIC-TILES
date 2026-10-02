import { crearTilesStaticas, renderizarTileCayendo } from "./entities/Tiles.js";
import {
  cargarTiemposGenerales,
  limpiarProgramacionTiles,
  pausarProgramacionTiles,
  programarTiles,
  reanudarProgramacionTiles,
  convertirTiempoATiempoObjetivo,
  tiemposGenerales,
} from "./data/tiempos.js";
import {
  detenerCronometro,
  getTiempoTranscurrido,
  initCronometer,
  resetCronometro,
} from "./entities/cronometro.js";
import { cleanCanvas } from "./core/canvas.js";
import "./UI/interaction.js";
import {
  FRAME_DURATION,
  cronometroElement,
  finalScreen,
  finalTime,
  progressBar,
  welcomeScreen,
} from "./config.js";
import { audioCtx, detenerSonido, reproducirSonido } from "./core/audio.js";
import { ocultarFeedback } from "./UI/feedback.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

let ultimoTiempo = 0;
let animationFrameId = null;
let juegoActivo = false;
let juegoPausado = false;
let reanudarPartidaAlDespausar = false;
let juegoCompletado = false;
let inicioEnCurso = false;
let frameCount = 0;

function calcularDuracionTotal() {
  return tiemposGenerales.reduce(
    (duracionMaxima, [, tiempo]) =>
      Math.max(duracionMaxima, convertirTiempoATiempoObjetivo(tiempo)),
    0,
  );
}

export function resetProgressBar() {
  if (!progressBar) return;
  progressBar.style.animation = "none";
  progressBar.style.animationPlayState = "running";
  progressBar.style.width = "0%";
  void progressBar.offsetWidth;
}

export function iniciarJuego() {
  if (juegoPausado) return;
  document.body.dataset.gameActive = "true";
  ocultarFeedback();
  welcomeScreen?.classList.add("hidden");
  finalScreen?.classList.add("hidden");
  resetProgressBar();
  ultimoTiempo = 0;
  juegoActivo = true;
  juegoCompletado = false;

  const duracionTotal = calcularDuracionTotal() / 1000;
  if (progressBar) {
    progressBar.style.animation = `width ${Math.max(duracionTotal, 0.1)}s linear forwards`;
  }

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  initCronometer();
  animationFrameId = requestAnimationFrame(gameLoop);
}

export function finalizarJuego() {
  if (juegoCompletado) return;
  juegoCompletado = true;
  juegoActivo = false;
  reanudarPartidaAlDespausar = false;
  document.body.dataset.gameActive = "false";
  ocultarFeedback();
  limpiarProgramacionTiles();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  detenerCronometro();

  const tiempoActual = cronometroElement?.textContent ?? "00:00:00";
  finalTime.textContent = tiempoActual;
  finalScreen?.classList.remove("hidden");
}

function pausarJuego() {
  if (juegoPausado) return;
  juegoPausado = true;
  reanudarPartidaAlDespausar = juegoActivo;
  document.body.dataset.gamePaused = "true";
  document.body.dataset.gameActive = "false";
  if (progressBar) progressBar.style.animationPlayState = "paused";
  void audioCtx.suspend();
  if (!juegoActivo) return;

  juegoActivo = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  detenerCronometro();
  pausarProgramacionTiles();
}

function reanudarJuego() {
  if (!juegoPausado) return;
  juegoPausado = false;
  delete document.body.dataset.gamePaused;
  if (progressBar) progressBar.style.animationPlayState = "running";
  void audioCtx.resume();

  if (!reanudarPartidaAlDespausar || juegoCompletado) return;
  reanudarPartidaAlDespausar = false;
  document.body.dataset.gameActive = "true";
  juegoActivo = true;
  ultimoTiempo = 0;
  initCronometer();
  reanudarProgramacionTiles();
  animationFrameId = requestAnimationFrame(gameLoop);
}

export function gameLoop(tiempoActual) {
  if (!juegoActivo) return;

  animationFrameId = requestAnimationFrame(gameLoop);
  const delta = tiempoActual - ultimoTiempo;
  if (delta < FRAME_DURATION) return;

  ultimoTiempo = tiempoActual - (delta % FRAME_DURATION);

  if (getTiempoTranscurrido() >= calcularDuracionTotal()) {
    finalizarJuego();
    return;
  }

  cleanCanvas();
  crearTilesStaticas();
  renderizarTileCayendo();
  frameCount++;
}

const tiemposListos = cargarTiemposGenerales(4);
const sdkGame = globalThis.ytgame?.game;
const sdkSystem = globalThis.ytgame?.system;

sdkSystem?.onPause?.(pausarJuego);
sdkSystem?.onResume?.(reanudarJuego);

if (sdkGame) {
  requestAnimationFrame(() => {
    sdkGame.firstFrameReady();
    void tiemposListos.then(() => sdkGame.gameReady());
  });
}

document.addEventListener("game:start", async () => {
  if (inicioEnCurso || juegoActivo) return;
  inicioEnCurso = true;

  try {
    await audioCtx.resume();
    await tiemposListos;
    if (juegoPausado) return;
    resetCronometro();
    programarTiles();
    iniciarJuego();
    detenerSonido("sweetDreams_MarylinManson");
    reproducirSonido("sweetDreams_MarylinManson", 1, 0);
  } finally {
    inicioEnCurso = false;
  }
});

if (welcomeScreen && !welcomeScreen.classList.contains("hidden")) {
  welcomeScreen.classList.remove("hidden");
}
