import { ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from "../core/canvas.js";
import { cronometroElement } from "./cronometro.js";

export class Tile {
  static height = 200;
  static width = 100;
  constructor(y, color, offsetTiles) {
    this.width = Tile.width;
    this.height = Tile.height;
    this.x = CANVAS_WIDTH / 2 + offsetTiles * this.width;
    this.y = y;
    this.color = color;
    this.speed = 10;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  down() {
    this.y += this.speed;
  }
}

const colors = ["#c02121", "#1c749f", "#b7245a", "#8eb209"];
const offSets = [-2, -1, 0, 1];
export const tilesStaticas = [];

export function crearTilesStaticas() {
  for (let i = 0; i < 4; i++) {
    const tile = new Tile(CANVAS_HEIGHT - Tile.height, colors[i], offSets[i]);
    tile.draw();
    tilesStaticas.push(tile);
  }
}

crearTilesStaticas();

const tilesCayendo = [];

// OPTIMIZAR LOGICA DE CONSULTAR TIEMPOS

// const tiemposTiles = {
//   0: ["00:07:01"],
//   1: ["00:03:05", "00:02:05", "00:03:09"],
//   2: ["00:03:05"],
//   3: ["00:05:03"],
// };

const tiemposGenerales = [];

async function rellenarTiemposGenerales() {
  try {
    const respuesta = await fetch(
      new URL("../core/tiempos.json", import.meta.url),
    );
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar tiempos.json: ${respuesta.status}`);
    }

    const tiemposTiles = await respuesta.json();
    for (const [tile, tiempos] of Object.entries(tiemposTiles)) {
      for (const tiempo of tiempos) {
        tiemposGenerales.push([tile, tiempo]);
      }
    }

    tiemposGenerales.sort((a, b) => a[1].localeCompare(b[1]));
  } catch (error) {
    console.error("Error al cargar los tiempos de las tiles:", error);
  }
}

rellenarTiemposGenerales();

export function crearTileCayendo() {
  for (let i = 0; i < tiemposGenerales.length; i++) {
    if (cronometroElement.innerHTML == tiemposGenerales[i][1]) {
      const tileCayendo = new Tile(
        0,
        colors[tiemposGenerales[i][0]],
        offSets[tiemposGenerales[i][0]],
      );
      tilesCayendo.push(tileCayendo);
    }
  }
}

export function renderizarTileCayendo() {
  tilesCayendo.forEach((tile, i) => {
    tile.draw();
    tile.down();
    if (tile.y > CANVAS_HEIGHT) {
      tilesCayendo.splice(i, 1);
    }
  });
}
