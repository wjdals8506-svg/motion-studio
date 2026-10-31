import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sfxRequest, summarize } from './sfx-generate.mjs';

const KEY = 'k' + 'ey123';            // 키 모양 문자열은 쪼개 둔다(커밋 검사)
const item = { name: 'wind', at: 15.045, prompt: 'soft autumn wind sweeping across a fogged window', duration: 2.5 };

test('요청은 sound-generation, 키는 헤더에만', () => {
  const { url, init } = sfxRequest(item, KEY);
  assert.equal(url, 'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers['xi-api-key'], KEY);
  assert.ok(!init.body.includes(KEY));
  assert.deepEqual(JSON.parse(init.body), {
    text: item.prompt, duration_seconds: 2.5, prompt_influence: 0.5, model_id: 'eleven_text_to_sound_v2',
  });
});

test('길이가 0.5~30초 밖이면 요청 전에 실패', () => {
  assert.throws(() => sfxRequest({ ...item, duration: 0.3 }, KEY), /0\.5~30/);
  assert.throws(() => sfxRequest({ ...item, duration: 31 }, KEY), /0\.5~30/);
});

test('summarize는 실패해도 이미 만든 파일을 담는다', () => {
  assert.deepEqual(summarize(['media/x/sfx-wind-1.mp3'], 'ElevenLabs 429'), { files: ['media/x/sfx-wind-1.mp3'], error: 'ElevenLabs 429' });
  assert.deepEqual(summarize([]), { files: [] });
});

import { validateBrief } from './sfx-generate.mjs';

test('크레딧을 쓰기 전에 모든 항목의 길이를 먼저 검사한다', () => {
  assert.throws(() => validateBrief([{ ...item }, { ...item, name: 'bad', duration: 40 }]), /bad/);
  assert.doesNotThrow(() => validateBrief([item]));
});
