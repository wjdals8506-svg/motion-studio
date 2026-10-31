import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAudioReport, pickDownbeats } from './music-map.mjs';

// hyperframes 0.8.221 `audio --only beats,downbeats,bpm --json`을 80 BPM 클릭음(마디 첫 박 0·3·6·9초)에 돌린 실측값
const BEATS = Array.from({ length: 15 }, (_, i) => Math.round((0.755 + 0.75 * i) * 1000) / 1000);
const REPORT = {
  version: 1,
  items: [{
    file: 'click80.wav', duration: 12,
    provenance: { beats: 'signal', downbeats: 'signal', bpm: 'signal' },
    beats: { times: BEATS, confidence: 0.927 },
    downbeats: { times: [1.505, 4.505, 7.505, 10.505], meter: 4, confidence: 'low' },
    bpm: { value: 80 },
  }],
};

test('정규화', () => {
  const m = normalizeAudioReport(REPORT);
  assert.equal(m.bpm, 80);
  assert.equal(m.duration, 12);
  assert.equal(m.downbeatSource, 'signal');
  assert.equal(m.downbeatConfidence, 'low');
  assert.equal(m.beatConfidence, 0.927);
  assert.deepEqual(m.downbeats, [1.505, 4.505, 7.505, 10.505]);
  assert.equal(m.beats.length, 15);
});

test('pickDownbeats는 구간 시작에 맞는 위상을 고른다', () => {
  assert.deepEqual(pickDownbeats(BEATS, 4, [3, 6, 9]), [3.005, 6.005, 9.005]);
});
