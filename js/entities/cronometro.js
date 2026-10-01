import { cronometroElement } from "../config.js";

export { cronometroElement };

let centesimas = 0;
let segundos = 0;
let minutos = 0;
let cronometroActivo = false;
let intervaloId = null;
let tiempoInicio = null;

export function getTiempoTranscurrido() {
  return tiempoInicio === null ? 0 : performance.now() - tiempoInicio;
}

function formatearNumero(valor) {
  return String(valor).padStart(2, "0");
}

export let time = `${formatearNumero(minutos)}:${formatearNumero(segundos)}:${formatearNumero(centesimas)}`;

function renderCronometro() {
  if (!cronometroElement) return;
  time = `${formatearNumero(minutos)}:${formatearNumero(segundos)}:${formatearNumero(centesimas)}`;
  cronometroElement.textContent = time;
}

export function resetCronometro() {
  clearInterval(intervaloId);
  intervaloId = null;
  cronometroActivo = false;
  tiempoInicio = null;
  centesimas = 0;
  segundos = 0;
  minutos = 0;
  renderCronometro();
}

export function detenerCronometro() {
  clearInterval(intervaloId);
  intervaloId = null;
  cronometroActivo = false;
}

export function initCronometer() {
  if (cronometroActivo) return;

  cronometroActivo = true;
  tiempoInicio = performance.now();
  intervaloId = setInterval(() => {
    const totalCentesimas = Math.floor(getTiempoTranscurrido() / 10);
    centesimas = totalCentesimas % 100;
    segundos = Math.floor(totalCentesimas / 100) % 60;
    minutos = Math.floor(totalCentesimas / 6000);

    renderCronometro();
  }, 10);
}

if (cronometroElement) {
  renderCronometro();
}
