const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const span = document.querySelector("span");

const imgFondo = document.querySelector(".fondo");
const icono = document.getElementById("PentaCruzInvert");

const img = new Image();
img.src = "img/calaca.jpeg";

// ------- PIANO DE ACIERTOS -----------------

// ------- PIANO DE ACIERTOS -----------------

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const pianoBuffers = {};

async function cargarPiano(nombre, ruta) {
    const res = await fetch(ruta);
    const arrayBuffer = await res.arrayBuffer();
    pianoBuffers[nombre] = await audioCtx.decodeAudioData(arrayBuffer);
}

Promise.all([
    cargarPiano('green', 'music/piano1.ogg'),
    cargarPiano('pink', 'music/piano5.mp3'),
    cargarPiano('blue', 'music/piano3.mp3'),
    cargarPiano('yellow', 'music/piano4.mp3'),
]);

// ---------- PUNTAJES ---------------

let scoreFino = {
    finoGreen: 0,
    finoPink: 0,
    finoBlue: 0,
    finoYellow: 0,
};

let scoreGafo = {
    gafoGreen: -1,
    gafoPink: -1,
    gafoBlue: -1,
    gafoYellow: -1,
};

let pico = [3, 9, 14];

// -------------- CRONÓMETRO -------------------------

let seconds = 0;
let cronometer = false;

function initCronometer() {
    if (cronometer === true) {
        setInterval(() => {
            seconds++;
            span.textContent = seconds;
        }, 1000);
    }
}

// --------- ANCHO Y ALTO DE LA VENTANA ---------------

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;


// ------------------- ESCALAR EL CANVAS ----------------------

function resizeCanvas() {
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    canvas.height = windowHeight;
    canvas.width = windowWidth;
}

// window.addEventListener("resize", resizeCanvas);

// ------------------ TAMAÑO DE LAS TILES Y COLORES ------------------------

const colorGreen = "#004518";
const colorPink = "#500041";
const colorBlue = "#001561";
const colorYellow = "#686200";

const anchTile = 80;
const altTile = 140;

// ----------------- LAS TILES ---------------------------------

class Tile {
    constructor(x, y, color, idGafo, idFino, gafoScore, finoScore, teclaCorrespondiente, piano) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 4;
        this.active = false;
        this.teclaStart = false;
        this.min = 3;
        this.max = 9;
        this.idGafo = idGafo;
        this.idFino = idFino;
        this.gafoScore = gafoScore;
        this.finoScore = finoScore;
        this.teclaCorrespondiente = teclaCorrespondiente;
        this.piano = piano;
    }

    actualizarPosicion(offsetTiles, esBoton) {
        this.x = windowWidth / 2 + offsetTiles * anchTile;
        if (esBoton) {
            this.y = windowHeight - 10;
        }
    }

    reproducirPiano() {
        if (!pianoBuffers[this.piano]) return;
        const fuente = audioCtx.createBufferSource();
        fuente.buffer = pianoBuffers[this.piano];
        fuente.connect(audioCtx.destination);
        fuente.start(0);
    }

    drawTile() {
        context.fillStyle = `${this.color}ff`;
        // context.drawImage(img, this.x, this.y - altTile, anchTile, altTile);
        context.fillRect(this.x, this.y - altTile, anchTile, altTile);
    }

    gravedad() {
        this.y += this.speed;
        if (this.y > windowHeight) {
            this.y = 0;

            if (!this.teclaStart) {
                scoreGafo[this.gafoScore] += 1;
                document.getElementById(this.idGafo).textContent = scoreGafo[this.gafoScore];
            }

            this.teclaStart = false;
            this.speed = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
        }
    }

    botonesPc() {
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            // this.teclaStart = true;
            if (e.repeat) return;
            span.classList.remove("start");
            icono.style.display = "none";
            if (!cronometer) {
                cronometer = true;
                initCronometer();
                tilesCayendo.forEach(t => t.active = true);
                span.textContent = 0;
            };

            tilesCayendo.forEach(t => t.active = true);
            if (e.key === this.teclaCorrespondiente) {
                this.teclaStart = true;
                if (this.y <= windowHeight - altTile - 40) {
                    scoreGafo[this.gafoScore] += 1;
                    document.getElementById(this.idGafo).textContent = scoreGafo[this.gafoScore];
                    imgFondo.classList.add("fondoSaturado");
                    setTimeout(() => {
                        imgFondo.classList.remove("fondoSaturado");
                    }, 500)
                } else if (this.y >= windowHeight - altTile - 40) {
                    scoreFino[this.finoScore] += 1;
                    document.getElementById(this.idFino).textContent = scoreFino[this.finoScore];
                    this.reproducirPiano();
                }
            }
        });
    }

    botonesCel() {
        document.addEventListener("touchstart", (e) => {
            span.classList.remove("start");
            icono.style.display = "none";
            if (!cronometer) {
                cronometer = true;
                initCronometer();
                tilesCayendo.forEach(t => t.active = true);
                span.textContent = 0;
            };

            if (e.changedTouches[0].clientY >= this.y - altTile &&
                e.changedTouches[0].clientX >= this.x &&
                e.changedTouches[0].clientX <= this.x + anchTile
            ) {
                const tileCae = tilesCayendo.find(t => t.color === this.color);
                tileCae.teclaStart = true;
                if (tileCae.y <= windowHeight - altTile - 40) {
                    scoreGafo[tileCae.gafoScore] += 1;
                    document.getElementById(tileCae.idGafo).textContent = scoreGafo[tileCae.gafoScore];
                    imgFondo.classList.add("fondoSaturado");
                    setTimeout(() => {
                        imgFondo.classList.remove("fondoSaturado");
                    }, 500);
                } else if (tileCae.y >= windowHeight - altTile - 40) {
                    scoreFino[tileCae.finoScore] += 1;
                    document.getElementById(tileCae.idFino).textContent = scoreFino[tileCae.finoScore];
                    tileCae.reproducirPiano();
                }
            };
        });
    }
}

const tileGreen = new Tile(windowWidth / 2 - anchTile * 2,
    windowHeight - 10,
    colorGreen,
    "gafoGreenId",
    "finoGreenId",
    "gafoGreen",
    "finoGreen",
    null,
    'green');

const tilePink = new Tile(windowWidth / 2 - anchTile,
    windowHeight - 10,
    colorPink,
    "gafoPinkId",
    "finoPinkId",
    "gafoPink",
    "finoPink",
    null,
    'pink');

const tileBlue = new Tile(windowWidth / 2,
    windowHeight - 10,
    colorBlue,
    "gafoBlueId",
    "finoBlueId",
    "gafoBlue",
    "finoBlue",
    null,
    'blue');

const tileYellow = new Tile(windowWidth / 2 + anchTile,
    windowHeight - 10,
    colorYellow,
    "gafoYellowId",
    "finoYellowId",
    "gafoYellow",
    "finoYellow",
    null,
    'yellow');

// ------------------- TILES QUE CAEN -----------------------

const tileGreenCaida = new Tile(windowWidth / 2 - anchTile * 2,
    windowHeight - 10,
    colorGreen,
    "gafoGreenId",
    "finoGreenId",
    "gafoGreen",
    "finoGreen",
    "v",
    'green');

const tilePinkCaida = new Tile(windowWidth / 2 - anchTile,
    windowHeight - 10,
    colorPink,
    "gafoPinkId",
    "finoPinkId",
    "gafoPink",
    "finoPink",
    "b",
    'pink');

const tileBlueCaida = new Tile(windowWidth / 2,
    windowHeight - 10,
    colorBlue,
    "gafoBlueId",
    "finoBlueId",
    "gafoBlue",
    "finoBlue",
    "n",
    'blue');

const tileYellowCaida = new Tile(windowWidth / 2 + anchTile,
    windowHeight - 10,
    colorYellow,
    "gafoYellowId",
    "finoYellowId",
    "gafoYellow",
    "finoYellow",
    "m",
    'yellow');


const tilesForDraw = [
    tileGreen,
    tilePink,
    tileBlue,
    tileYellow,
];

const tilesCayendo = [
    tileGreenCaida,
    tilePinkCaida,
    tileBlueCaida,
    tileYellowCaida,
];

// ----- BUCLE INFINITO Y LA INICIALIZACION DE LA DETECCION DE LOS EVENTOS ----------

document.addEventListener("touchstart", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
}, { once: true });

tilesCayendo.forEach(tileCae => {
    tileCae.botonesPc();
});

tilesForDraw.forEach(tile => {
    tile.botonesCel();
});

function draw() {
    // DIBUJAR CANVAS ----------------------------
    resizeCanvas();
    window.visualViewport?.addEventListener("resize", () => {
        windowHeight = window.visualViewport.height;
        windowWidth = window.visualViewport.width;
    });

    tileGreen.actualizarPosicion(-2, true);
    tilePink.actualizarPosicion(-1, true);
    tileBlue.actualizarPosicion(0, true);
    tileYellow.actualizarPosicion(1, true);
    tileGreenCaida.actualizarPosicion(-2, false);
    tilePinkCaida.actualizarPosicion(-1, false);
    tileBlueCaida.actualizarPosicion(0, false);
    tileYellowCaida.actualizarPosicion(1, false);

    // DIBUJAR TILES -----------------------------
    tilesForDraw.forEach(tile => {
        tile.drawTile();
    });

    // // DIBUJAR TILES CAYENDO ---------------------
    tilesCayendo.forEach(tileCae => {
        tileCae.drawTile();
        if (tileCae.active === true) {
            tileCae.gravedad();
        }
    });
    // initiTiles();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);