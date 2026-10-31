import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { readCutTable, readingTime, buildTiming } from './timing.mjs';

const TABLE = `| # | 역할 | 시청자가 믿게 될 것 | 카피 | 연결(서사) | 연결(디자인) | 키 모션 | 길이(초) |
|---|---|---|---|---|---|---|---|
| 1 | hook (2) | a | (없음) | b | c | — | 3.0 |
| 2 | turn (3) | a | 스며드는 / 윤종신의 목소리와 이야기 | b | c | **바람**(15.0초 시작, "스며드는" 18.0초 착지) | 6.0 |`;

const round1 = x => Math.round(x * 10) / 10;

test('컷 설계표를 읽는다', () => {
  assert.deepEqual(readCutTable(TABLE), [
    { n: 1, role: 'hook', copy: '', dur: 3, keyMotionAt: [] },
    { n: 2, role: 'turn', copy: '스며드는\n윤종신의 목소리와 이야기', dur: 6, keyMotionAt: [15, 18] },
  ]);
});

test('읽기 시간은 줄마다 0.5초 + 어절당 0.3초', () => {
  assert.equal(round1(readingTime('스며드는\n윤종신의 목소리와 이야기')), 2.2);
  assert.equal(round1(readingTime('서울 · 인천 · 수원')), 1.4);
  assert.equal(readingTime(''), 0);
});

test('시작 시각은 누적합', () => {
  const t = buildTiming(readCutTable(TABLE), { bpm: 80 });
  assert.deepEqual(t.beats.map(b => [b.start, b.dur]), [[0, 3], [3, 6]]);
  assert.equal(t.duration, 9);
  assert.equal(t.bpm, 80);
  assert.equal(t.audio, null);
  assert.deepEqual(t.beats[1].keyMotions, [{ at: 15 }, { at: 18 }]);
  assert.deepEqual(t.beats[0].boxes, []);
});

test('파일럿 설계표는 6컷 30초', () => {
  const md = fs.readFileSync(new URL('../projects/yoon-jongshin-concert-teaser/02_story.md', import.meta.url), 'utf8');
  const t = buildTiming(readCutTable(md), { bpm: 80 });
  assert.equal(t.beats.length, 6);
  assert.equal(t.duration, 30);
  assert.deepEqual(t.beats.flatMap(b => b.keyMotions.map(k => k.at)), [15, 18, 24]);
});
