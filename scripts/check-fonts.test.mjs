import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { missingAssets } from './check-fonts.mjs';

const project = html => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), '글꼴 검사 '));
  fs.mkdirSync(path.join(d, 'assets/fonts'), { recursive: true });
  fs.writeFileSync(path.join(d, 'assets/fonts/Pretendard-SemiBold.woff2'), '');
  fs.writeFileSync(path.join(d, 'index.html'), html);
  return d;
};

test('있는 글꼴은 통과', () => {
  assert.deepEqual(missingAssets(project("src: url('assets/fonts/Pretendard-SemiBold.woff2')")), []);
});

test('대소문자가 다른 글꼴 경로는 리눅스에서 없는 파일이다', () => {
  const d = project('src: url("assets/fonts/Pretendard-Semibold.woff2")');
  assert.deepEqual(missingAssets(d), ['assets/fonts/Pretendard-Semibold.woff2']);
});

test('원격 URL과 data URI는 건너뛴다', () => {
  assert.deepEqual(missingAssets(project("url(https://x/y.woff2) url(data:font/woff2;base64,AA)")), []);
});

test('스파이크 컴포지션의 글꼴은 모두 있다', () => {
  assert.deepEqual(missingAssets(fileURLToPath(new URL('../spike', import.meta.url))), []);
});
