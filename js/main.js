import { Tile } from "./entities/Tiles.js";

const tile = new Tile(30, 50, 100, 200, "#981515");
tile.draw();

const fps = 30;
const frameDuration = 1000 / fps;

let ultimoTiempo = 0;
let animationFrameId = null;
let juegoActivo = false;
let frameCount = 0;

function gameLoop(tiempoActual) {
  if (!juegoActivo) return;
  animationFrameId = requestAnimationFrame(gameLoop);
  const delta = tiempoActual - ultimoTiempo;
  if (delta < frameDuration) return;
  ultimoTiempo = tiempoActual - (delta % frameDuration);
  frameCount++;
}

gameLoop();
