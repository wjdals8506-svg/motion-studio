import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkManifest, addEntry } from './manifest.mjs';

const music = over => ({
  id: 'bgm-1', path: 'media/x/bgm-1.mp3', kind: 'music', source: 'elevenlabs',
  model: 'music_v1', prompt: '80 BPM, warm piano', license: 'ElevenLabs Music Terms (Creator)',
  commercial: true, public_redistribution: false, ...over,
});

test('정상 항목은 문제 없음', () => {
  assert.deepEqual(checkManifest([music()]), []);
});

test('공개 재배포 불가 음원이 media 밖이면 문제', () => {
  assert.equal(checkManifest([music({ path: 'projects/x/03_animatic/assets/audio/bgm.mp3' })]).length, 1);
});

test('ElevenLabs 음원은 model·prompt 필수', () => {
  assert.equal(checkManifest([music({ model: undefined, prompt: '' })]).length, 2);
});

test('필수 필드가 비면 문제', () => {
  assert.equal(checkManifest([music({ license: '' })]).length, 1);
  assert.equal(checkManifest([music({ commercial: undefined })]).length, 1);
});

test('addEntry는 같은 id를 교체한다', () => {
  const f = path.join(fs.mkdtempSync(path.join(os.tmpdir(), '목록 ')), 'assets.manifest.json');
  addEntry(f, music());
  addEntry(f, music({ prompt: 'new' }));
  addEntry(f, music({ id: 'bgm-2' }));
  const list = JSON.parse(fs.readFileSync(f, 'utf8'));
  assert.deepEqual(list.map(e => [e.id, e.prompt]), [['bgm-1', 'new'], ['bgm-2', '80 BPM, warm piano']]);
});
