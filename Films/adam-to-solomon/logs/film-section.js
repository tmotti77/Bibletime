const TITLE = 'From a Garden to a Temple';
// Purpose (SKILL.md "First questions"): 'cinematic' or 'ad'.
const PURPOSE = 'cinematic';
// Look: authored for this film. A 19th-century engraved, hand-coloured timeline chart: sepia line work and hatching on
// aged paper, colour laid as washes slightly off the lines, one red lineage line running through every plate.
const LOOKS = {
  'engraved-chart': { grade: 'contrast(1.03)', bloom: 0, texture: 'paper', vignette: 0.22, grain: 0.03, grainHold: Infinity, hold: 24, line: 0.002, steps: 0,
    palette: { bg: '#E9D9B0', ink: '#2A2118', accent: '#B3261E', dim: '#9C8A63', blue: '#4F7A8C', green: '#6E8B4E', gold: '#C99A2E' } },
};
const LOOK_ID = new URLSearchParams(location.search).get('look') || 'engraved-chart';
const LOOK = LOOKS[LOOK_ID] ?? LOOKS['engraved-chart'];
const FINISH = { shutter: null, weave: 0, tone: null };
const FPS = 24;
const DURATION = 180;                       // seconds; the picture and the sound both follow this
const BPM = 90;                             // placeholder until the recording is picked and measured
const BEAT0 = 0;
const beat = (n) => BEAT0 + n * 60 / BPM, bar = (n) => beat(4 * n);
const OWN_MUSIC = null;
const INSTRUMENTS = [];
const CAST = {};
const FORMULAS = {};
const PALETTE = { ...LOOK.palette };
const TYPE = {
  lang: 'en',
  roles: {
    display: { family: 'IM Fell English', files: { 400: 'fonts/im-fell-english-latin-400-normal.woff2' } },
    text: { family: 'Old Standard TT', files: { 400: 'fonts/old-standard-tt-latin-400-normal.woff2', 700: 'fonts/old-standard-tt-latin-700-normal.woff2' } },
    mono: null,
  },
  check: { strings: { display: [TITLE] }, sizes: { text: 0.04 } },
};

// Cues are shared by picture and sound. Chapter starts first, then the moments inside them.
const CUES = {
  c1: 0, c2: 16, c3: 32, c4: 46, c5: 64, c6: 80, sea: 90, c7: 102, c8: 118, c9: 134, c10: 156, end: DURATION,
  treeUp: 2.6, fruit: 10.5, split: 94,
};

const VO = [];
const CAPTIONS = null;
const CAPTION_STYLE = { role: 'display', accentRole: 'display', size: 0.062, caps: false, ink: PALETTE.ink, hi: PALETTE.ink, accent: PALETTE.accent, punch: 0.07 };

const SCENES = [
  { chapter: 'C1', from: CUES.c1, to: CUES.c2, draw: c1_eden, action: 'the red line grows into a tree; a hand takes the fruit; the garden loses its colour', amb: { kind: 'air', gain: 0.05 } },
  { chapter: 'C6', from: CUES.sea, to: CUES.c7, draw: c6_sea, action: 'the sea splits into two walls and the people walk through', in: { type: 'cut' }, amb: { kind: 'water', gain: 0.07 } },
];

const SFX = [];
const ROOM = { secs: 2.2, decay: 3.2, tone: 5000 };
const ARRANGEMENT = [
  { section: 'all', from: 0, to: CUES.end, parts: [] },
];

// ------------------------------ the engraver's kit ------------------------------
// A hand-drawn polyline, drawn up to the fraction k of its length (lines that draw themselves).
function stroke(g, pts, w, color, k = 1, alpha = 1) {
  if (k <= 0 || pts.length < 2) return;
  const n = (pts.length - 1) * clamp(k), full = Math.floor(n), f = n - full;
  g.save(); g.globalAlpha *= alpha; g.strokeStyle = color; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= full; i++) g.lineTo(pts[i][0], pts[i][1]);
  if (f > 0 && full + 1 < pts.length) g.lineTo(lerp(pts[full][0], pts[full + 1][0], f), lerp(pts[full][1], pts[full + 1][1], f));
  g.stroke(); g.restore();
}
// Engraver's hatching inside a path: parallel lines with a slightly uneven gap; cross = a second pass across the first.
function hatch(g, path, o = {}) {
  const { ang = -0.6, gap = 0.008, w = 0.0012, color = PALETTE.ink, alpha = 0.7, box = [-2, -1, 2, 1], k = 1, salt = 1, cross = false } = o;
  if (k <= 0 || alpha <= 0) return;
  g.save(); g.beginPath(); path(g); g.clip();
  g.strokeStyle = color; g.lineWidth = w; g.globalAlpha *= alpha; g.lineCap = 'round';
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2, R = Math.hypot(box[2] - box[0], box[3] - box[1]) / 2;
  for (const a of (cross ? [ang, ang + 1.1] : [ang])) {
    const dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx, n = Math.ceil(2 * R / gap);
    g.beginPath();
    for (let i = 0; i < n * clamp(k); i++) {
      const d = -R + i * gap + (hash1(salt * 131 + i) - 0.5) * gap * 0.35;
      g.moveTo(cx + nx * d - dx * R, cy + ny * d - dy * R); g.lineTo(cx + nx * d + dx * R, cy + ny * d + dy * R);
    }
    g.stroke();
  }
  g.restore();
}
// A hand-laid colour wash: sits a little off the line work, as on a hand-coloured print.
function wash(g, path, color, alpha = 0.55, off = 0.006) {
  if (alpha <= 0) return;
  g.save(); g.translate(off, off * 0.6); g.globalAlpha *= alpha; g.globalCompositeOperation = 'multiply';
  g.beginPath(); path(g); g.fillStyle = color; g.fill(); g.restore();
}
// The chart behind every plate: column rules, a ruled border with ticks, foxing. A far plane, so it slides slower.
function chartPaper(g, S, cam, col = 0) {
  plane(g, S, cam, 0.5, (g) => {
    const a = cam.x - 2.2, b = cam.x + 2.2;
    g.strokeStyle = PALETTE.dim;
    for (let i = Math.floor(a / 0.25); i * 0.25 < b; i++) {
      const x = i * 0.25, major = i % 4 === 0;
      g.globalAlpha = major ? 0.34 : 0.15; g.lineWidth = major ? 0.0018 : 0.001;
      g.beginPath(); g.moveTo(x, -0.69); g.lineTo(x, 0.69); g.stroke();
    }
    g.globalAlpha = 0.5; g.lineWidth = 0.0022;
    for (const y of [-0.7, -0.685, 0.685, 0.7]) { g.beginPath(); g.moveTo(a, y); g.lineTo(b, y); g.stroke(); }
    g.lineWidth = 0.0012; g.beginPath();
    for (let i = Math.floor(a / 0.05); i * 0.05 < b; i++) { const x = i * 0.05, h = i % 5 === 0 ? 0.022 : 0.011; g.moveTo(x, -0.685); g.lineTo(x, -0.685 + h); g.moveTo(x, 0.685); g.lineTo(x, 0.685 - h); }
    g.stroke();
    for (let c = Math.floor(a); c < b; c++) for (let j = 0; j < 3; j++) {      // foxing: brown blooms in the paper
      const n = c * 31 + j * 7 + col * 101 + 5000, fx = c + hash1(n), fy = hash1(n + 1) * 1.3 - 0.65, fr = 0.03 + hash1(n + 2) * 0.09;
      const gr = g.createRadialGradient(fx, fy, 0, fx, fy, fr); gr.addColorStop(0, 'rgba(120,84,40,0.16)'); gr.addColorStop(1, 'rgba(120,84,40,0)');
      g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(fx - fr, fy - fr, 2 * fr, 2 * fr);
    }
  });
}
// The red lineage line from x0 to x1 at height y, with the wobble of a ruled pen; the nib is its wet head.
function lineage(g, x0, x1, y, w = 0.007) {
  if (x1 <= x0) return;
  const pts = [[x0, y + (noise1(x0 * 9) - 0.5) * 0.006]];
  for (let i = Math.ceil(x0 / 0.02); i * 0.02 < x1; i++) { const x = i * 0.02; if (x > x0) pts.push([x, y + (noise1(x * 9) - 0.5) * 0.006]); }
  pts.push([x1, y + (noise1(x1 * 9) - 0.5) * 0.006]);
  stroke(g, pts, w, PALETTE.accent);
}
function nib(g, x, y, r = 0.009) { g.save(); g.fillStyle = PALETTE.accent; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.restore(); }
// A small engraved figure in a robe, feet at (x, y), h tall. o: face (1 right, -1 left), arm 0..1 (down to raised),
// lean (bowed), p (walk phase), wash (robe colour), staff, back (seen from behind). Returns the hand's position.
function person(g, x, y, h, o = {}) {
  const f = o.face ?? 1, lean = (o.lean ?? 0) * f, hw = h * 0.17, top = y - h * 0.8, sw = Math.sin((o.p ?? 0) * TAU) * h * 0.035;
  const lx = lean * h;
  const body = (g) => {
    g.moveTo(x - hw + sw, y); g.quadraticCurveTo(x - hw * 0.95 + lx * 0.5, y - h * 0.5, x - hw * 0.5 + lx, top);
    g.lineTo(x + hw * 0.5 + lx, top); g.quadraticCurveTo(x + hw * 0.95 + lx * 0.5, y - h * 0.5, x + hw - sw, y); g.closePath();
  };
  g.save();
  g.fillStyle = PALETTE.bg; g.beginPath(); body(g); g.fill();
  if (o.wash) wash(g, body, o.wash, o.washA ?? 0.6, h * 0.02);
  hatch(g, body, { ang: 1.25 * f, gap: h * 0.045, w: h * 0.009, alpha: 0.8, box: [x - h, y - h, x + h, y], salt: o.salt ?? 3 });
  g.strokeStyle = PALETTE.ink; g.lineWidth = h * 0.016; g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); body(g); g.stroke();
  const hx = x + lx * 1.25 + f * h * 0.015, hy = top - h * 0.08, hr = h * 0.085;
  g.beginPath(); g.arc(hx, hy, hr, 0, TAU); g.fillStyle = PALETTE.bg; g.fill(); g.stroke();
  g.beginPath(); g.fillStyle = PALETTE.ink;                                   // hair: the back of the head, all of it from behind
  if (o.back) g.arc(hx, hy, hr, 0, TAU); else g.arc(hx, hy, hr, f > 0 ? Math.PI * 0.55 : -Math.PI * 0.45, f > 0 ? Math.PI * 1.55 : Math.PI * 0.45);
  g.fill();
  const a = lerp(1.25, -1.1, o.arm ?? 0), sx = x + f * hw * 0.35 + lx, sy = top + h * 0.09;
  const hand = [sx + f * Math.cos(a) * h * 0.34, sy + Math.sin(a) * h * 0.34];
  g.lineWidth = h * 0.03; g.beginPath(); g.moveTo(sx, sy); g.lineTo(hand[0], hand[1]); g.stroke();
  if (o.staff) { g.lineWidth = h * 0.02; g.beginPath(); g.moveTo(hand[0], hand[1] - h * 0.42); g.lineTo(hand[0], Math.min(y, hand[1] + h * 0.7)); g.stroke(); }
  g.restore();
  return hand;
}
// A card: the film's words, set on the page itself, unmoved by the camera; words rise in one by one.
function card(g, S, str, t, t0, t1, y = -0.385, size = 0.058) {
  const a = Math.min(MOTION.at(t, t0, 0.4), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  if (a <= 0) return;
  plane(g, S, CAM.base(), 0, (g) => text(g, S, str, 0, y, size, PALETTE.ink, clamp(a), null, { weight: 400, reveal: MOTION.at(t, t0, 1.2), by: 'word', spread: 0.6 }));
}
function place(g, S, str, t, t0, t1) {
  const a = Math.min(MOTION.at(t, t0, 0.5), 1 - MOTION.at(t, t1 - 0.5, 0.5));
  label(g, S, str, -0.845, 0.452, 0.03, PALETTE.ink, null, clamp(a) * 0.9, 'left');
}

// ------------------------------ C1 Eden ------------------------------
const GY = 0.28;                                     // the height of the lineage line on every plate
const edenTree = lazy(() => {
  const r = rng(21), segs = [], tips = [];
  const grow = (x, y, a, len, w, d) => {
    const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len; segs.push({ x, y, x1, y1, w, d });
    if (d >= 5) { tips.push([x1, y1, r()]); return; }
    const n = d < 1 ? 3 : 2;
    for (let i = 0; i < n; i++) grow(x1, y1, a + (i - (n - 1) / 2) * (0.6 + r() * 0.3) + (r() - 0.5) * 0.25, len * (0.7 + r() * 0.1), w * 0.66, d + 1);
  };
  grow(0, GY, -Math.PI / 2, 0.2, 0.024, 0);
  return { segs, tips };
});
const FRUIT = [0.2, 0.062];                           // the one fruit within reach
function c1_eden(g, k, t, S) {
  // truck right with the line 3 s fast ease-out, hold; push in 3.5 s slow ease-in-out toward the fruit; pull back and truck right 3.5 s ease-in
  const A = MOTION.at, run = EASE.out(A(t, 0, 3)), leave = EASE.in(A(t, 12.5, 3.5)), push = EASE.inOut(A(t, 8.5, 3)) * (1 - EASE.inOut(A(t, 12.2, 2.4)));
  const headX = t < 12.5 ? lerp(-1.75, 0, run) : lerp(0.33, 2.3, leave);
  const cam = CAM.base();
  cam.x = lerp(-1.45, 0, run) + 1.75 * leave + 0.13 * push; cam.y = -0.04 * push; cam.dist = 1 - 0.36 * push;
  const growK = EASE.out(A(t, CUES.treeUp, 3.8)), leafK = EASE.out(A(t, 4.4, 2.6)), drain = EASE.inOut(A(t, 11.3, 2.6)), colour = leafK * (1 - drain);
  const { segs, tips } = edenTree();
  chartPaper(g, S, cam, 1);
  plane(g, S, cam, 0.28, (g) => {                     // far: the sun, the hills, the four rivers' first bend
    const sunK = EASE.out(A(t, 3.2, 2.5));
    if (sunK > 0) {
      const sx = -0.62, sy = -0.3;
      wash(g, (g) => g.arc(sx, sy, 0.085, 0, TAU), PALETTE.gold, 0.55 * sunK * (1 - 0.7 * drain), 0.005);
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0022; g.beginPath(); g.arc(sx, sy, 0.085, 0, TAU * sunK); g.stroke();
      g.lineWidth = 0.0015; g.beginPath();
      for (let i = 0; i < 40 * sunK; i++) { const a = i / 40 * TAU, r0 = 0.1, r1 = 0.14 + (i % 2) * 0.05; g.moveTo(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); g.lineTo(sx + Math.cos(a) * r1, sy + Math.sin(a) * r1); }
      g.stroke();
    }
    const hills = (g) => { g.moveTo(-1.6, 0.36); for (let x = -1.6; x <= 3.2; x += 0.04) g.lineTo(x, 0.2 - 0.07 * Math.sin(x * 2.3 + 1) - 0.035 * Math.sin(x * 5.1)); g.lineTo(3.2, 0.36); g.closePath(); };
    const hk = EASE.out(A(t, 2.2, 2.4));
    wash(g, hills, PALETTE.green, 0.4 * colour);
    hatch(g, hills, { ang: 0.05, gap: 0.011, w: 0.0013, alpha: 0.55, box: [-1.6, 0.05, 3.2, 0.4], k: hk, salt: 7 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.globalAlpha = hk; g.beginPath();
    for (let x = -1.6; x <= 3.2; x += 0.04) g.lineTo(x, 0.2 - 0.07 * Math.sin(x * 2.3 + 1) - 0.035 * Math.sin(x * 5.1));
    g.stroke(); g.globalAlpha = 1;
    hatch(g, (g) => g.rect(-1.6, -0.6, 4.8, 0.62), { ang: -0.35, gap: 0.016, w: 0.0013, alpha: 0.5 * drain, box: [-1.6, -0.6, 3.2, 0.02], k: drain, salt: 9 });   // the sky closes in
    for (let i = 0; i < 7; i++) {                       // birds: there while the garden has its colour
      const bx = -0.9 + i * 0.27 + 0.05 * t + 0.6 * drain * (i % 2 ? 1 : -1.4), by = -0.2 + 0.1 * hash1(60 + i) + 0.02 * Math.sin(t * 2 + i) - 0.3 * drain, fl = 0.012 * Math.sin(t * 9 + i * 2);
      stroke(g, [[bx - 0.02, by - 0.006 + fl], [bx, by], [bx + 0.02, by - 0.006 + fl]], 0.0022, PALETTE.ink, 1, leafK * (1 - drain));
    }
  });
  plane(g, S, cam, 0, (g) => {
    const ground = (g) => { g.moveTo(-2.2, GY); for (let x = -2.2; x <= 3.4; x += 0.05) g.lineTo(x, GY + 0.006 * Math.sin(x * 14)); g.lineTo(3.4, 0.62); g.lineTo(-2.2, 0.62); g.closePath(); };
    const gk = EASE.out(A(t, 2.4, 2.2));
    wash(g, ground, PALETTE.green, 0.5 * colour);
    hatch(g, ground, { ang: 0.42, gap: 0.013, w: 0.0014, alpha: 0.5, box: [-2.2, GY, 3.4, 0.62], k: gk, salt: 11 });
    const r = rng(33);                                 // sprigs and reeds along the ground
    for (let i = 0; i < 46; i++) {
      const px = -1.5 + r() * 2.6, ph = 0.02 + r() * 0.05, s = EASE.out(A(t, 3 + r() * 3, 0.8)) * (1 - 0.55 * drain), bend = (r() - 0.5) * 0.03 + 0.012 * drain;
      if (Math.abs(px) < 0.06 || s <= 0) continue;
      stroke(g, [[px, GY + 0.004], [px + bend * 0.4, GY - ph * 0.5 * s], [px + bend, GY - ph * s]], 0.002, PALETTE.ink);
      if (i % 3 === 0) { g.fillStyle = PALETTE.accent; g.globalAlpha = 0.8 * colour; g.beginPath(); g.arc(px + bend, GY - ph * s, 0.005, 0, TAU); g.fill(); g.globalAlpha = 1; }
    }
    // the tree: the red line turns upward and becomes the trunk; branches grow by depth
    for (const s of segs) {
      const sk = clamp(growK * 6.6 - s.d);
      if (sk <= 0) continue;
      const pts = []; for (let i = 0; i <= 6; i++) { const u = i / 6; pts.push([lerp(s.x, s.x1, u) + Math.sin(u * 3.1 + s.d * 2) * s.w * 0.25, lerp(s.y, s.y1, u)]); }
      stroke(g, pts, s.w, PALETTE.ink, sk);
      if (s.d < 3) stroke(g, pts, s.w * 0.42, PALETTE.bg, sk, 0.55);          // the lit side of the bark
      if (s.d < 2) stroke(g, pts, s.w * 0.16, PALETTE.accent, sk, 0.9);       // the red line still runs inside it
    }
    stroke(g, [[0.012, 0.13], [0.08, 0.075], [0.15, 0.045], [0.2, 0.04]], 0.008, PALETTE.ink, EASE.out(A(t, 4.2, 1.2)));   // the low branch
    // leaves: clusters at the tips; the wash is the garden's colour and it drains after the fruit is taken
    tips.forEach(([x, y, q], i) => {
      const lk = EASE.out(A(t, 4.4 + q * 2, 0.9));
      if (lk <= 0) return;
      const fall = EASE.in(A(t, 11.4 + q * 2.6, 2.2)), fy = fall * (GY - y - 0.01), fxx = Math.sin(fall * 5 + i) * 0.03 * fall;
      wash(g, (g) => g.arc(x, y, 0.062 * lk, 0, TAU), PALETTE.green, 0.34 * colour, 0.004);
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0019; g.beginPath();
      for (let j = 0; j < 6; j++) {
        const a = j / 6 * TAU + q * 6 + fall * 3, lx = x + Math.cos(a) * 0.028 * lk + fxx, ly = y + Math.sin(a) * 0.024 * lk + (j % 2 ? fy : fy * 0.7);
        g.moveTo(lx - 0.012, ly); g.quadraticCurveTo(lx, ly - 0.012, lx + 0.012, ly); g.quadraticCurveTo(lx, ly + 0.007, lx - 0.012, ly);
      }
      g.stroke();
      if (i % 6 === 2) { const fk = MOTION.back(A(t, 6 + q, 0.5)); g.fillStyle = PALETTE.accent; g.globalAlpha = 1 - 0.75 * drain; g.beginPath(); g.arc(x + 0.01, y + 0.03, 0.011 * fk, 0, TAU); g.fill(); g.globalAlpha = 1; }
    });
    // the serpent: one line that winds up the trunk
    const sp = []; for (let i = 0; i <= 60; i++) { const u = i / 60; sp.push([Math.sin(u * 17) * (0.026 - 0.008 * u) + 0.1 * Math.max(0, u - 0.8), GY - 0.015 - u * 0.2]); }
    stroke(g, sp, 0.0055, PALETTE.ink, EASE.inOut(A(t, 7.2, 2.2)));
    // the two figures: he waits, she reaches; then both walk out to the right, bowed
    const show = EASE.out(A(t, 5.4, 1.2)), walk = A(t, 12.3, 3.7), wx = 2.1 * EASE.in(walk), armE = t < CUES.fruit ? EASE.inOut(A(t, 9, 1.4)) : 1 - 0.75 * EASE.inOut(A(t, CUES.fruit + 0.15, 1.1));
    g.globalAlpha = show;
    person(g, -0.3 + wx * 0.94 + 0.5 * EASE.inOut(A(t, 11.6, 1.6)), GY, 0.215 * (0.9 + 0.1 * show), { face: 1, arm: 0.12, lean: 0.07 * walk, p: walk * 9, salt: 5 });
    const hand = person(g, 0.275 + wx, GY, 0.2 * (0.9 + 0.1 * show), { face: walk > 0.12 ? 1 : -1, arm: armE, lean: 0.07 * walk, p: walk * 9 + 0.5, salt: 8 });
    g.globalAlpha = 1;
    const fk = MOTION.back(A(t, 6.4, 0.5)), took = A(t, CUES.fruit, 0.2);       // the fruit: on the branch, then in her hand, then gone with her
    const fp = took <= 0 ? FRUIT : [lerp(FRUIT[0], hand[0], EASE.out(took)), lerp(FRUIT[1], hand[1], EASE.out(took))];
    if (took <= 0) stroke(g, [[0.2, 0.04], FRUIT], 0.002, PALETTE.ink, fk);
    nib(g, fp[0], fp[1], 0.0125 * fk);
    // the lineage line, in front of everything: it arrives, becomes the trunk, and leaves with them
    lineage(g, -2.2, Math.min(headX, 0), GY);
    if (t >= 12.5) lineage(g, 0, headX, GY);
    if (t < 3 || t >= 12.5) nib(g, headX, GY + (noise1(headX * 9) - 0.5) * 0.006);
  });
  card(g, S, 'In the beginning, a garden.', t, 3.6, 8.9);
  place(g, S, 'EDEN  ·  GENESIS 2', t, 4.2, 12);
}

// ------------------------------ C6 The sea ------------------------------
const HZ = -0.13;                                    // the horizon of the sea plate
const seaY = (d) => HZ + 0.72 * d ** 1.5;            // depth 0 (horizon) .. 1 (the near shore) to a height on the plate
const seaStones = lazy(() => { const r = rng(52); return Array.from({ length: 150 }, () => [r() * 2 - 1, r(), r()]); });
const seaCrowd = lazy(() => { const r = rng(57); return Array.from({ length: 26 }, (_, i) => ({ x: -0.8 + i * 0.062 + (r() - 0.5) * 0.03, h: 0.1 + r() * 0.035, lane: (r() - 0.5) * 1.3, start: 0.9 + i * 0.21 + r() * 0.3, salt: 2 + i })); });
function c6_sea(g, k, t, S) {
  // slow push in 4 s ease-out on the shore; at the split a short handheld tremor; then dolly in 8 s ease-in-out up the dry path
  const A = MOTION.at, tl = t - CUES.sea, ts = t - CUES.split, open = EASE.inOut(A(ts, 0, 3.4)), go = EASE.inOut(A(ts, 0.6, 7.4));
  const cam = CAM.base(); cam.dist = lerp(1.14, 1.02, EASE.out(A(tl, 0, 4))) - 0.2 * go; cam.y = -0.075 * go;
  if (ts > 0) CAM.handheld(cam, t * 5, 2.4 * (1 - EASE.out(A(ts, 0, 1.6))));
  const surfX = (d) => open * (0.03 + 0.4 * d), bedX = (d) => open * (0.016 + 0.25 * d), bedY = (d) => seaY(d) + open * 0.085 * d;
  chartPaper(g, S, cam, 6);
  plane(g, S, cam, 0.3, (g) => {                      // far: a sky of ruled cloud, light breaking over the far shore
    hatch(g, (g) => g.rect(-1.6, -0.75, 3.2, 0.62 + HZ + 0.13), { ang: -0.22, gap: 0.014, w: 0.0015, alpha: 0.6, box: [-1.6, -0.75, 1.6, HZ + 0.02], salt: 14 });
    g.save(); g.strokeStyle = PALETTE.bg; g.lineCap = 'round';
    for (let i = 0; i < 26; i++) {                     // rays cut out of the hatching, from where the path ends
      const a = -Math.PI / 2 + (i - 12.5) * 0.085, len = (0.35 + 0.5 * hash1(300 + i)) * open;
      g.globalAlpha = 0.9; g.lineWidth = 0.012 + 0.012 * hash1(320 + i);
      g.beginPath(); g.moveTo(Math.cos(a) * 0.03, HZ - 0.02 + Math.sin(a) * 0.03); g.lineTo(Math.cos(a) * len, HZ - 0.02 + Math.sin(a) * len); g.stroke();
    }
    g.restore();
    wash(g, (g) => g.arc(0, HZ - 0.02, 0.3 * open, Math.PI, TAU), PALETTE.gold, 0.4 * open, 0.004);
    const far = (g) => { g.moveTo(-1.7, HZ + 0.03); for (let x = -1.7; x <= 1.7; x += 0.03) g.lineTo(x, HZ - 0.035 - 0.03 * Math.sin(x * 4 + 2) - 0.014 * Math.sin(x * 11)); g.lineTo(1.7, HZ + 0.03); g.closePath(); };
    g.fillStyle = PALETTE.bg; g.beginPath(); far(g); g.fill();
    hatch(g, far, { ang: 1.2, gap: 0.006, w: 0.0012, alpha: 0.7, box: [-1.7, HZ - 0.1, 1.7, HZ + 0.03], salt: 15 });
  });
  plane(g, S, cam, 0, (g) => {
    // the sea: rows of engraved swell, closer rows wider apart; the surface stays, the middle opens
    const N = 34;
    const seaShape = (g) => { g.rect(-1.5, HZ, 3, 0.8); };
    const gapShape = (g) => { g.moveTo(-surfX(0), seaY(0)); for (let i = 1; i <= 20; i++) g.lineTo(-surfX(i / 20), seaY(i / 20)); for (let i = 20; i >= 0; i--) g.lineTo(surfX(i / 20), seaY(i / 20)); g.closePath(); };
    g.save();
    g.beginPath(); seaShape(g); if (open > 0) gapShape(g); g.clip('evenodd');
    wash(g, seaShape, PALETTE.blue, 0.5, 0.004);
    for (let j = 0; j <= N; j++) {
      const d = j / N, y = seaY(d), amp = 0.002 + 0.011 * d, fr = 26 - 15 * d, ph = hash1(400 + j) * 6, sp = 0.5 + 0.9 * d;
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0011 + 0.0019 * d; g.globalAlpha = 0.55 + 0.4 * d; g.beginPath();
      for (let x = -1.5; x <= 1.5; x += 0.012) {
        const pile = open * 0.035 * d * Math.exp(-((Math.abs(x) - surfX(d)) ** 2) / 0.012);    // the water heaps up at the edge
        const yy = y + amp * Math.sin(x * fr + t * sp + ph) + amp * 0.5 * Math.sin(x * fr * 2.3 - t * sp * 1.3 + ph) - pile;
        if (x === -1.5) g.moveTo(x, yy); else g.lineTo(x, yy);
      }
      g.stroke();
    }
    g.restore();
    if (open > 0.003) {
      // the two walls: the cut face of the water, from the surface edge down to the seabed
      for (const sgn of [-1, 1]) {
        const wall = (g) => { g.moveTo(sgn * surfX(0), seaY(0)); for (let i = 1; i <= 20; i++) g.lineTo(sgn * surfX(i / 20), seaY(i / 20) - open * 0.035 * (i / 20)); for (let i = 20; i >= 0; i--) g.lineTo(sgn * bedX(i / 20), bedY(i / 20)); g.closePath(); };
        g.fillStyle = PALETTE.bg; g.beginPath(); wall(g); g.fill();
        wash(g, wall, PALETTE.blue, 0.85, 0.003);
        hatch(g, wall, { ang: Math.PI / 2 - sgn * 0.16, gap: 0.0075, w: 0.0016, alpha: 0.85, box: [-0.5, HZ, 0.5, 0.75], salt: 17 + sgn, cross: true });
        g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0035; g.lineJoin = 'round'; g.beginPath();
        for (let i = 0; i <= 40; i++) { const d = i / 40, e = 0.006 * d * Math.sin(i * 1.7 + t * 2.2); g.lineTo(sgn * (surfX(d) + e), seaY(d) - open * 0.035 * d - Math.abs(e)); }
        g.stroke();
        g.strokeStyle = PALETTE.bg; g.lineWidth = 0.004; g.beginPath();           // foam: a pale lip under the edge
        for (let i = 4; i <= 40; i++) { const d = i / 40; g.lineTo(sgn * (surfX(d) - 0.006 * d), seaY(d) - open * 0.035 * d + 0.008 * d); }
        g.stroke();
      }
      // the seabed: dry ground, stones, the long shadow of the walls
      const bed = (g) => { g.moveTo(-bedX(0), bedY(0)); for (let i = 1; i <= 20; i++) g.lineTo(-bedX(i / 20), bedY(i / 20)); for (let i = 20; i >= 0; i--) g.lineTo(bedX(i / 20), bedY(i / 20)); g.closePath(); };
      g.fillStyle = PALETTE.bg; g.beginPath(); bed(g); g.fill();
      wash(g, bed, PALETTE.gold, 0.22, 0.002);
      g.save(); g.beginPath(); bed(g); g.clip();
      for (const [sx, sd, sq] of seaStones()) {
        const d = sd ** 0.7, x = sx * bedX(d) * 0.95, y = bedY(d), r = (0.002 + 0.007 * sq) * (0.25 + d);
        g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0012; g.globalAlpha = 0.7; g.beginPath(); g.ellipse(x, y, r * 1.6, r * 0.7, 0, 0, TAU); g.stroke();
        g.beginPath(); g.moveTo(x - r * 1.4, y + r * 0.9); g.lineTo(x + r * 2.2, y + r * 0.9); g.stroke();
      }
      g.restore();
      hatch(g, (g) => { g.moveTo(-bedX(0), bedY(0)); for (let i = 1; i <= 20; i++) g.lineTo(-bedX(i / 20), bedY(i / 20)); for (let i = 20; i >= 0; i--) g.lineTo(-bedX(i / 20) * 0.45, bedY(i / 20)); g.closePath(); },
        { ang: 0.1, gap: 0.006, w: 0.0012, alpha: 0.6, box: [-0.4, HZ, 0.1, 0.75], salt: 23 });
    }
    // the red line: it waits at the water's edge, then runs up the dry path to the far shore
    const lineK = EASE.inOut(A(ts, 1.3, 4.2));
    lineage(g, -1.6, 0, 0.462);
    const path = []; for (let i = 0; i <= 40; i++) { const d = 1 - i / 40; path.push([0.012 * Math.sin(d * 9) * d, i === 0 ? 0.462 : bedY(d * 0.93)]); }
    stroke(g, path, 0.006, PALETTE.accent, lineK);
    stroke(g, path.slice(24), 0.0035, PALETTE.accent, clamp(lineK * 2.5 - 1.5));       // thinner where it is far
    // the people: on the shore with their backs to us, then one after another up the path
    const walkers = [];
    for (const c of seaCrowd()) {
      const w = A(ts, c.start, 6.5), d = 1 - 0.86 * EASE.inOut(w);
      const onPath = EASE.inOut(A(ts, c.start, 1.3)), px = lerp(c.x, c.lane * bedX(d) * 0.55, onPath), py = lerp(0.492, bedY(d) + 0.004, onPath), ph = lerp(c.h, 0.014 + 0.105 * d * d, onPath);
      walkers.push({ px, py, ph, w, salt: c.salt, d });
    }
    walkers.sort((a, b) => a.py - b.py);
    for (const p of walkers) person(g, p.px, p.py, p.ph, { back: true, face: p.salt % 2 ? 1 : -1, arm: 0.1, p: p.w * 14 + p.salt * 0.3, salt: p.salt, wash: p.salt % 5 === 0 ? PALETTE.accent : p.salt % 3 === 0 ? PALETTE.blue : null, washA: 0.45 });
    // Moses: on a rock at the right, the staff goes up and the sea answers
    const rock = (g) => { g.moveTo(0.5, 0.56); g.lineTo(0.53, 0.44); g.lineTo(0.6, 0.405); g.lineTo(0.7, 0.42); g.lineTo(0.76, 0.56); g.closePath(); };
    g.fillStyle = PALETTE.bg; g.beginPath(); rock(g); g.fill();
    hatch(g, rock, { ang: 0.9, gap: 0.007, w: 0.0014, alpha: 0.8, box: [0.5, 0.4, 0.76, 0.56], salt: 29, cross: true });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.003; g.beginPath(); rock(g); g.stroke();
    person(g, 0.62, 0.41, 0.2, { face: -1, arm: 0.25 + 0.75 * MOTION.back(A(tl, 2.6, 0.9), 1.2), staff: true, salt: 31, wash: PALETTE.dim, washA: 0.5 });
    // the east wind: ruled streaks across the plate while the sea opens
    const wind = A(ts, -0.6, 4.6);
    if (wind > 0 && wind < 1) {
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0016;
      for (let i = 0; i < 22; i++) { const wy = HZ - 0.05 + hash1(700 + i) * 0.5, wx = 1.5 - ((wind * 3.2 + hash1(720 + i) * 2.4) % 3.4), wl = 0.1 + 0.2 * hash1(740 + i); g.globalAlpha = 0.5 * Math.sin(wind * Math.PI); g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx - wl, wy + 0.004); g.stroke(); }
      g.globalAlpha = 1;
    }
  });
  card(g, S, 'And the sea stood up.', t, CUES.split + 1.2, CUES.split + 6.4, -0.4);
  place(g, S, 'THE SEA OF REEDS  ·  EXODUS 14', t, CUES.sea + 0.6, CUES.c7 - 0.4);
}

function score(ctx, out) {
  // The music is a recording the user picks by ear (STATE.md Music line); it goes in OWN_MUSIC. Nothing is written here.
}
