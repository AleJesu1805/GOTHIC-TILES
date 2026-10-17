import { canvas } from "../config.js";

export { canvas };
export let CANVAS_WIDTH = 480;
export let CANVAS_HEIGHT = 854;
export const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

export function cleanCanvas() {
  // ctx.fillStyle = "#0000002d";
  // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function renderizarBarraProgreso(progress) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / CANVAS_WIDTH || 1;
  const scaleY = rect.height / CANVAS_HEIGHT || 1;
  const desiredWidth = Math.max(
    32,
    Math.min(window.innerWidth * 0.72, window.innerWidth - 224),
  );
  const width = Math.min(desiredWidth / scaleX, CANVAS_WIDTH - 32 / scaleX);
  const height = 7 / scaleY;
  const x = (CANVAS_WIDTH - width) / 2;
  const y = 16 / scaleY;
  const radius = height / 2;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fillStyle = "rgba(16, 18, 20, 0.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(126, 77, 158, 0.42)";
  ctx.lineWidth = 1 / scaleY;
  ctx.stroke();

  const fillWidth = Math.max(
    height,
    width * Math.min(1, Math.max(0, progress)),
  );
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, "#601b88");
  gradient.addColorStop(0.58, "#542276");
  gradient.addColorStop(1, "#7838a8");
  ctx.beginPath();
  ctx.roundRect(x, y, Math.min(fillWidth, width), height, radius);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.restore();
}

export function resizeCanvas() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}
