import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { lintMotion } from './motion-lint.mjs';

const page = (script, css = '', body = '') => `<html><head><style>${css}</style></head><body>${body}<script>
const tl = gsap.timeline({ paused: true });
${script}
</script></body></html>`;
const rules = html => lintMotion(html).map(f => f.rule);

test('페이드 + 슬라이드 진입은 fade-slide-in', () => {
  assert.deepEqual(rules(page(`tl.fromTo('#a', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, 1);`)), ['fade-slide-in']);
});

test('블러만 걷히는 진입(불투명도 그대로)은 통과', () => {
  assert.deepEqual(rules(page(`tl.fromTo('#a', { x: -500, filter: 'blur(10px)' }, { x: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }, 1);`)), []);
});

test('착지 뒤 선형 이동은 drift', () => {
  assert.deepEqual(rules(page(`tl.to('#t2', { x: 160, duration: 3.3, ease: 'none' }, 5);`)), ['drift']);
});

test('객체 프록시의 선형 진행(목소리 선 등)은 drift가 아니다', () => {
  assert.deepEqual(rules(page(`tl.to(proxy, { t: 30, duration: 30, ease: 'none', onUpdate: f }, 0);`)), []);
});

test('2초 넘게 0.1 이하로 커지는 스케일은 creep-scale', () => {
  assert.deepEqual(rules(page(`tl.fromTo('#t1', { scale: 0.94 }, { scale: 1.0, duration: 4.0, ease: 'power1.out' }, 0);`)), ['creep-scale']);
});

test('짧고 큰 스케일 변화(밀고 들어가기, 큰 글자 착지)는 통과', () => {
  assert.deepEqual(rules(page(`tl.to('#t3', { scale: 9, duration: 0.8, ease: 'power3.in' }, 14);`)), []);
});

test('화면 전체 층의 불투명도·색 트윈은 world-fade', () => {
  const css = '#tint { position: absolute; inset: 0; } #msg { position: absolute; }';
  const body = '<div id="veil" style="position:absolute;inset:0"></div>';
  const r = rules(page(`tl.to('#tint', { opacity: 0, duration: 0.45, ease: 'power2.in' }, 15);
tl.to('#veil', { backgroundColor: '#000', duration: 0.5, ease: 'power2.out' }, 24);
tl.to('#msg', { opacity: 0, duration: 0.2, ease: 'power2.in' }, 22);`, css, body));
  assert.deepEqual(r, ['world-fade', 'world-fade']);
});

test('ease 없는 트윈은 no-ease, set은 검사하지 않는다', () => {
  assert.deepEqual(rules(page(`tl.to('#a', { x: 10, duration: 0.5 }, 1);
tl.set('#a', { visibility: 'hidden' }, 2);`)), ['no-ease']);
});

test('결과에 줄 번호가 있다', () => {
  const [f] = lintMotion(page(`\n\ntl.to('#t2', { x: 160, duration: 3.3, ease: 'none' }, 5);`));
  assert.equal(f.line, 5);
});

test('3차 글로우 키 컷: 사용자가 거절한 판에서 다섯 종류가 모두 잡힌다', () => {
  const html = fs.readFileSync(new URL('../projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html', import.meta.url), 'utf8');
  const found = new Set(rules(html));
  for (const r of ['fade-slide-in', 'drift', 'creep-scale', 'world-fade', 'no-ease']) assert.ok(found.has(r), r);
});
