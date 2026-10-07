import { getTiempoTranscurrido } from "../entities/cronometro.js";
import { CANVAS_HEIGHT } from "../core/canvas.js";
import { crearTileCayendo, limpiarTilesCayendo } from "../entities/Tiles.js";

export const tiemposGenerales = [];
const temporizadoresTiles = [];

function programarTilePendiente(programacion) {
  const duracionCaida = (CANVAS_HEIGHT / 1000) * 1000;
  const tiempoInicio = programacion.tiempoObjetivo - duracionCaida;
  const demora = Math.max(0, tiempoInicio - getTiempoTranscurrido());

  programacion.temporizador = setTimeout(() => {
    const indice = temporizadoresTiles.indexOf(programacion);
    if (indice !== -1) temporizadoresTiles.splice(indice, 1);
    crearTileCayendo(Number(programacion.tile), programacion.tiempoObjetivo);
  }, demora);
}

export function convertirTiempoATiempoObjetivo(tiempo) {
  if (typeof tiempo === "number") return tiempo;
  if (!tiempo || typeof tiempo !== "string") return 0;

  const [minutos, segundos, centesimas] = tiempo.split(":").map(Number);
  return ((minutos * 60 + segundos) * 100 + centesimas) * 10;
}

export async function cargarTiemposGenerales(segundosExtra = 0) {
  try {
    const respuesta = await fetch(
      new URL("../tiempos/noRemorse/testing2.json", import.meta.url),
    );
    if (!respuesta.ok) {
      throw new Error(`No se pudo cargar tiempos.json: ${respuesta.status}`);
    }

    const tiemposTiles = await respuesta.json();
    tiemposGenerales.length = 0;

    for (const [tile, tiempos] of Object.entries(tiemposTiles)) {
      for (const tiempo of tiempos) {
        const tiempoObjetivo =
          convertirTiempoATiempoObjetivo(tiempo) + segundosExtra * 1000;
        tiemposGenerales.push([tile, tiempoObjetivo]);
      }
    }
    // console.log(tiemposGenerales);
  } catch (error) {
    console.error("Error al cargar los tiempos de las tiles:", error);
  }
}

export function limpiarProgramacionTiles() {
  temporizadoresTiles.forEach(({ temporizador }) => clearTimeout(temporizador));
  temporizadoresTiles.length = 0;
  limpiarTilesCayendo();
}

export function pausarProgramacionTiles() {
  temporizadoresTiles.forEach((programacion) => {
    clearTimeout(programacion.temporizador);
    programacion.temporizador = null;
  });
}

export function reanudarProgramacionTiles() {
  temporizadoresTiles.forEach((programacion) => {
    if (programacion.temporizador === null) {
      programarTilePendiente(programacion);
    }
  });
}

export function programarTiles() {
  limpiarProgramacionTiles();

  for (const [tile, tiempo] of tiemposGenerales) {
    const tiempoObjetivo = convertirTiempoATiempoObjetivo(tiempo);
    const programacion = { tile, tiempoObjetivo, temporizador: null };
    temporizadoresTiles.push(programacion);
    programarTilePendiente(programacion);
  }
}
