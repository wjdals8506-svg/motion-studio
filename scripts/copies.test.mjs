import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// 승인된 스타일 모듈이 원본이다. 컴포지션 폴더의 사본(../ 금지 규칙 때문에 복사해 씀)은 원본과 같아야 한다.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = path.join(ROOT, 'styles', 'modules', '19-grainy-gradient', 'fog-glass.js');
const norm = f => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
const copies = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
  e.isDirectory() ? (['node_modules', '.git', '.hyperframes'].includes(e.name) ? [] : copies(path.join(dir, e.name)))
    : e.name === 'fog-glass.js' ? [path.join(dir, e.name)] : []);

test('레포 안의 모든 fog-glass.js 사본이 모듈 원본과 같다', () => {
  // 사본이 없어도 통과한다(실사 파일럿은 이 렌더러를 쓰지 않는다)
  for (const f of copies(path.join(ROOT, 'projects'))) assert.equal(norm(f), norm(ORIGIN), path.relative(ROOT, f));
});
