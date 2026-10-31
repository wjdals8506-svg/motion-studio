// timing.json에서 회색 상자와 큰 글자의 3단계 애니매틱(HyperFrames 컴포지션)을 만든다.
// CLI: node scripts/animatic.mjs "projects/<slug>"  → 03_animatic/index.html (timing.json이 원본, 매번 덮어씀)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { missingAssets } from './check-fonts.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const FONTS = ['Pretendard-Regular.woff2', 'Pretendard-SemiBold.woff2'];
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// 폰 화면에서 읽히는 최소 글자 크기 (HyperFrames check text_below_floor: 짧은 변의 2.6%)
const floor = H => Math.max(28, Math.round(H * 0.026));
const pct = v => `${Math.round(v * 10000) / 100}%`;

const audioName = file => `bgm${path.extname(file)}`;

function beatHtml(b, cueIds) {
  const boxes = b.boxes.map(x =>
    `<div class="box" style="left: ${pct(x.x - x.w / 2)}; top: ${pct(x.y - x.h / 2)}; width: ${pct(x.w)}; height: ${pct(x.h)}"><span>${esc(x.label)}</span></div>`).join('\n        ');
  const copy = b.copy ? `<p class="copy" id="copy-${b.n}">${b.copy.split('\n').map(esc).join('<br>')}</p>` : '';
  const cues = cueIds.map(id => `<div class="cue" id="${id}"></div>`).join('');
  return `      <section class="clip beat" id="beat-${b.n}" data-start="${b.start}" data-duration="${b.dur}">
        ${boxes}
        ${copy}
        ${cues}
        <p class="caption">#${b.n} ${esc(b.role)}</p>
      </section>`;
}

export function renderAnimatic(timing) {
  const { width: W, height: H, duration, beats } = timing;
  // 키 모션 cue는 그 시각을 담은 컷 안에 넣는다(한 화면의 요소는 한 clip 안에).
  const cuesByBeat = new Map(beats.map(b => [b.n, []]));
  const cues = [];
  for (const b of beats) for (const k of b.keyMotions) {
    const host = beats.find(x => k.at >= x.start && k.at < x.start + x.dur) ?? beats.at(-1);
    const id = `cue-${cues.length + 1}`;
    cuesByBeat.get(host.n).push(id);
    cues.push({ id, at: k.at });
  }
  const tweens = [
    ...beats.filter(b => b.copy).map(b =>
      `tl.fromTo('#copy-${b.n}', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, ${b.start + 0.1});`),
    ...cues.flatMap(c => [
      `tl.fromTo('#${c.id}', { x: -40, opacity: 1 }, { x: ${W + 40}, opacity: 1, duration: 0.6, ease: 'power2.inOut', immediateRender: false }, ${c.at});`,
      `tl.set('#${c.id}', { opacity: 0 }, ${Math.round((c.at + 0.6) * 1000) / 1000});`,
    ]),
  ];
  const audio = timing.audio
    ? `\n      <audio id="bgm" src="assets/audio/${audioName(timing.audio)}" data-start="0" data-duration="${duration}" data-volume="1"></audio>`
    : '';
  return `<!doctype html>
<html lang="ko" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      @font-face { font-family: 'Pretendard'; font-weight: 400; src: url('assets/fonts/pretendard/${FONTS[0]}') format('woff2'); }
      @font-face { font-family: 'Pretendard'; font-weight: 600; src: url('assets/fonts/pretendard/${FONTS[1]}') format('woff2'); }
      :root { --ground: #16161a; --box: #5c5c63; --ink: #ecebe6; --muted: #8a8a90; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: var(--ground); }
      #root { width: 100%; height: 100%; position: relative; font-family: 'Pretendard', sans-serif; word-break: keep-all; }
      .beat { width: 100%; height: 100%; position: absolute; inset: 0; }
      .box { position: absolute; border: 2px dashed var(--box); display: flex; align-items: flex-end; padding: 8px 12px; }
      .box span { color: var(--muted); font-size: ${floor(H)}px; }
      .copy { position: absolute; left: 10%; right: 10%; top: 50%; transform: translateY(-50%); text-align: center; color: var(--ink); font-size: ${Math.round(H * 0.07)}px; font-weight: 600; line-height: 1.3; }
      .caption { position: absolute; left: 0; right: 0; bottom: ${Math.round(H * 0.04)}px; text-align: center; color: var(--muted); font-size: ${floor(H)}px; }
      .cue { position: absolute; top: 0; left: 0; width: 12px; height: 100%; background: var(--ink); opacity: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${duration}" data-width="${W}" data-height="${H}">
${beats.map(b => beatHtml(b, cuesByBeat.get(b.n))).join('\n')}${audio}
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      ${tweens.join('\n      ')}
      window.__timelines['main'] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/animatic.mjs "<project dir>"');
    process.exit(2);
  }
  const out = path.join(dir, '03_animatic');
  const timing = JSON.parse(fs.readFileSync(path.join(out, 'timing.json'), 'utf8'));
  const fontDir = path.join(out, 'assets', 'fonts', 'pretendard');
  fs.mkdirSync(fontDir, { recursive: true });
  for (const f of [...FONTS, 'LICENSE.txt']) fs.copyFileSync(path.join(ROOT, 'assets', 'fonts', 'pretendard', f), path.join(fontDir, f));
  if (timing.audio) {
    fs.mkdirSync(path.join(out, 'assets', 'audio'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, timing.audio), path.join(out, 'assets', 'audio', audioName(timing.audio)));
  }
  fs.writeFileSync(path.join(out, 'index.html'), renderAnimatic(timing));
  const missing = missingAssets(out);
  for (const m of missing) console.error(`없는 파일: ${m}`);
  console.log(JSON.stringify({ out: path.join(out, 'index.html'), beats: timing.beats.length, audio: Boolean(timing.audio) }));
  if (missing.length) process.exit(1);
}
