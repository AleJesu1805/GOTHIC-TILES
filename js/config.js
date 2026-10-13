export const FPS = 60;
export const FRAME_DURATION = 1000 / FPS;

export const TILE_COLORS = ["#78121D", "#1e441a", "#56524b", "#44103d"];
export const TILE_OFFSETS = [-2, -1, 0, 1];
export const TILE_KEYS = ["a", "s", "d", "f"];

const dificultades = [
  "Principiante",
  "Facil",
  "Intermedio",
  "Dificil",
  "Experto",
];

export const canvas = document.getElementById("game-canvas");
export const cronometroElement = document.querySelector("#cronometro");
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
  Prueba: {
    tittle: "Nivel de prueba",
    dificultad: dificultades[0],
    tiemposUrl: new URL("./tiempos/prueba.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/aLee DJ - MORTAL KUMBIA ｜ Versión TIKTOK ｜ aLee DJ.mp3",
      import.meta.url,
    ).href,
  },
  NoRemorse_Slayer: {
    tittle: "No Remorse -- Slayer",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/noRemorse/tiempos.json", import.meta.url)
      .href,
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
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/humpBEP/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/My Humps.mp3",
      import.meta.url,
    ).href,
  },
  sweetDreams_MarylinManson: {
    tittle: "Sweet Dreams -- Marilyn Manson",
    dificultad: dificultades[1],
    tiemposUrl: new URL("./tiempos/sweetDreams/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/MarilynMansonVEVO - Marilyn Manson - Sweet Dreams (Are Made Of This) (Alt. Version).mp3",
      import.meta.url,
    ).href,
  },
  BreakStuff_LimpBizkit: {
    tittle: "Break Stuff -- Limp Bizkit",
    dificultad: dificultades[3],
    tiemposUrl: new URL("./tiempos/breakStuff/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Break Stuff(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  WhatsUpPeople_MaximumTheHormone: {
    tittle: "What's up people?! -- Maximum The Hormone",
    dificultad: dificultades[3],
    tiemposUrl: new URL("./tiempos/whatsUpPeople/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/MAXIMUM THE HORMONE - What's up, people？!.mp3",
      import.meta.url,
    ).href,
  },
  SpawnAgain_Silverchair: {
    tittle: "Spawn (Again) -- Silverchair",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/spawnAgain/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Spawn (Again)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  FiringTheLove: {
    tittle: "Firing the Love -- Skindred",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/firingTheLove/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Firing-the-Love_M4A_128K_.mp3",
      import.meta.url,
    ).href,
  },
  BigSurprise: {
    tittle: "Big Surprise -- Animal Alpha",
    dificultad: dificultades[1],
    tiemposUrl: new URL("./tiempos/bigSurprise/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Big Surprise(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  Silvera_Gojira: {
    tittle: "Silvera -- Gojira",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/silvera/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Gojira - Silvera [OFFICIAL VIDEO].mp3",
      import.meta.url,
    ).href,
  },
  ItsOn_Korn: {
    tittle: "It's On -- Korn",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/itsOn/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Korn-It_s-On_-_Official-Audio_-_fdi173iq-DQ_.mp3",
      import.meta.url,
    ).href,
  },
  Tablescrap: {
    tittle: "Tablescrap -- Stolen Babies",
    dificultad: dificultades[2],
    tiemposUrl: new URL("./tiempos/tablescrap/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Stolen Babies - Tablescrap.mp3",
      import.meta.url,
    ).href,
  },
  MortalKumbia: {
    tittle: "Mortal Kumbia -- aLee DJ",
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/mortalKumbia/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/aLee DJ - MORTAL KUMBIA ｜ Versión TIKTOK ｜ aLee DJ.mp3",
      import.meta.url,
    ).href,
  },
  FingerPaintingOfTheInsane_AcidBath: {
    tittle: "Finger Painting of the Insane -- Acid Bath",
    dificultad: dificultades[2],
    tiemposUrl: new URL(
      "./tiempos/fingerPaintingOfTheInsane/tiempos.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Acid Bath - Finger Painting Of The Insane-2.mp3",
      import.meta.url,
    ).href,
  },
  // GivenUp_LinkinPark: {
  //   tittle: "Given Up -- Linkin Park",
  //   dificultad: dificultades[3],
  //   tiemposUrl: new URL("./tiempos/givenUp/tiempos.json", import.meta.url).href,
  //   cancionUrl: new URL(
  //     "../assets/audio/canciones/Linkin-Park-Given-Up-128.mp3",
  //     import.meta.url,
  //   ).href,
  // },
  // CarelessWhisper_GeorgeMichael: {
  //   tittle: "Careless Whisper -- George Michael",
  //   dificultad: dificultades[1],
  //   tiemposUrl: new URL(
  //     "./tiempos/carelessWhisper/tiempos.json",
  //     import.meta.url,
  //   ).href,
  //   cancionUrl: new URL(
  //     "../assets/audio/canciones/Careless Whisper(MP3_160K).mp3",
  //     import.meta.url,
  //   ).href,
  // },
  HandshakeWithHell_ArchEnemy: {
    tittle: "Handshake With Hell -- Arch Enemy",
    dificultad: dificultades[3],
    tiemposUrl: new URL(
      "./tiempos/handshakeWithHell/tiempos.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/ARCH ENEMY – Handshake With Hell (OFFICIAL SUMMER 2023 RECAP)(MP3_160K) (1).mp3",
      import.meta.url,
    ).href,
  },
  ZodiacVirtues: {
    tittle: "Zodiac Virtues -- Diablo Swing Orchestra",
    dificultad: dificultades[2],
    tiemposUrl: new URL("./tiempos/zodiacVirtues/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Zodiac Virtues.mp3",
      import.meta.url,
    ).href,
  },
};
