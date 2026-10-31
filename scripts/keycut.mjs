// 4단계 키 컷의 빈 틀을 만든다: timing.json의 해당 시간대(컷, 카피, 키 모션 시각, BGM 구간)와 디자인 토큰을 넣은
// HyperFrames 컴포지션. 장면 자체는 에이전트가 director 스킬을 따라 손으로 채운다.
// CLI: node scripts/keycut.mjs "projects/<slug>" --name <이름> --from <초> --to <초>  → 04_design/keycuts/<이름>/index.html (있으면 exit 1)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkTokens, tokensToCss, fontExists, fontDir } from './design-tokens.mjs';
import { missingAssets } from './check-fonts.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const round = x => Math.round(x * 1000) / 1000;
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const WEIGHTS = { thin: 100, extralight: 200, light: 300, regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };

export function keycutWindow(timing, from, to) {
  if (!(from >= 0 && to <= timing.duration && from < to))
    throw new Error(`키 컷 범위 ${from}~${to}초가 영상(0~${timing.duration}초) 안의 올바른 범위가 아님`);
  // 경계는 반올림한 값으로 비교한다(retime이 소수 셋째 자리로 맞추므로 start+dur에 부동소수 오차가 남는다)
  const beats = timing.beats
    .map(b => {
      const s = Math.max(b.start, from);
      const e = Math.min(round(b.start + b.dur), to);
      return { n: b.n, copy: b.copy, start: round(s - from), dur: round(e - s) };
    })
    .filter(b => b.dur > 0);
  const cues = timing.beats.flatMap(b => b.keyMotions.filter(k => round(k.at) >= round(from) && round(k.at) < round(to)).map(k => ({ at: round(k.at - from), n: b.n })));
  return { duration: round(to - from), beats, cues, mediaStart: from };
}

export function renderKeycut(win, { css, audio, width, height }) {
  const sections = win.beats.map(b => `      <!-- 컷 ${b.n} 카피: ${b.copy.replace(/\n/g, ' / ').replace(/--/g, '—') || '(없음)'} -->
      <section class="clip" id="beat-${b.n}" data-start="${b.start}" data-duration="${b.dur}" data-copy="${attr(b.copy)}">
      </section>`).join('\n');
  const bgm = audio
    ? `\n      <audio id="bgm" src="assets/audio/${audio}" data-start="0" data-duration="${win.duration}" data-media-start="${win.mediaStart}" data-volume="1"></audio>`
    : '';
  return `<!doctype html>
<html lang="ko" data-resolution="landscape">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${width}, height=${height}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
${css}
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${width}px; height: ${height}px; overflow: hidden; background: var(--color-ground); }
      #root { width: 100%; height: 100%; position: relative; word-break: keep-all; }
      .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${win.duration}" data-width="${width}" data-height="${height}">
${sections}${bgm}
    </div>
    <script>
      // 키 모션 시각(이 키 컷의 지역 시각, 초). 영상 전체 시각 = 지역 시각 + ${win.mediaStart}
      window.__cues = ${JSON.stringify(win.cues.map(c => c.at))};
      const tl = gsap.timeline({ paused: true });
      window.__timelines['main'] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
`;
}

function fontFaces(tokens, outDir) {
  const faces = [];
  for (const family of new Set(Object.values(tokens.type.families))) {
    const src = fontDir(family);
    const dst = path.join(outDir, 'assets', 'fonts', path.basename(src));
    fs.mkdirSync(dst, { recursive: true });
    for (const f of fs.readdirSync(src).filter(f => f.endsWith('.woff2') || /^LICENSE/i.test(f))) {
      fs.copyFileSync(path.join(src, f), path.join(dst, f));
      if (!f.endsWith('.woff2')) continue;
      const w = WEIGHTS[(f.match(/-([A-Za-z]+)\.woff2$/)?.[1] ?? 'regular').toLowerCase()] ?? 400;
      faces.push(`      @font-face { font-family: '${family}'; font-weight: ${w}; src: url('assets/fonts/${path.basename(src)}/${f}') format('woff2'); }`);
    }
  }
  return faces.join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir] = process.argv.slice(2);
  const arg = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
  const name = arg('--name');
  const from = Number(arg('--from'));
  const to = Number(arg('--to'));
  if (!dir || !name || !Number.isFinite(from) || !Number.isFinite(to)) {
    console.error('usage: node scripts/keycut.mjs "<project dir>" --name <이름> --from <초> --to <초>');
    process.exit(2);
  }
  const timing = JSON.parse(fs.readFileSync(path.join(dir, '03_animatic', 'timing.json'), 'utf8'));
  const tokens = JSON.parse(fs.readFileSync(path.join(dir, '04_design', 'design_tokens.json'), 'utf8'));
  const motion = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens', 'motion.json'), 'utf8'));
  const check = checkTokens(tokens, { motion, fontExists });
  if (check.errors.length) {
    for (const e of check.errors) console.error(e);
    process.exit(1);
  }
  const out = path.join(dir, '04_design', 'keycuts', name);
  if (fs.existsSync(path.join(out, 'index.html'))) {
    console.error(`이미 있음: ${path.join(out, 'index.html')} (손으로 쓴 장면을 지키기 위해 덮어쓰지 않는다)`);
    process.exit(1);
  }
  let win;
  try {
    win = keycutWindow(timing, from, to);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  fs.mkdirSync(out, { recursive: true });
  const css = `${fontFaces(tokens, out)}\n      ${tokensToCss(tokens, timing.height).replace(/\n/g, '\n      ')}`;
  let audio = null;
  // 음원은 커밋되지 않으므로(CLAUDE.md 14) 다른 PC·새 클론에는 없다. 없으면 audio 없이 만들고 경고한다
  if (timing.audio && !fs.existsSync(path.join(ROOT, timing.audio))) {
    console.error(`경고: 음원 원본이 없어 audio 없이 만듦: ${timing.audio}`);
  } else if (timing.audio) {
    audio = `bgm${path.extname(timing.audio)}`;
    fs.mkdirSync(path.join(out, 'assets', 'audio'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, timing.audio), path.join(out, 'assets', 'audio', audio));
  }
  fs.writeFileSync(path.join(out, 'index.html'), renderKeycut(win, { css, audio, width: timing.width, height: timing.height }));
  const missing = missingAssets(out);
  for (const m of missing) console.error(`없는 파일: ${m}`);
  console.log(JSON.stringify({ out: path.join(out, 'index.html'), duration: win.duration, cues: win.cues }));
  if (missing.length) process.exit(1);
}
