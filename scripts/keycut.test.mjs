import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { keycutWindow, renderKeycut } from './keycut.mjs';
import { missingAssets } from './check-fonts.mjs';

const b = (n, start, dur, copy = '', keys = []) =>
  ({ n, role: 'x', copy, start, dur, keyMotions: keys.map(at => ({ at })), boxes: [], section: null });
const timing = {
  version: 1, bpm: 80, width: 1920, height: 1080, duration: 30, audio: null, retimed: true,
  beats: [b(1, 0, 13.545), b(4, 13.545, 6, '스며드는', [15.045, 18.045]), b(5, 19.545, 4.5), b(6, 24.045, 5.955, '가을냄새', [24.045])],
};

test('keycutWindow는 범위의 컷과 큐를 지역 시각으로', () => {
  assert.deepEqual(keycutWindow(timing, 13.545, 19.545), {
    duration: 6,
    beats: [{ n: 4, copy: '스며드는', start: 0, dur: 6 }],
    cues: [{ at: 1.5, n: 4 }, { at: 4.5, n: 4 }],
    mediaStart: 13.545,
  });
});

test('범위에 걸친 컷은 잘라서 넣는다', () => {
  const w = keycutWindow(timing, 18, 21);
  assert.deepEqual(w.beats.map(x => [x.n, x.start, x.dur]), [[4, 0, 1.545], [5, 1.545, 1.455]]);
  assert.deepEqual(w.cues, [{ at: 0.045, n: 4 }]);
});

test('범위가 영상 밖이거나 뒤집히면 실패', () => {
  assert.throws(() => keycutWindow(timing, 25, 31), /범위/);
  assert.throws(() => keycutWindow(timing, -1, 3), /범위/);
  assert.throws(() => keycutWindow(timing, 5, 5), /범위/);
});

test('renderKeycut', () => {
  const html = renderKeycut(keycutWindow(timing, 13.545, 19.545), { css: ':root { --color-ink: #fff; }', audio: 'bgm.mp3', width: 1920, height: 1080 });
  assert.match(html, /data-composition-id="main" data-start="0" data-duration="6"/);
  assert.equal((html.match(/class="clip"/g) ?? []).length, 1);
  assert.match(html, /--color-ink/);
  assert.match(html, /window\.__cues = \[1\.5,4\.5\]/);
  assert.match(html, /<audio id="bgm" src="assets\/audio\/bgm\.mp3"[^>]*data-media-start="13\.545"/);
  assert.ok(!html.includes('../'));
  assert.ok(!renderKeycut(keycutWindow(timing, 0, 3), { css: '', audio: null, width: 1920, height: 1080 }).includes('<audio'));
});

test('CLI는 손으로 쓴 키 컷을 덮어쓰지 않는다', () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), '키 컷 테스트 '));
  fs.mkdirSync(path.join(d, '03_animatic'));
  fs.mkdirSync(path.join(d, '04_design'));
  fs.writeFileSync(path.join(d, '03_animatic', 'timing.json'), JSON.stringify(timing));
  fs.writeFileSync(path.join(d, '04_design', 'design_tokens.json'), JSON.stringify({
    version: 1, colors: { ground: '#1d1a17', ink: '#f3ede4', muted: '#a39a8e', accent: '#e7b77a' },
    type: { families: { sans: 'Pretendard' }, roles: { headline: { family: 'sans', weight: 600, size_h: 0.09, line: 1.25, tracking: -0.02, readable: true } } },
    texture: {}, motion: { enter: 'emphasized-decelerate', exit: 'emphasized-accelerate', idle: 'still' },
  }));
  const cli = fileURLToPath(new URL('./keycut.mjs', import.meta.url));
  const run = () => spawnSync('node', [cli, d, '--name', 'wind', '--from', '13.545', '--to', '19.545'], { encoding: 'utf8' });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  assert.deepEqual(missingAssets(path.join(d, '04_design', 'keycuts', 'wind')), []);
  assert.equal(run().status, 1);
});
