// 2단계 컷 설계표를 읽어 3단계 타이밍 원본(03_animatic/timing.json)을 만든다.
// CLI: node scripts/timing.mjs "projects/<slug>" --bpm 80  → JSON. timing.json이 이미 있으면 덮어쓰지 않고 exit 1.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cells = line => line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
const round = x => Math.round(x * 1000) / 1000;

export function readCutTable(md) {
  const lines = md.split(/\r?\n/);
  const h = lines.findIndex(l => l.trim().startsWith('|') && l.includes('길이(초)'));
  if (h < 0) throw new Error('컷 설계표(길이(초) 열)를 찾지 못함');
  const head = cells(lines[h]);
  const col = name => head.indexOf(name);
  const cuts = [];
  for (const line of lines.slice(h + 2)) {
    if (!line.trim().startsWith('|')) break;
    const c = cells(line);
    const copy = c[col('카피')];
    cuts.push({
      n: Number(c[col('#')]),
      role: c[col('역할')].split(/\s/)[0],
      copy: copy === '(없음)' ? '' : copy.split(' / ').join('\n'),
      dur: Number(c[col('길이(초)')]),
      keyMotionAt: [...c[col('키 모션')].matchAll(/(\d+(?:\.\d+)?)초/g)].map(m => Number(m[1])),
    });
  }
  return cuts;
}

// 한국어 읽기 시간: 줄마다 0.5초 + 어절당 0.3초 (director korean-type.md)
export function readingTime(copy) {
  if (!copy) return 0;
  return copy.split('\n').reduce((sum, line) => {
    const words = line.split(/\s+·\s+|\s+/).filter(Boolean).length;
    return sum + 0.5 + 0.3 * words;
  }, 0);
}

export function buildTiming(cuts, { bpm, width = 1920, height = 1080 }) {
  let start = 0;
  const beats = cuts.map(c => {
    const beat = {
      n: c.n, role: c.role, copy: c.copy, start: round(start), dur: c.dur,
      keyMotions: c.keyMotionAt.map(at => ({ at })), boxes: [], section: null,
    };
    start += c.dur;
    return beat;
  });
  return { version: 1, bpm, width, height, duration: round(start), audio: null, beats };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  const i = process.argv.indexOf('--bpm');
  const bpm = Number(process.argv[i + 1]);
  if (!dir || i < 0 || !bpm) {
    console.error('usage: node scripts/timing.mjs "<project dir>" --bpm <n>');
    process.exit(2);
  }
  const out = path.join(dir, '03_animatic', 'timing.json');
  if (fs.existsSync(out)) {
    console.error(`이미 있음: ${out} (에이전트가 적은 boxes를 지키기 위해 덮어쓰지 않는다)`);
    process.exit(1);
  }
  const timing = buildTiming(readCutTable(fs.readFileSync(path.join(dir, '02_story.md'), 'utf8')), { bpm });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(timing, null, 2) + '\n');
  console.log(JSON.stringify(timing, null, 2));
}
