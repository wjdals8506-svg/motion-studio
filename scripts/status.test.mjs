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

test('0~5 모두 승인이면 6단계', () => {
  const d = dir();
  for (const f of ['00_brief.md', '01_key_message.md', '02_story.md', '03_animatic.md', '04_design.md', '05_film.md']) write(d, f, 'approved');
  assert.equal(projectStatus(d).stage, 6);
});

test('3단계 초안이면 3단계', () => {
  const d = dir();
  for (const f of ['00_brief.md', '01_key_message.md', '02_story.md']) write(d, f, 'approved');
  write(d, '03_animatic.md', 'draft');
  assert.deepEqual(projectStatus(d), {
    stage: 3, approved: ['00_brief.md', '01_key_message.md', '02_story.md'], stale: [],
  });
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

test('앞 단계를 고쳐 다시 승인하면 그보다 먼저 승인된 뒤 단계는 stale', () => {
  const d = dir();
  const put = (file, at) =>
    fs.writeFileSync(path.join(d, file), `---\nstatus: approved\napproved_at: ${at}\n---\n`);
  put('00_brief.md', '2026-10-31T09:00');
  put('01_key_message.md', '2026-10-31T11:00');
  put('02_story.md', '2026-10-31T10:00');
  assert.deepEqual(projectStatus(d), {
    stage: 2, approved: ['00_brief.md', '01_key_message.md'], stale: ['02_story.md'],
  });
});
