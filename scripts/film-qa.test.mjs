import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filmQa } from './film-qa.mjs';

const timing = {
  duration: 30,
  beats: [
    { n: 4, copy: '스며드는', start: 13.545, dur: 6, keyMotions: [{ at: 15.045 }, { at: 18.045 }] },
    { n: 6, copy: '가을냄새', start: 24.045, dur: 5.955, keyMotions: [{ at: 24.045 }] },
  ],
};
const ok = {
  timing,
  sfx: [{ name: 'wind', at: 15.05 }, { name: 'title', at: 24.045 }],
  copyWindows: [{ copy: '스며드는\n윤종신의 목소리와 이야기', from: 16.3, to: 19.545 }],
  endHold: 1.2, manifestProblems: [], copiesMatch: true,
};

test('정상이면 오류 없음', () => {
  assert.deepEqual(filmQa(ok).errors, []);
});

test('키 모션과 0.1초 넘게 떨어진 효과음은 오류', () => {
  const r = filmQa({ ...ok, sfx: [{ name: 'whoosh', at: 20.0 }] });
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /whoosh/);
});

test('엔드 홀드는 0.6~1.4초', () => {
  assert.ok(filmQa({ ...ok, endHold: 0.5 }).errors.some(e => /엔드 홀드/.test(e)));
  assert.ok(filmQa({ ...ok, endHold: 1.5 }).errors.some(e => /엔드 홀드/.test(e)));
  assert.deepEqual(filmQa({ ...ok, endHold: 0.6 }).errors, []);
});

test('카피가 읽기 시간보다 짧게 보이면 오류', () => {
  const r = filmQa({ ...ok, copyWindows: [{ copy: '스며드는\n윤종신의 목소리와 이야기', from: 18, to: 19.545 }] });
  assert.ok(r.errors.some(e => /읽기 시간/.test(e)));
});

test('에셋 목록 문제와 렌더러 사본 불일치는 오류', () => {
  assert.equal(filmQa({ ...ok, manifestProblems: ['x: license 없음'], copiesMatch: false }).errors.length, 2);
});

import { sfxFromHtml, timingFromHtml, sameTiming } from './film-qa.mjs';

test('효과음은 sfx.json이 아니라 영상(index.html)의 audio 요소에서 읽는다', () => {
  const html = '<audio id="bgm" src="a.mp3" data-start="0"></audio>\n<audio id="sfx-gather" src="assets/audio/sfx-gather.mp3" data-start="20" data-duration="2"></audio>';
  assert.deepEqual(sfxFromHtml(html), [{ name: 'gather', at: 20 }]);
  assert.equal(filmQa({ ...ok, sfx: sfxFromHtml(html) }).errors.length, 1);
});

test('영상에 박힌 타이밍이 timing.json과 다르면 알 수 있다', () => {
  const html = `window.__timing = ${JSON.stringify({ beats: [{ n: 4, start: 13.545, dur: 6, keyMotions: [18.045] }], duration: 30 })};`;
  const embedded = timingFromHtml(html);
  assert.equal(sameTiming(embedded, { duration: 30, beats: [{ n: 4, start: 13.545, dur: 6, keyMotions: [{ at: 18.045 }] }] }), true);
  assert.equal(sameTiming(embedded, { duration: 30, beats: [{ n: 4, start: 13.545, dur: 6, keyMotions: [{ at: 18.5 }] }] }), false);
});
