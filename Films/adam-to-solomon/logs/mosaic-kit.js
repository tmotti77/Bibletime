// A drawn line; thin marks are thickened so they hold a row of tesserae.
function stroke(g, pts, w, color, k = 1, alpha = 1) {
  if (k <= 0 || pts.length < 2) return;
  const n = (pts.length - 1) * clamp(k), full = Math.floor(n), f = n - full;
  g.save(); g.globalAlpha *= alpha; g.strokeStyle = color; g.lineWidth = Math.max(w, 0.0045); g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= full; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (f > 0 && full + 1 < pts.length) g.lineTo(lerp(pts[full][0], pts[full + 1][0], f), lerp(pts[full][1], pts[full + 1][1], f));
  g.stroke(); g.restore();
}
// Shade inside a path: in mosaic a darker run of the same stones, never ruled lines.
function hatch(g, path, o = {}) {
  const { alpha = 0.7, k = 1, cross = false, color = PALETTE.ink } = o;
  if (k <= 0 || alpha <= 0) return;
  g.save(); g.beginPath(); path(g); g.globalAlpha *= alpha * (cross ? 0.34 : 0.17) * clamp(k); g.fillStyle = color; g.fill(); g.restore();
}
// A field of coloured stones laid over the ground colour.
function wash(g, path, color, alpha = 0.55, off = 0.006) {
  if (alpha <= 0) return;
  g.save(); g.globalAlpha *= Math.min(1, alpha * 1.55); g.beginPath(); path(g); g.fillStyle = color; g.fill(); g.restore();
}
// The floor behind every scene: cream stones with slow changes of tone, as in a laid pavement.
function chartPaper(g, S, cam, col = 0, half = 2.2) {
  plane(g, S, cam, 0.5, (g) => {
    const a = cam.x - half, b = cam.x + half;
    for (let c = Math.floor(a); c < b; c++) for (let j = 0; j < 4; j++) {
      const n = c * 31 + j * 7 + col * 101 + 5000, fx = c + hash1(n), fy = hash1(n + 1) * 1.6 - 0.8, fr = 0.12 + hash1(n + 2) * 0.3;
      const gr = g.createRadialGradient(fx, fy, 0, fx, fy, fr), tone = j % 2 ? '120,90,50' : '255,246,220'; gr.addColorStop(0, `rgba(${tone},0.2)`); gr.addColorStop(1, `rgba(${tone},0)`);
      g.fillStyle = gr; g.fillRect(fx - fr, fy - fr, 2 * fr, 2 * fr);
    }
  });
}
// The red line: one row of red stones through every scene.
function lineage(g, x0, x1, y, w = 0.012) {
  if (x1 <= x0) return;
  stroke(g, [[x0, y], [x1, y]], Math.max(w, 0.012), PALETTE.accent);
}
function nib(g, x, y, r = 0.012) { g.save(); g.fillStyle = PALETTE.accent; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, TAU); g.fill(); g.restore(); }
// A figure as the old floors show them: a robe of one colour, a dark outline, a face in profile.
const ROBES = ['#1F4E79', '#A8432A', '#3E7A5E', '#7A5C3A', '#F3EAD3', '#5B3A6B'], SKIN = '#B98A5E';
function person(g, x, y, h, o = {}) {
  const f = o.face ?? 1, lean = (o.lean ?? 0) * f, hw = h * 0.2, top = y - h * 0.8, sw = Math.sin((o.p ?? 0) * TAU) * h * 0.035;
  const lx = lean * h, robe = o.wash ?? ROBES[(o.salt ?? 3) % ROBES.length];
  const body = (g) => {
    g.moveTo(x - hw + sw, y); g.quadraticCurveTo(x - hw * 0.95 + lx * 0.5, y - h * 0.5, x - hw * 0.55 + lx, top);
    g.lineTo(x + hw * 0.55 + lx, top); g.quadraticCurveTo(x + hw * 0.95 + lx * 0.5, y - h * 0.5, x + hw - sw, y); g.closePath();
  };
  g.save();
  const a0 = g.globalAlpha, cl = o.hatch ?? 1;
  g.fillStyle = SKIN; g.beginPath(); body(g); g.fill();
  g.globalAlpha = a0 * cl; g.fillStyle = robe; g.beginPath(); body(g); g.fill(); g.globalAlpha = a0;
  g.strokeStyle = PALETTE.ink; g.lineWidth = Math.max(h * 0.035, 0.004); g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); body(g); g.stroke();
  const hx = x + lx * 1.25 + f * h * 0.015, hy = top - h * 0.085, hr = h * 0.1;
  g.beginPath(); g.arc(hx, hy, hr, 0, TAU); g.fillStyle = o.back ? PALETTE.ink : SKIN; g.fill(); g.stroke();
  if (!o.back) { g.beginPath(); g.fillStyle = PALETTE.ink; g.arc(hx, hy, hr, f > 0 ? Math.PI * 0.6 : -Math.PI * 0.4, f > 0 ? Math.PI * 1.6 : Math.PI * 0.4); g.fill(); }
  const a = lerp(1.25, -1.1, o.arm ?? 0), sx = x + f * hw * 0.35 + lx, sy = top + h * 0.09;
  const hand = [sx + f * Math.cos(a) * h * 0.34, sy + Math.sin(a) * h * 0.34];
  g.strokeStyle = PALETTE.ink; g.lineWidth = Math.max(h * 0.075, 0.006); g.beginPath(); g.moveTo(sx, sy); g.lineTo(hand[0], hand[1]); g.stroke();
  g.strokeStyle = SKIN; g.lineWidth = Math.max(h * 0.04, 0.003); g.beginPath(); g.moveTo(sx, sy); g.lineTo(hand[0], hand[1]); g.stroke();
  if (o.staff) { g.strokeStyle = PALETTE.ink; g.lineWidth = Math.max(h * 0.035, 0.005); g.beginPath(); g.moveTo(hand[0], hand[1] - h * 0.42); g.lineTo(hand[0], Math.min(y, hand[1] + h * 0.7)); g.stroke(); }
  g.restore();
  return hand;
}
// Words are cut into stone plaques laid over the mosaic; they are queued here and drawn after the stones are set.
const OVER = [];
function plaque(g, S, str, x, y, size, a, align = 'center') {
  g.save(); g.setTransform(S.u / 100, 0, 0, S.u / 100, S.W / 2, S.H / 2); g.globalAlpha = a;
  setType(g, TYPE, 'display', size * 100, { short: 100, weight: 700, track: 0.08 }); g.textBaseline = 'alphabetic'; g.textAlign = 'left';
  const m = g.measureText(str), w = m.width, cap = size * 100 * 0.7, px = size * 100 * 0.75, py = size * 100 * 0.6, X = align === 'center' ? x * 100 - w / 2 : x * 100, Y = y * 100 + cap / 2;
  const bx = X - px, by = Y - cap - py, bw = w + 2 * px, bh = cap + 2 * py;
  g.fillStyle = 'rgba(30,22,14,0.45)'; g.fillRect(bx + 0.5, by + 0.6, bw, bh);
  const gr = g.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, '#E6D6B0'); gr.addColorStop(1, '#CDB88C'); g.fillStyle = gr; g.fillRect(bx, by, bw, bh);
  g.strokeStyle = '#F5EBD0'; g.lineWidth = 0.28; g.strokeRect(bx + 0.3, by + 0.3, bw - 0.6, bh - 0.6); g.strokeStyle = '#8E7B5A'; g.lineWidth = 0.18; g.strokeRect(bx + 0.75, by + 0.75, bw - 1.5, bh - 1.5);
  g.fillStyle = '#FBF3DC'; g.fillText(str, X + 0.1, Y + 0.14); g.fillStyle = '#33261A'; g.fillText(str, X, Y);
  g.restore();
}
function card(g, S, str, t, t0, t1, y = -0.385, size = 0.058, o = {}) {
  const a = Math.min(MOTION.at(t, t0, 0.4), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  if (a <= 0) return;
  const rise = 1 - EASE.out(MOTION.at(t, t0, 0.6));
  OVER.push(() => plaque(g, S, up(str.replace(/\.$/, ''), 'en'), 0, (y < 0 ? -0.405 : 0.385) - (y < 0 ? 0.03 : -0.03) * rise, 0.04, clamp(a)));
}
function place(g, S, str, t, t0, t1, y = 0.45, color = PALETTE.ink) {
  const a = Math.min(MOTION.at(t, t0, 0.5), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  if (a <= 0) return;
  OVER.push(() => plaque(g, S, str, -0.83, y < 0 ? -0.43 : 0.43, 0.026, clamp(a), 'left'));
}
// The whole picture is set in stones: the drawing is sampled on a grid of tesserae, each a little uneven in size,
// place and tone, with mortar between; a border of triangles runs along the top and the bottom of the floor.
const MORTAR = '#9C8B6C';
let mz = null;
function mosaic(g, S) {
  const cell = Math.max(3, Math.round(S.u / 96)), cw = Math.ceil(S.W / cell) + 1, ch = Math.ceil(S.H / cell);
  if (!mz || mz.c.width !== cw || mz.c.height !== ch) { const c = Object.assign(document.createElement('canvas'), { width: cw, height: ch }); mz = { c, g: c.getContext('2d', { willReadFrequently: true }) }; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  const bh = cell * 4, tri = cell * 4;                // the border, drawn before the stones are set
  for (const y0 of [0, S.H - bh]) {
    g.fillStyle = '#F1E6C8'; g.fillRect(0, y0, S.W, bh);
    g.fillStyle = PALETTE.ink; g.fillRect(0, y0 === 0 ? bh - cell : y0, S.W, cell);
    for (let i = 0; i * tri < S.W + tri; i++) { g.fillStyle = i % 2 ? PALETTE.accent : PALETTE.blue; g.beginPath(); if (y0 === 0) { g.moveTo(i * tri, 0); g.lineTo(i * tri + tri, 0); g.lineTo(i * tri + tri / 2, bh - cell); } else { g.moveTo(i * tri, S.H); g.lineTo(i * tri + tri, S.H); g.lineTo(i * tri + tri / 2, y0 + cell); } g.fill(); }
  }
  mz.g.imageSmoothingEnabled = true; mz.g.imageSmoothingQuality = 'high'; mz.g.drawImage(g.canvas, 0, 0, cw * cell, ch * cell, 0, 0, cw, ch);
  const d = mz.g.getImageData(0, 0, cw, ch).data, gap = cell * 0.14, sz = cell - gap;
  g.fillStyle = MORTAR; g.fillRect(0, 0, S.W, S.H);
  for (let y = 0; y < ch; y++) {
    const ro = (hash1(9000 + y) - 0.5) * cell * 0.6;
    for (let x = 0; x < cw; x++) {
      const i = (y * cw + x) * 4, h = hash1(y * 977 + x * 131 + 17), h2 = hash1(y * 613 + x * 419 + 5), j = 0.88 + 0.22 * h;
      g.fillStyle = `rgb(${Math.min(255, d[i] * j) | 0},${Math.min(255, d[i + 1] * j) | 0},${Math.min(255, d[i + 2] * j) | 0})`;
      const px = x * cell + ro + gap / 2 + (h2 - 0.5) * gap * 0.9, py = y * cell + gap / 2 + (h - 0.5) * gap * 0.9, w = sz * (0.92 + 0.12 * h2), hh = sz * (0.92 + 0.12 * h);
      g.beginPath(); g.moveTo(px + w * 0.12 * h, py); g.lineTo(px + w, py + hh * 0.1 * h2); g.lineTo(px + w - w * 0.1 * h2, py + hh); g.lineTo(px, py + hh - hh * 0.12 * h); g.closePath(); g.fill();
    }
  }
  g.restore();
}
const M = (fn) => (g, k, t, S) => { OVER.length = 0; fn(g, k, t, S); mosaic(g, S); for (const f of OVER) f(); OVER.length = 0; };
