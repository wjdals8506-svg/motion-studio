// 김 서린 유리창 렌더러 (스타일 A: Styles-20 #19 Grainy Gradient 계열).
// HyperFrames 결정론 규칙: 모든 프레임은 render(state)에 넘긴 값만으로 그린다. 누적 상태, Math.random, 시계 없음.
// 쓰는 법: const fg = FogGlass.create(canvas, { seed }); fg.render({ t, cam, trail, sweep, refog, writing, droplet });
(function () {
  const W = 1920, H = 1080, M = 0.12;            // 화면 크기, 카메라 여유(세계는 화면보다 상하좌우 12% 넓다)
  const WW = Math.round(W * (1 + 2 * M)), WH = Math.round(H * (1 + 2 * M));
  const OX = W * M, OY = H * M;                   // 화면 좌표(0~1) → 세계 좌표 원점 이동
  const wx = fx => OX + fx * W, wy = fy => OY + fy * H;

  const prng = seed => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const canvas = (w = WW, h = WH) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  function drawScene(rng) {
    const c = canvas(), s = c.getContext('2d');
    const sky = s.createLinearGradient(0, 0, 0, WH);
    sky.addColorStop(0, '#22233a'); sky.addColorStop(0.42, '#564760'); sky.addColorStop(0.66, '#b27b6a'); sky.addColorStop(0.8, '#dda472');
    s.fillStyle = sky; s.fillRect(0, 0, WW, WH);
    const glow = s.createRadialGradient(WW * 0.7, WH * 0.73, 0, WW * 0.7, WH * 0.73, WW * 0.42);
    glow.addColorStop(0, 'rgba(255,196,128,0.42)'); glow.addColorStop(1, 'rgba(255,196,128,0)');
    s.fillStyle = glow; s.fillRect(0, 0, WW, WH);
    const lights = [];
    const skyline = (base, minH, maxH, color, litP) => {
      let x = -20;
      while (x < WW + 20) {
        const w = 50 + rng() * 150, h = minH + rng() * (maxH - minH), top = base - h;
        s.fillStyle = color; s.fillRect(x, top, w, WH);
        if (rng() < 0.3) s.fillRect(x + w * 0.3, top - 18 - rng() * 30, 3, 50);   // 옥상 안테나
        // 창 불빛: 층마다 켜진 칸 수와 위치가 다르다(격자처럼 보이지 않게)
        if (litP) for (let fy = top + 16 + rng() * 10; fy < base - 8; fy += 22 + rng() * 10) {
          if (rng() > 0.55) continue;
          const n = 1 + (rng() * 3 | 0);
          for (let k = 0; k < n; k++) {
            const lx = x + 8 + rng() * (w - 22), lw = 5 + rng() * 9;
            s.fillStyle = `rgba(255,${185 + rng() * 45 | 0},${105 + rng() * 45 | 0},${0.35 + rng() * 0.55})`;
            s.fillRect(lx, fy, lw, 7 + rng() * 6);
          }
        }
        x += w + 2 + rng() * 6;
      }
    };
    skyline(WH * 0.74, 110, 330, '#463b52', 0);
    skyline(WH * 0.86, 140, 430, '#1e1a25', 1);
    for (let i = 0; i < 34; i++) lights.push({ x: rng() * WW, y: WH * (0.79 + rng() * 0.17), r: 10 + rng() * 34, ph: rng() * 6.28 });
    return { c, lights };
  }

  function drawFogBase(scene, rng) {
    const c = canvas(), f = c.getContext('2d');
    f.filter = 'blur(34px)'; f.drawImage(scene, 0, 0); f.filter = 'none';
    f.fillStyle = 'rgba(224,214,202,0.58)'; f.fillRect(0, 0, WW, WH);
    for (let i = 0; i < 12000; i++) {                // 맺힌 물방울(결로)
      const x = rng() * WW, y = rng() * WH, r = 0.6 + rng() * 2.4;
      f.fillStyle = rng() < 0.5 ? 'rgba(255,250,242,0.22)' : 'rgba(70,60,60,0.10)';
      f.beginPath(); f.arc(x, y, r, 0, 6.2832); f.fill();
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
      });
    }
    return st;
  }

  function stamp(m, x, y, r, hard) {
    const g = m.createRadialGradient(x, y, r * hard, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    m.fillStyle = g; m.beginPath(); m.arc(x, y, r, 0, 6.2832); m.fill();
  }

  // 획 목록에서 진행도만큼의 부분 경로를 돌려준다(길이 기준)
  function partial(strokes, p) {
    const lens = strokes.map(s => s.slice(1).reduce((a, q, i) => a + Math.hypot(q[0] - s[i][0], q[1] - s[i][1]), 0));
    let left = p * lens.reduce((a, b) => a + b, 0);
    const out = [];
    strokes.forEach((s, k) => {
      if (left <= 0) return;
      const seg = [s[0]];
      for (let i = 1; i < s.length && left > 0; i++) {
        const d = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]);
        if (d <= left) { seg.push(s[i]); left -= d; }
        else { const u = left / d; seg.push([s[i - 1][0] + (s[i][0] - s[i - 1][0]) * u, s[i - 1][1] + (s[i][1] - s[i - 1][1]) * u]); left = 0; }
      }
      if (seg.length > 1) out.push(seg);
      void k;
    });
    return out;
  }

  function create(target, { seed = 7, sweep = { y: 0.5, r: 0.27 } } = {}) {
    const rng = prng(seed);
    const scene = drawScene(rng);
    const fogBase = drawFogBase(scene.c, rng);
    const tiles = grainTiles(rng);
    const stamps = sweepStamps(rng, sweep);
    const mask = canvas(), m = mask.getContext('2d');
    const fog = canvas(), f = fog.getContext('2d');
    const ctx = target.getContext('2d');

    function render(st) {
      const t = st.t || 0, cam = st.cam || { x: 0, y: 0, zoom: 1 };
      // 1) 닦인 자리 마스크: 좁은 첫 바람 자국, 큰 바람, 물방울 자국, 손가락 글씨
      m.globalCompositeOperation = 'source-over';
      m.clearRect(0, 0, WW, WH);
      if (st.trail) {
        const p = st.trail.progress, y = wy(st.trail.y ?? 0.7), hh = (st.trail.h ?? 0.12) * H;
        for (let x = -0.05; x <= -0.05 + 1.1 * p; x += 0.006) stamp(m, wx(x), y + Math.sin(x * 13) * hh * 0.12, hh * 0.62, 0.45);
      }
      // 큰 바람: 가로로 늘인 스탬프라 닦인 자국이 바람 방향(왼→오)으로 결이 진다. 진행도 0이면 아무것도 없다
      if (st.sweep && st.sweep.progress > 0) for (const s of stamps) {
        if (s.t > st.sweep.progress) break;
        m.save(); m.translate(wx(s.x), wy(s.y)); m.scale(1.7, 1); stamp(m, 0, 0, s.r * H * 0.78, 0.5); m.restore();
      }
      if (st.droplet) {
        // 물방울이 지나간 자국: 폭이 들쭉날쭉하고 살짝 휘는 길(김이 닦인 자리)
        const d = st.droplet;
        for (let y = d.y0; y < d.y; y += 0.0015) {
          const k = (y - d.y0) * 900, w = d.r * H * (0.34 + 0.04 * Math.sin(k * 0.35) + 0.02 * Math.sin(k * 1.3));
          m.fillStyle = 'rgba(0,0,0,0.55)'; m.beginPath(); m.arc(wx(d.x + 0.0007 * Math.sin(k * 0.21)), wy(y), w, 0, 6.2832); m.fill();
        }
      }
      // 2) 다시 서리는 김: 가장자리부터 안쪽으로 마스크를 지운다
      if (st.refog) {
        const r = st.refog, cx = WW / 2, cy = WH / 2, R = Math.hypot(W, H) * 0.62;
        // r=1이면 안쪽 반지름 0, 바깥 반지름 1px: 마스크 전체를 지워 김이 완전히 덮인다
        const inner = R * 1.1 * (1 - r), outer = inner + R * 0.3 * (1 - r) + 1;
        const g = m.createRadialGradient(cx, cy, inner, cx, cy, outer);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,1)');
        m.globalCompositeOperation = 'destination-out'; m.fillStyle = g; m.fillRect(0, 0, WW, WH);
        m.globalCompositeOperation = 'source-over';
      }
      if (st.writing) {
        const w = st.writing, segs = partial(w.strokes, w.progress);
        m.strokeStyle = '#000'; m.lineCap = 'round'; m.lineJoin = 'round';
        for (const seg of segs) {
          m.lineWidth = w.width * H;
          m.beginPath(); m.moveTo(wx(seg[0][0]), wy(seg[0][1]));
          for (const q of seg.slice(1)) m.lineTo(wx(q[0]), wy(q[1]));
          m.stroke();
        }
      }
      // 3) 김 = 기본 김 − 마스크, 숨쉬듯 아주 작게 농도가 변한다(idle: breathe, 진폭 2%)
      f.globalCompositeOperation = 'source-over'; f.clearRect(0, 0, WW, WH);
      f.globalAlpha = 0.98 + 0.02 * Math.sin(t * 0.9); f.drawImage(fogBase, 0, 0); f.globalAlpha = 1;
      f.globalCompositeOperation = 'destination-out'; f.drawImage(mask, 0, 0); f.globalCompositeOperation = 'source-over';

      // 4) 합성: 카메라(이동·확대) → 창밖 → 불빛 → 김
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2); ctx.scale(cam.zoom, cam.zoom);
      ctx.translate(-W / 2 - OX - cam.x * W, -H / 2 - OY - cam.y * H);
      ctx.drawImage(scene.c, 0, 0);
      for (const L of scene.lights) {
        const a = 0.85 + 0.06 * Math.sin(t * 1.7 + L.ph);   // 불빛도 아주 작게 산다
        const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, L.r);
        g.addColorStop(0, `rgba(255,214,150,${a})`); g.addColorStop(0.4, `rgba(255,180,110,${a * 0.4})`); g.addColorStop(1, 'rgba(255,180,110,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(L.x, L.y, L.r, 0, 6.2832); ctx.fill();
      }
      ctx.drawImage(fog, 0, 0);
      // 김 너머로 번져 보이는 저녁 불빛(강조색의 유일한 의미). 김이 덮인 곳에서만 보이도록 김 위에 넓고 옅게 얹는다
      for (const L of scene.lights) {
        const a2 = 0.24 + 0.03 * Math.sin(t * 1.3 + L.ph), R2 = L.r * 2.6;
        const g = ctx.createRadialGradient(L.x, L.y, 0, L.x, L.y, R2);
        g.addColorStop(0, `rgba(255,196,130,${a2})`); g.addColorStop(1, 'rgba(255,196,130,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(L.x, L.y, R2, 0, 6.2832); ctx.fill();
      }
      if (st.droplet) {                                  // 물방울: 작은 렌즈(밝은 테두리와 맺힌 빛)
        const d = st.droplet, x = wx(d.x), y = wy(d.y), r = d.r * H, sk = 1 + 0.35 * (d.stretch || 0);
        // 자국 위에 남은 작은 물방울들(위치는 자국 길이로 정해져 늘 같다)
        for (let yy = d.y0 + 0.01; yy < d.y - 0.012; yy += 0.013) {
          const k = (yy - d.y0) * 900, bx = wx(d.x + 0.0007 * Math.sin(k * 0.21) + 0.0015 * Math.sin(k * 1.7)), by = wy(yy), br = r * (0.12 + 0.08 * (0.5 + 0.5 * Math.sin(k * 3.1)));
          const bg = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 0, bx, by, br);
          bg.addColorStop(0, 'rgba(255,250,240,0.8)'); bg.addColorStop(1, 'rgba(255,245,230,0.15)');
          ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bx, by, br, 0, 6.2832); ctx.fill();
        }
        // 물방울 몸통: 원 하나를 늘여 그려 빛 맺힘이 모양을 따라간다(아래쪽이 무겁고 위가 가늘다)
        ctx.save(); ctx.translate(x, y); ctx.scale(0.9 / Math.sqrt(sk), 1.05 * sk);
        const g = ctx.createRadialGradient(-r * 0.28, -r * 0.32, r * 0.05, 0, r * 0.1, r);
        g.addColorStop(0, 'rgba(255,252,246,0.9)'); g.addColorStop(0.3, 'rgba(240,226,214,0.28)'); g.addColorStop(0.8, 'rgba(70,56,66,0.22)'); g.addColorStop(1, 'rgba(255,244,228,0.35)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.2832); ctx.fill(); ctx.restore();
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
    [Array.from({ length: 17 }, (_, i) => [0.5 + 0.15 * Math.sin(i / 16 * 6.2832 + 3.14), 0.16 - 0.12 * Math.cos(i / 16 * 6.2832 + 3.14)]),
      [[0.08, 0.46], [0.92, 0.46]], [[0.22, 0.58], [0.77, 0.58], [0.76, 0.72], [0.22, 0.72], [0.22, 0.88], [0.80, 0.88]]],
    [[[0.14, 0.06], [0.14, 0.42], [0.52, 0.42]], [[0.66, 0.04], [0.66, 0.50]], [[0.66, 0.24], [0.78, 0.24]], [[0.86, 0.02], [0.86, 0.55]],
      [[0.20, 0.62], [0.20, 0.94], [0.80, 0.94], [0.80, 0.62], [0.20, 0.62]]],
    [[[0.42, 0.10], [0.31, 0.52], [0.10, 0.88]], [[0.33, 0.48], [0.56, 0.86]], [[0.68, 0.05], [0.68, 0.96]], [[0.68, 0.46], [0.80, 0.46]], [[0.88, 0.02], [0.88, 0.98]]],
  ];
  function place(cx, cy, hFrac, seed = 3) {
    const rng = prng(seed), h = hFrac, w = h * H / W, adv = w * 1.06;
    const x0 = cx - (adv * 4 - w * 0.06) / 2, y0 = cy - h / 2;
    return SYLLABLES.flatMap((strokes, i) => strokes.map(s => s.map(([u, v]) =>
      [x0 + i * adv + u * w + (rng() - 0.5) * w * 0.02, y0 + v * h + (rng() - 0.5) * h * 0.02])));
  }

  window.FogGlass = { create, place, W, H };
})();
