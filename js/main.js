import {
  Tile,
  crearTileCayendo,
  crearTilesStaticas,
  renderizarTileCayendo,
} from "./entities/Tiles.js";
import { initCronometer } from "./entities/cronometro.js";
import { cleanCanvas } from "./core/canvas.js";
import { reproducirSonido } from "./core/audio.js";
import "./UI/interaction.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

initCronometer();

const fps = 30;
const frameDuration = 1000 / fps;

let ultimoTiempo = 0;
let animationFrameId = null;
let juegoActivo = true;
let frameCount = 0;

function gameLoop(tiempoActual) {
  if (!juegoActivo) return;
  animationFrameId = requestAnimationFrame(gameLoop);
  const delta = tiempoActual - ultimoTiempo;
  if (delta < frameDuration) return;
  ultimoTiempo = tiempoActual - (delta % frameDuration);
  cleanCanvas();
  crearTilesStaticas();
  renderizarTileCayendo();
  frameCount++;
}

gameLoop();
