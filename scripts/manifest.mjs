// 프로젝트의 assets.manifest.json을 검사한다(스펙 9절). 하나라도 문제가 있으면 진행을 멈춘다.
// 공개 재배포가 안 되는 에셋(ElevenLabs 음원 등)은 커밋되지 않는 media/ 아래에만 있어야 한다.
// CLI: node scripts/manifest.mjs "projects/<slug>"  → 문제가 있으면 stderr에 한 줄씩, exit 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED = ['id', 'path', 'kind', 'source', 'license', 'commercial', 'public_redistribution'];
const empty = v => v === undefined || v === null || v === '';

export function checkManifest(entries) {
  const problems = [];
  for (const e of entries) {
    const id = e.id || '(id 없음)';
    for (const f of REQUIRED) if (empty(e[f])) problems.push(`${id}: ${f} 없음`);
    if (e.source === 'elevenlabs') for (const f of ['model', 'prompt']) if (empty(e[f])) problems.push(`${id}: ${f} 없음`);
    if (e.public_redistribution === false && !String(e.path ?? '').startsWith('media/'))
      problems.push(`${id}: 공개 재배포 불가 에셋은 media/ 아래에만 둔다 (${e.path})`);
  }
  return problems;
}

export function addEntry(file, entry) {
  const list = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
  const i = list.findIndex(e => e.id === entry.id);
  if (i >= 0) list[i] = entry; else list.push(entry);
  fs.writeFileSync(file, JSON.stringify(list, null, 2) + '\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/manifest.mjs "<project dir>"');
    process.exit(2);
  }
  const file = path.join(dir, 'assets.manifest.json');
  const problems = fs.existsSync(file) ? checkManifest(JSON.parse(fs.readFileSync(file, 'utf8'))) : [];
  for (const p of problems) console.error(p);
  console.log(JSON.stringify({ file, problems: problems.length }));
  if (problems.length) process.exit(1);
}
