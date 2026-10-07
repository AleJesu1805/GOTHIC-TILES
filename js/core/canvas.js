import { canvas } from "../config.js";

export { canvas };
export let CANVAS_WIDTH = 800;
export let CANVAS_HEIGHT = 800;
export const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

export function cleanCanvas() {
  // ctx.fillStyle = "#0000002d";
  // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function resizeCanvas() {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}
