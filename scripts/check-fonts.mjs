// 컴포지션 index.html이 url(...)로 가리키는 로컬 파일이 대소문자까지 똑같이 있는지 본다.
// Windows 미리보기는 대소문자를 무시해 통과해도 리눅스 렌더에서는 대체 글꼴로 바뀐다.
// CLI: node scripts/check-fonts.mjs "<composition dir>"  → 없는 파일이 있으면 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const existsExact = (dir, rel) =>
  rel.split('/').every(part => {
    if (part === '.' || part === '') return true;
    if (!fs.existsSync(dir) || !fs.readdirSync(dir).includes(part)) return false;
    dir = path.join(dir, part);
    return true;
  });

export function missingAssets(dir) {
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map(m => m[1].trim());
  return refs.filter(r => !/^(https?:|data:|#)/.test(r) && !existsExact(dir, r.split(/[?#]/)[0]));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const missing = missingAssets(process.argv[2] ?? '.');
  for (const m of missing) console.error(`없는 파일: ${m}`);
  if (missing.length) process.exit(1);
}
