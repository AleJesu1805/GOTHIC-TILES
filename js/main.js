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
  formatearTiempoTranscurrido,
  getTiempoTranscurrido,
  initCronometer,
  resetCronometro,
  time,
} from "./entities/cronometro.js";
import { cleanCanvas, resizeCanvas } from "./core/canvas.js";
import "./UI/interaction.js";
import {
  FRAME_DURATION,
  cronometroElement,
  finalScreen,
  finalScore,
  finalTime,
  level,
  pauseButton,
  pauseScreen,
  progressBar,
  resumeButton,
  welcomeScreen,
} from "./config.js";
import {
  audioCtx,
  canciones,
  detenerSonido,
  reproducirSonido,
} from "./core/audio.js";
import {
  obtenerPuntaje,
  reiniciarPuntaje,
  VALORES_PUNTAJE,
} from "./data/puntaje.js";
import { limpiarEfectos, renderizarEfectos } from "./entities/efectos.js";

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
let solicitudInicio = 0;
let frameCount = 0;
let duracionTotalPartida = 0;
let nivelActual = level.Prueba;

const levelList = document.querySelector(".level-list");
for (const [levelId, levelData] of Object.entries(level)) {
  const label = document.createElement("label");
  label.className = "level-option";

  const input = document.createElement("input");
  input.type = "radio";
  input.name = "level";
  input.value = levelId;
  input.checked = levelId === "Prueba";

  const title = document.createElement("span");
  title.textContent = levelData.tittle;

  label.append(input, title);
  levelList?.append(label);
}

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
  limpiarEfectos();
  welcomeScreen?.classList.add("hidden");
  finalScreen?.classList.add("hidden");
  resetProgressBar();
  ultimoTiempo = 0;
  juegoActivo = true;
  juegoCompletado = false;
  reiniciarPuntaje();

  duracionTotalPartida = calcularDuracionTotal();
  const duracionTotal = duracionTotalPartida / 1000;
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
  limpiarProgramacionTiles();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  detenerCronometro();

  const tiempoActual =
    formatearTiempoTranscurrido(getTiempoTranscurrido()) ?? "00:00:00";
  finalTime.textContent = tiempoActual;
  const puntajeMaximo = tiemposGenerales.length * VALORES_PUNTAJE[0];
  const rendimiento =
    puntajeMaximo === 0
      ? 0
      : Math.round((obtenerPuntaje() / puntajeMaximo) * 100);
  finalScore.textContent = `${rendimiento}%`;
  finalScreen?.classList.remove("hidden");
}

function pausarJuego() {
  if (juegoPausado) return;
  juegoPausado = true;
  reanudarPartidaAlDespausar = juegoActivo;
  document.body.dataset.gamePaused = "true";
  document.body.dataset.gameActive = "false";
  pauseScreen?.classList.remove("hidden");
  if (pauseButton) {
    pauseButton.textContent = "Continuar";
    pauseButton.setAttribute("aria-label", "Continuar juego");
  }
  if (progressBar) progressBar.style.animationPlayState = "paused";
  void audioCtx.suspend();
  canciones.pausarCancion();
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
  pauseScreen?.classList.add("hidden");
  if (pauseButton) {
    pauseButton.textContent = "Pausar";
    pauseButton.setAttribute("aria-label", "Pausar juego");
  }
  if (progressBar) progressBar.style.animationPlayState = "running";
  void audioCtx.resume();
  canciones.reanudarCancion();

  if (!reanudarPartidaAlDespausar || juegoCompletado) return;
  reanudarPartidaAlDespausar = false;
  document.body.dataset.gameActive = "true";
  juegoActivo = true;
  ultimoTiempo = 0;
  initCronometer();
  reanudarProgramacionTiles();
  animationFrameId = requestAnimationFrame(gameLoop);
}

function volverAlMenu() {
  solicitudInicio++;
  inicioEnCurso = false;
  juegoActivo = false;
  juegoPausado = false;
  juegoCompletado = false;
  reanudarPartidaAlDespausar = false;
  document.body.dataset.gameActive = "false";
  delete document.body.dataset.gamePaused;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  detenerCronometro();
  resetCronometro();
  limpiarProgramacionTiles();
  resetProgressBar();
  canciones.pausarCancion();
  void audioCtx.suspend();
  pauseScreen?.classList.add("hidden");
  finalScreen?.classList.add("hidden");
  welcomeScreen?.classList.remove("hidden");
  if (pauseButton) {
    pauseButton.textContent = "Pausar";
    pauseButton.setAttribute("aria-label", "Pausar juego");
  }
  cleanCanvas();
}

resumeButton?.addEventListener("click", reanudarJuego);
document.addEventListener("game:home", volverAlMenu);

pauseButton?.addEventListener("click", () => {
  if (juegoPausado) {
    reanudarJuego();
    return;
  }

  pausarJuego();
});

export function gameLoop(tiempoActual) {
  if (!juegoActivo) return;

  animationFrameId = requestAnimationFrame(gameLoop);
  const delta = tiempoActual - ultimoTiempo;
  if (delta < FRAME_DURATION) return;

  ultimoTiempo = tiempoActual - (delta % FRAME_DURATION);

  if (getTiempoTranscurrido() >= duracionTotalPartida) {
    setTimeout(() => {
      finalizarJuego();
    }, 100);
    return;
  }

  cleanCanvas();
  crearTilesStaticas();
  renderizarTileCayendo();
  renderizarEfectos();
  frameCount++;
}

const musicVolumeInput = document.getElementById("music-volume");
const musicVolumeOutput = document.querySelector('output[for="music-volume"]');
const musicVolumeStorageKey = "gothic-tiles-music-volume";

try {
  const savedVolume = localStorage.getItem(musicVolumeStorageKey);
  const parsedVolume = Number(savedVolume);
  if (savedVolume !== null && Number.isFinite(parsedVolume)) {
    musicVolumeInput.value = String(Math.min(100, Math.max(0, parsedVolume)));
  }
} catch {}

function actualizarVolumenMusica() {
  if (!musicVolumeInput) return;
  const min = Number(musicVolumeInput.min);
  const max = Number(musicVolumeInput.max);
  const value = Number(musicVolumeInput.value);
  const percentage = ((value - min) / (max - min)) * 100;
  musicVolumeInput.style.setProperty("--range-progress", `${percentage}%`);
  canciones.establecerVolumen(value / 100);
  if (musicVolumeOutput) {
    musicVolumeOutput.textContent = `${value}%`;
  }
  try {
    localStorage.setItem(musicVolumeStorageKey, musicVolumeInput.value);
  } catch {}
}

musicVolumeInput?.addEventListener("input", actualizarVolumenMusica);
actualizarVolumenMusica();

const tiemposListos = cargarTiemposGenerales(nivelActual.tiemposUrl, 0);
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
  const solicitudActual = ++solicitudInicio;

  try {
    await audioCtx.resume();
    await tiemposListos;
    if (solicitudActual !== solicitudInicio) return;
    const nivelSeleccionado = document.querySelector(
      'input[name="level"]:checked',
    )?.value;
    nivelActual = level[nivelSeleccionado] ?? nivelActual;
    await cargarTiemposGenerales(nivelActual.tiemposUrl, 0);
    if (solicitudActual !== solicitudInicio || juegoPausado) return;
    resetCronometro();
    programarTiles();
    iniciarJuego();
    canciones.reproducirCancion(nivelActual.cancionUrl);
  } finally {
    if (solicitudActual === solicitudInicio) inicioEnCurso = false;
  }
});

window.addEventListener("resize", () => {
  resizeCanvas();
  crearTilesStaticas();
});

if (welcomeScreen && !welcomeScreen.classList.contains("hidden")) {
  welcomeScreen.classList.remove("hidden");
}
