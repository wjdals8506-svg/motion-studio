// 5단계 1단 자동 검사: 효과음은 키 모션에만, 엔드 홀드 0.6~1.4초, 카피 읽기 시간, 에셋 목록, 렌더러 사본.
// 컴포지션은 <script type="application/json" id="qa">{ "copyWindows": [{ copy, from, to }], "endHold": 초 }</script>로 선언한다.
// CLI: node scripts/film-qa.mjs "projects/<slug>"  → JSON { errors, warnings }, 오류 있으면 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readingTime } from './timing.mjs';
import { checkManifest } from './manifest.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

export function filmQa({ timing, sfx, copyWindows, endHold, manifestProblems, copiesMatch }) {
  const errors = [];
  const warnings = [];
  const keys = timing.beats.flatMap(b => b.keyMotions.map(k => k.at));
  for (const s of sfx) {
    const d = Math.min(...keys.map(k => Math.abs(k - s.at)));
    if (!(d <= 0.1)) errors.push(`효과음 ${s.name} ${s.at}초: 키 모션과 ${Number.isFinite(d) ? d.toFixed(2) : '∞'}초 떨어짐 (효과음은 키 모션에만)`);
  }
  if (!(endHold >= 0.6 && endHold <= 1.4)) errors.push(`엔드 홀드 ${endHold}초: 0.6~1.4초여야 함`);
  for (const w of copyWindows) {
    const need = readingTime(w.copy), have = w.to - w.from;
    if (have + 1e-9 < need) errors.push(`카피 "${w.copy.replace(/\n/g, ' / ')}" ${have.toFixed(2)}초 보임 < 읽기 시간 ${need.toFixed(2)}초`);
  }
  for (const p of manifestProblems) errors.push(`에셋 목록: ${p}`);
  if (!copiesMatch) errors.push('렌더러 사본이 스타일 모듈 원본과 다름');
  return { errors, warnings };
}

// 효과음은 선언(sfx.json)이 아니라 영상에 실제로 들어간 <audio id="sfx-이름" data-start="초">에서 읽는다(5단계 리뷰 I1)
export const sfxFromHtml = html =>
  [...html.matchAll(/<audio\b[^>]*\bid="sfx-([^"]+)"[^>]*\bdata-start="([\d.]+)"/g)].map(m => ({ name: m[1], at: Number(m[2]) }));

// 영상에 박힌 window.__timing(비계가 넣은 사본)과 timing.json이 같은지(5단계 리뷰 I3)
export const timingFromHtml = html => JSON.parse(html.match(/window\.__timing = (\{.*?\});/)?.[1] ?? 'null');
export function sameTiming(embedded, timing) {
  if (!embedded) return false;
  const key = bs => JSON.stringify(bs.map(b => [b.n, b.start, b.dur, b.keyMotions.map(k => (typeof k === 'number' ? k : k.at))]));
  return embedded.duration === timing.duration && key(embedded.beats) === key(timing.beats);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) { console.error('usage: node scripts/film-qa.mjs "<project dir>"'); process.exit(2); }
  const film = path.join(dir, '05_film');
  const read = (f, d) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : d);
  const html = fs.readFileSync(path.join(film, 'index.html'), 'utf8');
  const qa = JSON.parse(html.match(/<script type="application\/json" id="qa">([\s\S]*?)<\/script>/)?.[1] ?? '{}');
  const norm = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const copy = path.join(film, 'assets', 'js', 'fog-glass.js');
  const origin = path.join(ROOT, 'styles', 'modules', '19-grainy-gradient', 'fog-glass.js');
  const r = filmQa({
    timing: read(path.join(dir, '03_animatic', 'timing.json')),
    sfx: sfxFromHtml(html),
    copyWindows: qa.copyWindows ?? [],
    endHold: qa.endHold,
    manifestProblems: checkManifest(read(path.join(dir, 'assets.manifest.json'), [])),
    copiesMatch: !fs.existsSync(copy) || norm(copy) === norm(origin),
  });
  if (!qa.copyWindows) r.errors.push('index.html에 qa 블록(copyWindows, endHold)이 없음');
  const timing = read(path.join(dir, '03_animatic', 'timing.json'));
  if (!sameTiming(timingFromHtml(html), timing)) r.errors.push('영상의 window.__timing이 03_animatic/timing.json과 다름(3단계를 다시 맞췄다면 영상 시각도 갱신)');
  const declared = read(path.join(film, 'sfx.json'), []);
  if (JSON.stringify(declared.map(x => [x.name, x.at])) !== JSON.stringify(sfxFromHtml(html).map(x => [x.name, x.at])))
    r.errors.push('sfx.json과 영상의 효과음 audio 요소가 다름');
  console.log(JSON.stringify(r, null, 2));
  if (r.errors.length) process.exit(1);
}
