import { canvas, CANVAS_HEIGHT, CANVAS_WIDTH } from "../core/canvas.js";
import { Tile } from "../entities/Tiles.js";
import { reproducirSonido } from "../core/audio.js";
import { cronometroElement } from "../entities/cronometro.js";

canvas.addEventListener("pointerdown", (e) => {
  const leftEdge = CANVAS_WIDTH / 2 - 2 * Tile.width;
  const rightEdge = CANVAS_WIDTH / 2 + 2 * Tile.width;
  if (
    e.clientX < leftEdge ||
    e.clientX > rightEdge ||
    e.clientY < CANVAS_HEIGHT - Tile.height
  )
    return;

  const tileIndex = Math.max(
    0,
    Math.ceil((e.clientX - CANVAS_WIDTH / 2) / Tile.width) + 1,
  );
  reproducirSonido(tileIndex);
});

const teclas = ["a", "s", "d", "f"];
const listaDeTiempos = {
  0: [],
  1: [],
  2: [],
  3: [],
};
document.addEventListener("keydown", (e) => {
  teclas.forEach((tecla, i) => {
    if (e.key === tecla || e.key === tecla.toUpperCase) {
      reproducirSonido(i);
      listaDeTiempos[i].push(cronometroElement.textContent);
    }
  });
  //   console.log(JSON.stringify(listaDeTiempos, null, 2));
});
