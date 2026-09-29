export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;
export const canvas = document.querySelector("canvas");
export const ctx = canvas.getContext("2d");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

export function cleanCanvas() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
