const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const span = document.querySelector("span");

const piano = new Audio('music/piano1.ogg');

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

window.addEventListener("resize", resizeCanvas);

// ------------------ TAMAÑO DE LAS TILES ------------------------

const anchTile = 70;
const altTile = 100;

// ----------------- LAS TILES ---------------------------------

class Tile {
    constructor(x, y, color, idGafo, idFino, gafoScore, finoScore, teclaCorrespondiente) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 5;
        this.active = false;
        this.teclaStart = false;
        this.min = 3;
        this.max = 10;
        this.idGafo = idGafo;
        this.idFino = idFino;
        this.gafoScore = gafoScore;
        this.finoScore = finoScore;
        this.teclaCorrespondiente = teclaCorrespondiente;
    }

    drawTile() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y - altTile, anchTile, altTile);
    }

    gravedad() {
        if (this.active === true) {
            this.y += this.speed;
            if (this.y > windowHeight - 10) {
                this.y = 0;

                if (!this.teclaStart) {
                    scoreGafo[this.gafoScore] += 1;
                    document.getElementById(this.idGafo).textContent = scoreGafo[this.gafoScore];
                }

                this.teclaStart = false;

                // piano.currentTime = 0;
                // piano.play();

                this.speed = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
            }
        }
    }

    botonesPc() {
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            Tile.teclaStart = true;
            if (!cronometer) {
                cronometer = true;
                initCronometer();
                tilesCayendo.forEach(t => t.active = true);
            };

            tilesCayendo.forEach(t => t.active = true);
            if(e.key === this.teclaCorrespondiente) {
                if (this.y <= windowHeight - altTile - 10) {
                    scoreGafo[this.gafoScore] += 1;
                    document.getElementById(this.idGafo).textContent = scoreGafo[this.gafoScore];
                } else if (this.y >= windowHeight - altTile) {
                    scoreFino[this.finoScore] += 1;
                    document.getElementById(this.idFino).textContent = scoreFino[this.finoScore];
                }
            }
        });
    }

    botonesCel() {
        document.addEventListener("touchstart", (e) => {
            // e.preventDefault();
            Tile.teclaStart = true;
            if (!cronometer) {
                cronometer = true;
                initCronometer();
                tilesCayendo.forEach(t => t.active = true);
            };

            if (e.changedTouches[0].clientY >= this.y - altTile &&
                e.changedTouches[0].clientX >= this.x &&
                e.changedTouches[0].clientX <= this.x + anchTile
            ) {
                this.teclaStart = true;
                if (this.y <= windowHeight - altTile - 10) {
                    scoreGafo[this.gafoScore] += 1;
                    document.getElementById(this.idGafo).textContent = scoreGafo[this.gafoScore];
                } else if (this.y >= windowHeight - altTile) {
                    scoreFino[this.finoScore] += 1;
                    document.getElementById(this.idFino).textContent = scoreFino[this.finoScore];
                }
            };
        });
    }
}

const tileGreen = new Tile(windowWidth / 2 - anchTile * 2, windowHeight - 10, "green", "gafoGreenId", "gafoGreen");
const tilePink = new Tile(windowWidth / 2 - anchTile, windowHeight - 10, "pink", "gafoPinkId", "gafoPink");
const tileBlue = new Tile(windowWidth / 2, windowHeight - 10, "blue", "gafoBlueId", "gafoBlue");
const tileYellow = new Tile(windowWidth / 2 + anchTile, windowHeight - 10, "yellow", "gafoYellowId", "gafoYellow");

// ------------------- TILES QUE CAEN -----------------------

const tileGreenCaida = new Tile(windowWidth / 2 - anchTile * 2, windowHeight - 10, "green", "gafoGreenId", "finoGreenId", "gafoGreen", "finoGreen", "v");
const tilePinkCaida = new Tile(windowWidth / 2 - anchTile, windowHeight - 10, "pink", "gafoPinkId", "finoPinkId", "gafoPink","finoPink", "b");
const tileBlueCaida = new Tile(windowWidth / 2, windowHeight - 10, "blue", "gafoBlueId", "finoBlueId", "gafoBlue", "finoBlue", "n");
const tileYellowCaida = new Tile(windowWidth / 2 + anchTile, windowHeight - 10, "yellow", "gafoYellowId", "finoYellowId", "gafoYellow","finoYellow", "m");

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

// let delay = 3;

// function initiTiles() {
//         if (seconds === 5 - delay) {
//             tileBlueCaida.active = true;
//         }
// }

// ----- BUCLE INFINITO Y LA INICIALIZACION DE LA DETECCION DE LOS EVENTOS ----------

tilesCayendo.forEach(tileCae => {
        tileCae.botonesPc();
        tileCae.botonesCel();
});

function draw() {
    // DIBUJAR CANVAS ----------------------------
    resizeCanvas();

    // DIBUJAR TILES -----------------------------
    tilesForDraw.forEach(tile => {
        tile.drawTile();
    });

    // DIBUJAR TILES CAYENDO ---------------------
    tilesCayendo.forEach(tileCae => {
        tileCae.drawTile();
        tileCae.gravedad();
    });

    // initiTiles();

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);