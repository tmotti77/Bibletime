// A soft glow of light on the page (a fire, a lamp of gold): laid as paint, not as a wash.
function glow(g, x, y, r, a, c = '201,154,46') {
  if (a <= 0 || r <= 0) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`);
  g.save(); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); g.restore();
}
function pyramid(g, x, y, s, salt = 1) {             // base centre (x, y), s = half its base
  const lit = (g) => { g.moveTo(x - s, y); g.lineTo(x, y - s * 1.25); g.lineTo(x + s * 0.25, y); g.closePath(); };
  const dark = (g) => { g.moveTo(x + s * 0.25, y); g.lineTo(x, y - s * 1.25); g.lineTo(x + s, y); g.closePath(); };
  g.fillStyle = PALETTE.bg; g.beginPath(); lit(g); dark(g); g.fill();
  wash(g, (g) => { lit(g); dark(g); }, PALETTE.gold, 0.4, 0.004);
  hatch(g, lit, { ang: 0.02, gap: s * 0.07, w: 0.0012, alpha: 0.5, box: [x - s, y - s * 1.3, x + s, y], salt });
  hatch(g, dark, { ang: 1.0, gap: s * 0.035, w: 0.0013, alpha: 0.8, box: [x - s, y - s * 1.3, x + s, y], salt: salt + 1, cross: true });
  g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0025; g.lineJoin = 'round'; g.beginPath(); lit(g); dark(g); g.stroke();
}
function palm(g, x, y, h, sway = 0) {
  stroke(g, [[x, y], [x + h * 0.06 + sway * 0.3, y - h * 0.5], [x + h * 0.02 + sway, y - h]], h * 0.05, PALETTE.ink);
  for (let i = 0; i < 7; i++) { const a = -Math.PI * (0.02 + 0.96 * i / 6), tx = x + h * 0.02 + sway, ty = y - h; stroke(g, [[tx, ty], [tx + Math.cos(a) * h * 0.25, ty + Math.sin(a) * h * 0.22 - h * 0.05], [tx + Math.cos(a) * h * 0.45, ty + Math.sin(a) * h * 0.2 + h * 0.12]], h * 0.028, PALETTE.ink); }
  wash(g, (g) => g.ellipse(x + h * 0.02 + sway, y - h * 0.98, h * 0.45, h * 0.24, 0, 0, TAU), PALETTE.green, 0.4, 0.004);
}

// ------------------------------ C5 Joseph ------------------------------
const EG = GY + 0.8;                                  // the ground of Egypt, lower down the page
function c5_joseph(g, k, t, S) {
  // truck right with the line 2.5 s ease-out; crane down 3.6 s ease-in-out with the falling line, into Egypt; truck right 4 s; out 1.6 s ease-in
  const tl = t - CUES.c5, run = EASE.out(A(tl, 0, 2.5)), down = EASE.inOut(A(tl, 4.4, 3.6)), on = EASE.inOut(A(tl, 8.6, 4.4)), leave = EASE.in(A(tl, 14.4, 1.6));
  const cam = CAM.base(); cam.x = lerp(-1.1, 0, run) + 0.95 * down + 0.75 * on + 1.3 * leave; cam.y = 0.74 * down; cam.dist = 1 + 0.06 * down;
  chartPaper(g, S, cam, 5);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.19 - 0.045 * Math.sin(x * 2 + 0.5), -2.2, 1.3, 0.5, { ang: 0.08, gap: 0.012, salt: 91, wash: PALETTE.green, washA: 0.3 });
    const sy = EG + 0.02;                              // Egypt, far: the sun on the river plain and three pyramids
    wash(g, (g) => g.arc(1.2, sy - 0.42, 0.075, 0, TAU), PALETTE.gold, 0.7, 0.004); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.beginPath(); g.arc(1.2, sy - 0.42, 0.075, 0, TAU); g.stroke();
    pyramid(g, 1.75, sy, 0.3, 92); pyramid(g, 2.3, sy, 0.22, 94); pyramid(g, 2.75, sy, 0.15, 96);
    land(g, (x) => sy + 0.004 * Math.sin(x * 9), 0.2, 4.6, sy + 0.5, { ang: 0.05, gap: 0.012, salt: 97, wash: PALETTE.gold, washA: 0.3 });
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.006 * Math.sin(x * 9), -2.4, 0.86, GY + 0.3, { ang: 0.42, gap: 0.013, salt: 98, wash: PALETTE.green, washA: 0.35 });
    const pit = (g) => g.ellipse(0.5, GY + 0.012, 0.09, 0.022, 0, 0, TAU);
    g.fillStyle = PALETTE.ink; g.beginPath(); pit(g); g.fill();
    const gather = EASE.inOut(A(tl, 2.4, 1.6)), drop = EASE.in(A(tl, 3.9, 0.8));
    for (let i = 0; i < 10; i++) person(g, -0.95 + i * 0.085 + gather * (0.42 + 0.02 * i), GY, 0.13 + 0.02 * hash1(980 + i), { face: 1, arm: 0.15 + 0.5 * gather * (i % 2), p: gather * 6 + i * 0.3, salt: 100 + i });
    if (drop < 1) {                                      // Joseph and the coat: the one bright thing on the plate
      const jx = lerp(0.2, 0.5, EASE.inOut(A(tl, 3.2, 0.8))), jy = GY + 0.2 * drop, coat = MOTION.back(A(tl, 1, 0.5));
      g.save(); g.beginPath(); g.rect(-1, -1, 3, 1 + GY + 0.012); g.clip();
      person(g, jx, jy, 0.16, { face: -1, arm: 0.3, salt: 111 });
      g.globalCompositeOperation = 'multiply';
      [PALETTE.accent, PALETTE.gold, PALETTE.blue, PALETTE.green, PALETTE.accent].forEach((c, i) => { g.fillStyle = c; g.globalAlpha = 0.85 * clamp(coat); g.fillRect(jx - 0.026 + i * 0.0105, jy - 0.125, 0.0105, 0.122); });
      g.restore();
    }
    // the line dips out of the land and down the page; silver falls with it
    const fall = [[0.5, GY]]; for (let i = 1; i <= 30; i++) { const u = i / 30; fall.push([0.5 + 0.6 * u + 0.05 * Math.sin(u * Math.PI), GY + (EG - GY) * EASE.inOut(u)]); }
    lineage(g, -2.4, lerp(-2.4, 0.5, run), GY);
    stroke(g, fall, 0.007, PALETTE.accent, A(tl, 4.3, 3.4));
    for (let i = 0; i < 20; i++) {
      const u = A(tl, 4.4 + i * 0.07, 2.6); if (u <= 0 || u >= 1) continue;
      const cx = 0.5 + 0.6 * u + 0.09 * (hash1(1200 + i) - 0.5) + 0.05, cy = GY + (EG - GY) * EASE.in(u) - 0.03;
      g.fillStyle = STARLIGHT; g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.beginPath(); g.ellipse(cx, cy, 0.011, 0.011 * Math.abs(Math.cos(t * 7 + i)) + 0.002, 0, 0, TAU); g.fill(); g.stroke();
    }
    // Egypt: the river, the palms, seven stacks of grain, and the one who was sold standing over them
    land(g, (x) => EG + 0.005 * Math.sin(x * 8), 0.3, 4.8, EG + 0.5, { ang: 0.42, gap: 0.013, salt: 113, wash: PALETTE.gold, washA: 0.32 });
    g.save(); g.beginPath(); g.rect(0.3, EG + 0.09, 4.5, 0.12); g.clip(); wash(g, (g) => g.rect(0.3, EG + 0.09, 4.5, 0.12), PALETTE.blue, 0.6, 0); waves(g, 0.3, 4.8, EG + 0.1, EG + 0.2, t, 5, 21); g.restore();
    palm(g, 1.02, EG, 0.3, 0.01 * Math.sin(t * 1.2)); palm(g, 2.62, EG, 0.24, 0.01 * Math.sin(t * 1.2 + 2));
    for (let i = 0; i < 7; i++) {
      const sx = 1.3 + i * 0.105, sk = EASE.out(A(tl, 8.6 + i * 0.35, 1)), h = 0.14 * sk;
      if (sk <= 0) continue;
      const sh = (g) => { g.moveTo(sx - 0.035, EG); g.quadraticCurveTo(sx - 0.012, EG - h * 0.6, sx - 0.045, EG - h); g.lineTo(sx + 0.045, EG - h); g.quadraticCurveTo(sx + 0.012, EG - h * 0.6, sx + 0.035, EG); g.closePath(); };
      g.fillStyle = PALETTE.bg; g.beginPath(); sh(g); g.fill(); wash(g, sh, PALETTE.gold, 0.75, 0.003);
      hatch(g, sh, { ang: 1.45, gap: 0.007, w: 0.0012, alpha: 0.8, box: [sx - 0.05, EG - 0.15, sx + 0.05, EG], salt: 114 + i });
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0022; g.beginPath(); sh(g); g.stroke(); stroke(g, [[sx - 0.022, EG - h * 0.6], [sx + 0.022, EG - h * 0.6]], 0.003, PALETTE.ink);
    }
    block(g, 2.14, EG - 0.035, 0.22, 0.035, 121); block(g, 2.18, EG - 0.07, 0.14, 0.035, 122);
    const jr = EASE.out(A(tl, 9.4, 1.2));
    g.globalAlpha = jr; person(g, 2.25, EG - 0.07, 0.19, { face: -1, arm: 0.2 + 0.6 * EASE.inOut(A(tl, 10.6, 1)), salt: 123, wash: PALETTE.gold, washA: 0.8 }); g.globalAlpha = 1;
    for (let i = 0; i < 9; i++) {                        // the family comes down after him, along the line
      const w = EASE.out(A(tl, 10.8 + i * 0.22, 3.6)), fx = lerp(0.2, 1.18 - i * 0.075 + 0.6, w) + 1.4 * leave * 0;
      if (w > 0) person(g, fx - 0.55, EG, 0.11 + 0.02 * hash1(1250 + i), { face: 1, arm: 0.15, lean: 0.05, p: w * 9 + i * 0.4, salt: 124 + i, wash: i % 4 === 0 ? PALETTE.blue : null, washA: 0.4 });
    }
    const head = lerp(1.1, 2.1, EASE.inOut(A(tl, 7.6, 3))) + 2.6 * leave;
    if (tl > 7.6) { lineage(g, 1.1, head, EG); nib(g, head, EG); }
  });
  card(g, S, 'Sold for silver. Raised to rule.', t, CUES.c5 + 6.6, CUES.c5 + 12.4, -0.425, 0.058, { plate: true });
  place(g, S, 'DOTHAN  ·  GENESIS 37', t, CUES.c5 + 0.8, CUES.c5 + 4.6);
  place(g, S, 'EGYPT  ·  GENESIS 41', t, CUES.c5 + 8.4, CUES.c5 + 15.2);
}

// ------------------------------ C6 Moses: the bricks and the bush ------------------------------
const bushTwigs = lazy(() => {
  const r = rng(131), segs = [];
  const grow = (x, y, a, len, d) => { const x1 = x + Math.cos(a) * len, y1 = y + Math.sin(a) * len; segs.push([x, y, x1, y1, d]); if (d < 4) for (let i = 0; i < 2 + (d < 1 ? 2 : 0); i++) grow(x1, y1, a + (r() - 0.5) * 1.5, len * (0.62 + r() * 0.2), d + 1); };
  for (let i = 0; i < 3; i++) grow(1.95 + (i - 1) * 0.03, GY, -Math.PI / 2 + (i - 1) * 0.5, 0.075, 0);
  return segs;
});
function c6_moses(g, k, t, S) {
  // truck right over the brickyard 2.5 s ease-out; truck right 2.8 s ease-in-out to the bush; slow push in 3 s on the flame
  const tl = t - CUES.c6, run = EASE.out(A(tl, 0, 2.5)), to2 = EASE.inOut(A(tl, 3.6, 2.8)), fire = EASE.out(A(tl, 5.6, 1.2)), push = EASE.inOut(A(tl, 6.4, 3.6));
  const cam = CAM.base(); cam.x = lerp(-1.1, 0, run) + 1.9 * to2; cam.dist = 1 - 0.2 * push; cam.y = -0.05 * push;
  chartPaper(g, S, cam, 7);
  plane(g, S, cam, 0.28, (g) => {
    pyramid(g, -0.45, 0.22, 0.42, 132);
    for (let i = 0; i < 5; i++) block(g, 0.25 + i * 0.09, 0.22 - 0.045 * (i + 1), 0.5 - i * 0.09, 0.045, 134 + i, { wash: PALETTE.gold, washA: 0.35 });   // one still going up
    land(g, (x) => 0.22 - (x > 1.1 ? 0.5 * (1 - Math.abs(x - 2.5) / 1.4) ** 1.3 * (Math.abs(x - 2.5) < 1.4 ? 1 : 0) : 0) + 0.012 * Math.sin(x * 13), -2.2, 4.2, 0.6, { ang: 0.6, gap: 0.011, salt: 139, wash: PALETTE.dim, washA: 0.3, cross: true, alpha: 0.4 });
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.005 * Math.sin(x * 10), -2.4, 4.4, 0.7, { ang: 0.42, gap: 0.013, salt: 140, wash: PALETTE.gold, washA: 0.3 });
    for (let s = 0; s < 4; s++) for (let r = 0; r < 4; r++) for (let c = 0; c < 4 - (r > 2 ? 1 : 0); c++) {   // brick stacks, counted and counted again
      const bk = EASE.out(A(tl, 0.2 + s * 0.5 + r * 0.25 + c * 0.05, 0.4)); if (bk <= 0) continue;
      g.globalAlpha = bk; block(g, -0.85 + s * 0.4 + c * 0.042 + (r % 2) * 0.02, GY - 0.022 * (r + 1) - 0.03 * (1 - bk), 0.04, 0.022, 141 + s * 16 + r * 4 + c, { wash: PALETTE.accent, washA: 0.35, hatch: false, lw: 0.0016 }); g.globalAlpha = 1;
    }
    for (let i = 0; i < 7; i++) {                        // bent under the load, in a line
      const px = -1.0 + i * 0.3 + 0.07 * tl;
      person(g, px, GY, 0.14, { face: 1, arm: 0.75, lean: 0.3, p: tl * 0.9 + i * 0.37, salt: 160 + i });
      block(g, px + 0.012, GY - 0.165, 0.045, 0.024, 170 + i, { wash: PALETTE.accent, washA: 0.4, hatch: false });
    }
    const whip = Math.sin(tl * 4.2);                      // the taskmaster
    const hnd = person(g, 0.52, GY, 0.2, { face: -1, arm: 0.55 + 0.4 * whip, salt: 178, wash: PALETTE.dim, washA: 0.6 });
    stroke(g, [hnd, [hnd[0] - 0.07, hnd[1] - 0.05 - 0.05 * whip], [hnd[0] - 0.16, hnd[1] + 0.02 * whip], [hnd[0] - 0.22, hnd[1] + 0.05 - 0.07 * whip]], 0.0025, PALETTE.ink);
    // Horeb: the bush that burns and is not burnt
    glow(g, 1.95, GY - 0.12, 0.42 * fire, 0.5 * (0.85 + 0.15 * noise1(t * 6)));
    for (let i = 0; i < 16; i++) {
      const fx = 1.95 + (hash1(1300 + i) - 0.5) * 0.26, fh = (0.1 + 0.16 * hash1(1320 + i)) * fire * (0.75 + 0.5 * noise1(t * 5 + i * 3)), fw = 0.022 + 0.02 * hash1(1340 + i), by = GY - 0.01 - 0.1 * hash1(1360 + i), lean = 0.03 * (noise1(t * 3 + i) - 0.5);
      const fl = (g) => { g.moveTo(fx - fw, by); g.quadraticCurveTo(fx - fw * 1.2 + lean, by - fh * 0.5, fx + lean * 2, by - fh); g.quadraticCurveTo(fx + fw * 1.2 + lean, by - fh * 0.5, fx + fw, by); g.closePath(); };
      wash(g, fl, i % 2 ? PALETTE.accent : PALETTE.gold, 0.6, 0); g.strokeStyle = PALETTE.accent; g.lineWidth = 0.002; g.globalAlpha = fire; g.beginPath(); fl(g); g.stroke(); g.globalAlpha = 1;
    }
    for (const [x0, y0, x1, y1, d] of bushTwigs()) { stroke(g, [[x0, y0], [x1, y1]], 0.0075 - d * 0.0013, PALETTE.ink); if (d >= 3) { g.fillStyle = PALETTE.green; g.beginPath(); g.ellipse(x1, y1, 0.009, 0.0045, x1 * 40, 0, TAU); g.fill(); } }
    const kn = EASE.inOut(A(tl, 6.2, 1.4));               // Moses: he comes with the line, sees it, and goes down on his knees
    person(g, lerp(0.9, 1.55, EASE.out(A(tl, 3.4, 2.8))), GY, 0.2 * (1 - 0.32 * kn), { face: 1, arm: 0.2 + 0.7 * kn, lean: 0.12 * kn, staff: kn < 0.3, p: A(tl, 3.4, 2.8) * 6, salt: 180, wash: PALETTE.blue, washA: 0.4 });
    for (const sx of [1.43, 1.46]) { g.globalAlpha = kn; block(g, sx, GY - 0.012, 0.022, 0.012, 181, { hatch: false }); g.globalAlpha = 1; }    // the sandals, off
    const head = lerp(-2.4, 0.2, run) + 1.5 * to2;
    lineage(g, -2.4, head, GY); nib(g, head, GY);
  });
  card(g, S, 'Let my people go.', t, CUES.c6 + 6.2, CUES.c6 + 9.7, -0.425, 0.062, { plate: true });
  place(g, S, 'EGYPT  ·  EXODUS 1', t, CUES.c6 + 0.6, CUES.c6 + 4);
  place(g, S, 'HOREB  ·  EXODUS 3', t, CUES.c6 + 6, CUES.c6 + 9.7);
}

// ------------------------------ C7 Sinai and the wilderness ------------------------------
const sinaiCrowd = lazy(() => { const r = rng(191); return Array.from({ length: 40 }, (_, i) => ({ x: (i < 20 ? -1.25 : 0.42) + r() * 0.85, y: GY + 0.02 + r() * 0.12, h: 0.05 + r() * 0.025, salt: 200 + i })).sort((a, b) => a.y - b.y); });
function c7_sinai(g, k, t, S) {
  // slow push in with a small orbit 5 s ease-out on the mountain; the tablets rise into the frame and hold 5 s; truck right 3 s ease-in-out into the desert; out 1.6 s
  const tl = t - CUES.c7, into = EASE.out(A(tl, 0, 5)), tab = EASE.inOut(A(tl, 4.6, 1.6)) * (1 - EASE.inOut(A(tl, 9.6, 1.4))), to2 = EASE.inOut(A(tl, 9.8, 3)), leave = EASE.in(A(tl, 14.4, 1.6));
  const cam = CAM.base(); cam.dist = lerp(1.3, 1.08, into); CAM.orbit(cam, into, -5, 4); cam.x += 2.5 * to2 + 1.3 * leave; cam.y = -0.1 * (1 - to2);
  const mt = (x) => GY - 0.66 * Math.max(0, 1 - Math.abs(x + 0.02) / 0.82) ** 0.85 + 0.014 * Math.sin(x * 31) + 0.01 * Math.sin(x * 57);
  const bolt = [1.5, 3.0, 4.2].map((b) => 1 - A(tl, b, 0.35)).find((v) => v > 0 && v < 1) ?? 0;
  chartPaper(g, S, cam, 8);
  plane(g, S, cam, 0.3, (g) => {
    hatch(g, (g) => g.rect(-2.4, -1.2, 7.6, 1.0), { ang: -0.25, gap: 0.011, w: 0.0015, alpha: 0.7 * (1 - 0.75 * to2), box: [-2.4, -1.2, 1.6, -0.2], salt: 192, cross: true });
    land(g, (x) => 0.2 - 0.05 * Math.sin(x * 1.6 + 1) - 0.02 * Math.sin(x * 4.7), -2.4, 5.4, 0.6, { ang: 0.08, gap: 0.012, salt: 193, wash: PALETTE.gold, washA: 0.28 });
  });
  plane(g, S, cam, 0, (g) => {
    land(g, mt, -1.5, 1.5, 0.7, { ang: 1.0, gap: 0.009, salt: 194, wash: PALETTE.dim, washA: 0.55, cross: true, alpha: 0.6, lw: 0.003 });
    land(g, (x) => GY + 0.006 * Math.sin(x * 9), -2.6, 5.6, 0.7, { ang: 0.42, gap: 0.013, salt: 195, wash: PALETTE.gold, washA: 0.3 });
    glow(g, 0, -0.42, 0.3 + 0.25 * bolt, 0.35 + 0.5 * bolt, '179,38,30');     // fire on the summit
    for (let i = 0; i < 9; i++) {                        // smoke: coils that rise and lean with the wind
      const u = (i / 9 + tl * 0.05) % 1, sx = -0.02 + 0.5 * u * u + 0.05 * Math.sin(i * 2 + t * 0.6), sy = -0.4 - 0.5 * u, r = 0.05 + 0.13 * u, pts = [];
      for (let j = 0; j <= 26; j++) { const a = j / 26 * TAU * 1.6 + i; pts.push([sx + Math.cos(a) * r * (j / 26), sy + Math.sin(a) * r * 0.7 * (j / 26)]); }
      stroke(g, pts, 0.004, PALETTE.ink, 1, 0.85 * (1 - u * 0.6));
    }
    if (bolt > 0) { const bx = [1.5, 3.0, 4.2].findIndex((b) => tl >= b && tl < b + 0.35), s = bx % 2 ? 1 : -1; const z = [[0.05 * s, -0.62], [0.16 * s, -0.42], [0.1 * s, -0.36], [0.27 * s, -0.16], [0.21 * s, -0.12], [0.36 * s, 0.06]]; stroke(g, z, 0.012, STARLIGHT); stroke(g, z, 0.004, PALETTE.accent); }
    for (const c of sinaiCrowd()) person(g, c.x, c.y, c.h, { back: true, arm: bolt > 0 ? 0.9 : 0.15, salt: c.salt });
    // the line goes up the mountain alone
    const climb = [[-2.6, GY], [-0.9, GY]]; for (let i = 1; i <= 24; i++) { const u = i / 24, x = -0.9 + 0.88 * u + 0.06 * Math.sin(u * 22); climb.push([x, mt(x) - 0.004]); }
    stroke(g, climb, 0.0065, PALETTE.accent, EASE.inOut(A(tl, 0.2, 4.4)));
    // the wilderness: forty turns of the same line, a tent in the middle of them, a pillar of cloud over it
    const coil = []; for (let i = 0; i <= 800; i++) { const u = i / 800, a = u * 40 * TAU; coil.push([1.55 + 2.0 * u + 0.034 * Math.sin(a), GY - 0.036 + 0.036 * Math.cos(a) - 0.03 * Math.sin(u * Math.PI)]); }
    const ck = EASE.inOut(A(tl, 10.2, 4.6));
    stroke(g, coil, 0.0048, PALETTE.accent, ck);
    const tb = (g) => { g.moveTo(2.36, GY - 0.11); g.lineTo(2.47, GY - 0.2); g.lineTo(2.64, GY - 0.2); g.lineTo(2.75, GY - 0.11); g.closePath(); };
    g.fillStyle = PALETTE.bg; g.beginPath(); tb(g); g.fill(); wash(g, tb, PALETTE.accent, 0.4); hatch(g, tb, { ang: 1.57, gap: 0.011, w: 0.0014, alpha: 0.8, box: [2.36, GY - 0.2, 2.75, GY - 0.11], salt: 196 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0028; g.beginPath(); tb(g); g.stroke();
    for (let i = 0; i < 9; i++) stroke(g, [[2.3 + i * 0.064, GY - 0.075], [2.3 + i * 0.064, GY - 0.125]], 0.0022, PALETTE.ink);
    stroke(g, [[2.3, GY - 0.115], [2.812, GY - 0.115]], 0.0018, PALETTE.ink);
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0024;
    for (let i = 0; i < 22; i++) { const u = i / 22, cx = 2.555 + 0.03 * Math.sin(i * 1.9 + t * 0.7) + 0.1 * u * u, cy = GY - 0.22 - 0.6 * u; g.globalAlpha = 0.8; g.beginPath(); g.arc(cx, cy, 0.03 + 0.035 * u, Math.PI * 0.15 + i, Math.PI * 1.25 + i); g.stroke(); }
    g.globalAlpha = 1;
    const out = A(tl, 14.4, 1.6); if (out > 0) lineage(g, 3.55, lerp(3.55, 5.4, EASE.in(out)), GY);
  });
  if (tab > 0) plane(g, S, CAM.base(), 0, (g) => {      // the two tablets, close: ten lines cut one after another
    glow(g, 0, 0.04, 0.75 * tab, 0.55);
    for (const s of [-1, 1]) {
      const x = s * 0.165 - 0.14, y = lerp(0.7, -0.2, tab), w = 0.28, h = 0.5;
      const slab = (g) => { g.moveTo(x, y + h); g.lineTo(x, y + 0.14); g.arc(x + w / 2, y + 0.14, w / 2, Math.PI, 0); g.lineTo(x + w, y + h); g.closePath(); };
      g.fillStyle = PALETTE.bg; g.beginPath(); slab(g); g.fill(); wash(g, slab, PALETTE.dim, 0.3, 0.005);
      hatch(g, slab, { ang: 0.85, gap: 0.014, w: 0.0011, alpha: 0.35, box: [x, y, x + w, y + h], salt: 197 + s });
      hatch(g, (g) => g.rect(x + w * 0.86, y, w * 0.14, h), { ang: 0.3, gap: 0.006, w: 0.0012, alpha: 0.6, box: [x, y, x + w, y + h], salt: 199 });
      g.save(); g.beginPath(); slab(g); g.clip(); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.004; g.lineCap = 'round';
      for (let i = 0; i < 5; i++) {
        const n = (s < 0 ? 0 : 5) + i, lk = A(tl, 6.1 + n * 0.3, 0.3), ly = y + 0.16 + i * 0.062;
        if (lk <= 0) continue;
        g.beginPath();
        for (let m = 0; m < 9 * lk; m++) { const mx = x + w - 0.04 - m * 0.024, q = hash1(1400 + n * 11 + m); g.moveTo(mx, ly - 0.014 * (q > 0.3 ? 1 : 0.4)); g.lineTo(mx - 0.006 * (q - 0.5), ly + 0.014); if (q > 0.6) { g.moveTo(mx - 0.008, ly - 0.014); g.lineTo(mx + 0.004, ly - 0.014); } }
        g.stroke();
        if (lk < 1) nib(g, x + w - 0.04 - 9 * lk * 0.024, ly, 0.006);
      }
      g.restore();
      g.strokeStyle = PALETTE.ink; g.lineWidth = 0.004; g.lineJoin = 'round'; g.beginPath(); slab(g); g.stroke();
    }
  });
  card(g, S, 'Forty years to cross a desert.', t, CUES.c7 + 11, CUES.c7 + 15.4, -0.425, 0.058, { plate: true });
  place(g, S, 'SINAI  ·  EXODUS 20', t, CUES.c7 + 0.8, CUES.c7 + 9.6);
}

