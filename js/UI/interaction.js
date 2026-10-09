import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH } from "../core/canvas.js";
import {
  Tile,
  iluminarCarril,
  tilesCayendo,
  tilesStaticas,
} from "../entities/Tiles.js";
import { reproducirSonido, reproducirSonidoJson } from "../core/audio.js";
import { time } from "../entities/cronometro.js";
import {
  TILE_KEYS,
  homeButtons,
  restartButton,
  startButton,
} from "../config.js";
import { mostrarFeedback } from "./feedback.js";
import { tiemposGenerales } from "../data/tiempos.js";

function emitGameStart() {
  document.dispatchEvent(new CustomEvent("game:start"));
}

function emitReturnToMenu() {
  document.dispatchEvent(new CustomEvent("game:home"));
}

startButton?.addEventListener("click", emitGameStart);
restartButton?.addEventListener("click", emitGameStart);
homeButtons.forEach((button) =>
  button.addEventListener("click", emitReturnToMenu),
);

document.querySelectorAll(".setting-range").forEach((range) => {
  const output = range.parentElement?.querySelector("output");
  const updateDisplay = () => {
    const min = Number(range.min);
    const max = Number(range.max);
    const value = Number(range.value);
    const percentage = ((value - min) / (max - min)) * 100;
    range.style.setProperty("--range-progress", `${percentage}%`);
    if (output) output.value = `${value}%`;
  };

  range.addEventListener("input", updateDisplay);
  updateDisplay();
});

function procesarEntrada(indice) {
  if (document.body.dataset.gameActive !== "true") return;
  iluminarCarril(indice);

  const tileIndex = tilesCayendo.findIndex(
    (tile) =>
      tile.index === indice &&
      tile.y > CANVAS_HEIGHT - Tile.height * 2.2 &&
      tile.y <= CANVAS_HEIGHT,
  );

  if (tileIndex === -1) {
    mostrarFeedback("MUY MAL", "poor");
    return;
  }

  const [tile] = tilesCayendo.splice(tileIndex, 1);
  const distancia = Math.abs(tile.y - (CANVAS_HEIGHT - Tile.height));
  if (distancia <= 35) {
    mostrarFeedback("EXCELENTE", "excellent");
  } else if (distancia <= 100) {
    mostrarFeedback("MUY BIEN", "good");
  } else if (distancia <= 180) {
    mostrarFeedback("BIEN", "good");
  } else {
    mostrarFeedback("TARDE", "poor");
  }
  // reproducirSonidoJson(String(indice));
  // reproducirSonido(indice);
}

canvas.addEventListener("pointerdown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const canvasX = ((e.clientX - rect.left) / rect.width) * CANVAS_WIDTH;
  const canvasY = ((e.clientY - rect.top) / rect.height) * CANVAS_HEIGHT;
  const leftEdge = CANVAS_WIDTH / 2 - 2 * Tile.width;
  const rightEdge = CANVAS_WIDTH / 2 + 2 * Tile.width;
  if (
    canvasX < leftEdge ||
    canvasX >= rightEdge ||
    canvasY < CANVAS_HEIGHT - Tile.height
  )
    return;

  const tileIndex = Math.floor((canvasX - leftEdge) / Tile.width);
  procesarEntrada(tileIndex);
});

const listaDeTiempos = {
  0: [],
  1: [],
  2: [],
  3: [],
};
document.addEventListener("keydown", (e) => {
  TILE_KEYS.forEach((tecla, i) => {
    if (e.key === tecla || e.key === tecla.toUpperCase()) {
      procesarEntrada(i);
      listaDeTiempos[i].push(time);
    }
  });
  if (e.key == "e") {
    console.log(JSON.stringify(listaDeTiempos, null, 2));
    // console.log(tiemposGenerales);
  }
});
