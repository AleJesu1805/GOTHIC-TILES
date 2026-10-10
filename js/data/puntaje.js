export const VALORES_PUNTAJE = [1000, 750, 500, 250];

let puntosAcumulados = 0;

export function reiniciarPuntaje() {
  puntosAcumulados = 0;
}

export function registrarPuntos(puntos) {
  puntosAcumulados += puntos;
}

export function obtenerPuntaje() {
  return puntosAcumulados;
}
