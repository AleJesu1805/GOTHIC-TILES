import {
  Tile,
  crearTileCayendo,
  crearTilesStaticas,
  renderizarTileCayendo,
  tiemposGenerales,
} from "./entities/Tiles.js";
import { initCronometer } from "./entities/cronometro.js";
import { cleanCanvas } from "./core/canvas.js";
import "./UI/interaction.js";
import { audioCtx } from "./core/audio.js";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}

const fps = 60;
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

document.addEventListener(
  "pointerdown",
  () => {
    let ultimoMomento =
      tiemposGenerales[tiemposGenerales.length - 1][1].split(":");
    let ultimoSegundo =
      Number(ultimoMomento[0]) * 60 +
      Number(ultimoMomento[1]) +
      Number(ultimoMomento[2]) / 100;
    console.log(ultimoMomento, ultimoSegundo);

    if (audioCtx.state === "suspended") audioCtx.resume();
    document.getElementById("timelapsed").style.animation =
      `width ${ultimoSegundo}s linear`;
    initCronometer();
    requestAnimationFrame(gameLoop);
  },
  { once: true },
);
