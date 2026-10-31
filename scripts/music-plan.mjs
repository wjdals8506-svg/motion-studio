// 컷 구성(timing.json)과 음악 방향(music_brief.json)으로 ElevenLabs Music composition plan을 만든다.
// 스키마는 music_v1의 MusicPrompt (https://elevenlabs.io/docs/api-reference/music/compose, 2026-10-31 확인).
// CLI: node scripts/music-plan.mjs "projects/<slug>"  → 03_animatic/music_plan.json, timing.json의 section 채움
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MIN_MS = 3000;
const MAX_MS = 120000;

// 구간 길이(ms) 목록. 구간은 컷 묶음(beats)으로 정하거나, 마디·키 모션에 맞추려면 끝 초(until)로 정한다.
function sectionLengths(timing, sections) {
  const byUntil = sections.every(s => s.until !== undefined);
  if (!byUntil && sections.some(s => s.until !== undefined)) throw new Error('구간을 beats와 until로 섞어 정할 수 없음');
  if (byUntil) {
    if (sections.at(-1).until !== timing.duration)
      throw new Error(`마지막 구간 until ${sections.at(-1).until}초 ≠ 영상 길이 ${timing.duration}초`);
    return sections.map((s, i) => Math.round((s.until - (i ? sections[i - 1].until : 0)) * 1000));
  }
  const order = timing.beats.map(b => b.n);
  const covered = sections.flatMap(s => s.beats);
  if (covered.join() !== order.join())
    throw new Error(`구간이 컷을 순서대로 한 번씩 덮어야 함: 컷 [${order}] / 구간 [${covered}]`);
  const dur = new Map(timing.beats.map(b => [b.n, b.dur]));
  return sections.map(s => Math.round(s.beats.reduce((sum, n) => sum + dur.get(n), 0) * 1000));
}

export function buildMusicPlan(timing, brief) {
  const lengths = sectionLengths(timing, brief.sections);
  const sections = brief.sections.map((s, i) => {
    const ms = lengths[i];
    if (ms < MIN_MS) throw new Error(`구간 ${s.name} 길이 ${ms}ms < 최소 ${MIN_MS}ms`);
    if (ms > MAX_MS) throw new Error(`구간 ${s.name} 길이 ${ms}ms > 최대 ${MAX_MS}ms`);
    return {
      section_name: s.name, positive_local_styles: s.positive, negative_local_styles: s.negative,
      duration_ms: ms, lines: [],
    };
  });
  return {
    model_id: 'music_v1',
    bpm: timing.bpm,
    duration_ms: sections.reduce((sum, s) => sum + s.duration_ms, 0),
    // composition_plan에는 force_instrumental을 쓸 수 없어 스타일로 기악을 지정한다.
    composition_plan: {
      positive_global_styles: [`${timing.bpm} BPM`, 'instrumental', ...brief.global.positive],
      negative_global_styles: ['vocals', ...brief.global.negative.filter(x => x !== 'vocals')],
      sections,
    },
  };
}

export function sectionStarts(plan) {
  let t = 0;
  return plan.composition_plan.sections.map(s => { const start = t; t += s.duration_ms / 1000; return start; });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/music-plan.mjs "<project dir>"');
    process.exit(2);
  }
  const out = path.join(dir, '03_animatic');
  const timingFile = path.join(out, 'timing.json');
  const timing = JSON.parse(fs.readFileSync(timingFile, 'utf8'));
  const brief = JSON.parse(fs.readFileSync(path.join(out, 'music_brief.json'), 'utf8'));
  let plan;
  try {
    plan = buildMusicPlan(timing, brief);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  // 각 컷의 section은 컷이 시작하는 시각이 속한 구간의 이름이다.
  const starts = sectionStarts(plan);
  for (const b of timing.beats)
    b.section = plan.composition_plan.sections[starts.findLastIndex(t => t <= b.start)].section_name;
  fs.writeFileSync(timingFile, JSON.stringify(timing, null, 2) + '\n');
  fs.writeFileSync(path.join(out, 'music_plan.json'), JSON.stringify(plan, null, 2) + '\n');
  console.log(JSON.stringify(plan, null, 2));
}
