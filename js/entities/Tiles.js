import { ctx, CANVAS_WIDTH, CANVAS_HEIGHT } from "../core/canvas.js";
import { cronometroElement, getTiempoTranscurrido } from "./cronometro.js";

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

const colors = ["#c02121", "#1c749f", "#b7245a", "#8eb209"];
const offSets = [-2, -1, 0, 1];
export const tilesStaticas = [];

export function crearTilesStaticas() {
  for (let i = 0; i < 4; i++) {
    const tile = new Tile(
      CANVAS_HEIGHT - Tile.height,
      `${colors[i]}aa`,
      offSets[i],
      i,
    );
    tile.draw();
    tilesStaticas.push(tile);
  }
}

crearTilesStaticas();

export const tilesCayendo = [];

export const tiemposGenerales = [];

async function rellenarTiemposGenerales() {
  try {
    const respuesta = await fetch(
      new URL("../tiempos/tiempos2.json", import.meta.url),
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

    for (const [tile, tiempo] of tiemposGenerales) {
      const [minutos, segundos, centesimas] = tiempo.split(":").map(Number);
      const tiempoObjetivo =
        ((minutos * 60 + segundos) * 100 + centesimas) * 10;
      const duracionCaida = (CANVAS_HEIGHT / 1000) * 1000;
      const tiempoInicio = tiempoObjetivo - duracionCaida;
      const demora = Math.max(0, tiempoInicio - getTiempoTranscurrido());

      setTimeout(() => crearTileCayendo(Number(tile), tiempoObjetivo), demora);
    }
  } catch (error) {
    console.error("Error al cargar los tiempos de las tiles:", error);
  }
}

rellenarTiemposGenerales();

export function crearTileCayendo(tile, tiempoObjetivo) {
  const tileCayendo = new Tile(
    -Tile.height,
    `${colors[tile]}aa`,
    offSets[tile],
    tiempoObjetivo,
    tile,
  );
  tilesCayendo.push(tileCayendo);
}

export function renderizarTileCayendo() {
  tilesCayendo.forEach((tile, i) => {
    tile.down(getTiempoTranscurrido());
    tile.draw();
    if (tile.y > CANVAS_HEIGHT) {
      // console.log(getTiempoTranscurrido() / 1000);
      tilesCayendo.splice(i, 1);
    }
  });
}
