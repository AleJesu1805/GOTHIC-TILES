export const FPS = 60;
export const FRAME_DURATION = 1000 / FPS;

export const TILE_COLORS = ["#d71920", "#8f1018", "#c71924", "#a9a6a2"];
export const TILE_OFFSETS = [-2, -1, 0, 1];
export const TILE_KEYS = ["a", "s", "d", "f"];

export const canvas = document.querySelector("canvas");
export const cronometroElement = document.querySelector("#cronometro");
export const feedbackElement = document.querySelector("#mensaje-feedback");
export const startButton = document.getElementById("start-button");
export const restartButton = document.getElementById("restart-button");
export const pauseButton = document.getElementById("pause-button");
export const welcomeScreen = document.getElementById("welcome-screen");
export const finalScreen = document.getElementById("final-screen");
export const progressBar = document.getElementById("timelapsed");
export const finalTime = document.getElementById("final-time");

export const level = {
  Boom_BEP: {
    tiemposUrl: new URL("./tiempos/boomBEP/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Boom Boom Pow.mp3",
      import.meta.url,
    ).href,
  },
  Hump_BEP: {
    tiemposUrl: new URL("./tiempos/humpBEP/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/My Humps.mp3",
      import.meta.url,
    ).href,
  },
  NoRemorse_Slayer: {
    tiemposUrl: new URL("./tiempos/noRemorse/testing.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/No Remorse (I Wanna Die)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  sweetDreams_MarylinManson: {
    tiemposUrl: new URL(
      "./tiempos/sweetDreams/sweetDreams.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/MarilynMansonVEVO - Marilyn Manson - Sweet Dreams (Are Made Of This) (Alt. Version).mp3",
      import.meta.url,
    ).href,
  },
};
