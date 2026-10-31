import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderAnimatic } from './animatic.mjs';
import { missingAssets } from './check-fonts.mjs';
import { AUDIO } from './secret-scan.mjs';

const timing = (audio = null) => ({
  version: 1, bpm: 80, width: 1920, height: 1080, duration: 9, audio,
  beats: [
    { n: 1, role: 'hook', copy: '', start: 0, dur: 3, keyMotions: [], boxes: [{ x: 0.5, y: 0.6, w: 0.05, h: 0.08, label: '물방울' }], section: null },
    { n: 2, role: 'turn', copy: '스며드는\n윤종신의 목소리와 이야기', start: 3, dur: 6, keyMotions: [{ at: 15 }, { at: 18 }], boxes: [], section: null },
  ],
});
const count = (s, re) => (s.match(re) ?? []).length;

test('컷마다 clip 하나, 시작·길이가 timing과 같다', () => {
  const html = renderAnimatic(timing());
  assert.equal(count(html, /class="clip beat"/g), 2);
  assert.match(html, /data-start="3" data-duration="6"/);
  assert.match(html, /data-composition-id="main" data-start="0" data-duration="9"/);
  assert.match(html, /물방울/);
  assert.match(html, /스며드는<br>윤종신의 목소리와 이야기/);
});

test('한국어는 keep-all, 경로에 ../ 없음', () => {
  const html = renderAnimatic(timing('media/x/bgm-1.mp3'));
  assert.match(html, /word-break: keep-all/);
  assert.ok(!html.includes('../'));
});

test('음원이 없으면 audio 요소가 없다', () => {
  assert.ok(!renderAnimatic(timing()).includes('<audio'));
});

test('음원이 있으면 assets/audio 안을 가리키고, 그 경로는 커밋 검사에 막힌다', () => {
  const html = renderAnimatic(timing('media/x/bgm-1.mp3'));
  const src = html.match(/<audio[^>]*src="([^"]+)"/)[1];
  assert.equal(src, 'assets/audio/bgm.mp3');
  assert.ok(AUDIO.test(src));
});

test('키 모션마다 cue가 그 시각에 있다', () => {
  const html = renderAnimatic(timing());
  assert.equal(count(html, /class="cue"/g), 2);
  assert.ok(html.includes('}, 15)'));
  assert.ok(html.includes('}, 18)'));
});

test('CLI 결과 폴더의 로컬 에셋이 모두 있다', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), '애니매틱 테스트 '));
  fs.mkdirSync(path.join(d, '03_animatic'));
  fs.writeFileSync(path.join(d, '03_animatic', 'timing.json'), JSON.stringify(timing()));
  const cli = fileURLToPath(new URL('./animatic.mjs', import.meta.url));
  const r = spawnSync('node', [cli, d], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(missingAssets(path.join(d, '03_animatic')), []);
});
