// 프로젝트 폴더의 단계 산출물 front matter(status:, approved_at:)를 읽어 현재 단계를 알려 준다.
// 앞 단계보다 먼저 승인된 뒤 단계는 옛 앞 단계를 바탕으로 만든 것이라 stale로 본다.
// CLI: node scripts/status.mjs "projects/<slug>"  → JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const STAGES = [
  { n: 0, file: '00_brief.md' },
  { n: 1, file: '01_key_message.md' },
  { n: 2, file: '02_story.md' },
  { n: 3, file: '03_animatic.md' },
  { n: 4, file: '04_design.md' },
];

function readFront(file) {
  if (!fs.existsSync(file)) return null;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const front = { status: 'draft', approved_at: '' };
  if (lines[0] !== '---') return front;
  for (const line of lines.slice(1)) {
    if (line === '---') break;
    const m = line.match(/^(status|approved_at):\s*(\S*)/);
    if (m) front[m[1]] = m[2];
  }
  return front;
}

export function projectStatus(dir) {
  const approved = [];
  const stale = [];
  let stage = STAGES.length;
  let latest = '';
  for (const { n, file } of STAGES) {
    const front = readFront(path.join(dir, file));
    if (stage === STAGES.length) {
      // approved_at은 ISO 문자열(YYYY-MM-DDTHH:MM)이라 문자열 비교가 곧 시간 비교다.
      if (front?.status === 'approved' && front.approved_at >= latest) {
        approved.push(file);
        latest = front.approved_at;
      } else {
        stage = n;
        if (front?.status === 'approved') stale.push(file);
      }
    } else if (front !== null) {
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
