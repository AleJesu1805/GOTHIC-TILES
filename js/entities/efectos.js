import { ctx } from "../core/canvas.js";

const particulas = [];
const textosFlotantes = [];
let ultimoTiempoParticulas = 0;

const COLORES_JUICIO = {
  excellent: "#c5c4c1",
  good: "#705829",
  poor: "#641e20",
};

export function crearExplosion(tile, cantidad = 18) {
  for (let i = 0; i < cantidad; i++) {
    particulas.push({
      x: tile.x + Math.random() * tile.width,
      y: tile.y + Math.random() * 10,
      vx: (Math.random() - 0.5) * 180,
      vy: -(220 + Math.random() * 220),
      vida: 0.45 + Math.random() * 0.45,
      tamano: 2.5 + Math.random() * 4,
      color: tile.color,
    });
  }
}

export function crearTextoFlotante(x, y, texto, rendimiento) {
  textosFlotantes.push({
    x,
    y,
    texto,
    color: COLORES_JUICIO[rendimiento] ?? "#ffffff",
    inicio: performance.now(),
    vida: 0.85,
  });
}

export function crearJuicioVisual(tile, texto, rendimiento) {
  const x = tile.x + tile.width / 2;
  const y = tile.y - 40;
  crearExplosion(tile);
  crearTextoFlotante(x, y, texto, rendimiento);
}

export function limpiarEfectos() {
  particulas.length = 0;
  textosFlotantes.length = 0;
  ultimoTiempoParticulas = 0;
}

function renderizarParticulas(delta) {
  for (let i = particulas.length - 1; i >= 0; i--) {
    const p = particulas[i];
    p.vida -= delta;
    if (p.vida <= 0) {
      particulas.splice(i, 1);
      continue;
    }
    p.x += p.vx * delta;
    p.y += p.vy * delta;
    p.vy += 140 * delta;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.vida / 0.5));
    ctx.fillStyle = p.color;
    const s = p.tamano;
    ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
  }
  ctx.globalAlpha = 1;
}

function renderizarTextosFlotantes() {
  const ahora = performance.now();
  for (let i = textosFlotantes.length - 1; i >= 0; i--) {
    const t = textosFlotantes[i];
    const progreso = (ahora - t.inicio) / (t.vida * 1000);
    if (progreso >= 1) {
      textosFlotantes.splice(i, 1);
      continue;
    }

    let escala = 1;
    if (progreso < 0.15) {
      const tProgreso = progreso / 0.15;
      escala = 0.4 + (1 - Math.pow(1 - tProgreso, 2)) * 0.6;
    }

    ctx.save();
    ctx.globalAlpha = 1 - progreso * progreso;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${Math.round(30 * escala)}px "Savage", Impact, sans-serif`;
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 8;
    ctx.fillStyle = t.color;
    ctx.fillText(t.texto, t.x, t.y - progreso * 90);
    ctx.restore();
  }
}

export function renderizarEfectos() {
  const ahora = performance.now();
  const delta =
    ultimoTiempoParticulas === 0
      ? 1 / 60
      : Math.min((ahora - ultimoTiempoParticulas) / 1000, 1 / 30);
  ultimoTiempoParticulas = ahora;
  renderizarParticulas(delta);
  renderizarTextosFlotantes();
}
