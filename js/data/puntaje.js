export const VALORES_PUNTAJE = [100, 90, 50, 20];

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
