import { crearTileCayendo } from "./Tiles.js";
export const cronometroElement = document.querySelector("#cronometro");

let centesimas = 0;
let segundos = 0;
let minutos = 0;
let cronometroActivo = false;
let intervaloId = null;

function formatearNumero(valor) {
  return String(valor).padStart(2, "0");
}

function renderCronometro() {
  if (!cronometroElement) return;

  cronometroElement.textContent = `${formatearNumero(minutos)}:${formatearNumero(segundos)}:${formatearNumero(centesimas)}`;
}

export function resetCronometro() {
  clearInterval(intervaloId);
  cronometroActivo = false;
  centesimas = 0;
  segundos = 0;
  minutos = 0;
  renderCronometro();
}

export function initCronometer() {
  if (cronometroActivo) return;

  cronometroActivo = true;
  intervaloId = setInterval(() => {
    centesimas += 1;

    if (centesimas >= 100) {
      centesimas = 0;
      segundos += 1;
    }

    if (segundos >= 60) {
      segundos = 0;
      minutos += 1;
    }

    renderCronometro();
    crearTileCayendo();
  }, 10);
}

if (cronometroElement) {
  renderCronometro();
}
