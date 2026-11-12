// ------------------------------ the silhouette kit ------------------------------
// Every chapter has its own painted sky; everything in front of it is a silhouette lit from behind.
const MOODS = {
  1: { sky: ['#1b1440', '#5b2a6e', '#c2456a', '#f28a3c', '#ffd98a'], sun: [0.34, 0.66], far: '#7a3a6c', mid: '#3a1c44' },
  2: { sky: ['#0c1420', '#1d2a3a', '#3a4a58', '#62727c', '#98a2a6'], sun: null, far: '#2c3a48', mid: '#18222c' },
  3: { sky: ['#2a0f1a', '#7a2a1e', '#c8552a', '#f0a040', '#ffe0a0'], sun: [0.72, 0.7], far: '#8a3a2a', mid: '#4a1c18' },
  4: { sky: ['#141a44', '#3a3a7a', '#8a4a7a', '#e08a5a', '#ffd9a0'], sun: null, far: '#3a2f5a', mid: '#1c1830' },
  5: { sky: ['#3a2410', '#a8641e', '#e8a23a', '#ffd27a', '#fff0c0'], sun: [0.62, 0.52], far: '#a8703a', mid: '#5a3416' },
  6: { sky: ['#0a1a2a', '#14404e', '#2f7a7a', '#e0b070', '#fff0c0'], sun: null, far: '#1f4a54', mid: '#102a32' },
  7: { sky: ['#1a0a14', '#4a1420', '#9a2a22', '#e0602a', '#ffb060'], sun: [0.2, 0.72], far: '#5a1e24', mid: '#2a0e14' },
  8: { sky: ['#0a0608', '#2a0c0c', '#5a1a12', '#a0401a', '#e08a3a'], sun: null, far: '#2a1010', mid: '#160808' },
  9: { sky: ['#2a1a3a', '#8a4a5a', '#e08a4a', '#ffc870', '#fff0c0'], sun: [0.76, 0.6], far: '#8a4a4a', mid: '#44242c' },
  10: { sky: ['#101838', '#3a3a78', '#b0608a', '#f0a070', '#ffe0b0'], sun: [0.24, 0.68], far: '#5a3a6a', mid: '#2a1c38' },
  11: { sky: ['#3a1a08', '#a85a12', '#f0a428', '#ffd870', '#fff6d0'], sun: [0.5, 0.62], far: '#a8662a', mid: '#5a3210' },
};
let MOOD = MOODS[1];
const SIL = '#0b0710';
function stroke(g, pts, w, color, k = 1, alpha = 1) {
  if (k <= 0 || pts.length < 2) return;
  const n = (pts.length - 1) * clamp(k), full = Math.floor(n), f = n - full, lit = color === PALETTE.accent || color === STARLIGHT || color === PALETTE.gold;
  g.save(); g.globalAlpha *= alpha; g.strokeStyle = color === PALETTE.bg ? SIL : color; g.lineWidth = Math.max(w, 0.003); g.lineCap = 'round'; g.lineJoin = 'round';
  if (lit) { g.shadowColor = color; g.shadowBlur = S.u * 0.014; }
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= full; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (f > 0 && full + 1 < pts.length) g.lineTo(lerp(pts[full][0], pts[full + 1][0], f), lerp(pts[full][1], pts[full + 1][1], f));
  g.stroke(); g.restore();
}
function hatch() {}                                   // no ruled shading in this look: light and haze do that work
// Colour in this look: a strong wash is light (a sun, fire, gold), a weak one a tint inside the shadow; blue is water.
function wash(g, path, color, alpha = 0.55) {
  if (alpha <= 0) return;
  g.save(); g.beginPath(); path(g);
  if (color === NIGHT) { g.globalAlpha *= Math.min(1, alpha * 1.15); g.fillStyle = '#080c24'; }
  else if (color === PALETTE.green) { g.globalAlpha *= Math.min(1, alpha * 2.4); g.fillStyle = SIL; }
  else if (color === PALETTE.dim) { g.globalAlpha *= Math.min(1, alpha * 2); g.fillStyle = MOOD.mid; }
  else if (color === PALETTE.gold || color === PALETTE.accent) { g.globalAlpha *= alpha > 0.5 ? Math.min(1, alpha * 1.2) : alpha * 0.4; g.fillStyle = color; }
  else { g.globalAlpha *= 0.94; g.fillStyle = '#101c30'; }
  g.fill(); g.restore();
}
// The sky behind every scene, in screen space: the chapter's gradient, its sun, long clouds that drift with the camera.
function chartPaper(g, S, cam, col = 1) {
  MOOD = MOODS[col] ?? MOODS[1];
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0);
  const sk = g.createLinearGradient(0, 0, 0, S.H * 0.8); MOOD.sky.forEach((c, i) => sk.addColorStop([0, 0.3, 0.55, 0.78, 1][i], c)); g.fillStyle = sk; g.fillRect(0, 0, S.W, S.H);
  if (MOOD.sun) {
    const sx = MOOD.sun[0] * S.W - cam.x * S.u * 0.05, sy = MOOD.sun[1] * S.H, gl = g.createRadialGradient(sx, sy, 0, sx, sy, S.u * 0.75);
    gl.addColorStop(0, 'rgba(255,244,200,0.95)'); gl.addColorStop(0.12, 'rgba(255,214,130,0.7)'); gl.addColorStop(0.45, 'rgba(255,150,80,0.2)'); gl.addColorStop(1, 'rgba(255,120,80,0)');
    g.fillStyle = gl; g.fillRect(0, 0, S.W, S.H); g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(sx, sy, S.u * 0.085, 0, TAU); g.fill();
  }
  for (let i = 0; i < 30; i++) {
    const n = col * 211 + i * 17, span = S.W * 1.6, cx = ((hash1(n) * span - cam.x * S.u * (0.1 + 0.12 * hash1(n + 3))) % span + span) % span - S.W * 0.3, cy = (0.08 + hash1(n + 1) * 0.5) * S.H, cw = (0.1 + hash1(n + 2) * 0.26) * S.W, ch = (0.012 + hash1(n + 4) * 0.03) * S.H;
    const cg = g.createLinearGradient(0, cy - ch, 0, cy + ch); cg.addColorStop(0, 'rgba(20,10,30,0.5)'); cg.addColorStop(1, 'rgba(255,190,130,0.45)');
    g.fillStyle = cg; g.beginPath(); g.ellipse(cx, cy, cw, ch, 0, 0, TAU); g.fill();
  }
  g.restore();
}
function lineage(g, x0, x1, y, w = 0.006) {
  if (x1 <= x0) return;
  stroke(g, [[x0, y], [x1, y]], Math.max(w, 0.006), PALETTE.accent);
}
function nib(g, x, y, r = 0.009) { g.save(); g.shadowColor = PALETTE.accent; g.shadowBlur = S.u * 0.03; g.fillStyle = '#ff7a5c'; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, TAU); g.fill(); g.restore(); }
// A person as a silhouette with real proportions: legs, torso, neck, head, two arms. Returns the near hand.
function person(g, x, y, h, o = {}) {
  const f = o.face ?? 1, u = h / 8, lean = (o.lean ?? 0) * f * h * 0.9, st = Math.sin((o.p ?? 0) * TAU) * u * 0.7, hipY = y - u * 3.9, shY = y - u * 6.2 + Math.abs(lean) * 0.25, sx0 = x + lean;
  g.save(); g.fillStyle = SIL; g.strokeStyle = SIL; g.lineCap = 'round'; g.lineJoin = 'round';
  if (o.long !== false && !o.legs) {                  // a robe: one long shape from the shoulders to the feet
    g.beginPath(); g.moveTo(sx0 - u * 0.95, shY); g.quadraticCurveTo(sx0, shY - u * 0.45, sx0 + u * 0.95, shY); g.quadraticCurveTo(x + u * 1.05, y - u * 2.5, x + u * 1.15 + st * 0.4, y); g.lineTo(x - u * 1.15 + st * 0.4, y); g.quadraticCurveTo(x - u * 1.05, y - u * 2.5, sx0 - u * 0.95, shY); g.fill();
    g.lineWidth = u * 0.6; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * u * 0.4, y - u * 0.4); g.lineTo(x + s * u * 0.45 + s * st, y + u * 0.02); g.stroke(); }
  } else {
    g.lineWidth = u * 0.85; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * u * 0.4, hipY); g.lineTo(x + s * (u * 0.5 + st * 0.5), y - u * 2); g.lineTo(x + s * u * 0.5 + s * st, y); g.stroke(); }
    g.beginPath(); g.moveTo(sx0 - u * 0.95, shY); g.quadraticCurveTo(sx0, shY - u * 0.4, sx0 + u * 0.95, shY); g.lineTo(x + u * 0.75, hipY + u * 0.2); g.lineTo(x - u * 0.75, hipY + u * 0.2); g.closePath(); g.fill();
  }
  g.lineWidth = u * 0.5;
  const arm = (side, a) => { const ax = sx0 + side * u * 0.85, ay = shY + u * 0.15, ex = ax + Math.sin(a) * u * 1.45 * f, ey = ay + Math.cos(a) * u * 1.45, hx = ex + Math.sin(a * 1.12) * u * 1.4 * f, hy = ey + Math.cos(a * 1.12) * u * 1.4; g.beginPath(); g.moveTo(ax, ay); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke(); return [hx, hy]; };
  arm(-f, 0.1 - st * 0.1); const hand = arm(f, lerp(0.15, 2.5, o.arm ?? 0));
  const hx = sx0 + lean * 0.3 + f * u * 0.08, hy = shY - u * 1.1;
  g.fillRect(sx0 + lean * 0.15 - u * 0.2, shY - u * 0.75, u * 0.4, u * 0.7);
  g.beginPath(); g.ellipse(hx, hy, u * 0.55, u * 0.62, 0, 0, TAU); g.fill();
  if ((o.salt ?? 0) % 3 === 0) { g.beginPath(); g.moveTo(hx - f * u * 0.6, hy - u * 0.2); g.quadraticCurveTo(hx - f * u * 1.1, hy + u * 1.4, hx - f * u * 0.5, hy + u * 2.2); g.lineTo(hx, hy + u * 0.6); g.closePath(); g.fill(); }     // long hair or a head cloth
  if (o.staff) { g.lineWidth = u * 0.22; g.beginPath(); g.moveTo(hand[0], hand[1] - u * 3.4); g.lineTo(hand[0], Math.min(y, hand[1] + u * 5.6)); g.stroke(); }
  g.restore();
  return hand;
}
// Ground whose top edge is y = f(x). Far ground is haze, mountains are a middle tone, near ground is black with grass.
function land(g, f, x0, x1, bottom, o = {}) {
  const far = (o.ang ?? 0.3) < 0.2, mid = !!o.cross;
  g.save(); g.fillStyle = far ? MOOD.far : mid ? MOOD.mid : SIL; g.beginPath(); g.moveTo(x0, bottom);
  for (let x = x0; x <= x1 + 1e-6; x += 0.03) g.lineTo(x, f(x));
  g.lineTo(x1, bottom); g.closePath(); g.fill();
  if (!far && !mid && o.fill !== false) { g.strokeStyle = SIL; g.lineWidth = 0.0026; g.lineCap = 'round'; g.beginPath(); for (let i = Math.ceil(x0 / 0.011); i * 0.011 < x1; i++) { const x = i * 0.011 + (hash1(i * 7 + 3) - 0.5) * 0.008, hh = 0.008 + 0.026 * hash1(i * 13 + 1), y = f(x); g.moveTo(x, y + 0.004); g.quadraticCurveTo(x + (hash1(i) - 0.5) * 0.01, y - hh * 0.5, x + (hash1(i + 9) - 0.5) * 0.022, y - hh); } g.stroke(); }
  g.restore();
}
// A cut stone or a brick: black against the sky, its joints caught by the light; gold when the gold comes.
function block(g, x, y, w, h, salt = 1, o = {}) {
  g.fillStyle = SIL; g.fillRect(x, y, w, h);
  if ((o.wash === PALETTE.gold || o.wash === PALETTE.accent) && (o.washA ?? 0.5) > 0.5) { g.save(); g.globalAlpha *= Math.min(1, ((o.washA ?? 0.5) - 0.5) * 2.4); g.fillStyle = o.wash === PALETTE.gold ? '#ffc94a' : o.wash; g.fillRect(x, y, w, h); g.restore(); }
  g.strokeStyle = 'rgba(255,200,140,0.22)'; g.lineWidth = 0.0014; g.strokeRect(x, y, w, h);
}
// Light on water: rows of glints.
function waves(g, x0, x1, y0, y1, t, rows, salt = 0) {
  g.save(); g.strokeStyle = MOOD.sky[4]; g.lineCap = 'round';
  for (let j = 0; j <= rows; j++) {
    const d = j / rows, y = lerp(y0, y1, d ** 1.4), amp = 0.003 + 0.007 * d, fr = 24 - 11 * d, ph = hash1(900 + salt + j) * 6;
    g.lineWidth = 0.0018 + 0.003 * d; g.globalAlpha = 0.16 + 0.3 * hash1(950 + salt + j); g.beginPath();
    for (let x = x0; x <= x1; x += 0.014) { const yy = y + amp * Math.sin(x * fr + t * (0.6 + d) + ph) + amp * 0.5 * Math.sin(x * fr * 2.3 - t + ph), on = Math.sin(x * 9 + j * 2.3 + t * 0.7) > -0.2; if (!on || x === x0) g.moveTo(x, yy); else g.lineTo(x, yy); }
    g.stroke();
  }
  g.restore();
}
// Words sit in the black bars of the frame: the line of the film below, the place and the book above.
const OVER = [];
function barText(g, S, str, x, y, size, a, align, weight = 700) {
  g.save(); g.setTransform(S.u / 100, 0, 0, S.u / 100, S.W / 2, S.H / 2); g.globalAlpha = a; setType(g, TYPE, 'display', size * 100, { short: 100, weight, track: 0.1 });
  g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = '#f4e6c8'; g.fillText(str, x * 100, y * 100); g.restore();
}
function card(g, S, str, t, t0, t1) {
  const a = Math.min(MOTION.at(t, t0, 0.5), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  if (a > 0) OVER.push(() => barText(g, S, up(str.replace(/\.$/, ''), 'en'), 0, 0.458, 0.036, clamp(a), 'center'));
}
function place(g, S, str, t, t0, t1) {
  const a = Math.min(MOTION.at(t, t0, 0.5), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  if (a > 0) OVER.push(() => barText(g, S, str, -0.84, -0.46, 0.022, clamp(a) * 0.85, 'left', 400));
}
function M(fn) {
  return (g, k, t, S) => {
    OVER.length = 0; fn(g, k, t, S);
    g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.fillStyle = '#000'; const bar = Math.round(S.H * 0.075); g.fillRect(0, 0, S.W, bar); g.fillRect(0, S.H - bar, S.W, bar); g.restore();
    for (const f of OVER) f(); OVER.length = 0;
  };
}

