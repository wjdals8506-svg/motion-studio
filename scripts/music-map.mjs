// 고른 곡의 박자 지도(03_animatic/music_map.json)를 만든다. 분석은 hyperframes audio(signal)로 하고,
// 마디 첫 박 신뢰도가 low면 음악 구간 시작점에 가장 잘 맞는 위상으로 다시 고른다(3단계 계획 결정 3).
// CLI: node scripts/music-map.mjs "projects/<slug>" "<음원 경로>"  → JSON
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sectionStarts } from './music-plan.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const HF = path.join(ROOT, 'node_modules', 'hyperframes', 'bin', 'hyperframes.mjs');

export function normalizeAudioReport(report) {
  const it = report.items[0];
  return {
    file: it.file,
    duration: it.duration,
    bpm: it.bpm?.value ?? null,
    beats: it.beats?.times ?? [],
    downbeats: it.downbeats?.times ?? [],
    downbeatSource: it.provenance?.downbeats ?? 'signal',
    beatConfidence: it.beats?.confidence ?? null,
    downbeatConfidence: it.downbeats?.confidence ?? 'low',
  };
}

export function pickDownbeats(beats, meter, anchors) {
  let best = null;
  for (let p = 0; p < meter; p++) {
    const cand = beats.filter((_, i) => i % meter === p);
    if (!cand.length) continue;
    const cost = anchors.reduce((sum, a) => sum + Math.min(...cand.map(c => Math.abs(c - a))), 0);
    if (!best || cost < best.cost) best = { cost, cand };
  }
  return best?.cand ?? [];
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir, file] = process.argv.slice(2);
  if (!dir || !file || !fs.existsSync(file)) {
    console.error('usage: node scripts/music-map.mjs "<project dir>" "<audio file>"');
    process.exit(2);
  }
  const out = path.join(dir, '03_animatic');
  const report = JSON.parse(execFileSync(process.execPath,
    [HF, 'audio', file, '--only', 'beats,downbeats,bpm', '--quality', 'local', '--json'],
    { encoding: 'utf8', env: { ...process.env, HYPERFRAMES_NO_TELEMETRY: '1' }, maxBuffer: 1 << 26 }));
  const map = normalizeAudioReport(report);
  if (map.downbeatConfidence === 'low') {
    const plan = JSON.parse(fs.readFileSync(path.join(out, 'music_plan.json'), 'utf8'));
    // signal 분석은 0초의 첫 박을 자주 놓치므로 0은 기준점에서 뺀다.
    map.downbeats = pickDownbeats(map.beats, 4, sectionStarts(plan).filter(t => t > 0));
    map.downbeatSource = 'plan-phase';
  }
  map.file = path.relative(ROOT, path.resolve(file)).split(path.sep).join('/');
  fs.writeFileSync(path.join(out, 'music_map.json'), JSON.stringify(map, null, 2) + '\n');
  console.log(JSON.stringify({ ...map, beats: map.beats.length, downbeats: map.downbeats }, null, 2));
}
