import { canvas } from "../config.js";

export { canvas };
export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;
export const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

export function cleanCanvas() {
  // ctx.fillStyle = "#0000002d";
  // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
