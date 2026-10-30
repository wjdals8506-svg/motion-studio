import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { projectStatus } from './status.mjs';

// 공백과 한글이 든 경로에서도 동작해야 한다.
const dir = () => fs.mkdtempSync(path.join(os.tmpdir(), '상태 테스트 '));
const write = (d, file, status) =>
  fs.writeFileSync(path.join(d, file), `---\nstage: 0\nstatus: ${status}\n---\n`);

test('빈 프로젝트는 0단계', () => {
  assert.deepEqual(projectStatus(dir()), { stage: 0, approved: [], stale: [] });
});

test('브리프 승인, 키메시지 초안이면 1단계', () => {
  const d = dir();
  write(d, '00_brief.md', 'approved');
  write(d, '01_key_message.md', 'draft');
  assert.deepEqual(projectStatus(d), { stage: 1, approved: ['00_brief.md'], stale: [] });
});

test('0~2 모두 승인이면 3단계', () => {
  const d = dir();
  for (const f of ['00_brief.md', '01_key_message.md', '02_story.md']) write(d, f, 'approved');
  assert.equal(projectStatus(d).stage, 3);
});

test('앞 단계를 다시 열면 뒤 단계는 stale', () => {
  const d = dir();
  write(d, '00_brief.md', 'approved');
  write(d, '01_key_message.md', 'draft');
  write(d, '02_story.md', 'approved');
  assert.deepEqual(projectStatus(d), { stage: 1, approved: ['00_brief.md'], stale: ['02_story.md'] });
});

test('front matter 없는 파일은 draft로 본다', () => {
  const d = dir();
  fs.writeFileSync(path.join(d, '00_brief.md'), '# 브리프');
  assert.equal(projectStatus(d).stage, 0);
});
