// 박자 지도(music_map.json)에 맞춰 컷 경계와 키 모션을 옮긴다(director music.md).
// 곡 길이와 영상 길이는 바꾸지 않는다. 옮기면 컷이 너무 짧아지는 경계는 그대로 두고 경고한다.
// CLI: node scripts/retime.mjs "projects/<slug>"  → timing.json 갱신(처음 한 번 timing.before-retime.json 보관), JSON { shifts, warnings }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readingTime } from './timing.mjs';

const round = x => Math.round(x * 1000) / 1000;
const nearest = (list, x) => list.reduce((best, v) => (best === null || Math.abs(v - x) < Math.abs(best - x) ? v : best), null);

export function retime(timing, map, { tolerance = 0.3, minDur = 1.0 } = {}) {
  const t = structuredClone(timing);
  const shifts = [];
  const warnings = [];
  const snap = x => {
    for (const list of [map.downbeats, map.beats]) {
      const v = nearest(list, x);
      if (v !== null && Math.abs(v - x) <= tolerance) return round(v);
    }
    return x;
  };
  const min = b => Math.max(minDur, readingTime(b.copy));

  if (map.duration !== undefined && Math.abs(map.duration - t.duration) > 0.1)
    warnings.push(`곡 길이 ${map.duration}초 ≠ 영상 길이 ${t.duration}초`);

  const bs = t.beats;
  for (let i = 1; i < bs.length; i++) {
    const from = bs[i].start;
    const to = snap(from);
    if (to === from) continue;
    const nextStart = i + 1 < bs.length ? bs[i + 1].start : t.duration;
    if (to - bs[i - 1].start >= min(bs[i - 1]) && nextStart - to >= min(bs[i])) {
      bs[i].start = to;
      shifts.push({ what: `컷 ${bs[i].n} 시작`, from, to });
    } else {
      warnings.push(`컷 ${bs[i].n} 시작 ${from}초: 박자로 옮기면 너무 짧아져 그대로 둠`);
    }
  }
  bs.forEach((b, i) => { b.dur = round((i + 1 < bs.length ? bs[i + 1].start : t.duration) - b.start); });

  for (const b of bs) for (const k of b.keyMotions) {
    const to = snap(k.at);
    if (to !== k.at) {
      shifts.push({ what: `키 모션 (컷 ${b.n})`, from: k.at, to });
      k.at = to;
    }
  }
  return { timing: t, shifts, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/retime.mjs "<project dir>"');
    process.exit(2);
  }
  const out = path.join(dir, '03_animatic');
  const timingFile = path.join(out, 'timing.json');
  const before = path.join(out, 'timing.before-retime.json');
  if (!fs.existsSync(before)) fs.copyFileSync(timingFile, before);
  // 늘 보관본에서 다시 계산해, 여러 번 돌려도 옮긴 값 위에 또 옮기지 않는다.
  const timing = JSON.parse(fs.readFileSync(before, 'utf8'));
  const current = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
  const map = JSON.parse(fs.readFileSync(path.join(out, 'music_map.json'), 'utf8'));
  const r = retime({ ...timing, audio: current.audio, beats: timing.beats.map((b, i) => ({ ...b, boxes: current.beats[i]?.boxes ?? b.boxes, section: current.beats[i]?.section ?? b.section })) }, map);
  fs.writeFileSync(timingFile, JSON.stringify(r.timing, null, 2) + '\n');
  console.log(JSON.stringify({ shifts: r.shifts, warnings: r.warnings }, null, 2));
}
