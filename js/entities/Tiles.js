import { ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from "../core/canvas.js";
import { TILE_COLORS, TILE_OFFSETS } from "../config.js";
import { getTiempoTranscurrido } from "./cronometro.js";
import { mostrarFeedback } from "../UI/feedback.js";

export class Tile {
  static height = 200;
  static width = CANVAS_WIDTH / 4;
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
const laneFlashStartedAt = Array(4).fill(null);
const laneFlashDuration = 200;

export function iluminarCarril(indice) {
  if (indice < 0 || indice >= laneFlashStartedAt.length) return;
  laneFlashStartedAt[indice] = performance.now();
}

function dibujarBrilloCarril(tile, indice) {
  const startedAt = laneFlashStartedAt[indice];
  if (startedAt === null) return;

  const progress = (performance.now() - startedAt) / laneFlashDuration;
  if (progress >= 1) {
    laneFlashStartedAt[indice] = null;
    return;
  }

  ctx.save();
  ctx.globalAlpha = Math.sin(progress * Math.PI) * 0.24;
  ctx.fillStyle = `${tile.color}`.replace("aa", "ff");
  ctx.fillRect(tile.x, 0, tile.width, CANVAS_HEIGHT);
  ctx.restore();
}

export function crearTilesStaticas() {
  if (tilesStaticas.length === 0) {
    for (let i = 0; i < 4; i++) {
      tilesStaticas.push(
        new Tile(
          CANVAS_HEIGHT - Tile.height,
          `${TILE_COLORS[i]}aa`,
          TILE_OFFSETS[i],
          i,
        ),
      );
    }
  }

  for (let i = 0; i < tilesStaticas.length; i++) {
    const tile = tilesStaticas[i];
    tile.draw();
    dibujarBrilloCarril(tile, i);
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
