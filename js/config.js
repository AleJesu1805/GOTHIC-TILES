export const FPS = 60;
export const FRAME_DURATION = 1000 / FPS;
export const TILE_FALL_DURATION = 1000;

export const TILE_COLORS = ["#78121D", "#9bb5bb", "#78121D", "#9bb5bb"];
export const TILE_OFFSETS = [-2, -1, 0, 1];
export const TILE_KEYS = ["a", "s", "d", "f"];

export const dificultades = [
  "Preescolar",
  "Sencillito",
  "Mas o menos",
  "Arrecho",
  "VERGATARIO",
];
export const difficultyColors = [
  "#098d2e",
  "#1c5c98",
  "#947900",
  "#ed5a00",
  "#f0002d",
];

export const canvas = document.getElementById("game-canvas");
export const startButton = document.getElementById("start-button");
export const restartButton = document.getElementById("restart-button");
export const homeButtons = document.querySelectorAll(".home-button");
export const pauseButton = document.getElementById("pause-button");
export const pauseScreen = document.getElementById("pause-screen");
export const resumeButton = document.getElementById("resume-button");
export const welcomeScreen = document.getElementById("welcome-screen");
export const finalScreen = document.getElementById("final-screen");
export const finalTime = document.getElementById("final-time");
export const finalScore = document.getElementById("final-score");

export const level = {
  Prueba: {
    tittle: "Nivel de prueba",
    timeout: 0,
    dificultad: dificultades[0],
    tiemposUrl: new URL("./tiempos/prueba.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/aLee DJ - MORTAL KUMBIA ｜ Versión TIKTOK ｜ aLee DJ.mp3",
      import.meta.url,
    ).href,
  },
  NoRemorse_Slayer: {
    tittle: "No Remorse -- Slayer",
    timeout: 1000,
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
    timeout: 0,
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/humpBEP/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/My Humps.mp3",
      import.meta.url,
    ).href,
  },
  sweetDreams_MarylinManson: {
    tittle: "Sweet Dreams -- Marilyn Manson",
    timeout: 0,
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
    timeout: 0,
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
    timeout: 0,
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
    timeout: 0,
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
    timeout: 2000,
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
    timeout: 0,
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
    timeout: 0,
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/silvera/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Gojira - Silvera [OFFICIAL VIDEO].mp3",
      import.meta.url,
    ).href,
  },
  ItsOn_Korn: {
    tittle: "It's On -- Korn",
    timeout: 0,
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/itsOn/tiempos.json", import.meta.url).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Korn-It_s-On_-_Official-Audio_-_fdi173iq-DQ_.mp3",
      import.meta.url,
    ).href,
  },
  Tablescrap: {
    tittle: "Tablescrap -- Stolen Babies",
    timeout: 0,
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
    timeout: 0,
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
    timeout: 0,
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
    timeout: 0,
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
    timeout: 0,
    dificultad: dificultades[2],
    tiemposUrl: new URL("./tiempos/zodiacVirtues/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Zodiac Virtues.mp3",
      import.meta.url,
    ).href,
  },
  DelusionsOfSaviour: {
    tittle: "Delusions of Saviour -- Slayer",
    timeout: 0,
    dificultad: dificultades[2],
    tiemposUrl: new URL(
      "./tiempos/delusionsOfSaviour/tiempos.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Delusions of Saviour(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  // Detached: {
  //   tittle: "Detached",
  //   timeout: 0,
  //   dificultad: dificultades[2],
  //   tiemposUrl: new URL("./tiempos/detached/tiempos.json", import.meta.url)
  //     .href,
  //   cancionUrl: new URL(
  //     "../assets/audio/canciones/Detached(MP3_160K).mp3",
  //     import.meta.url,
  //   ).href,
  // },
  Frantic_Metallica: {
    tittle: "Frantic -- Metallica",
    timeout: 0,
    dificultad: dificultades[3],
    tiemposUrl: new URL(
      "./tiempos/metallicaFrantic/tiempos.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Metallica- Frantic(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  OneOfUsIsTheKiller: {
    tittle: "One of Us is the Killer -- The Dillinger Escape Plan",
    timeout: 0,
    dificultad: dificultades[3],
    tiemposUrl: new URL(
      "./tiempos/oneOfUsIsTheKiller/tiempos.json",
      import.meta.url,
    ).href,
    cancionUrl: new URL(
      "../assets/audio/canciones/One of Us is the Killer(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  OutOfTheBlack: {
    tittle: "Out of the Black",
    timeout: 0,
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/outOfTheBlack/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Out of the Black.m4a",
      import.meta.url,
    ).href,
  },
  NoOneKnows_QOTSA: {
    tittle: "No One Knows -- Queens Of The Stone Age",
    timeout: 0,
    dificultad: dificultades[4],
    tiemposUrl: new URL("./tiempos/noOneKnows/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/Queens Of The Stone Age - No One Knows (Official Music Video)(MP3_160K).mp3",
      import.meta.url,
    ).href,
  },
  // BABE_Scowl: {
  //   tittle: "B.A.B.E. -- Scowl",
  //   timeout: 0,
  //   dificultad: dificultades[3],
  //   tiemposUrl: new URL("./tiempos/scowlBabe/tiempos.json", import.meta.url)
  //     .href,
  //   cancionUrl: new URL(
  //     "../assets/audio/canciones/Scowl - B.A.B.E. (Official Video)(MP3_160K).mp3",
  //     import.meta.url,
  //   ).href,
  // },
  RedStars_TBM: {
    tittle: "Red Stars -- The Birthday Massacre",
    timeout: 0,
    dificultad: dificultades[3],
    tiemposUrl: new URL("./tiempos/redStars/tiempos.json", import.meta.url)
      .href,
    cancionUrl: new URL(
      "../assets/audio/canciones/The Birthday Massacre - Red Stars.opus",
      import.meta.url,
    ).href,
  },
};
