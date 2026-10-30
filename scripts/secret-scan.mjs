// 커밋 전에 스테이징된 파일에서 API 키 형태의 문자열을 찾는다. 값은 절대 출력하지 않는다.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const RULES = [
  ['elevenlabs-key', /sk_[a-f0-9]{48}/gi],
  ['api-key-assignment', /[A-Z0-9_]*(API_KEY|TOKEN|SECRET)[ \t]*[=:][ \t]*\S{8,}/g],
  ['github-token', /gh[pousr]_[A-Za-z0-9]{36,}/g],
];

export function findSecrets(text) {
  return RULES.flatMap(([rule, re]) => [...text.matchAll(re)].map(m => ({ rule, index: m.index })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM', '-z'], { encoding: 'utf8' })
    .split('\0').filter(Boolean);
  let leaks = 0;
  for (const f of files) {
    for (const { rule } of findSecrets(readFileSync(f, 'utf8'))) {
      console.error(`${f} · ${rule}`);
      leaks++;
    }
  }
  if (leaks) process.exit(1);
}
