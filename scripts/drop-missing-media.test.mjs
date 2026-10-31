import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dropMissingMedia } from './drop-missing-media.mjs';

test('dropMissingMedia는 없는 음원만 지운다', () => {
  const html = '<div>\n  <audio id="bgm" src="assets/audio/bgm.mp3" data-start="0"></audio>\n  <audio src="assets/sfx/a.wav"></audio>\n</div>';
  const r = dropMissingMedia(html, s => s.includes('sfx'));
  assert.ok(!r.html.includes('bgm.mp3'));
  assert.ok(r.html.includes('a.wav'));
  assert.deepEqual(r.dropped, ['assets/audio/bgm.mp3']);
});

test('video도 같은 규칙, 다 있으면 그대로', () => {
  const html = '<video src="v.mp4" muted></video><img src="x.png">';
  assert.deepEqual(dropMissingMedia(html, () => true), { html, dropped: [] });
  assert.deepEqual(dropMissingMedia(html, () => false).dropped, ['v.mp4']);
});
