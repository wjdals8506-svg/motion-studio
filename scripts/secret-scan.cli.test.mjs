import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 실제 git 레포에서 훅이 보는 그대로 검사한다. 키 값은 쪼개 둔다.
const SCAN = fileURLToPath(new URL('./secret-scan.mjs', import.meta.url));
const KEY = 'sk_' + 'a1'.repeat(24);
const repo = () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), '비밀 검사 '));
  const git = (...a) => execFileSync('git', a, { cwd: d });
  git('init', '-q');
  git('config', 'user.email', 't@t'); git('config', 'user.name', 't');
  return { d, git, write: (f, s) => fs.writeFileSync(path.join(d, f), s) };
};
const scan = d => spawnSync('node', [SCAN], { cwd: d, encoding: 'utf8' }).status;

test('이름을 바꾼 파일에 넣은 키도 막는다', () => {
  const { d, git, write } = repo();
  write('big.md', Array.from({ length: 200 }, (_, i) => `줄 ${i}`).join('\n'));
  git('add', '.'); git('commit', '-qm', 'a');
  git('mv', 'big.md', 'big2.md');
  fs.appendFileSync(path.join(d, 'big2.md'), `\nkey: ${KEY}\n`);
  git('add', '.');
  assert.equal(scan(d), 1);
});

test('작업 트리에서만 지운 키도 스테이징 내용으로 막는다', () => {
  const { d, git, write } = repo();
  write('s.md', `key: ${KEY}\n`);
  git('add', '.');
  write('s.md', '지움\n');
  assert.equal(scan(d), 1);
});

test('오디오 파일 스테이징을 막는다', () => {
  const { d, git, write } = repo();
  write('bgm.opus', 'x');
  git('add', '-f', '.');
  assert.equal(scan(d), 1);
});

test('평범한 파일은 통과', () => {
  const { d, git, write } = repo();
  write('a.md', '키는 .env에 둔다\n');
  write('notes_mp3', '확장자가 아닌 이름\n');
  git('add', '.');
  assert.equal(scan(d), 0);
});

test('애니매틱 음원 사본 폴더는 확장자와 관계없이 막는다', () => {
  const { d, git, write } = repo();
  fs.mkdirSync(path.join(d, 'p', '03_animatic', 'assets', 'audio'), { recursive: true });
  write('p/03_animatic/assets/audio/bgm.aiff', 'x');
  git('add', '-f', '.');
  assert.equal(scan(d), 1);
});
