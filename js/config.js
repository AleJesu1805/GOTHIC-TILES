export const FPS = 60;
export const FRAME_DURATION = 1000 / FPS;

export const TILE_COLORS = ["#d71920", "#8f1018", "#4f5c0b", "#a9a6a2"];
export const TILE_OFFSETS = [-2, -1, 0, 1];
export const TILE_KEYS = ["a", "s", "d", "f"];

export const canvas = document.querySelector("canvas");
export const cronometroElement = document.querySelector("#cronometro");
export const feedbackElement = document.querySelector("#mensaje-feedback");
export const startButton = document.getElementById("start-button");
export const restartButton = document.getElementById("restart-button");
export const homeButtons = document.querySelectorAll(".home-button");
export const pauseButton = document.getElementById("pause-button");
export const pauseScreen = document.getElementById("pause-screen");
export const resumeButton = document.getElementById("resume-button");
export const welcomeScreen = document.getElementById("welcome-screen");
export const finalScreen = document.getElementById("final-screen");
export const progressBar = document.getElementById("timelapsed");
export const finalTime = document.getElementById("final-time");
export const finalScore = document.getElementById("final-score");

export const level = {
  NoRemorse_Slayer: {
    tittle: "No Remorse -- Slayer",
    tiemposUrl: new URL("./tiempos/noRemorse/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/No Remorse (I Wanna Die)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  Prueba: {
    tittle: "Nivel de prueba",
    tiemposUrl: new URL("./tiempos/prueba.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/No Remorse (I Wanna Die)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  // Boom_BEP: {
  //   tittle: "Boom Boom Pow -- Black Eyed Peas",
  //   tiemposUrl: new URL("./tiempos/boomBEP/tiempos.json", import.meta.url).href,
  //   cancionUrl: new URL(
  //     "../assets/audio/canciones/Boom Boom Pow.mp3",
  //     import.meta.url,
  //   ).href,
  // },
  Hump_BEP: {
    tittle: "My Humps -- Black Eyed Peas",
    tiemposUrl: new URL("./tiempos/humpBEP/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/My Humps.mp3",
      import.meta.url,
    ).href,
  },
  sweetDreams_MarylinManson: {
    tittle: "Sweet Dreams -- Marilyn Manson",
    tiemposUrl: new URL("./tiempos/sweetDreams/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/MarilynMansonVEVO - Marilyn Manson - Sweet Dreams (Are Made Of This) (Alt. Version).mp3",
      import.meta.url,
    ).href,
  },
  BreakStuff_LimpBizkit: {
    tittle: "Break Stuff -- Limp Bizkit",
    tiemposUrl: new URL("./tiempos/breakStuff/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Break Stuff(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  WhatsUpPeople_MaximumTheHormone: {
    tittle: "What's up people?! -- Maximum The Hormone",
    tiemposUrl: new URL(
      "./tiempos/whatsUpPeople/tiempos2.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/MAXIMUM THE HORMONE - What's up, people？!.mp3",
      import.meta.url,
    ).href,
  },
  SpawnAgain_Silverchair: {
    tittle: "Spawn (Again) -- Silverchair",
    tiemposUrl: new URL("./tiempos/spawnAgain/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Spawn (Again)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
};
