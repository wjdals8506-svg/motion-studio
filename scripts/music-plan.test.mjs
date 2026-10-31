import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMusicPlan, sectionStarts } from './music-plan.mjs';

const timing = durs => {
  let start = 0;
  return {
    bpm: 80, duration: durs.reduce((a, b) => a + b, 0),
    beats: durs.map((dur, i) => { const b = { n: i + 1, start, dur }; start += dur; return b; }),
  };
};
const brief = sections => ({
  global: { positive: ['warm piano'], negative: ['drums'] },
  sections: sections.map((beats, i) => ({ name: `s${i + 1}`, beats, positive: [], negative: [] })),
});

test('구간 길이는 컷 길이 합', () => {
  const plan = buildMusicPlan(timing([3, 4.5, 6]), brief([[1, 2], [3]]));
  assert.deepEqual(plan.composition_plan.sections.map(s => s.duration_ms), [7500, 6000]);
  assert.equal(plan.duration_ms, 13500);
  assert.equal(plan.model_id, 'music_v1');
  assert.deepEqual(plan.composition_plan.positive_global_styles.slice(0, 3), ['80 BPM', 'instrumental', 'warm piano']);
  assert.ok(plan.composition_plan.negative_global_styles.includes('vocals'));
  assert.deepEqual(plan.composition_plan.sections[0].lines, []);
});

test('3초보다 짧은 구간은 실패', () => {
  assert.throws(() => buildMusicPlan(timing([2, 4]), brief([[1], [2]])), /최소 3000ms/);
});

test('120초보다 긴 구간은 실패', () => {
  assert.throws(() => buildMusicPlan(timing([121]), brief([[1]])), /최대 120000ms/);
});

test('빠지거나 겹친 컷은 실패', () => {
  assert.throws(() => buildMusicPlan(timing([3, 4]), brief([[1], [1, 2]])), /구간/);
  assert.throws(() => buildMusicPlan(timing([3, 4]), brief([[1]])), /구간/);
});

const untilBrief = ends => ({
  global: { positive: [], negative: [] },
  sections: ends.map((until, i) => ({ name: `s${i + 1}`, until, positive: [], negative: [] })),
});

test('구간을 끝 초(until)로 정할 수 있다 — 마디·키 모션에 맞출 때', () => {
  const plan = buildMusicPlan(timing([3, 4.5, 6, 6, 4.5, 6]), untilBrief([15, 24, 30]));
  assert.deepEqual(plan.composition_plan.sections.map(s => s.duration_ms), [15000, 9000, 6000]);
  assert.deepEqual(sectionStarts(plan), [0, 15, 24]);
});

test('until은 늘어나야 하고 마지막은 영상 길이와 같아야 한다', () => {
  assert.throws(() => buildMusicPlan(timing([10, 10]), untilBrief([12, 18])), /영상 길이/);
  assert.throws(() => buildMusicPlan(timing([10, 10]), untilBrief([12, 10, 20])), /최소 3000ms/);
});

test('beats와 until을 섞으면 실패', () => {
  const b = untilBrief([5, 10]);
  b.sections[0] = { name: 'a', beats: [1], positive: [], negative: [] };
  assert.throws(() => buildMusicPlan(timing([5, 5]), b), /섞/);
});

test('구간 시작 초', () => {
  assert.deepEqual(sectionStarts(buildMusicPlan(timing([3, 4.5, 6]), brief([[1, 2], [3]]))), [0, 7.5]);
});
