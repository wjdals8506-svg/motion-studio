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

test('없는 video는 지우지 않고 missing으로 알린다(장면이 빠진 채 성공하면 안 됨)', () => {
  const html = '<video src="v.mp4" muted></video><img src="x.png">';
  assert.deepEqual(dropMissingMedia(html, () => true), { html, dropped: [], missing: [] });
  const r = dropMissingMedia(html, () => false);
  assert.deepEqual(r.dropped, []);
  assert.deepEqual(r.missing, ['v.mp4']);
  assert.equal(r.html, html);
});
