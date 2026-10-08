import { ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from "../core/canvas.js";
import { TILE_COLORS, TILE_OFFSETS } from "../config.js";
import { getTiempoTranscurrido } from "./cronometro.js";
import { mostrarFeedback } from "../UI/feedback.js";

export class Tile {
  static height = 200;
  static width = 100;
  constructor(y, color, offsetTiles, tiempoObjetivo = null, index = null) {
    this.width = Tile.width;
    this.height = Tile.height;
    this.x = CANVAS_WIDTH / 2 + offsetTiles * this.width;
    this.y = y;
    this.color = color;
    this.offsetTiles = offsetTiles;
    this.tiempoObjetivo = tiempoObjetivo;
    this.index = index;
    this.speed = 1000;
  }
  draw() {
    // ctx.strokeStyle = "#010101";
    // ctx.lineWidth = 7;
    // ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  down(tiempoActual) {
    const duracionCaida = (CANVAS_HEIGHT / this.speed) * 1000;
    const tiempoInicio = this.tiempoObjetivo - duracionCaida;
    const tiempoCayendo = Math.max(0, tiempoActual - tiempoInicio);
    this.y = -this.height + (this.speed * tiempoCayendo) / 1000;
  }
}

export const tilesStaticas = [];

export function crearTilesStaticas() {
  for (let i = 0; i < 4; i++) {
    const tile = new Tile(
      CANVAS_HEIGHT - Tile.height,
      `${TILE_COLORS[i]}aa`,
      TILE_OFFSETS[i],
      i,
    );
    tile.draw();
    tilesStaticas.push(tile);
  }
}

crearTilesStaticas();

export const tilesCayendo = [];

export function limpiarTilesCayendo() {
  tilesCayendo.length = 0;
}

export function crearTileCayendo(tile, tiempoObjetivo) {
  const tileCayendo = new Tile(
    -Tile.height,
    `${TILE_COLORS[tile]}aa`,
    TILE_OFFSETS[tile],
    tiempoObjetivo,
    tile,
  );
  // tilesCayendo.height = 50;
  tilesCayendo.push(tileCayendo);
}

export function renderizarTileCayendo() {
  tilesCayendo.forEach((tile, i) => {
    tile.down(getTiempoTranscurrido());
    tile.draw();
    if (tile.y > CANVAS_HEIGHT) {
      tilesCayendo.splice(i, 1);
      mostrarFeedback("¡Muy mal!", "poor");
    }
  });
}
