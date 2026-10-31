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
    sfx: read(path.join(film, 'sfx.json'), []),
    copyWindows: qa.copyWindows ?? [],
    endHold: qa.endHold,
    manifestProblems: checkManifest(read(path.join(dir, 'assets.manifest.json'), [])),
    copiesMatch: !fs.existsSync(copy) || norm(copy) === norm(origin),
  });
  if (!qa.copyWindows) r.warnings.push('index.html에 qa 블록(copyWindows, endHold)이 없음');
  console.log(JSON.stringify(r, null, 2));
  if (r.errors.length) process.exit(1);
}
