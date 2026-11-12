// ------------------------------ shared pieces of the plates ------------------------------
const A = (t, start, dur) => clamp((t - start) / dur);
const STARLIGHT = '#FBF3D8', NIGHT = '#2B3A55';
// Ground whose top edge is y = f(x): paper, wash, hatching, contour.
function land(g, f, x0, x1, bottom, o = {}) {
  const shape = (g) => { g.moveTo(x0, bottom); for (let x = x0; x <= x1 + 1e-6; x += 0.03) g.lineTo(x, f(x)); g.lineTo(x1, bottom); g.closePath(); };
  if (o.fill !== false) { g.fillStyle = PALETTE.bg; g.beginPath(); shape(g); g.fill(); }
  if (o.wash) wash(g, shape, o.wash, o.washA ?? 0.4);
  hatch(g, shape, { ang: o.ang ?? 0.3, gap: o.gap ?? 0.012, w: 0.0013, alpha: o.alpha ?? 0.5, box: [x0, -0.7, x1, bottom], k: o.k ?? 1, salt: o.salt ?? 1, cross: o.cross });
  g.save(); g.strokeStyle = PALETTE.ink; g.lineWidth = o.lw ?? 0.0022; g.lineJoin = 'round'; g.beginPath();
  for (let x = x0; x <= x1 + 1e-6; x += 0.03) g.lineTo(x, f(x));
  g.stroke(); g.restore();
}
// An ashlar or a brick: x, y = its top-left corner.
function block(g, x, y, w, h, salt = 1, o = {}) {
  const p = (g) => g.rect(x, y, w, h);
  g.fillStyle = PALETTE.bg; g.beginPath(); p(g); g.fill();
  if (o.wash) wash(g, p, o.wash, o.washA ?? 0.5, 0.003);
  if (o.hatch !== false) hatch(g, p, { ang: 0.9, gap: o.gap ?? 0.007, w: 0.001, alpha: 0.45, box: [x, y, x + w, y + h], salt });
  g.strokeStyle = PALETTE.ink; g.lineWidth = o.lw ?? 0.002; g.strokeRect(x, y, w, h);
}
// Rows of engraved swell between two heights.
function waves(g, x0, x1, y0, y1, t, rows, salt = 0) {
  g.save(); g.strokeStyle = PALETTE.ink;
  for (let j = 0; j <= rows; j++) {
    const d = j / rows, y = lerp(y0, y1, d ** 1.4), amp = 0.003 + 0.008 * d, fr = 24 - 11 * d, ph = hash1(900 + salt + j) * 6;
    g.lineWidth = 0.0012 + 0.0016 * d; g.globalAlpha = 0.55 + 0.4 * d; g.beginPath();
    for (let x = x0; x <= x1; x += 0.014) { const yy = y + amp * Math.sin(x * fr + t * (0.6 + d) + ph) + amp * 0.5 * Math.sin(x * fr * 2.3 - t + ph); if (x === x0) g.moveTo(x, yy); else g.lineTo(x, yy); }
    g.stroke();
  }
  g.restore();
}
// Night laid over a plate: a blue-black wash and a second direction of hatching.
function night(g, x0, y0, w, h, a, salt = 71) {
  if (a <= 0) return;
  wash(g, (g) => g.rect(x0, y0, w, h), NIGHT, 0.8 * a, 0);
  hatch(g, (g) => g.rect(x0, y0, w, h), { ang: 0.5, gap: 0.011, w: 0.0012, alpha: 0.45 * a, box: [x0, y0, x0 + w, y0 + h], salt });
}

// ------------------------------ C2 The Flood ------------------------------
function ark(g, x, y, s, rock = 0) {                  // the ark, its waterline at (x, y), s = half its length
  g.save(); g.translate(x, y); g.rotate(rock);
  const hull = (g) => { g.moveTo(-s, -s * 0.28); g.quadraticCurveTo(-s * 0.9, s * 0.2, -s * 0.5, s * 0.22); g.lineTo(s * 0.55, s * 0.22); g.quadraticCurveTo(s * 0.95, s * 0.2, s * 1.08, -s * 0.34); g.closePath(); };
  const house = (g) => g.rect(-s * 0.6, -s * 0.62, s * 1.2, s * 0.36);
  const roof = (g) => { g.moveTo(-s * 0.7, -s * 0.62); g.lineTo(0, -s * 0.86); g.lineTo(s * 0.7, -s * 0.62); g.closePath(); };
  for (const [p, a, wsh] of [[house, 1.57, null], [roof, 0.5, PALETTE.accent], [hull, 0.02, PALETTE.gold]]) {
    g.fillStyle = PALETTE.bg; g.beginPath(); p(g); g.fill(); if (wsh) wash(g, p, wsh, 0.45, 0.004);
    hatch(g, p, { ang: a, gap: s * 0.06, w: 0.0013, alpha: 0.7, box: [-s * 1.1, -s, s * 1.1, s * 0.3], salt: 41 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.003; g.lineJoin = 'round'; g.beginPath(); p(g); g.stroke();
  }
  g.fillStyle = PALETTE.ink; for (let i = -2; i <= 2; i++) g.fillRect(i * s * 0.2 - s * 0.035, -s * 0.52, s * 0.07, s * 0.1);
  g.restore();
}
function c2_flood(g, k, t, S) {
  // truck right with the line 2.5 s ease-out; crane up 7.5 s ease-in-out with the rising water; truck right 4 s ease-in under the bow
  const tl = t - CUES.c2, run = EASE.out(A(tl, 0, 2.5)), rise = EASE.inOut(A(tl, 2, 7.5)), ebb = EASE.inOut(A(tl, 10.5, 4.5)), leave = EASE.in(A(tl, 12, 4));
  const level = lerp(0.66, -0.03, rise) + 0.34 * ebb, hill = (x) => GY - 0.18 * Math.exp(-((x / 0.42) ** 2)), arkY = Math.min(0.1, level + 0.012 * Math.sin(t * 1.3));
  const rain = A(tl, 0.6, 2) * (1 - A(tl, 8.2, 2.6)), bow = EASE.inOut(A(tl, 9.6, 4.2));
  const cam = CAM.base(); cam.x = lerp(-1.25, 0, run) + 1.25 * leave; cam.y = (arkY - 0.1) * 0.85; cam.dist = 1 + 0.08 * rise - 0.08 * leave;
  chartPaper(g, S, cam, 2);
  plane(g, S, cam, 0.28, (g) => {                     // far: the cloud that closes, far hills that go under
    land(g, (x) => 0.16 - 0.06 * Math.sin(x * 2.1) - 0.03 * Math.sin(x * 5.3 + 1), -1.8, 3.4, 0.5, { ang: 0.08, gap: 0.011, salt: 43, wash: PALETTE.green, washA: 0.3 * (1 - rise) + 0.3 * ebb });
    hatch(g, (g) => g.rect(-1.8, -0.9, 5.2, 0.62), { ang: -0.3, gap: 0.011, w: 0.0015, alpha: 0.75 * (1 - 0.8 * bow), box: [-1.8, -0.9, 3.4, -0.28], k: A(tl, 0.2, 2.6), salt: 44, cross: true });
    if (level < 0.5) { g.save(); g.beginPath(); g.rect(-1.8, level - 0.03, 5.2, 1); g.clip(); wash(g, (g) => g.rect(-1.8, level - 0.03, 5.2, 1), PALETTE.blue, 0.5, 0); waves(g, -1.8, 3.4, level - 0.03, level + 0.2, t, 8, 3); g.restore(); }
  });
  plane(g, S, cam, 0, (g) => {
    land(g, hill, -2.4, 3.4, 0.7, { ang: 0.42, gap: 0.013, salt: 45, wash: PALETTE.green, washA: 0.45 * (1 - rise) + 0.4 * ebb });
    for (let i = 0; i < 9; i++) {                       // the world that goes under: huts and trees on the plain
      const hx = -1.5 + i * 0.36 + (hash1(460 + i) - 0.5) * 0.12, hy = hill(hx);
      if (Math.abs(hx) < 0.45) continue;
      if (i % 2) { block(g, hx - 0.03, hy - 0.04, 0.06, 0.04, 46 + i); stroke(g, [[hx - 0.04, hy - 0.04], [hx, hy - 0.07], [hx + 0.04, hy - 0.04]], 0.0025, PALETTE.ink); }
      else { stroke(g, [[hx, hy], [hx, hy - 0.06]], 0.003, PALETTE.ink); wash(g, (g) => g.arc(hx, hy - 0.075, 0.03, 0, TAU), PALETTE.green, 0.5 * (1 - rise)); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.beginPath(); g.arc(hx, hy - 0.075, 0.03, 0, TAU); g.stroke(); }
    }
    lineage(g, -2.4, lerp(-2.4, -0.42, run), GY);       // the line reaches the hill and the water closes over it
    if (level < 0.66) {
      g.save(); g.beginPath(); g.rect(-2.4, level, 5.8, 1); g.clip();
      wash(g, (g) => g.rect(-2.4, level, 5.8, 1), PALETTE.blue, 0.62, 0);
      waves(g, -2.4, 3.4, level, level + 0.45, t, 14, 9);
      g.restore();
    }
    ark(g, 0, arkY + 0.012, 0.2, arkY < 0.095 ? 0.035 * Math.sin(t * 1.3 + 1) : 0);
    g.save(); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0017; g.lineCap = 'round';      // the rain: ruled, slanted, falling
    for (let i = 0; i < 190; i++) {
      const rx = cam.x - 1.2 + hash1(500 + i) * 2.4, ry = ((hash1(700 + i) + t * (1.3 + 0.5 * hash1(900 + i))) % 1) * 1.5 - 0.8;
      g.globalAlpha = 0.7 * rain * (0.4 + 0.6 * hash1(1100 + i)); g.beginPath(); g.moveTo(rx, ry); g.lineTo(rx - 0.022, ry + 0.07); g.stroke();
    }
    g.restore();
    const dv = A(tl, 7.6, 3.4);                          // the dove: out over the water and back with a green sprig
    if (dv > 0 && dv < 1) {
      const a = dv * TAU, dx = 0.1 + 0.42 * Math.sin(a / 2) + 0.12 * Math.sin(a), dy = arkY - 0.24 - 0.2 * Math.sin(a / 2) + 0.05 * Math.sin(a * 2), fl = 0.018 * Math.sin(t * 16);
      stroke(g, [[dx - 0.03, dy - 0.012 + fl], [dx, dy], [dx + 0.03, dy - 0.012 + fl]], 0.004, PALETTE.ink);
      if (dv > 0.5) { g.fillStyle = PALETTE.green; g.beginPath(); g.ellipse(dx + (dv > 0.5 ? -0.016 : 0.016), dy + 0.006, 0.012, 0.005, 0.4, 0, TAU); g.fill(); }
    }
    // the bow: the line leaves the ark as an arc and the colours follow it down to dry ground
    if (bow > 0) {
      const cx = 0.79, cy = GY + 0.12, a0 = Math.PI + 0.32, a1 = TAU - 0.153;
      [[PALETTE.blue, 0.725], [PALETTE.green, 0.75], [PALETTE.gold, 0.775]].forEach(([c, r], i) => {
        g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.6; g.strokeStyle = c; g.lineWidth = 0.024; g.beginPath(); g.arc(cx, cy, r, a0, lerp(a0, a1, clamp(bow * 1.15 - 0.05 * (3 - i)))); g.stroke(); g.restore();
      });
      g.save(); g.strokeStyle = PALETTE.accent; g.lineWidth = 0.008; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, 0.8, a0, lerp(a0, a1, bow)); g.stroke(); g.restore();
      const ha = lerp(a0, a1, bow); if (bow < 1) nib(g, cx + Math.cos(ha) * 0.8, cy + Math.sin(ha) * 0.8);
    }
    const out = A(tl, 13.8, 2.2); if (out > 0) { lineage(g, 1.58, lerp(1.58, 3.2, EASE.in(out)), GY); nib(g, lerp(1.58, 3.2, EASE.in(out)), GY); }
  });
  card(g, S, 'The waters rose. One boat floated.', t, CUES.c2 + 2.6, CUES.c2 + 8.6, -0.425, 0.058, { plate: true });
  place(g, S, 'THE FLOOD  ·  GENESIS 7', t, CUES.c2 + 1, CUES.c2 + 13.5);
}

// ------------------------------ C3 Babel ------------------------------
const babelBricks = lazy(() => {
  const r = rng(61), list = [];
  for (let i = 0; i < 8; i++) {
    const w = 0.64 - 0.062 * i, n = Math.max(3, Math.round(w / 0.055)), bw = w / n;
    for (let row = 0; row < 3; row++) for (let c = 0; c < n; c++) list.push({ x: -w / 2 + c * bw + (row % 2 ? bw / 2 : 0) - (row % 2 && c === n - 1 ? bw * n : 0) * 0, y: GY - 0.1 * i - (row + 1) * 0.1 / 3, w: bw, h: 0.1 / 3, tier: i, tone: r(), spin: (r() - 0.5) * 5, vx: (r() - 0.5) * 0.5 });
  }
  return list;
});
const babelThreads = lazy(() => { const r = rng(63); return Array.from({ length: 23 }, (_, i) => ({ a: -Math.PI * (0.04 + 0.92 * (i + r() * 0.6) / 23), len: 0.55 + r() * 0.85, curl: (r() - 0.5) * 2.2, kind: i % 4, lag: r() * 0.25 })); });
function c3_babel(g, k, t, S) {
  // truck right with the line 2 s ease-out; tilt up the tower 6.5 s ease-in-out as it builds; pull back 3 s as the threads fly; whip right 2 s ease-in
  const tl = t - CUES.c3, run = EASE.out(A(tl, 0, 2)), build = A(tl, 1, 7.4), up = EASE.inOut(A(tl, 1.4, 6.6)), burst = A(tl, 8.6, 4), back = EASE.inOut(A(tl, 8.6, 3)), leave = EASE.in(A(tl, 11.8, 2.2));
  const top = [0, GY - 0.8];
  const cam = CAM.base(); cam.x = lerp(-1.2, 0, run) + 1.55 * leave; cam.y = -0.34 * up + 0.22 * back + 0.12 * leave; cam.dist = 1 + 0.34 * back - 0.34 * leave;
  if (burst > 0) CAM.handheld(cam, t * 5, 2.2 * (1 - EASE.out(A(tl, 8.6, 1.4))));
  chartPaper(g, S, cam, 3);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.2 - 0.03 * Math.sin(x * 3.1 + 2), -2, 3.6, 0.6, { ang: 0.05, gap: 0.012, salt: 64, wash: PALETTE.gold, washA: 0.22 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0022;   // cloud: scallops the tower grows into
    for (let i = 0; i < 26; i++) { const cx = -1.5 + i * 0.13 + 0.02 * Math.sin(t * 0.4 + i), cy = -0.66 + 0.05 * hash1(650 + i); g.globalAlpha = 0.7; g.beginPath(); g.arc(cx, cy, 0.06 + 0.03 * hash1(670 + i), Math.PI * 0.1, Math.PI * 0.9); g.stroke(); }
    g.globalAlpha = 1;
    hatch(g, (g) => g.rect(-2, -1.1, 5.6, 0.42), { ang: 0.12, gap: 0.01, w: 0.0013, alpha: 0.55, box: [-2, -1.1, 3.6, -0.68], salt: 66 });
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.005 * Math.sin(x * 11), -2.4, 3.8, 0.7, { ang: 0.42, gap: 0.013, salt: 67, wash: PALETTE.gold, washA: 0.28 });
    const bricks = babelBricks(), total = bricks.length, fallT = Math.max(0, tl - 8.75);
    bricks.forEach((b, i) => {
      const bk = clamp(build * total - i);
      if (bk <= 0) return;
      let x = b.x, y = b.y + (1 - EASE.out(bk)) * -0.05, rot = 0;
      if (b.tier >= 6 && fallT > 0) { const ft = Math.max(0, fallT - (7 - b.tier) * 0.35 - b.tone * 0.3); x += b.vx * ft; y += 0.9 * ft * ft - 0.12 * ft * (b.tier - 5); rot = b.spin * ft; if (y > GY - 0.03) return; }
      g.save(); g.translate(x + b.w / 2, y + b.h / 2); g.rotate(rot); g.globalAlpha = bk;
      block(g, -b.w / 2, -b.h / 2, b.w, b.h, 68 + i, { wash: b.tone > 0.45 ? PALETTE.accent : PALETTE.gold, washA: 0.16 + 0.22 * b.tone, hatch: i % 3 === 0, lw: 0.0017 });
      g.restore();
    });
    for (let i = 0; i < 8; i++) {                        // an arched door and a ramp on every tier that stands
      if (build * 8 < i + 0.9 || (i >= 6 && fallT > 0)) continue;
      const w = 0.64 - 0.062 * i, y = GY - 0.1 * i;
      g.fillStyle = PALETTE.ink; g.beginPath(); g.moveTo(-0.014, y); g.lineTo(-0.014, y - 0.045); g.arc(0, y - 0.045, 0.014, Math.PI, 0); g.lineTo(0.014, y); g.fill();
      stroke(g, [[-w / 2, y], [-w / 2 + 0.06, y - 0.1]], 0.0022, PALETTE.ink); stroke(g, [[w / 2, y], [w / 2 - 0.06, y - 0.1]], 0.0022, PALETTE.ink);
    }
    for (let i = 0; i < 6; i++) {                        // the builders: up the ledges with their loads, then scattering
      const tier = 1 + i, w = 0.64 - 0.062 * tier, s = i % 2 ? 1 : -1, sc = EASE.in(A(tl, 9 + i * 0.12, 2.4));
      if (build * 8 < tier) continue;
      person(g, s * (w / 2 + 0.035 + 0.02 * Math.sin(t * 1.1 + i)) + s * 1.3 * sc, GY - 0.1 * tier * (1 - sc), 0.06, { face: sc > 0 ? s : -s, arm: sc > 0 ? 0.9 : 0.4, p: t * 1.6 + i * 0.3, salt: 80 + i });
    }
    const h = Math.min(build, 1) * 0.8;                 // the line climbs inside the tower as high as it stands
    lineage(g, -2.4, lerp(-2.4, 0, run), GY);
    if (h > 0) stroke(g, [[0, GY], [0, GY - h * (fallT > 0 ? 1 - 0.25 * A(fallT, 0, 0.8) : 1)]], 0.007, PALETTE.accent);
    if (burst > 0) {
      // the top breaks: the one line becomes many threads, each ending in its own mark
      const crack = [0, GY - 0.6];
      babelThreads().forEach((th, i) => {
        const tk = EASE.out(clamp(burst * 1.5 - th.lag)), pts = [];
        for (let j = 0; j <= 30; j++) { const u = j / 30, r = u * th.len; pts.push([crack[0] + Math.cos(th.a + th.curl * u * u * 0.5) * r * 1.5, crack[1] + Math.sin(th.a + th.curl * u * u * 0.5) * r * 0.75 - 0.05 * u]); }
        const grey = EASE.inOut(A(tl, 10.2 + th.lag, 1.6));
        stroke(g, pts, 0.004, PALETTE.accent, tk, 1 - grey); stroke(g, pts, 0.003, PALETTE.dim, tk, grey);
        if (tk >= 1) {
          const [ex, ey] = pts[30]; g.save(); g.strokeStyle = g.fillStyle = grey > 0.5 ? PALETTE.dim : PALETTE.accent; g.lineWidth = 0.003; g.beginPath();
          if (th.kind === 0) g.arc(ex, ey, 0.012, 0, TAU); else if (th.kind === 1) g.rect(ex - 0.01, ey - 0.01, 0.02, 0.02); else if (th.kind === 2) { g.moveTo(ex, ey - 0.014); g.lineTo(ex + 0.013, ey + 0.01); g.lineTo(ex - 0.013, ey + 0.01); g.closePath(); } else { g.moveTo(ex - 0.012, ey - 0.012); g.lineTo(ex + 0.012, ey + 0.012); g.moveTo(ex + 0.012, ey - 0.012); g.lineTo(ex - 0.012, ey + 0.012); }
          g.stroke(); g.restore();
        }
      });
      // one thread keeps its red and comes back down to the ground, going on to the right
      const keep = EASE.inOut(A(tl, 9.4, 3.2)), kp = [];
      for (let j = 0; j <= 40; j++) { const u = j / 40; kp.push([crack[0] + 1.75 * u, crack[1] - 0.28 * Math.sin(u * Math.PI) + (GY - crack[1]) * u * u]); }
      stroke(g, kp, 0.0065, PALETTE.accent, keep);
      const out = A(tl, 12.4, 1.6); if (out > 0) lineage(g, 1.75, lerp(1.75, 3.6, EASE.in(out)), GY);
    }
  });
  card(g, S, 'One language became many.', t, CUES.c3 + 9.2, CUES.c3 + 13.6, 0.36, 0.058, { plate: true });
  place(g, S, 'BABEL  ·  GENESIS 11', t, CUES.c3 + 0.8, CUES.c3 + 8.6);
}

// ------------------------------ C4 Abraham ------------------------------
const abStars = lazy(() => { const r = rng(72); return Array.from({ length: 170 }, () => [-1.9 + r() * 5.6, -0.86 + r() * 0.98, 0.003 + r() * 0.006, r()]); });
function c4_abraham(g, k, t, S) {
  // truck right with the walker 3 s ease-out; hold as night falls and the stars come, slow tilt up; truck right 3.2 s ease-in-out to the sleeper; crane up the ladder; truck out 2 s ease-in
  const tl = t - CUES.c4, run = EASE.out(A(tl, 0, 3)), dusk = EASE.inOut(A(tl, 2.6, 3)) * (1 - EASE.inOut(A(tl, 15.4, 2.6))), to2 = EASE.inOut(A(tl, 9.4, 3.2)), lad = EASE.out(A(tl, 11.6, 3.6)), leave = EASE.in(A(tl, 16, 2));
  const cam = CAM.base(); cam.x = lerp(-1.1, 0, run) + 1.95 * to2 + 1.1 * leave; cam.y = -0.1 * EASE.inOut(A(tl, 4, 4)) * (1 - to2) - 0.2 * EASE.inOut(A(tl, 12, 3)) * (1 - leave); cam.dist = 1 + 0.1 * EASE.inOut(A(tl, 4, 4)) * (1 - leave);
  chartPaper(g, S, cam, 4);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.18 - 0.05 * Math.sin(x * 1.7 + 1) - 0.02 * Math.sin(x * 4.3), -2.4, 4.6, 0.6, { ang: 0.1, gap: 0.012, salt: 73, wash: PALETTE.gold, washA: 0.3 });
    night(g, -2.4, -1.1, 7, 1.75, dusk);
    for (const [i, [sx, sy, sr, q]] of abStars().entries()) {        // the stars come one at a time, as if counted
      const sk = MOTION.back(A(tl, 4.2 + i * 0.03, 0.35)) * dusk;
      if (sk <= 0) continue;
      const tw = 0.75 + 0.25 * Math.sin(t * 3 + q * 40), r = sr * sk * tw;
      g.fillStyle = STARLIGHT; g.globalAlpha = 1; g.beginPath(); g.arc(sx, sy, Math.max(0, r), 0, TAU); g.fill();
      if (q > 0.72) { g.strokeStyle = STARLIGHT; g.lineWidth = 0.0013; g.beginPath(); g.moveTo(sx - r * 3, sy); g.lineTo(sx + r * 3, sy); g.moveTo(sx, sy - r * 3); g.lineTo(sx, sy + r * 3); g.stroke(); }
    }
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.008 * Math.sin(x * 6), -2.6, 4.8, 0.7, { ang: 0.42, gap: 0.013, salt: 74, wash: PALETTE.gold, washA: 0.3 });
    for (let i = 0; i < 15; i++) {                       // the many threads, grey now, thinning out behind him
      const y0 = -0.35 + i * 0.06, pts = []; for (let j = 0; j <= 30; j++) { const x = -2.6 + j * 0.065; pts.push([x, y0 + 0.03 * Math.sin(x * (3 + i % 4) + i) + (0.24 - y0) * 0.12 * (j / 30)]); }
      stroke(g, pts, 0.003, PALETTE.dim, 1, 0.65 * (1 - dusk));
    }
    const tent = (g) => { g.moveTo(0.02, GY); g.lineTo(0.22, GY - 0.2); g.lineTo(0.46, GY); g.closePath(); };
    g.fillStyle = PALETTE.bg; g.beginPath(); tent(g); g.fill(); wash(g, tent, PALETTE.accent, 0.35);
    hatch(g, tent, { ang: 1.15, gap: 0.016, w: 0.0016, alpha: 0.8, box: [0, GY - 0.2, 0.46, GY], salt: 75 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.003; g.lineJoin = 'round'; g.beginPath(); tent(g); g.stroke();
    g.fillStyle = PALETTE.ink; g.beginPath(); g.moveTo(0.2, GY); g.lineTo(0.235, GY - 0.11); g.lineTo(0.27, GY); g.fill();
    stroke(g, [[0.22, GY - 0.2], [0.22, GY - 0.235]], 0.0025, PALETTE.ink); stroke(g, [[0.02, GY], [-0.05, GY + 0.004]], 0.002, PALETTE.ink); stroke(g, [[0.46, GY], [0.53, GY + 0.004]], 0.002, PALETTE.ink);
    const fl = 0.6 + 0.4 * noise1(t * 7);              // a small fire by the tent
    wash(g, (g) => g.arc(0.62, GY - 0.02, 0.09 * fl, 0, TAU), PALETTE.gold, 0.5 * dusk, 0);
    stroke(g, [[0.6, GY], [0.61, GY - 0.03 * fl], [0.62, GY - 0.012], [0.63, GY - 0.04 * fl], [0.645, GY]], 0.003, PALETTE.accent);
    // Abram: he walks in with the line, stops, and looks up
    const ax = lerp(-1.75, -0.25, run);
    person(g, ax, GY, 0.21, { face: 1, arm: 0.2 + 0.7 * EASE.inOut(A(tl, 4.4, 1.3)), staff: tl < 4.2, p: run * 7, salt: 76, wash: PALETTE.blue, washA: 0.4 });
    // Bethel: a sleeper on a stone, and a ladder that goes all the way up
    const bx = 1.95;
    block(g, bx - 0.13, GY - 0.03, 0.07, 0.03, 77);
    const sl = (g) => { g.moveTo(bx - 0.07, GY); g.quadraticCurveTo(bx + 0.05, GY - 0.075, bx + 0.2, GY - 0.03); g.lineTo(bx + 0.24, GY); g.closePath(); };
    g.fillStyle = PALETTE.bg; g.beginPath(); sl(g); g.fill(); wash(g, sl, PALETTE.green, 0.4); hatch(g, sl, { ang: 0.3, gap: 0.009, w: 0.0014, alpha: 0.8, box: [bx - 0.1, GY - 0.08, bx + 0.25, GY], salt: 78 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.003; g.beginPath(); sl(g); g.stroke(); g.beginPath(); g.arc(bx - 0.095, GY - 0.047, 0.02, 0, TAU); g.fillStyle = PALETTE.bg; g.fill(); g.stroke();
    if (lad > 0) {
      const L0 = [bx + 0.05, GY - 0.06], L1 = [bx + 0.42, -0.92], P = (u, s) => [lerp(L0[0], L1[0], u) + s * (0.035 - 0.012 * u), lerp(L0[1], L1[1], u)];
      wash(g, (g) => { g.moveTo(...P(0, -1.6)); g.lineTo(...P(lad, -3.4)); g.lineTo(...P(lad, 3.4)); g.lineTo(...P(0, 1.6)); g.closePath(); }, PALETTE.gold, 0.55, 0);
      for (const s of [-1, 1]) stroke(g, [P(0, s), P(lad, s)], 0.004, STARLIGHT);
      g.strokeStyle = STARLIGHT; g.lineWidth = 0.003; g.beginPath();
      for (let i = 1; i < 26 * lad; i++) { const u = i / 26; g.moveTo(...P(u, -1)); g.lineTo(...P(u, 1)); }
      g.stroke();
      for (let i = 0; i < 6; i++) {                      // the messengers: small winged marks going up and coming down
        const u = (i / 6 + (i % 2 ? -1 : 1) * tl * 0.07 + 10) % 1; if (u > lad - 0.03) continue;
        const [mx, my] = P(u, i % 2 ? 2.4 : -2.4), wf = 0.012 * Math.sin(t * 8 + i);
        stroke(g, [[mx - 0.03, my - 0.012 + wf], [mx, my], [mx + 0.03, my - 0.012 + wf]], 0.0035, STARLIGHT); g.fillStyle = STARLIGHT; g.beginPath(); g.arc(mx, my - 0.012, 0.006, 0, TAU); g.fill();
      }
    }
    night(g, -2.6, GY - 0.012, 7.4, 0.6, dusk * 0.55, 79);
    const head = tl < 9.4 ? lerp(-2, -0.18, run) : lerp(-0.18, 1.8, to2) + 2.6 * leave;
    lineage(g, -2.6, head, GY); if (head < 4.3) nib(g, head, GY);
  });
  const ink = dusk > 0.5 ? STARLIGHT : PALETTE.ink;
  card(g, S, 'Count the stars, if you can.', t, CUES.c4 + 5.4, CUES.c4 + 10, -0.425, 0.058, { color: STARLIGHT });
  place(g, S, 'CANAAN  ·  GENESIS 15', t, CUES.c4 + 1, CUES.c4 + 9.4, 0.45, ink);
  place(g, S, 'BETHEL  ·  GENESIS 28', t, CUES.c4 + 11.6, CUES.c4 + 17.2, 0.45, ink);
}

