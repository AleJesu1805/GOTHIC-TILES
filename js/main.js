import { crearTilesStaticas, renderizarTileCayendo } from "./entities/Tiles.js";
import {
  cargarTiemposGenerales,
  limpiarProgramacionTiles,
  programarTiles,
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
import { audioCtx } from "./core/audio.js";
import { ocultarFeedback } from "./UI/feedback.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

let ultimoTiempo = 0;
let animationFrameId = null;
let juegoActivo = false;
let juegoCompletado = false;
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
  progressBar.style.width = "0%";
  void progressBar.offsetWidth;
}

export function iniciarJuego() {
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
  document.body.dataset.gameActive = "false";
  ocultarFeedback();
  limpiarProgramacionTiles();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  detenerCronometro();

  const tiempoActual = cronometroElement?.textContent ?? "00:00:00";
  finalTime.textContent = tiempoActual;
  finalScreen?.classList.remove("hidden");
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

const tiemposListos = cargarTiemposGenerales();

document.addEventListener("game:start", async () => {
  await tiemposListos;
  if (audioCtx.state === "suspended") audioCtx.resume();
  resetCronometro();
  programarTiles();
  iniciarJuego();
});

if (welcomeScreen && !welcomeScreen.classList.contains("hidden")) {
  welcomeScreen.classList.remove("hidden");
}
