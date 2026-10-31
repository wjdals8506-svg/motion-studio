import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = fileURLToPath(new URL('./retime.mjs', import.meta.url));
const beat = (n, start, dur) => ({ n, role: 'x', copy: '', start, dur, keyMotions: [], boxes: [], section: null });
const timing = (durs, extra = {}) => {
  let s = 0;
  return { version: 1, bpm: 80, width: 1920, height: 1080, duration: durs.reduce((a, b) => a + b, 0), audio: null,
    beats: durs.map((d, i) => { const b = beat(i + 1, s, d); s += d; return b; }), ...extra };
};
const project = (current, before) => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), '재조정 CLI '));
  const a = path.join(d, '03_animatic');
  fs.mkdirSync(a);
  fs.writeFileSync(path.join(a, 'timing.json'), JSON.stringify(current));
  if (before) fs.writeFileSync(path.join(a, 'timing.before-retime.json'), JSON.stringify(before));
  fs.writeFileSync(path.join(a, 'music_map.json'), JSON.stringify({ duration: 10, bpm: 80, beats: [], downbeats: [] }));
  return d;
};
const run = d => spawnSync('node', [CLI, d], { encoding: 'utf8' });
const read = d => JSON.parse(fs.readFileSync(path.join(d, '03_animatic', 'timing.json'), 'utf8'));

test('새로 만든 timing.json이면 오래된 보관본을 새 기준으로 바꾼다', () => {
  const d = project(timing([3, 4, 3]), timing([3, 6, 1]));
  assert.equal(run(d).status, 0);
  assert.deepEqual(read(d).beats.map(b => b.dur), [3, 4, 3]);
  assert.equal(read(d).retimed, true);
});

test('재조정한 뒤 컷 구성을 바꿨으면 멈춘다', () => {
  const before = timing([3, 4, 3]);
  const d = project({ ...timing([3, 7]), retimed: true }, before);
  const r = run(d);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /보관본/);
});
