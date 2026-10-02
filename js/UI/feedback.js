import { feedbackElement } from "../config.js";

let hideTimeout;
export let historial = [];

export function mostrarFeedback(mensaje, rendimiento) {
  if (!feedbackElement) return;

  clearTimeout(hideTimeout);
  feedbackElement.textContent = mensaje;
  feedbackElement.className = `hud-feedback ${rendimiento}`;
  feedbackElement.classList.add("is-visible");
  hideTimeout = setTimeout(() => {
    feedbackElement.classList.remove("is-visible");
  }, 900);
  historial.push([mensaje, rendimiento]);
}

export function ocultarFeedback() {
  clearTimeout(hideTimeout);
  feedbackElement?.classList.remove("is-visible");
}
