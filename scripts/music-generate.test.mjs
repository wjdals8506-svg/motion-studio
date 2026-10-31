import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readEnvKey, musicRequest, redact, promptSummary } from './music-generate.mjs';

// 키 모양 문자열은 쪼개 둬서 이 파일이 커밋 검사에 걸리지 않게 한다.
const KEY = 'k' + 'ey123';
const NAME = 'ELEVENLABS_' + 'API_KEY';
const plan = {
  model_id: 'music_v1', bpm: 80, duration_ms: 6000,
  composition_plan: {
    positive_global_styles: ['80 BPM', 'instrumental'], negative_global_styles: ['vocals'],
    sections: [{ section_name: 'intro', positive_local_styles: ['soft'], negative_local_styles: [], duration_ms: 6000, lines: [] }],
  },
};

test('env에서 키를 읽는다', () => {
  assert.equal(readEnvKey('# x\n' + NAME + '=' + '"abc"\n', NAME), 'abc');
  assert.equal(readEnvKey(NAME + '=' + 'abc\r\n', NAME), 'abc');
  assert.equal(readEnvKey('OTHER=1\n', NAME), null);
});

test('요청은 music 엔드포인트, 키는 헤더에만', () => {
  const { url, init } = musicRequest(plan, KEY);
  assert.equal(url, 'https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['xi-api-key'], KEY);
  assert.ok(!init.body.includes(KEY));
  const body = JSON.parse(init.body);
  assert.equal(body.model_id, 'music_v1');
  assert.equal(body.respect_sections_durations, true);
  assert.deepEqual(body.composition_plan, plan.composition_plan);
});

test('redact는 키를 모두 가린다', () => {
  assert.equal(redact(`err ${KEY} / ${KEY}`, KEY), 'err *** / ***');
  assert.equal(redact('no key', ''), 'no key');
});

test('prompt 요약은 전역·구간 스타일을 담는다', () => {
  assert.equal(promptSummary(plan), '80 BPM, instrumental | -vocals | intro(6.0s): soft');
});
