import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrast, checkTokens, tokensToCss } from './design-tokens.mjs';

const tokens = over => ({
  version: 1,
  source: { style: '19 Grainy Gradient', why: 'test' },
  colors: { ground: '#1d1a17', ink: '#f3ede4', muted: '#a39a8e', accent: '#e7b77a' },
  type: {
    families: { sans: 'Pretendard' },
    roles: { headline: { family: 'sans', weight: 600, size_h: 0.09, line: 1.25, tracking: -0.02, readable: true } },
  },
  texture: {},
  motion: { enter: 'emphasized-decelerate', exit: 'emphasized-accelerate', idle: 'still' },
  ...over,
});
const opts = {
  motion: { easings: { 'emphasized-decelerate': [], 'emphasized-accelerate': [] }, measured_eases: { crashIn: {} } },
  fontExists: () => true,
};
const withRole = (role, def, extra = {}) => tokens({ type: { families: { sans: 'Pretendard', ...extra }, roles: { [role]: def } } });

test('대비 계산', () => {
  assert.equal(Math.round(contrast('#000000', '#ffffff')), 21);
  assert.equal(Math.round(contrast('#777777', '#ffffff') * 100) / 100, 4.48);
});

test('정상 토큰은 오류 없음', () => {
  assert.deepEqual(checkTokens(tokens(), opts), { errors: [], warnings: [] });
});

test('글자 대비 부족은 오류', () => {
  const r = checkTokens(tokens({ colors: { ground: '#e9e6e0', ink: '#d8d4cc', muted: '#555555', accent: '#e7b77a' } }), opts);
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /ink/);
});

test('필수 색이 없거나 형식이 틀리면 오류', () => {
  const r = checkTokens(tokens({ colors: { ground: '#1d1a17', ink: 'white', muted: '#a39a8e' } }), opts);
  assert.ok(r.errors.some(e => /ink/.test(e)));
  assert.ok(r.errors.some(e => /accent/.test(e)));
});

test('읽는 글자 2.6% 미만은 오류, 4% 미만은 경고', () => {
  const small = checkTokens(withRole('info', { family: 'sans', weight: 400, size_h: 0.02, line: 1.4, tracking: 0, readable: true }), opts);
  assert.ok(small.errors.some(e => /info/.test(e)));
  const mid = checkTokens(withRole('info', { family: 'sans', weight: 400, size_h: 0.035, line: 1.4, tracking: 0, readable: true }), opts);
  assert.deepEqual(mid.errors, []);
  assert.ok(mid.warnings.some(w => /info/.test(w)));
  const texture = checkTokens(withRole('grain', { family: 'sans', weight: 400, size_h: 0.015, line: 1, tracking: 0, readable: false }), opts);
  assert.deepEqual(texture, { errors: [], warnings: [] });
});

test('레포에 없는 글꼴은 오류', () => {
  const t = withRole('title', { family: 'hand', weight: 400, size_h: 0.14, line: 1.1, tracking: 0, readable: true }, { hand: 'Nanum Pen' });
  const r = checkTokens(t, { ...opts, fontExists: f => f === 'Pretendard' });
  assert.ok(r.errors.some(e => /Nanum Pen/.test(e)));
});

test('families에 없는 family 키는 오류', () => {
  const r = checkTokens(withRole('title', { family: 'serif', weight: 400, size_h: 0.1, line: 1, tracking: 0, readable: true }), opts);
  assert.ok(r.errors.some(e => /serif/.test(e)));
});

test('모션 이름은 motion.json에 있어야 하고 idle은 still·breathe', () => {
  const r = checkTokens(tokens({ motion: { enter: 'bouncy', exit: 'crashIn', idle: 'wiggle' } }), opts);
  assert.ok(r.errors.some(e => /bouncy/.test(e)));
  assert.ok(r.errors.some(e => /wiggle/.test(e)));
  assert.ok(!r.errors.some(e => /crashIn/.test(e)));
});

test('CSS 변수', () => {
  const css = tokensToCss(tokens(), 1080);
  assert.match(css, /--color-ink: #f3ede4;/);
  assert.match(css, /--font-sans: 'Pretendard', sans-serif;/);
  assert.match(css, /--type-headline-size: 97px;/);
  assert.match(css, /--type-headline-weight: 600;/);
  assert.match(css, /--type-headline-tracking: -0.02em;/);
});

test('글자 크기 키 오타·누락은 오류, readable은 false라고 적었을 때만 건너뛴다', () => {
  const typo = checkTokens(withRole('info', { family: 'sans', weight: 400, sizeH: 0.02, line: 1.4, tracking: 0, readable: true }), opts);
  assert.ok(typo.errors.some(e => /info.*size_h/.test(e)));
  const noFlag = checkTokens(withRole('info', { family: 'sans', weight: 400, size_h: 0.01, line: 1.4, tracking: 0 }), opts);
  assert.ok(noFlag.errors.some(e => /info/.test(e)));
});
