import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retime } from './retime.mjs';

const timing = (cuts, keyAt = []) => {
  let start = 0;
  const beats = cuts.map(([dur, copy = ''], i) => {
    const b = { n: i + 1, role: 'x', copy, start, dur, keyMotions: [], boxes: [], section: null };
    start += dur;
    return b;
  });
  for (const at of keyAt) beats.find(b => at >= b.start && at < b.start + b.dur).keyMotions.push({ at });
  return { version: 1, bpm: 80, width: 1920, height: 1080, duration: start, audio: null, beats };
};
const map = (downbeats, beats = [], duration) => ({ duration, bpm: 80, beats, downbeats });

test('경계는 오차 안 마디 첫 박으로', () => {
  const r = retime(timing([[3], [4.5]]), map([0.12, 3.12, 6.12], [], 7.5));
  assert.deepEqual(r.timing.beats.map(b => [b.start, b.dur]), [[0, 3.12], [3.12, 4.38]]);
  assert.equal(r.shifts.length, 1);
  assert.deepEqual(r.warnings, []);
});

test('마디 첫 박이 없으면 오차 안 박으로', () => {
  const r = retime(timing([[3], [4.5]]), map([], [2.85], 7.5));
  assert.equal(r.timing.beats[1].start, 2.85);
});

test('오차 밖이면 그대로', () => {
  const r = retime(timing([[3], [4.5]]), map([3.5], [], 7.5));
  assert.equal(r.timing.beats[1].start, 3);
  assert.equal(r.shifts.length, 0);
});

test('너무 짧아지면 옮기지 않는다', () => {
  const r = retime(timing([[1.1], [2.9]]), map([0.85], [], 4));
  assert.equal(r.timing.beats[1].start, 1.1);
  assert.equal(r.warnings.length, 1);
  assert.match(r.warnings[0], /컷 2 시작 1.1초/);
});

test('읽기 시간보다 짧아져도 옮기지 않는다', () => {
  // 카피 3어절 = 0.5 + 0.9 = 1.4초. 1.5초 컷을 1.25초로 줄이는 이동은 막는다.
  const r = retime(timing([[1.5, '하나 둘 셋'], [3]]), map([1.25], [], 4.5));
  assert.equal(r.timing.beats[1].start, 1.5);
});

test('키 모션도 맞춘다', () => {
  const r = retime(timing([[13.5], [6]], [18]), map([18.12], [], 19.5));
  assert.equal(r.timing.beats[1].keyMotions[0].at, 18.12);
});

test('곡 길이가 다르면 경고, 영상 길이는 그대로', () => {
  const r = retime(timing([[15], [15]]), map([], [], 29.6));
  assert.ok(r.warnings.some(w => w.includes('곡 길이')));
  assert.equal(r.timing.duration, 30);
  assert.equal(r.timing.beats.at(-1).start + r.timing.beats.at(-1).dur, 30);
});

test('원본 timing은 바꾸지 않는다', () => {
  const t = timing([[3], [4.5]]);
  retime(t, map([3.12], [], 7.5));
  assert.equal(t.beats[1].start, 3);
});
