// 김 서린 유리창 렌더러 (스타일 A: Styles-20 #19 Grainy Gradient 계열).
// HyperFrames 결정론 규칙: 모든 프레임은 render(state)에 넘긴 값만으로 그린다. 누적 상태, Math.random, 시계 없음.
// 쓰는 법: const fg = FogGlass.create(canvas, { seed }); fg.render({ t, cam, trail, sweep, refog, writing, droplet });
(function () {
  const W = 1920, H = 1080, M = 0.12;            // 화면 크기, 카메라 여유(세계는 화면보다 상하좌우 12% 넓다)
  const WW = Math.round(W * (1 + 2 * M)), WH = Math.round(H * (1 + 2 * M));
  const OX = W * M, OY = H * M;                   // 화면 좌표(0~1) → 세계 좌표 원점 이동
  const wx = fx => OX + fx * W, wy = fy => OY + fy * H;
  const TAU = Math.PI * 2;

  const prng = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const canvas = (w = WW, h = WH) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  // 창밖: 해 질 녘 하늘과 깊이가 다른 도시 네 겹. 먼 겹일수록 하늘색에 묻히고 흐리며,
  // 초점이 유리에 있는 것처럼 도시 전체가 살짝 흐리다(벡터 건물이 사진 속 배경 흐림으로 읽히게).
  function drawScene(rng) {
    const c = canvas(), s = c.getContext('2d');
    const sky = s.createLinearGradient(0, 0, 0, WH);
    sky.addColorStop(0, '#22233a'); sky.addColorStop(0.42, '#564760'); sky.addColorStop(0.66, '#b27b6a'); sky.addColorStop(0.8, '#dda472');
    s.fillStyle = sky; s.fillRect(0, 0, WW, WH);
    const glow = s.createRadialGradient(WW * 0.7, WH * 0.73, 0, WW * 0.7, WH * 0.73, WW * 0.42);
    glow.addColorStop(0, 'rgba(255,196,128,0.42)'); glow.addColorStop(1, 'rgba(255,196,128,0)');
    s.fillStyle = glow; s.fillRect(0, 0, WW, WH);

    const winLights = [];
    const layer = (base, minH, maxH, color, litP, blur, haze) => {
      const L = canvas(), l = L.getContext('2d');
      let x = -20;
      while (x < WW + 20) {
        const w = 40 + rng() * 150, h = minH + rng() * (maxH - minH), top = base - h;
        l.fillStyle = color; l.fillRect(x, top, w, WH);
        if (rng() < 0.35) l.fillRect(x + w * (0.2 + rng() * 0.5), top - 14 - rng() * 30, 2 + rng() * 2, 46);   // 옥상 안테나·물탱크
        if (rng() < 0.25) l.fillRect(x + w * 0.15, top - 10, w * 0.3, 12);
        if (litP) for (let fy = top + 14 + rng() * 10; fy < base - 8; fy += 20 + rng() * 12) {
          if (rng() > litP) continue;
          const n = 1 + (rng() * 3 | 0);
          for (let k = 0; k < n; k++) {
            const lx = x + 6 + rng() * (w - 18), lw = 4 + rng() * 9, a = 0.3 + rng() * 0.6;
            l.fillStyle = `rgba(255,${185 + rng() * 45 | 0},${105 + rng() * 45 | 0},${a})`;
            l.fillRect(lx, fy, lw, 6 + rng() * 6);
            if (a > 0.75 && rng() < 0.25) winLights.push({ x: lx + lw / 2, y: fy, r: 18 + rng() * 26, ph: rng() * TAU, ord: rng() });
          }
        }
        x += w + 1 + rng() * 8;
      }
      s.filter = `blur(${blur}px)`; s.drawImage(L, 0, 0); s.filter = 'none';
      if (haze) {                                          // 겹 사이 대기: 지평선 쪽 따뜻한 안개
        const g = s.createLinearGradient(0, base - maxH, 0, base);
        g.addColorStop(0, 'rgba(214,160,128,0)'); g.addColorStop(1, `rgba(214,160,128,${haze})`);
        s.fillStyle = g; s.fillRect(0, base - maxH, WW, maxH);
      }
    };
    layer(WH * 0.70, 60, 200, '#6b5670', 0, 5, 0.30);
    layer(WH * 0.77, 100, 300, '#463b52', 0.18, 3, 0.22);
    layer(WH * 0.86, 140, 430, '#262030', 0.5, 1.6, 0.10);
    layer(WH * 0.98, 60, 200, '#16121b', 0.35, 1.2, 0);

    const out = canvas(), o = out.getContext('2d');       // 초점은 유리에: 도시 전체를 아주 살짝 흐리게
    o.filter = 'blur(1.4px)'; o.drawImage(c, 0, 0); o.filter = 'none';
    const lights = [];                                     // 거리 불빛(보케)
    for (let i = 0; i < 34; i++) lights.push({ x: rng() * WW, y: WH * (0.79 + rng() * 0.17), r: 10 + rng() * 34, ph: rng() * TAU, ord: rng() });
    return { c: out, lights, winLights };
  }

  // 김: 흐린 창밖 + 우윳빛 막 + 결로. 결로는 아주 작은 점(대부분)과 드문 큰 물방울 두 층
  function drawFogBase(scene, rng) {
    const c = canvas(), f = c.getContext('2d');
    f.filter = 'blur(34px)'; f.drawImage(scene, 0, 0); f.filter = 'none';
    f.fillStyle = 'rgba(224,214,202,0.58)'; f.fillRect(0, 0, WW, WH);
    for (let i = 0; i < 26000; i++) {
      const x = rng() * WW, y = rng() * WH, r = 0.4 + rng() * 1.1;
      f.fillStyle = rng() < 0.55 ? 'rgba(255,250,242,0.16)' : 'rgba(70,60,60,0.06)';
      f.beginPath(); f.arc(x, y, r, 0, TAU); f.fill();
    }
    for (let i = 0; i < 1400; i++) {
      const x = rng() * WW, y = rng() * WH, r = 1.4 + rng() * 2.4;
      const g = f.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,252,246,0.35)'); g.addColorStop(1, 'rgba(120,104,110,0.08)');
      f.fillStyle = g; f.beginPath(); f.arc(x, y, r, 0, TAU); f.fill();
    }
    return c;
  }

  function grainTiles(rng) {
    return Array.from({ length: 6 }, () => {
      const c = canvas(256, 256), g = c.getContext('2d'), img = g.createImageData(256, 256), d = img.data;
      for (let i = 0; i < d.length; i += 4) { const v = 128 + (rng() - 0.5) * 90; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      g.putImageData(img, 0, 0); return c;
    });
  }

  // 큰 바람이 쓸고 가는 스탬프 목록(미리 계산, 진행도로 앞에서부터 잘라 쓴다)
  function sweepStamps(rng, opt) {
    const st = [];
    for (let t = 0; t <= 1; t += 0.004) {
      st.push({
        t, x: -0.06 + t * 1.12,
        y: opt.y + 0.02 * Math.sin(t * 4.1) - 0.02 * t + (rng() - 0.5) * 0.08,
        r: opt.r + 0.05 * Math.sin(t * 9.1 + 1.3) + rng() * 0.05,
        bead: [rng(), rng(), rng(), rng()],
      });
    }
    return st;
  }
  // 바람결: 닦이기 직전 김이 밀리는 가로 결(앞쪽)과, 닦인 자리에 남는 가로 얼룩(뒤쪽)
  function windLines(rng, n) {
    return Array.from({ length: n }, () => ({ u: rng(), y: 0.22 + rng() * 0.58, len: 0.04 + rng() * 0.16, w: 1 + rng() * 3, a: 0.05 + rng() * 0.12, light: rng() < 0.6 }));
  }

  function stamp(m, x, y, r, hard) {
    const g = m.createRadialGradient(x, y, r * hard, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = g; m.beginPath(); m.arc(x, y, r, 0, TAU); m.fill();
  }

  // 획 목록에서 진행도만큼의 부분 경로를 돌려준다(길이 기준). 각 점에 획 안에서의 위치 u(0~1)를 붙인다.
  function partial(strokes, p) {
    const lens = strokes.map(s => s.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - s[i][0], q[1] - s[i][1]), 0));
    let left = p * lens.reduce((a, b) => a + b, 0);
    const out = [];
    strokes.forEach((s, k) => {
      if (left <= 0) return;
      const seg = [[s[0][0], s[0][1], 0]];
      let run = 0;
      for (let i = 1; i < s.length && left > 0; i++) {
        const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
        const take = Math.min(d, left), u = take / d;
        run += take; left -= take;
        seg.push([s[i - 1][0] + (s[i][0] - s[i - 1][0]) * u, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * u, run / lens[k]]);
      }
      if (seg.length > 1) out.push({ seg, k });
    });
    return out;
  }

  function create(target, { seed = 7, sweep = { y: 0.5, r: 0.27 } } = {}) {
    const rng = prng(seed);
    const scene = drawScene(rng);
    const fogBase = drawFogBase(scene.c, rng);
    const tiles = grainTiles(rng);
    const stamps = sweepStamps(rng, sweep);
    const ahead = windLines(rng, 140), smears = windLines(rng, 110);
    const mask = canvas(), m = mask.getContext('2d');
    const fog = canvas(), f = fog.getContext('2d');
    const sm = canvas(), smc = sm.getContext('2d');
    const tc = canvas(), tcc = tc.getContext('2d');
    const ctx = target.getContext('2d');

    function render(st) {
      const t = st.t || 0, cam = st.cam || { x: 0, y: 0, zoom: 1 };
      const on = L => L.ord <= (st.lightsOn ?? 1);         // 불빛이 하나둘 켜짐(정해진 순서)
      const sweepP = st.sweep ? st.sweep.progress : 0;
      const front = -0.06 + 1.12 * sweepP + 0.13;          // 큰 바람이 닦은 자리의 앞쪽 가장자리(화면 폭 비율)
      const wet = 1 - (st.refog || 0);                      // 김이 다시 덮이면 바람 얼룩과 가장자리 물방울도 함께 사라진다

      // 1) 닦인 자리 마스크: 좁은 첫 바람 자국, 큰 바람, 물방울 자국, 손가락 글씨
      m.globalCompositeOperation = 'source-over'; m.globalAlpha = 1;
      m.clearRect(0, 0, WW, WH);
      if (st.trail) {
        const p = st.trail.progress, y = wy(st.trail.y ?? 0.7), hh = (st.trail.h ?? 0.12) * H;
        for (let x = -0.05; x <= -0.05 + 1.1 * p; x += 0.006) stamp(m, wx(x), y + Math.sin(x * 13) * hh * 0.12, hh * 0.62, 0.45);
      }
      // 큰 바람: 가로로 늘인 스탬프라 자국이 바람 방향으로 결이 지고, 다 닦이지 않아 엷은 김이 10% 남는다
      if (sweepP > 0) {
        m.globalAlpha = 0.9;
        for (const s of stamps) {
          if (s.t > sweepP) break;
          m.save(); m.translate(wx(s.x), wy(s.y)); m.scale(1.7, 1); stamp(m, 0, 0, s.r * H * 0.78, 0.5); m.restore();
        }
        m.globalAlpha = 1;
      }
      if (st.droplet) {                                     // 물방울이 지나간 자국: 물방울보다 가늘고 엷다
        const d = st.droplet;
        for (let y = d.y0; y < d.y; y += 0.0015) {
          const k = (y - d.y0) * 900, w = d.r * H * (0.3 + 0.04 * Math.sin(k * 0.35) + 0.02 * Math.sin(k * 1.3));
          m.fillStyle = 'rgba(0,0,0,0.3)'; m.beginPath(); m.arc(wx(d.x + 0.0007 * Math.sin(k * 0.21)), wy(y), w, 0, TAU); m.fill();
        }
      }
      // 2) 다시 서리는 김: 가장자리부터 안쪽으로 마스크를 지운다(r=1이면 전부)
      if (st.refog) {
        const r = st.refog, cx = WW / 2, cy = WH / 2, R = Math.hypot(W, H) * 0.62;
        // 가장자리 폭은 늘 넓게(0.22R) 두고, 마지막 남은 구멍은 0.8 이후 전체가 함께 옅어진다(작은 원판이 남지 않게)
        const inner = R * 1.1 * (1 - r), outer = inner + R * 0.22 + 1;
        const g = m.createRadialGradient(cx, cy, inner, cx, cy, outer);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
        m.globalCompositeOperation = 'destination-out'; m.fillStyle = g; m.fillRect(0, 0, WW, WH);
        if (r > 0.8) { m.globalAlpha = Math.min(1, (r - 0.8) / 0.2); m.fillStyle = '#000'; m.fillRect(0, 0, WW, WH); m.globalAlpha = 1; }
        m.globalCompositeOperation = 'source-over';
      }
      // 손가락 글씨: 시작에 물이 고여 굵고, 가운데서 가늘어지고, 손끝 압력이 흔들린다
      const drips = [];
      if (st.writing) {
        const w = st.writing, base = w.width * H;
        m.fillStyle = '#000';
        for (const { seg, k } of partial(w.strokes, w.progress)) {
          for (let i = 1; i < seg.length; i++) {
            const [x0, y0, u0] = seg[i - 1], [x1, y1, u1] = seg[i];
            const steps = Math.max(1, Math.ceil(Math.hypot((x1 - x0) * W, (y1 - y0) * H) / 2));
            for (let j = 0; j <= steps; j++) {
              const a = j / steps, u = u0 + (u1 - u0) * a;
              const r = base * 0.5 * (1.18 - 0.22 * Math.sin(Math.PI * u) + 0.07 * Math.sin(u * 23 + k * 1.7));
              m.beginPath(); m.arc(wx(x0 + (x1 - x0) * a), wy(y0 + (y1 - y0) * a), r, 0, TAU); m.fill();
            }
          }
        }
        // 획 끝에서 흘러내리는 물줄기(엔드 홀드 동안 김과 함께 아주 작게 산다)
        if (w.drip > 0) for (const o of w.strokes.drips || []) {
          const len = o.len * Math.min(1, w.drip * o.speed);
          m.lineCap = 'round'; m.strokeStyle = 'rgba(0,0,0,0.85)'; m.lineWidth = base * 0.32;
          m.beginPath(); m.moveTo(wx(o.x), wy(o.y)); m.lineTo(wx(o.x + 0.0006), wy(o.y + len)); m.stroke();
          drips.push({ x: wx(o.x + 0.0006), y: wy(o.y + len), r: base * 0.3 });
        }
      }

      if (st.title && st.title.glyph && st.title.progress > 0) {
        const T = st.title, g = T.glyph, gx = wx(T.x) - g.width / 2, gy = wy(T.y) - g.height / 2;
        const fx = gx + (g.width + 120) * T.progress - 60;       // 드러나는 앞쪽 가장자리(부드러운 폭 120px)
        tcc.globalCompositeOperation = 'source-over'; tcc.clearRect(0, 0, WW, WH);
        tcc.drawImage(g, gx, gy);
        const lg = tcc.createLinearGradient(fx - 60, 0, fx + 60, 0);
        lg.addColorStop(0, 'rgba(0,0,0,1)'); lg.addColorStop(1, 'rgba(0,0,0,0)');
        tcc.globalCompositeOperation = 'destination-in'; tcc.fillStyle = lg; tcc.fillRect(0, 0, WW, WH);
        m.drawImage(tc, 0, 0);
      }
      // 3) 김 = 기본 김(+ 김 너머 번지는 불빛) − 마스크. 숨쉬듯 아주 작게 농도가 변한다(idle: breathe, 진폭 2%)
      f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, WW, WH);
      f.globalAlpha = 0.98 + 0.02 * Math.sin(t * 0.9); f.drawImage(fogBase, 0, 0); f.globalAlpha = 1;
      for (const L of [...scene.lights, ...scene.winLights].filter(on)) {   // 강조색의 유일한 의미: 저녁 불빛
        const a2 = 0.22 + 0.03 * Math.sin(t * 1.3 + L.ph), R2 = L.r * 2.4;
        const g = f.createRadialGradient(L.x, L.y, 0, L.x, L.y, R2);
        g.addColorStop(0, `rgba(255,196,130,${a2})`); g.addColorStop(1, 'rgba(255,196,130,0)');
        f.fillStyle = g; f.beginPath(); f.arc(L.x, L.y, R2, 0, TAU); f.fill();
      }
      if (sweepP > 0 && sweepP < 1) {                      // 바람이 닿기 직전의 김: 밀리며 가로 결이 생긴다
        for (const l of ahead) {
          const x = wx(front + l.u * 0.24 - 0.02 * sweepP), fade = (1 - l.u) * Math.min(1, sweepP * 6);
          f.fillStyle = l.light ? `rgba(250,244,236,${l.a * fade})` : `rgba(90,78,90,${l.a * 0.6 * fade})`;
          f.fillRect(x, wy(l.y), l.len * W * (0.6 + 0.4 * (1 - l.u)), l.w);
        }
      }
      f.globalCompositeOperation = 'destination-out'; f.drawImage(mask, 0, 0); f.globalCompositeOperation = 'source-over';

      // 4) 합성: 카메라(이동·확대) → 창밖 → 거리 불빛 → 닦인 자리의 바람 얼룩 → 김 → 물기
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2); ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-W / 2 - OX - cam.x * W, -H / 2 - OY - cam.y * H);
      ctx.drawImage(scene.c, 0, 0);
      for (const L of scene.lights.filter(on)) {
        const a = 0.85 + 0.06 * Math.sin(t * 1.7 + L.ph);  // 불빛도 아주 작게 산다
        const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
        g.addColorStop(0, `rgba(255,214,150,${a})`); g.addColorStop(0.4, `rgba(255,180,110,${a * 0.4})`); g.addColorStop(1, 'rgba(255,180,110,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, TAU); ctx.fill();
      }
      for (const L of scene.winLights.filter(on)) {         // 건물 창이 하나둘 켜진다(lightsOn 순서)
        const r = L.r * 0.4, g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, r);
        g.addColorStop(0, 'rgba(255,222,170,0.75)'); g.addColorStop(1, 'rgba(255,196,130,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(L.x, L.y, r, 0, TAU); ctx.fill();
      }
      if (sweepP > 0 && wet > 0) {                          // 닦인 자리에 남은 가로 얼룩(바람결). 닦인 곳 안에만
        smc.globalCompositeOperation = 'source-over'; smc.clearRect(0, 0, WW, WH);
        for (const l of smears) {
          const x = wx(l.u * 1.1 - 0.05);
          if (x > wx(front)) continue;
          smc.fillStyle = `rgba(240,232,222,${l.a * 0.6 * wet})`; smc.fillRect(x, wy(l.y), l.len * W, l.w * 1.2);
        }
        smc.globalCompositeOperation = 'destination-in'; smc.drawImage(mask, 0, 0);
        ctx.drawImage(sm, 0, 0);
      }
      ctx.drawImage(fog, 0, 0);
      if (sweepP > 0 && wet > 0) {                          // 닦인 띠 위아래 가장자리에 모인 물방울(드물게, 별처럼 보이지 않게)
        for (let i = 0; i < stamps.length; i += 3) {
          const s = stamps[i];
          if (s.t > sweepP) break;
          for (const side of [-1, 1]) {
            const b = s.bead, x = wx(s.x) + (b[0] - 0.5) * 60, y = wy(s.y) + side * s.r * H * 0.74 * (0.92 + 0.08 * b[1]), r = 1.6 + b[2] * 3.2;
            if (b[3] < 0.7) continue;
            const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
            g.addColorStop(0, `rgba(255,250,240,${0.5 * wet})`); g.addColorStop(1, 'rgba(255,245,230,0)');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
          }
        }
      }
      for (const d of drips) {                              // 물줄기 끝의 물방울
        const g = ctx.createRadialGradient(d.x - d.r * 0.3, d.y - d.r * 0.3, 0, d.x, d.y, d.r * 1.3);
        g.addColorStop(0, 'rgba(255,250,240,0.55)'); g.addColorStop(1, 'rgba(255,245,230,0.08)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 1.3, 0, TAU); ctx.fill();
      }
      if (st.droplet) {                                     // 물방울: 작은 렌즈(밝은 테두리와 맺힌 빛)
        const d = st.droplet, x = wx(d.x), y = wy(d.y), r = d.r * H, sk = 1 + 0.35 * (d.stretch || 0);
        for (let yy = d.y0 + 0.01; yy < d.y - 0.012; yy += 0.013) {   // 자국 위에 남은 작은 물방울들
          const k = (yy - d.y0) * 900, bx = wx(d.x + 0.0007 * Math.sin(k * 0.21) + 0.0015 * Math.sin(k * 1.7)), by = wy(yy), br = r * (0.12 + 0.08 * (0.5 + 0.5 * Math.sin(k * 3.1)));
          const bg = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 0, bx, by, br);
          bg.addColorStop(0, 'rgba(255,250,240,0.8)'); bg.addColorStop(1, 'rgba(255,245,230,0.15)');
          ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
        }
        ctx.save(); ctx.translate(x, y); ctx.scale(0.9 / Math.sqrt(sk), 1.05 * sk);   // 원 하나를 늘여 빛 맺힘이 모양을 따라간다
        const g = ctx.createRadialGradient(-r * 0.28, -r * 0.32, r * 0.05, 0, r * 0.1, r);
        g.addColorStop(0, 'rgba(255,252,246,0.9)'); g.addColorStop(0.3, 'rgba(240,226,214,0.28)'); g.addColorStop(0.8, 'rgba(70,56,66,0.22)'); g.addColorStop(1, 'rgba(255,244,228,0.35)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill(); ctx.restore();
      }
      ctx.restore();
      // 5) 필름 그레인(초당 12장 바뀜)과 아주 옅은 비네트
      ctx.save();
      ctx.globalAlpha = 0.16; ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = ctx.createPattern(tiles[Math.floor(t * 12) % tiles.length], 'repeat'); ctx.fillRect(0, 0, W, H);
      ctx.restore();
      const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
      v.addColorStop(0, 'rgba(10,8,14,0)'); v.addColorStop(1, 'rgba(10,8,14,0.35)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }
    return { render };
  }

  // '가을냄새' 손가락 획(음절마다 0~1 상자, 획 순서대로). 위치·크기는 place()로 화면 좌표(0~1)에 놓는다.
  const SYLLABLES = [
    [[[0.10, 0.20], [0.50, 0.19], [0.47, 0.44], [0.36, 0.66], [0.16, 0.88]], [[0.72, 0.06], [0.73, 0.96]], [[0.73, 0.48], [0.93, 0.47]]],
    [Array.from({ length: 17 }, (_, i) => [0.5 + 0.15 * Math.sin(i / 16 * TAU + 3.14), 0.16 - 0.12 * Math.cos(i / 16 * TAU + 3.14)]),
      [[0.08, 0.46], [0.92, 0.46]], [[0.22, 0.58], [0.77, 0.58], [0.76, 0.72], [0.22, 0.72], [0.22, 0.88], [0.80, 0.88]]],
    [[[0.14, 0.06], [0.14, 0.42], [0.52, 0.42]], [[0.66, 0.04], [0.66, 0.50]], [[0.66, 0.24], [0.78, 0.24]], [[0.86, 0.02], [0.86, 0.55]],
      [[0.20, 0.62], [0.20, 0.94], [0.80, 0.94], [0.80, 0.62], [0.20, 0.62]]],
    [[[0.42, 0.10], [0.31, 0.52], [0.10, 0.88]], [[0.33, 0.48], [0.56, 0.86]], [[0.68, 0.05], [0.68, 0.96]], [[0.68, 0.46], [0.80, 0.46]], [[0.88, 0.02], [0.88, 0.98]]],
  ];
  // 물줄기가 시작되는 획 끝: 가의 ㅏ, 냄의 ㅁ 왼쪽 아래, 새의 마지막 세로획 (음절 번호, 상자 좌표, 길이 H 비율, 속도)
  const DRIPS = [[0, 0.73, 0.96, 0.05, 1.0], [2, 0.20, 0.94, 0.035, 0.7], [3, 0.88, 0.98, 0.06, 0.85]];
  function place(cx, cy, hFrac, seed = 3) {
    const rng = prng(seed), h = hFrac, w = h * H / W, adv = w * 1.06;
    const x0 = cx - (adv * 4 - w * 0.06) / 2, y0 = cy - h / 2;
    const strokes = SYLLABLES.flatMap((ss, i) => ss.map(s => s.map(([u, v]) =>
      [x0 + i * adv + u * w + (rng() - 0.5) * w * 0.02, y0 + v * h + (rng() - 0.5) * h * 0.02])));
    strokes.drips = DRIPS.map(([i, u, v, len, speed]) => ({ x: x0 + i * adv + u * w, y: y0 + v * h, len, speed }));
    return strokes;
  }

  // 글꼴 모양 제목의 글리프 캔버스(글꼴이 로드된 뒤 한 번 만든다). font는 CSS font 문자열
  function makeTitle(text, font, tracking = 0) {
    const c0 = canvas(10, 10).getContext('2d'); c0.font = font;
    const chars = [...text], gap = tracking, widths = chars.map(ch => c0.measureText(ch).width);
    const w = Math.ceil(widths.reduce((a, b) => a + b, 0) + gap * (chars.length - 1) + 40), h = Math.ceil(parseFloat(font.match(/(\d+(?:\.\d+)?)px/)[1]) * 1.4);
    const c = canvas(w, h), g = c.getContext('2d');
    g.font = font; g.textBaseline = 'middle'; g.fillStyle = '#000';
    let x = 20; chars.forEach((ch, i) => { g.fillText(ch, x, h / 2); x += widths[i] + gap; });
    return c;
  }

  window.FogGlass = { create, place, makeTitle, W, H };
})();
