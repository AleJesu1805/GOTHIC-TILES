let tiempoInicio = null;
let tiempoAcumulado = 0;

export function getTiempoTranscurrido() {
  return (
    tiempoAcumulado +
    (tiempoInicio === null ? 0 : performance.now() - tiempoInicio)
  );
}

function formatearNumero(valor) {
  return String(valor).padStart(2, "0");
}

export function formatearTiempoTranscurrido(milisegundos) {
  const totalCentesimas = Math.floor(milisegundos / 10);
  const centesimas = totalCentesimas % 100;
  const segundos = Math.floor(totalCentesimas / 100) % 60;
  const minutos = Math.floor(totalCentesimas / 6000);

  return `${formatearNumero(minutos)}:${formatearNumero(segundos)}:${formatearNumero(centesimas)}`;
}

export function resetCronometro() {
  tiempoInicio = null;
  tiempoAcumulado = 0;
}

export function detenerCronometro() {
  if (tiempoInicio !== null) {
    tiempoAcumulado = getTiempoTranscurrido();
    tiempoInicio = null;
  }
}

export function initCronometer() {
  if (tiempoInicio !== null) return;
  tiempoInicio = performance.now();
}
