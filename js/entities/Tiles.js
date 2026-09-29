import { ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from "../core/canvas.js";
import { cronometroElement } from "./cronometro.js";

const tiempos = {
  0: ["00:07:01"],
  1: ["00:03:05", "00:02:05", "00:03:09"],
  2: ["00:03:05"],
  3: ["00:05:03"],
};

export class Tile {
  static height = 200;
  constructor(y, color, offsetTiles) {
    this.width = 100;
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
export const tilesStaticas = [];

export function crearTilesStaticas() {
  let offSet = -2;
  for (let i = 0; i < 4; i++) {
    const tile = new Tile(
      CANVAS_HEIGHT - (Tile.height + 10),
      colors[i],
      offSet,
    );
    tile.draw();
    tilesStaticas.push(tile);
    offSet++;
  }
}

crearTilesStaticas();

const tilesCayendo = [];

// OPTIMIZAR LOGICA DE CONSULTAR TIEMPOS

export function crearTileCayendo() {
  let offSet = -2;
  for (let [tile, tempo] of Object.entries(tiempos)) {
    for (let i = 0; i < tempo.length; i++) {
      if (cronometroElement.innerHTML == tempo[i]) {
        const tileCayendo = new Tile(0, colors[tile], offSet);
        tilesCayendo.push(tileCayendo);
      }
    }
    offSet++;
  }
  tilesCayendo.forEach((tile) => {
    tile.draw();
    tile.down();
  });
}
