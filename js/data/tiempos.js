import { getTiempoTranscurrido } from "../entities/cronometro.js";
import { CANVAS_HEIGHT } from "../core/canvas.js";
import { crearTileCayendo, limpiarTilesCayendo } from "../entities/Tiles.js";

export const tiemposGenerales = [];
const temporizadoresTiles = [];

export function convertirTiempoATiempoObjetivo(tiempo) {
  if (!tiempo || typeof tiempo !== "string") return 0;

  const [minutos, segundos, centesimas] = tiempo.split(":").map(Number);
  return ((minutos * 60 + segundos) * 100 + centesimas) * 10;
}

export async function cargarTiemposGenerales() {
  try {
    const respuesta = await fetch(
      new URL("../tiempos/tiempos.json", import.meta.url),
    );
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar tiempos.json: ${respuesta.status}`);
    }

    const tiemposTiles = await respuesta.json();
    tiemposGenerales.length = 0;

    for (const [tile, tiempos] of Object.entries(tiemposTiles)) {
      for (const tiempo of tiempos) {
        tiemposGenerales.push([tile, tiempo]);
      }
    }
  } catch (error) {
    console.error("Error al cargar los tiempos de las tiles:", error);
  }
}

export function limpiarProgramacionTiles() {
  temporizadoresTiles.forEach(clearTimeout);
  temporizadoresTiles.length = 0;
  limpiarTilesCayendo();
}

export function programarTiles() {
  limpiarProgramacionTiles();

  for (const [tile, tiempo] of tiemposGenerales) {
    const tiempoObjetivo = convertirTiempoATiempoObjetivo(tiempo);
    const duracionCaida = (CANVAS_HEIGHT / 1000) * 1000;
    const tiempoInicio = tiempoObjetivo - duracionCaida;
    const demora = Math.max(0, tiempoInicio - getTiempoTranscurrido());

    temporizadoresTiles.push(
      setTimeout(() => crearTileCayendo(Number(tile), tiempoObjetivo), demora),
    );
  }
}
