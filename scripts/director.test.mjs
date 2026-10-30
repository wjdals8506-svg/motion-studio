import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const SKILL_DIR = '.claude/skills/director';
const skill = fs.readFileSync(path.join(SKILL_DIR, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
const tokens = JSON.parse(fs.readFileSync('tokens/motion.json', 'utf8'));
const runtime = fs.readFileSync('vendor/motionmaxxing/runtime/motion.js', 'utf8');

test('SKILL.md front matter에 name과 description이 있다', () => {
  assert.match(skill, /^---\n[\s\S]*?^name: director$[\s\S]*?^description: .+$[\s\S]*?^---$/m);
});

test('SKILL.md가 링크한 references 파일이 모두 존재하고 출처 표기가 있다', () => {
  const links = [...new Set([...skill.matchAll(/\]\((references\/[^)]+\.md)\)/g)].map(m => m[1]))];
  assert.ok(links.length >= 6, `링크 ${links.length}개`);
  for (const l of links) {
    const p = path.join(SKILL_DIR, l);
    assert.ok(fs.existsSync(p), l);
    assert.match(fs.readFileSync(p, 'utf8'), /\(출처: [^)]+\)/, `${l}에 출처 표기 없음`);
  }
});

test('M3 이징은 [x1,y1,x2,y2]이고 x1,x2는 0~1', () => {
  for (const n of ['standard', 'emphasized-decelerate']) assert.ok(n in tokens.easings, n);
  for (const [name, v] of Object.entries(tokens.easings)) {
    assert.equal(v.length, 4, name);
    assert.ok(v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1, name);
  }
});

test('실측 이징 12개가 원본 motion.js와 이름·프레임 수가 같다', () => {
  const frames = JSON.parse(
    runtime.match(/const EASE_FRAMES = (\{[^}]+\})/)[1].replace(/(\w+):/g, '"$1":')
  );
  assert.equal(Object.keys(frames).length, 12);
  assert.deepEqual(Object.keys(tokens.measured_eases).sort(), Object.keys(frames).sort());
  for (const [name, f] of Object.entries(frames)) assert.equal(tokens.measured_eases[name].frames, f, name);
});

test('end_hold_s는 [0.6, 1.4]', () => {
  assert.deepEqual(tokens.end_hold_s, [0.6, 1.4]);
});
