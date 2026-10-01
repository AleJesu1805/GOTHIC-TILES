export const FPS = 60;
export const FRAME_DURATION = 1000 / FPS;

export const TILE_COLORS = ["#c02121", "#1c749f", "#b7245a", "#8eb209"];
export const TILE_OFFSETS = [-2, -1, 0, 1];
export const TILE_KEYS = ["a", "s", "d", "f"];

export const canvas = document.querySelector("canvas");
export const cronometroElement = document.querySelector("#cronometro");
export const feedbackElement = document.querySelector("#mensaje-feedback");
export const startButton = document.getElementById("start-button");
export const restartButton = document.getElementById("restart-button");
export const welcomeScreen = document.getElementById("welcome-screen");
export const finalScreen = document.getElementById("final-screen");
export const progressBar = document.getElementById("timelapsed");
export const finalTime = document.getElementById("final-time");
