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

const tileGreen = {
    x: windowWidth / 2 - anchTile * 2,
    y: windowHeight,
    color: "green",
    speed: 1,
    active: false,
    teclaPresionada: false,
    min: 2,
    max: 6,
    drawTile: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y - altTile - 10, anchTile, altTile);
    },
    gravedad: function () {
        if (this.active === true) {
            this.y += this.speed;
            if (this.y > windowHeight) {
                this.y = 0;

                
                if (!this.teclaPresionada) {
                    scoreGafo.gafoGreen += 1;
                    document.getElementById("gafoGreen").textContent = scoreGafo.gafoGreen;
                }

                this.teclaPresionada = false;

                // piano.currentTime = 0;
                // piano.play();
                // this.active = false;

                this.speed = Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
            }
        }
    },
};

const tilePink = {
    ...tileGreen,
    color: "pink",
    x: windowWidth / 2 - anchTile,
};

const tileBlue = {
    ...tileGreen,
    color: "blue",
    x: windowWidth / 2,
};

const tileYellow = {
    ...tileGreen,
    color: "yellow",
    x: windowWidth / 2 + anchTile,
};

// ------------------- TILES QUE CAEN -----------------------



var tileGreenCaida = {
    ...tileGreen,
    // speed: Math.floor(Math.random() * (10 - 5 + 1) + 5),
}

var tilePinkCaida = {
    ...tilePink,
    // speed: Math.floor(Math.random() * (10 - 5 + 1) + 5),
}

var tileBlueCaida = {
    ...tileBlue,
    // speed: Math.floor(Math.random() * (10 - 5 + 1) + 5),
}

var tileYellowCaida = {
    ...tileYellow,
    // speed: Math.floor(Math.random() * (10 - 5 + 1) + 5),
}

// -------------- DETECCIÓN DE TECLAS PRESIONADAS ----------

document.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (e.key === "g" && !cronometer) {
        cronometer = true;
        initCronometer();
    }
    if (e.key === "v") {
        tileGreenCaida.teclaPresionada = true;
        if (tileGreenCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoGreen += 1;
            document.getElementById("gafoGreen").textContent = scoreGafo.gafoGreen;
        } else if (tileGreenCaida.y >= windowHeight- altTile) {
            scoreFino.finoGreen += 1;
            document.getElementById("finoGreen").textContent = scoreFino.finoGreen;
        }
    }

    if (e.key === "b") {
        if (tilePinkCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoPink += 1;
            document.getElementById("gafoPink").textContent = scoreGafo.gafoPink;
        } else if (tilePinkCaida.y >= windowHeight - altTile) {
            scoreFino.finoPink += 1;
            document.getElementById("finoPink").textContent = scoreFino.finoPink;
        }
    }

    if (e.key === "n") {
        if (tileBlueCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoBlue += 1;
            document.getElementById("gafoBlue").textContent = scoreGafo.gafoBlue;
        } else if (tileBlueCaida.y >= windowHeight - altTile) {
            scoreFino.finoBlue += 1;
            document.getElementById("finoBlue").textContent = scoreFino.finoBlue;
        }
    }

    if (e.key === "m") {
        if (tileYellowCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoYellow += 1;
            document.getElementById("gafoYellow").textContent = scoreGafo.gafoYellow;
        } else if (tileYellowCaida.y >= windowHeight - altTile) {
            scoreFino.finoYellow += 1;
            document.getElementById("finoYellow").textContent = scoreFino.finoYellow;
        }
    }
});

// ----------------- BUCLE INFINITO ----------------------

// let delay = 3;

// function initiTiles() {
//         if (seconds === 5 - delay) {
//             tileBlueCaida.active = true;
//         }
// }

const tilesComun = [
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

function draw() {
    // DIBUJAR CANVAS -------------------------
    resizeCanvas();

    // DIBUJAR TILES -----------------------------
    tilesComun.forEach(tile => {
        tile.drawTile();
    });

    // // DIBUJAR TILES CAYENDO ----------------------
    tilesCayendo.forEach(tileCae => {
        tileCae.drawTile();
        tileCae.gravedad();
    });

    // initiTiles();

    tileGreenCaida.active = true;

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);