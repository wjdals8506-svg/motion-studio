// 프로젝트 폴더의 단계 산출물 front matter(status:)를 읽어 현재 단계를 알려 준다.
// CLI: node scripts/status.mjs "projects/<slug>"  → JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STAGES = [
  { n: 0, file: '00_brief.md' },
  { n: 1, file: '01_key_message.md' },
  { n: 2, file: '02_story.md' },
];

function readStatus(file) {
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  if (lines[0] !== '---') return 'draft';
  for (const line of lines.slice(1)) {
    if (line === '---') break;
    const m = line.match(/^status:\s*(\S+)/);
    if (m) return m[1];
  }
  return 'draft';
}

export function projectStatus(dir) {
  const approved = [];
  const stale = [];
  let stage = STAGES.length;
  for (const { n, file } of STAGES) {
    const status = readStatus(path.join(dir, file));
    if (stage === STAGES.length) {
      if (status === 'approved') approved.push(file);
      else stage = n;
    } else if (status !== null) {
      stale.push(file);
    }
  }
  return { stage, approved, stale };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir || !fs.existsSync(dir)) {
    console.error('usage: node scripts/status.mjs "<project dir>"');
    process.exit(2);
  }
  console.log(JSON.stringify(projectStatus(dir), null, 2));
}
