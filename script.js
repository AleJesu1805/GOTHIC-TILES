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
    y: windowHeight - 10,
    color: "green",
    speed: 5,
    active: false,
    teclaPresionada: false,
    min: 2,
    max: 4,
    drawTile: function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y - altTile, anchTile, altTile);
    },
    gravedad: function () {
        if (this.active === true) {
            this.y += this.speed;
            if (this.y > windowHeight) {
                this.y = 0;

                
                if (!this.teclaPresionada) {
                    scoreGafo[this.gafoScore] += 1;
                    document.getElementById(this.id).textContent = scoreGafo[this.gafoScore];
                }

                this.teclaPresionada = false;

                // piano.currentTime = 0;
                // piano.play();

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
    id: "gafoGreenId",
    gafoScore: "gafoGreen",
}

var tilePinkCaida = {
    ...tilePink,
    id: "gafoPinkId",
    gafoScore: "gafoPink",
}

var tileBlueCaida = {
    ...tileBlue,
    id: "gafoBlueId",
    gafoScore: "gafoBlue",
}

var tileYellowCaida = {
    ...tileYellow,
    id: "gafoYellowId",
    gafoScore: "gafoYellow",
}

// -------------- DETECCIÓN DE TECLAS PRESIONADAS ----------

document.addEventListener("keydown", (e) => {
    e.preventDefault();
    if (!cronometer) {
        cronometer = true;
        initCronometer();
        tilesCayendo.forEach(t => t.active = true);
    }
    if (e.key === "v") {
        tileGreenCaida.teclaPresionada = true;
        if (tileGreenCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoGreen += 1;
            document.getElementById("gafoGreenId").textContent = scoreGafo.gafoGreen;
        } else if (tileGreenCaida.y >= windowHeight- altTile) {
            scoreFino.finoGreen += 1;
            document.getElementById("finoGreenId").textContent = scoreFino.finoGreen;
        }
    }

    if (e.key === "b") {
        if (tilePinkCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoPink += 1;
            document.getElementById("gafoPinkId").textContent = scoreGafo.gafoPink;
        } else if (tilePinkCaida.y >= windowHeight - altTile) {
            scoreFino.finoPink += 1;
            document.getElementById("finoPinkId").textContent = scoreFino.finoPink;
        }
    }

    if (e.key === "n") {
        if (tileBlueCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoBlue += 1;
            document.getElementById("gafoBlueId").textContent = scoreGafo.gafoBlue;
        } else if (tileBlueCaida.y >= windowHeight - altTile) {
            scoreFino.finoBlue += 1;
            document.getElementById("finoBlueId").textContent = scoreFino.finoBlue;
        }
    }

    if (e.key === "m") {
        if (tileYellowCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoYellow += 1;
            document.getElementById("gafoYellowId").textContent = scoreGafo.gafoYellow;
        } else if (tileYellowCaida.y >= windowHeight - altTile) {
            scoreFino.finoYellow += 1;
            document.getElementById("finoYellowId").textContent = scoreFino.finoYellow;
        }
    }
});

// ---------------- SOPORTE PARA MOVILES ----------------------

canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!cronometer) {
        cronometer = true;
        initCronometer();
        tilesCayendo.forEach(t => t.active = true);
    };

    if (e.changedTouches[0].clientY >= tileGreen.y - altTile &&
        e.changedTouches[0].clientX >= tileGreen.x &&
        e.changedTouches[0].clientX <= tileGreen.x + anchTile
    ) {
        tileGreenCaida.teclaPresionada = true;
        if (tileGreenCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoGreen += 1;
            document.getElementById("gafoGreenId").textContent = scoreGafo.gafoGreen;
        } else if (tileGreenCaida.y >= windowHeight- altTile) {
            scoreFino.finoGreen += 1;
            document.getElementById("finoGreenId").textContent = scoreFino.finoGreen;
        }
    };

    if (e.changedTouches[0].clientY >= tilePink.y - altTile &&
        e.changedTouches[0].clientX >= tilePink.x &&
        e.changedTouches[0].clientX <= tilePink.x + anchTile
    ) {
        if (tilePinkCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoPink += 1;
            document.getElementById("gafoPinkId").textContent = scoreGafo.gafoPink;
        } else if (tilePinkCaida.y >= windowHeight- altTile) {
            scoreFino.finoPink += 1;
            document.getElementById("finoPinkId").textContent = scoreFino.finoPink;
        }
    };

    if (e.changedTouches[0].clientY >= tileBlue.y - altTile &&
        e.changedTouches[0].clientX >= tileBlue.x &&
        e.changedTouches[0].clientX <= tileBlue.x + anchTile
    ) {
        if (tileBlueCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoBlue += 1;
            document.getElementById("gafoBlueId").textContent = scoreGafo.gafoBlue;
        } else if (tileBlueCaida.y >= windowHeight - altTile) {
            scoreFino.finoBlue += 1;
            document.getElementById("finoBlueId").textContent = scoreFino.finoBlue;
        }
    }

    if (e.changedTouches[0].clientY >= tileYellow.y - altTile &&
        e.changedTouches[0].clientX >= tileYellow.x &&
        e.changedTouches[0].clientX <= tileYellow.x + anchTile
    ) {
        if (tileYellowCaida.y <= windowHeight - altTile - 10) {
            scoreGafo.gafoYellow += 1;
            document.getElementById("gafoYellowId").textContent = scoreGafo.gafoYellow;
        } else if (tileYellowCaida.y >= windowHeight - altTile) {
            scoreFino.finoYellow += 1;
            document.getElementById("finoYellowId").textContent = scoreFino.finoYellow;
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

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);