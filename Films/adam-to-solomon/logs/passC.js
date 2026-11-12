// ------------------------------ C8 The land: Jericho, the Judges, Ruth ------------------------------
const jericho = lazy(() => {
  const r = rng(211), list = [];
  for (let row = 0; row < 6; row++) for (let c = 0; c < 12; c++) list.push({ x: -0.54 + c * 0.09 + (row % 2 ? 0.045 : 0) - (row % 2 && c === 11 ? 0 : 0), y: GY - 0.05 * (row + 1), w: 0.09, h: 0.05, row, c, vx: (r() - 0.5) * 0.5, spin: (r() - 0.5) * 6, rest: r() * 0.06, d: r() });
  for (const s of [-1, 1]) for (let row = 0; row < 9; row++) list.push({ x: s * 0.6 - 0.07, y: GY - 0.05 * (row + 1), w: 0.14, h: 0.05, row, c: s < 0 ? -1 : 12, vx: s * (0.1 + r() * 0.3), spin: s * (1 + r() * 4), rest: r() * 0.06, d: r(), tower: true });
  return list;
});
const wheat = lazy(() => { const r = rng(213); return Array.from({ length: 150 }, () => [3.2 + r() * 1.9, 0.09 + r() * 0.08, r(), r() * 0.1]); });
function c8_land(g, k, t, S) {
  // truck right with the marchers 2.2 s ease-out; handheld on the fall; truck right 2.4 s to the loops; truck right 2.4 s into the field; out 1.2 s ease-in
  const tl = t - CUES.c8, run = EASE.out(A(tl, 0, 2.2)), ft = Math.max(0, tl - 4.4), to2 = EASE.inOut(A(tl, 6, 2.4)), to3 = EASE.inOut(A(tl, 10.6, 2.4)), leave = EASE.in(A(tl, 14.8, 1.2));
  const cam = CAM.base(); cam.x = lerp(-1.0, 0, run) + 2.0 * to2 + 2.05 * to3 + 1.2 * leave; cam.dist = 1.06 - 0.1 * to3;
  if (ft > 0) CAM.handheld(cam, t * 6, 3.4 * (1 - EASE.out(A(ft, 0, 1.6))));
  chartPaper(g, S, cam, 9);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.19 - 0.05 * Math.sin(x * 1.4 + 2) - 0.02 * Math.sin(x * 4.1), -2.4, 7, 0.6, { ang: 0.08, gap: 0.012, salt: 214, wash: PALETTE.green, washA: 0.3 });
    wash(g, (g) => g.arc(4.75, -0.05, 0.11, 0, TAU), PALETTE.gold, 0.75, 0.004); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.beginPath(); g.arc(4.75, -0.05, 0.11, 0, TAU); g.stroke();
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.005 * Math.sin(x * 10), -2.4, 7.4, 0.7, { ang: 0.42, gap: 0.013, salt: 215, wash: PALETTE.gold, washA: 0.28 });
    // Jericho: a wall of cut blocks, two towers, a shut gate; the horns sound and every block lets go
    for (const b of jericho()) {
      let x = b.x, y = b.y, rot = 0;
      if (ft > 0) { const f2 = Math.max(0, ft - (b.tower ? 0.25 : 0.05 * Math.abs(b.c - 5.5)) - (b.tower ? 8 - b.row : 5 - b.row) * 0.06); x += b.vx * Math.min(f2, 0.9); y = Math.min(GY - 0.05 - b.rest, y + 1.5 * f2 * f2); rot = b.spin * Math.min(f2, 0.6); }
      g.save(); g.translate(x + b.w / 2, y + b.h / 2); g.rotate(rot);
      block(g, -b.w / 2, -b.h / 2, b.w, b.h, 216 + b.row * 13 + b.c, { wash: b.d > 0.5 ? PALETTE.gold : PALETTE.dim, washA: 0.3, hatch: b.d > 0.35 });
      g.restore();
    }
    if (ft <= 0) { g.fillStyle = PALETTE.ink; g.beginPath(); g.moveTo(-0.05, GY); g.lineTo(-0.05, GY - 0.11); g.arc(0, GY - 0.11, 0.05, Math.PI, 0); g.lineTo(0.05, GY); g.fill(); for (const s of [-1, 1]) for (let i = 0; i < 3; i++) block(g, s * 0.6 - 0.07 + i * 0.056, GY - 0.48, 0.028, 0.03, 300 + i, { hatch: false }); }
    for (let i = 0; i < 5; i++) { const u = A(ft, i * 0.12, 1.8); if (u > 0 && u < 1) { g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.globalAlpha = 1 - u; for (let j = 0; j < 4; j++) { g.beginPath(); g.arc(-0.45 + i * 0.22 + j * 0.03, GY - 0.03 - 0.12 * u, 0.03 + 0.09 * u, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } g.globalAlpha = 1; } }
    for (let i = 0; i < 7; i++) {                        // seven with horns, in front of the wall
      const px = -1.5 + i * 0.13 + 0.26 * Math.min(tl, 4.4), blow = EASE.inOut(A(tl, 3.5, 0.5)) * (1 - A(ft, 0.8, 0.8));
      const hnd = person(g, px, GY + 0.07, 0.13, { face: 1, arm: 0.5 + 0.4 * blow, p: Math.min(tl, 4.4) * 1.5 + i * 0.3, salt: 310 + i, wash: i === 3 ? PALETTE.blue : null, washA: 0.4 });
      stroke(g, [hnd, [hnd[0] + 0.035, hnd[1] - 0.02], [hnd[0] + 0.05, hnd[1] - 0.045]], 0.005, PALETTE.ink);
      if (blow > 0.5) { g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0018; for (let j = 1; j <= 3; j++) { g.globalAlpha = 0.8 - j * 0.2; g.beginPath(); g.arc(hnd[0] + 0.05, hnd[1] - 0.045, 0.02 * j + 0.01 * Math.sin(t * 20), -1.3, 0.2); g.stroke(); } g.globalAlpha = 1; }
    }
    // the Judges: the line goes round and round; in each turn someone rises
    const loopK = A(tl, 6.2, 4), lp = [[0.7, GY]];
    for (let n = 0; n < 3; n++) { const cx = 1.62 + n * 0.4; lp.push([cx, GY]); for (let j = 1; j <= 40; j++) { const a = Math.PI / 2 + j / 40 * TAU; lp.push([cx + Math.cos(a) * 0.15, GY - 0.15 + Math.sin(a) * 0.15]); } }
    lp.push([3.1, GY]);
    for (let n = 0; n < 3; n++) {
      const cx = 1.62 + n * 0.4, cy = GY - 0.15, ek = MOTION.back(A(tl, 7.2 + n * 1.1, 0.5));
      if (ek <= 0) continue;
      g.save(); g.translate(cx, cy + 0.07); g.scale(Math.max(0.01, ek), Math.max(0.01, ek)); g.translate(-cx, -cy - 0.07);
      if (n === 0) palm(g, cx, cy + 0.1, 0.19, 0.008 * Math.sin(t * 1.5));                                   // Deborah under her palm
      if (n === 1) { block(g, cx - 0.03, cy + 0.03, 0.06, 0.07, 320, { wash: PALETTE.accent, washA: 0.35 }); glow(g, cx, cy - 0.03, 0.12, 0.7); stroke(g, [[cx - 0.02, cy + 0.03], [cx - 0.012, cy - 0.03 - 0.02 * noise1(t * 6)], [cx, cy], [cx + 0.012, cy - 0.05 - 0.02 * noise1(t * 7 + 3)], [cx + 0.02, cy + 0.03]], 0.004, PALETTE.accent); }   // Gideon's jar and torch
      if (n === 2) { for (const s of [-1, 1]) { g.save(); g.translate(cx + s * 0.05, cy + 0.1); g.rotate(s * 0.22 * EASE.in(A(tl, 9.9, 0.7))); block(g, -0.018, -0.2, 0.036, 0.2, 321 + s, {}); block(g, -0.028, -0.215, 0.056, 0.02, 323, { hatch: false }); g.restore(); } person(g, cx, cy + 0.1, 0.1, { arm: 0.9, salt: 325 }); }   // Samson between the pillars
      g.restore();
    }
    // Ruth: a field at harvest, one who gleans and one who has seen her
    const fs = (g) => g.rect(3.2, GY - 0.13, 1.9, 0.13);
    wash(g, fs, PALETTE.gold, 0.5, 0.004);
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.lineCap = 'round';
    for (const [wx, wh, q, wd] of wheat()) { const sw = 0.012 * Math.sin(t * 1.6 + wx * 6); g.beginPath(); g.moveTo(wx, GY + wd * 0.3); g.quadraticCurveTo(wx + sw * 0.3, GY - wh * 0.5, wx + sw, GY - wh); g.stroke(); g.fillStyle = PALETTE.gold; g.beginPath(); g.ellipse(wx + sw, GY - wh - 0.008, 0.005, 0.014, sw * 8, 0, TAU); g.fill(); g.stroke(); }
    const bend = 0.5 + 0.5 * Math.sin(tl * 2.2);
    person(g, 3.82 + 0.03 * tl * 0.2, GY + 0.05, 0.19, { face: 1, arm: 0.35 + 0.3 * bend, lean: 0.16 + 0.14 * bend, salt: 330, wash: PALETTE.blue, washA: 0.45 });
    person(g, 4.48, GY + 0.03, 0.22, { face: -1, arm: 0.45, staff: true, salt: 331, wash: PALETTE.accent, washA: 0.35 });
    lineage(g, -2.4, lerp(-2.4, -0.62, run), GY);
    if (ft > 0.7) lineage(g, -0.62, lerp(-0.62, 0.7, EASE.inOut(A(ft, 0.7, 1.2))), GY);
    stroke(g, lp, 0.0065, PALETTE.accent, loopK);
    const on = A(tl, 10.4, 5.6); if (on > 0) { lineage(g, 3.1, lerp(3.1, 7.2, EASE.inOut(on)), GY); nib(g, lerp(3.1, 7.2, EASE.inOut(on)), GY); }
  });
  card(g, S, 'Walls fell. Judges rose.', t, CUES.c8 + 5.2, CUES.c8 + 10, -0.425, 0.058, { plate: true });
  place(g, S, 'JERICHO  ·  JOSHUA 6', t, CUES.c8 + 0.8, CUES.c8 + 5.8);
  place(g, S, 'BETHLEHEM  ·  RUTH 2', t, CUES.c8 + 12, CUES.c8 + 15.4);
}

// ------------------------------ C9 David ------------------------------
const zion = lazy(() => { const r = rng(231); return Array.from({ length: 38 }, (_, i) => ({ u: r(), up: r(), w: 0.05 + r() * 0.05, h: 0.035 + r() * 0.05, dome: r() > 0.7, tone: r() })).sort((a, b) => a.up - b.up); });
function crown(g, x, y, s) {
  const c = (g) => { g.moveTo(x - s, y); g.lineTo(x - s * 1.1, y - s * 0.8); g.lineTo(x - s * 0.55, y - s * 0.35); g.lineTo(x, y - s); g.lineTo(x + s * 0.55, y - s * 0.35); g.lineTo(x + s * 1.1, y - s * 0.8); g.lineTo(x + s, y); g.closePath(); };
  g.fillStyle = PALETTE.bg; g.beginPath(); c(g); g.fill(); wash(g, c, PALETTE.gold, 0.9, 0.002); g.strokeStyle = PALETTE.ink; g.lineWidth = s * 0.1; g.lineJoin = 'round'; g.beginPath(); c(g); g.stroke();
}
function c9_david(g, k, t, S) {
  // hold wide on the valley 3.6 s, whip right with the stone 0.5 s and settle; truck right 2 s ease-in-out and push in on the harp; truck right 2.5 s to the hill and crane up as the city builds; out 1.4 s ease-in
  const tl = t - CUES.c9, run = EASE.out(A(tl, 0, 2)), th = A(tl, 3.6, 0.45), fell = EASE.in(A(tl, 4.05, 1.0)), to2 = EASE.inOut(A(tl, 6.2, 2)), to3 = EASE.inOut(A(tl, 13, 2.5)), leave = EASE.in(A(tl, 20.6, 1.4));
  const cam = CAM.base(); cam.x = lerp(-0.7, 0, run) + 0.22 * EASE.out(th) * (1 - to2) + 2.2 * to2 + 2.1 * to3 + 1.3 * leave; cam.dist = 1.12 - 0.3 * to2 + 0.36 * to3; cam.y = -0.1 * to2 * (1 - to3) - 0.13 * to3;
  if (tl > 4.05) CAM.handheld(cam, t * 6, 2.6 * (1 - EASE.out(A(tl, 4.9, 1.2))) * (tl > 4.9 ? 1 : 0.2));
  const zh = (x) => GY - 0.34 * Math.exp(-(((x - 4.3) / 0.62) ** 2));
  chartPaper(g, S, cam, 10);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.2 - 0.16 * Math.exp(-(((x + 0.95) / 0.5) ** 2)) - 0.16 * Math.exp(-(((x - 0.95) / 0.5) ** 2)) - 0.03 * Math.sin(x * 2.2), -2.4, 7.4, 0.6, { ang: 0.08, gap: 0.012, salt: 232, wash: PALETTE.green, washA: 0.3 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002;    // two armies on two hills: rows of spears
    for (const s of [-1, 1]) for (let i = 0; i < 26; i++) { const sx = s * (0.62 + (i % 13) * 0.05), sy = 0.2 - 0.16 * Math.exp(-(((sx - s * 0.95) / 0.5) ** 2)) + (i > 12 ? 0.03 : 0), sh = 0.055 + 0.012 * Math.sin(t * 3 + i) * (1 - fell) + (s > 0 ? -0.02 * fell : 0.02 * fell); g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + s * -0.004, sy - sh); g.stroke(); g.beginPath(); g.arc(sx, sy - 0.012, 0.007, 0, TAU); g.fillStyle = PALETTE.bg; g.fill(); g.stroke(); }
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => (x > 3.2 ? zh(x) : GY) + 0.005 * Math.sin(x * 10), -2.4, 7.6, 0.7, { ang: 0.42, gap: 0.013, salt: 233, wash: PALETTE.green, washA: 0.3 });
    g.save(); g.beginPath(); g.rect(-0.2, GY + 0.03, 0.4, 0.07); g.clip(); wash(g, (g) => g.rect(-0.2, GY + 0.03, 0.4, 0.07), PALETTE.blue, 0.5, 0); waves(g, -0.2, 0.2, GY + 0.035, GY + 0.09, t, 3, 31); g.restore();   // the brook
    // Elah: the giant, the boy, the sling going round, one stone
    g.save(); g.translate(0.62, GY); g.rotate(1.47 * fell);
    const gh = person(g, 0, 0, 0.44, { face: -1, arm: 0.5 + 0.3 * Math.sin(tl * 2) * (1 - fell), salt: 234, wash: PALETTE.dim, washA: 0.65 });
    stroke(g, [[gh[0], gh[1] - 0.3], [gh[0], gh[1] + 0.26]], 0.007, PALETTE.ink); g.fillStyle = PALETTE.ink; g.beginPath(); g.moveTo(gh[0], gh[1] - 0.36); g.lineTo(gh[0] - 0.014, gh[1] - 0.3); g.lineTo(gh[0] + 0.014, gh[1] - 0.3); g.fill();
    const sh = (g) => g.ellipse(-0.06, -0.2, 0.05, 0.09, 0, 0, TAU); g.fillStyle = PALETTE.bg; g.beginPath(); sh(g); g.fill(); hatch(g, sh, { ang: 0.8, gap: 0.008, w: 0.0014, alpha: 0.8, box: [-0.12, -0.3, 0, -0.1], salt: 235, cross: true }); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.003; g.beginPath(); sh(g); g.stroke();
    g.restore();
    if (fell > 0.7) for (let j = 0; j < 5; j++) { const u = A(tl, 5 + j * 0.08, 1.4); if (u < 1) { g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.globalAlpha = 1 - u; g.beginPath(); g.arc(0.75 + j * 0.09, GY - 0.02 - 0.08 * u, 0.03 + 0.08 * u, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.globalAlpha = 1; } }
    const dh = person(g, -0.6, GY, 0.14, { face: 1, arm: th > 0 ? 0.55 : 0.85, salt: 236, wash: PALETTE.blue, washA: 0.45 });
    const head = [0.61, GY - 0.39], arcPt = (u) => [lerp(dh[0], head[0], u), lerp(dh[1], head[1], u) - 0.2 * Math.sin(u * Math.PI)];
    if (th <= 0) { const sa = -tl * tl * 2.2, sp = EASE.out(A(tl, 1.4, 1)); stroke(g, [dh, [dh[0] + Math.cos(sa) * 0.06 * sp, dh[1] + Math.sin(sa) * 0.06 * sp]], 0.0025, PALETTE.ink); nib(g, dh[0] + Math.cos(sa) * 0.06 * sp, dh[1] + Math.sin(sa) * 0.06 * sp, 0.007); }
    else { const pts = []; for (let j = 0; j <= 30; j++) pts.push(arcPt(j / 30)); stroke(g, pts, 0.004, PALETTE.accent, EASE.out(th)); if (th < 1) nib(g, ...arcPt(EASE.out(th)), 0.009); }
    // the harp: its strings are the line; a crown comes down
    const hx = 2.26, hy = 0.02, body = (g) => { g.moveTo(hx - 0.14, hy + 0.2); g.quadraticCurveTo(hx, hy + 0.3, hx + 0.14, hy + 0.2); g.lineTo(hx + 0.11, hy + 0.1); g.quadraticCurveTo(hx, hy + 0.16, hx - 0.11, hy + 0.1); g.closePath(); };
    const hk = EASE.out(A(tl, 6.6, 1.2));
    g.globalAlpha = hk; g.fillStyle = PALETTE.bg; g.beginPath(); body(g); g.fill(); wash(g, body, PALETTE.gold, 0.7, 0.004); hatch(g, body, { ang: 0.2, gap: 0.008, w: 0.0013, alpha: 0.7, box: [hx - 0.15, hy + 0.1, hx + 0.15, hy + 0.3], salt: 237 });
    g.strokeStyle = PALETTE.ink; g.lineWidth = 0.004; g.beginPath(); body(g); g.stroke();
    for (const s of [-1, 1]) stroke(g, [[hx + s * 0.125, hy + 0.14], [hx + s * 0.19, hy - 0.05], [hx + s * 0.15, hy - 0.26], [hx + s * 0.17, hy - 0.3]], 0.014, PALETTE.ink, hk);
    stroke(g, [[hx - 0.2, hy - 0.26], [hx + 0.2, hy - 0.26]], 0.012, PALETTE.ink, hk); g.globalAlpha = 1;
    for (let i = 0; i < 10; i++) {
      const sx = hx - 0.108 + i * 0.024, sk = EASE.out(A(tl, 7.4 + i * 0.22, 0.4)); if (sk <= 0) continue;
      const since = ((tl - 9.6 - i * 0.31) % 3.1 + 3.1) % 3.1, amp = tl > 9.6 + i * 0.31 ? 0.008 * Math.exp(-since * 2.2) * Math.sin(since * 46) : 0, pts = [];
      for (let j = 0; j <= 12; j++) { const u = j / 12; pts.push([sx + amp * Math.sin(u * Math.PI), lerp(hy - 0.255, hy + 0.13, u)]); }
      stroke(g, pts, 0.0036, PALETTE.accent, sk);
    }
    const ck = EASE.out(A(tl, 10.6, 1.6)), kingX = 1.86;
    const kh = person(g, kingX, GY, 0.25, { face: 1, arm: 0.62 + 0.06 * Math.sin(tl * 4), salt: 238, wash: PALETTE.blue, washA: 0.45 + 0.2 * ck });
    if (ck > 0) { glow(g, kingX + 0.005, GY - 0.3, 0.16 * ck, 0.6); crown(g, kingX + 0.004, GY - 0.245 - 0.3 * (1 - MOTION.back(A(tl, 10.6, 1.4), 1.2)), 0.024); }
    // Jerusalem: a hill takes on a wall and fills with houses
    zion().forEach((h, i) => {
      const bk = EASE.out(A(tl, 14.6 + i * 0.11, 0.5)); if (bk <= 0) return;
      const x = 3.82 + h.u * 0.96, base = zh(x + h.w / 2) + 0.012 + (1 - h.up) * 0.0, y = base - h.h * bk - h.up * 0.035;
      g.globalAlpha = bk; block(g, x, y, h.w, h.h * bk + 0.03, 240 + i, { wash: h.tone > 0.5 ? PALETTE.gold : PALETTE.dim, washA: 0.35, hatch: h.tone > 0.3 });
      g.fillStyle = PALETTE.ink; g.fillRect(x + h.w * 0.4, y + h.h * 0.3, h.w * 0.16, h.h * 0.3);
      if (h.dome) { g.beginPath(); g.arc(x + h.w / 2, y, h.w * 0.32, Math.PI, 0); g.fillStyle = PALETTE.bg; g.fill(); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.002; g.stroke(); }
      g.globalAlpha = 1;
    });
    const wk = EASE.inOut(A(tl, 14, 3));                 // the wall along the foot of the city, with its gate
    for (let i = 0; i < 22 * wk; i++) { const x = 3.66 + i * 0.058, y = zh(x + 0.029) + 0.075 * Math.exp(-(((x - 4.3) / 0.75) ** 4)); block(g, x, y - 0.052, 0.058, 0.07, 280 + i, { wash: PALETTE.gold, washA: 0.3 }); if (i % 2 === 0) block(g, x + 0.012, y - 0.07, 0.03, 0.02, 281, { hatch: false }); }
    lineage(g, -2.4, lerp(-2.4, -0.62, run), GY);
    const on = A(tl, 5, 2.6); if (on > 0) lineage(g, 0.62, lerp(0.62, 1.86, EASE.inOut(on)), GY);
    const up = A(tl, 13.2, 3); if (up > 0) { const pts = []; for (let j = 0; j <= 50; j++) { const x = lerp(1.86, 4.3, j / 50); pts.push([x, (x > 3.2 ? zh(x) + 0.02 + 0.07 * Math.exp(-(((x - 4.3) / 0.75) ** 4)) : GY)]); } stroke(g, pts, 0.0065, PALETTE.accent, EASE.inOut(up)); }
    const out = A(tl, 19.6, 2.4); if (out > 0) { const pts = []; for (let j = 0; j <= 50; j++) { const x = lerp(4.3, 7.4, j / 50); pts.push([x, (x < 5.6 ? zh(x) + 0.02 + 0.07 * Math.exp(-(((x - 4.3) / 0.75) ** 4)) : GY)]); } stroke(g, pts, 0.0065, PALETTE.accent, EASE.in(out)); }
  });
  card(g, S, 'A shepherd became king.', t, CUES.c9 + 8.4, CUES.c9 + 13, -0.425, 0.058, { plate: true });
  place(g, S, 'ELAH  ·  1 SAMUEL 17', t, CUES.c9 + 0.8, CUES.c9 + 5.8);
  place(g, S, 'JERUSALEM  ·  2 SAMUEL 5', t, CUES.c9 + 15.4, CUES.c9 + 21);
}

// ------------------------------ C10 Solomon: the Temple, and the whole chart ------------------------------
const STATIONS = ['EDEN', 'THE FLOOD', 'BABEL', 'ABRAHAM', 'JOSEPH', 'THE SEA', 'SINAI', 'JERICHO', 'DAVID'];
function medallion(g, i, x, y, s, t) {                // the small plates of the whole chart
  g.save(); g.beginPath(); g.arc(x, y, s, 0, TAU); g.fillStyle = PALETTE.bg; g.fill(); g.strokeStyle = PALETTE.ink; g.lineWidth = s * 0.035; g.stroke(); g.beginPath(); g.arc(x, y, s * 0.92, 0, TAU); g.lineWidth = s * 0.012; g.stroke();
  g.beginPath(); g.arc(x, y, s * 0.9, 0, TAU); g.clip();
  const gy = y + s * 0.45;
  if (i !== 5) land(g, () => gy, x - s, x + s, y + s, { ang: 0.42, gap: s * 0.06, salt: 400 + i, wash: i === 0 || i === 8 ? PALETTE.green : PALETTE.gold, washA: 0.35, fill: false });
  if (i === 0) { stroke(g, [[x, gy], [x, y - s * 0.1]], s * 0.07, PALETTE.ink); for (const [dx, dy] of [[-0.28, -0.2], [0.28, -0.2], [0, -0.45]]) { wash(g, (g) => g.arc(x + dx * s, y + dy * s, s * 0.27, 0, TAU), PALETTE.green, 0.6, 0); g.beginPath(); g.arc(x + dx * s, y + dy * s, s * 0.27, 0, TAU); g.lineWidth = s * 0.02; g.stroke(); } nib(g, x + s * 0.2, y - s * 0.05, s * 0.07); }
  if (i === 1) { g.save(); g.beginPath(); g.rect(x - s, y + s * 0.2, 2 * s, s); g.clip(); wash(g, (g) => g.rect(x - s, y + s * 0.2, 2 * s, s), PALETTE.blue, 0.6, 0); waves(g, x - s, x + s, y + s * 0.25, y + s * 0.8, t, 4, 51); g.restore(); ark(g, x, y + s * 0.22, s * 0.5); }
  if (i === 2) for (let n = 0; n < 5; n++) block(g, x - s * (0.5 - n * 0.09), gy - s * 0.2 * (n + 1), s * (1 - n * 0.18), s * 0.2, 410 + n, { wash: PALETTE.accent, washA: 0.35, gap: s * 0.05 });
  if (i === 3) { night(g, x - s, y - s, 2 * s, s * 1.45, 1, 415); for (let n = 0; n < 12; n++) { g.fillStyle = STARLIGHT; g.beginPath(); g.arc(x + (hash1(420 + n) - 0.5) * 1.5 * s, y - s * (0.15 + 0.7 * hash1(440 + n)), s * 0.03, 0, TAU); g.fill(); } g.fillStyle = PALETTE.accent; g.beginPath(); g.moveTo(x - s * 0.4, gy); g.lineTo(x, gy - s * 0.45); g.lineTo(x + s * 0.4, gy); g.fill(); }
  if (i === 4) { pyramid(g, x - s * 0.1, gy, s * 0.55, 450); pyramid(g, x + s * 0.5, gy, s * 0.3, 452); }
  if (i === 5) { wash(g, (g) => g.rect(x - s, y - s * 0.3, 2 * s, 2 * s), PALETTE.blue, 0.6, 0); waves(g, x - s, x + s, y - s * 0.25, y + s, t, 7, 55); const p = (g) => { g.moveTo(x - s * 0.04, y - s * 0.3); g.lineTo(x - s * 0.4, y + s); g.lineTo(x + s * 0.4, y + s); g.lineTo(x + s * 0.04, y - s * 0.3); g.closePath(); }; g.fillStyle = PALETTE.bg; g.beginPath(); p(g); g.fill(); wash(g, p, PALETTE.gold, 0.3, 0); g.lineWidth = s * 0.025; g.beginPath(); p(g); g.stroke(); }
  if (i === 6) { const m = (g) => { g.moveTo(x - s * 0.75, gy); g.lineTo(x, y - s * 0.55); g.lineTo(x + s * 0.75, gy); g.closePath(); }; g.fillStyle = PALETTE.bg; g.beginPath(); m(g); g.fill(); wash(g, m, PALETTE.dim, 0.5, 0); hatch(g, m, { ang: 1, gap: s * 0.05, w: s * 0.012, alpha: 0.6, box: [x - s, y - s, x + s, y + s], salt: 460, cross: true }); g.lineWidth = s * 0.025; g.beginPath(); m(g); g.stroke(); glow(g, x, y - s * 0.55, s * 0.4, 0.6, '179,38,30'); }
  if (i === 7) for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { g.save(); g.translate(x - s * 0.62 + c * s * 0.31 + (r % 2) * s * 0.1, gy - s * 0.17 * (r + 0.5) - (r === 2 ? s * 0.12 * hash1(470 + c) : 0)); g.rotate(r === 2 ? (hash1(480 + c) - 0.5) * 1.4 : 0); block(g, -s * 0.15, -s * 0.085, s * 0.3, s * 0.17, 470 + r * 5 + c, { wash: PALETTE.gold, washA: 0.3, gap: s * 0.05 }); g.restore(); }
  if (i === 8) { for (const sg of [-1, 1]) stroke(g, [[x + sg * s * 0.3, gy - s * 0.1], [x + sg * s * 0.42, y - s * 0.2], [x + sg * s * 0.34, y - s * 0.55]], s * 0.06, PALETTE.ink); stroke(g, [[x - s * 0.45, y - s * 0.5], [x + s * 0.45, y - s * 0.5]], s * 0.05, PALETTE.ink); for (let n = 0; n < 6; n++) stroke(g, [[x - s * 0.25 + n * s * 0.1, y - s * 0.48], [x - s * 0.25 + n * s * 0.1, gy - s * 0.1]], s * 0.022, PALETTE.accent); }
  g.restore();
}
function c10_solomon(g, k, t, S) {
  // truck right with the line 2.4 s ease-out, crane up slowly as the courses rise; hold on the plumb line; the one big pull back 6 s ease-in-out to the whole chart; drift
  const tl = t - CUES.c10, run = EASE.out(A(tl, 0, 2.4)), build = A(tl, 0.6, 6.6), gold = EASE.out(A(tl, 8.5, 3.2)), back = EASE.inOut(A(tl, 12.4, 6)), drift = A(tl, 18.4, 5.6);
  const cam = CAM.base(); cam.x = lerp(-0.9, 0, run) - 3.78 * back; cam.y = -0.1 * EASE.inOut(A(tl, 1, 7)) * (1 - back) + 0.02 * back; cam.dist = 1.12 + 4.2 * back + 0.14 * drift;
  const base = GY - 0.09, topY = base - 9 * 0.045, drop = EASE.out(A(tl, 6.5, 1.0)), sw = 0.2 * Math.exp(-1.6 * Math.max(0, tl - 6.5)) * Math.cos(5.2 * (tl - 6.5)) * (tl > 6.5 ? 1 : 0);
  chartPaper(g, S, cam, 11, 2.2 + 1.9 * cam.dist);
  plane(g, S, cam, 0.28, (g) => {
    land(g, (x) => 0.19 - 0.045 * Math.sin(x * 1.5 + 1) - 0.02 * Math.sin(x * 4), -3, 2.4, 0.6, { ang: 0.08, gap: 0.012, salt: 341, wash: PALETTE.green, washA: 0.3 });
    if (gold > 0) { g.save(); g.strokeStyle = PALETTE.gold; g.lineCap = 'round'; for (let i = 0; i < 30; i++) { const a = -Math.PI * (i + 0.5) / 30, r1 = (0.5 + 0.5 * hash1(350 + i)) * 1.2 * gold; g.globalAlpha = 0.5; g.lineWidth = 0.012; g.beginPath(); g.moveTo(Math.cos(a) * 0.4, 0.05 + Math.sin(a) * 0.4); g.lineTo(Math.cos(a) * (0.4 + r1), 0.05 + Math.sin(a) * (0.4 + r1)); g.stroke(); } g.restore(); }
  });
  plane(g, S, cam, 0, (g) => {
    land(g, (x) => GY + 0.005 * Math.sin(x * 10), -9.6, 2.6, 0.7, { ang: 0.42, gap: 0.013, salt: 342, wash: PALETTE.gold, washA: 0.28 });
    // the whole chart: every plate again, small, on the one line
    if (back > 0.02) STATIONS.forEach((name, i) => {
      const x = -7.65 + i * 0.85, mk = MOTION.back(A(tl, 13 + (8 - i) * 0.42, 0.6), 1.2);
      if (mk <= 0) return;
      medallion(g, i, x, GY - 0.02, 0.31 * mk, t);
      text(g, S, name, x, i % 2 ? GY + 0.56 : GY - 0.56, 0.17, PALETTE.ink, clamp(mk), 0.06, { role: 'text', weight: 700 });
    });
    lineage(g, -9.6, lerp(-2, -0.62, run), GY, 0.007 + 0.012 * back);
    // the Temple: three steps, nine courses, two pillars, a door
    const stones = [];
    for (let s = 0; s < 3; s++) for (let c = 0; c < 10 - s; c++) stones.push([-0.5 + s * 0.05 + c * 0.1, GY - 0.03 * (s + 1), 0.1, 0.03]);
    for (let r = 0; r < 9; r++) for (let c = 0; c < 8; c++) { const x = -0.28 + c * 0.07 + (r % 2 ? 0.035 : 0); if (Math.abs(x + 0.035) < 0.06 && r < 6) continue; stones.push([Math.max(-0.28, x - (r % 2 && c === 0 ? 0.035 : 0)), base - 0.045 * (r + 1), r % 2 && c === 7 ? 0.035 : 0.07, 0.045]); }
    for (const s of [-1, 1]) for (let r = 0; r < 5; r++) for (let c = 0; c < 2; c++) stones.push([s * 0.35 - 0.07 + c * 0.07, base - 0.045 * (r + 1), 0.07, 0.045]);
    stones.forEach(([x, y, w, h], i) => { const bk = clamp(build * stones.length * 1.08 - i); if (bk <= 0) return; g.globalAlpha = bk; block(g, x, y - 0.04 * (1 - EASE.out(bk)), w, h, 500 + i, { wash: PALETTE.gold, washA: 0.2 + 0.6 * gold, hatch: i % 2 === 0 }); g.globalAlpha = 1; });
    g.fillStyle = PALETTE.ink; g.beginPath(); g.moveTo(-0.055, base); g.lineTo(-0.055, base - 0.24); g.arc(0, base - 0.24, 0.055, Math.PI, 0); g.lineTo(0.055, base); g.fill();     // the door
    glow(g, 0, base - 0.14, 0.2 * gold, 0.9);
    const pk = EASE.out(A(tl, 5.2, 1.6));
    for (const s of [-1, 1]) { const px = s * 0.19; if (pk <= 0) continue; block(g, px - 0.02, base - 0.3 * pk, 0.04, 0.3 * pk, 600 + s, { wash: PALETTE.gold, washA: 0.5 + 0.4 * gold, gap: 0.005 }); block(g, px - 0.032, base - 0.3 * pk - 0.03, 0.064, 0.03, 602, { wash: PALETTE.gold, washA: 0.8, hatch: false }); block(g, px - 0.03, base - 0.012, 0.06, 0.012, 603, { hatch: false }); }
    const ck = EASE.out(A(tl, 6.8, 1));
    if (ck > 0) { g.globalAlpha = ck; block(g, -0.3, topY - 0.022, 0.6, 0.022, 604, { wash: PALETTE.gold, washA: 0.5 + 0.4 * gold, hatch: false }); for (let i = 0; i < 12; i++) block(g, -0.295 + i * 0.05, topY - 0.045, 0.03, 0.023, 605 + i, { wash: PALETTE.gold, washA: 0.4 + 0.5 * gold, hatch: false }); g.globalAlpha = 1; }
    const work = 1 - EASE.inOut(A(tl, 6.6, 1.4));         // scaffold, cedar and hands, gone once the last course is on
    if (work > 0) {
      g.globalAlpha = work; for (const x of [-0.42, -0.34]) stroke(g, [[x, GY], [x, -0.44]], 0.004, PALETTE.ink); for (let i = 1; i < 12; i++) stroke(g, [[-0.42, GY - i * 0.058], [-0.34, GY - i * 0.058]], 0.0025, PALETTE.ink);
      stroke(g, [[-0.44, -0.44], [0.02, -0.44]], 0.005, PALETTE.ink);
      for (let i = 0; i < 4; i++) { const hx = 0.62 + (i % 2) * 0.16 + 0.03 * Math.sin(tl * 1.4 + i), hy = i < 2 ? GY : GY; const hnd = person(g, hx - (i > 1 ? 1.5 : 0), hy, 0.12, { face: i > 1 ? 1 : -1, arm: 0.5 + 0.3 * Math.sin(tl * 3 + i), lean: 0.12, p: tl * 0.8 + i * 0.4, salt: 610 + i }); block(g, hnd[0] - 0.02, hnd[1] - 0.03, 0.045, 0.028, 614 + i, { wash: PALETTE.gold, washA: 0.3, hatch: false }); }
      for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(0.95 + (i % 3) * 0.045 + (i > 2 ? 0.022 : 0), GY - 0.02 - (i > 2 ? 0.036 : 0), 0.022, 0.02, 0, 0, TAU); g.fillStyle = PALETTE.bg; g.fill(); g.strokeStyle = PALETTE.ink; g.lineWidth = 0.0025; g.stroke(); g.beginPath(); g.arc(0.95 + (i % 3) * 0.045 + (i > 2 ? 0.022 : 0), GY - 0.02 - (i > 2 ? 0.036 : 0), 0.009, 0, TAU); g.stroke(); }
      g.globalAlpha = 1;
    }
    // the line's last move: up the scaffold, along the beam, and straight down as a plumb line
    const rise = A(tl, 2.6, 2.6), along = A(tl, 5.2, 1.2), LW = 0.0065 + 0.004 * back;
    stroke(g, [[-0.62, GY], [-0.38, GY], [-0.38, -0.44]], LW, PALETTE.accent, EASE.inOut(rise));
    stroke(g, [[-0.38, -0.44], [0, -0.44]], LW, PALETTE.accent, EASE.inOut(along));
    if (drop > 0) { const L = 0.5 * drop, bx = Math.sin(sw) * L, by = -0.44 + Math.cos(sw) * L; stroke(g, [[0, -0.44], [bx, by]], LW, PALETTE.accent); g.fillStyle = PALETTE.accent; g.beginPath(); g.moveTo(bx - 0.016, by); g.lineTo(bx + 0.016, by); g.lineTo(bx, by + 0.045); g.closePath(); g.fill(); g.beginPath(); g.arc(bx, by, 0.016, Math.PI, 0); g.fill(); }
    if (back > 0.02) {
      text(g, S, 'THE TEMPLE', 0, GY + 0.56, 0.17, PALETTE.ink, clamp(back * 2), 0.06, { role: 'text', weight: 700 });
      g.strokeStyle = PALETTE.ink; g.globalAlpha = clamp(back * 1.5 - 0.3); g.lineWidth = 0.014; g.strokeRect(-8.45, -2.25, 9.55, 4.4); g.lineWidth = 0.006; g.strokeRect(-8.38, -2.18, 9.41, 4.26);
      g.lineWidth = 0.005; g.beginPath(); for (let i = 0; i <= 188; i++) { const x = -8.38 + i * 0.05, h = i % 10 === 0 ? 0.09 : i % 5 === 0 ? 0.06 : 0.035; g.moveTo(x, -1.02); g.lineTo(x, -1.02 + h); g.moveTo(x, 1.2); g.lineTo(x, 1.2 - h); } g.moveTo(-8.38, -1.02); g.lineTo(1.03, -1.02); g.moveTo(-8.38, 1.2); g.lineTo(1.03, 1.2); g.stroke(); g.globalAlpha = 1;
      text(g, S, 'From a Garden to a Temple', -3.68, -1.56, 0.5, PALETTE.ink, 1, null, { weight: 400, reveal: A(tl, 17.2, 2), by: 'word', spread: 0.7 });
      text(g, S, 'ADAM  ·  NOAH  ·  ABRAHAM  ·  ISAAC  ·  JACOB  ·  JOSEPH  ·  MOSES  ·  JOSHUA  ·  RUTH  ·  DAVID  ·  SOLOMON', -3.68, 1.68, 0.165, PALETTE.ink, EASE.out(A(tl, 19.4, 1.4)), 0.05, { role: 'text', weight: 400 });
    }
  });
  place(g, S, 'JERUSALEM  ·  1 KINGS 6', t, CUES.c10 + 1, CUES.c10 + 11.6);
}

