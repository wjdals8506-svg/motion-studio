// 커밋 전에 스테이징된 내용에서 API 키 형태의 문자열과 오디오 파일을 찾는다. 값은 절대 출력하지 않는다.
// 오디오는 ElevenLabs 약관상 공개 레포에 올릴 수 없다(docs/spike-report.md C절).
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const RULES = [
  ['elevenlabs-key', /sk_[a-f0-9]{48}/gi],
  ['api-key-assignment', /[A-Z0-9_]*(API_KEY|TOKEN|SECRET)[ \t]*[=:][ \t]*\S{8,}/g],
  ['github-token', /gh[pousr]_[A-Za-z0-9]{36,}/g],
];

const AUDIO = /\.(mp3|wav|m4a|aac|ogg|oga|flac|opus|pcm|ulaw|alaw|webm)$/i;

export function findSecrets(text) {
  return RULES.flatMap(([rule, re]) => [...text.matchAll(re)].map(m => ({ rule, index: m.index })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], { encoding: 'utf8' })
    .split('\0').filter(Boolean);
  let leaks = 0;
  for (const f of files) {
    if (AUDIO.test(f)) {
      console.error(`${f} · audio-file`);
      leaks++;
      continue;
    }
    // 작업 트리가 아니라 실제로 커밋될 index의 내용을 읽는다.
    const staged = execFileSync('git', ['show', ':' + f], { encoding: 'utf8', maxBuffer: 1 << 28 });
    for (const { rule } of findSecrets(staged)) {
      console.error(`${f} · ${rule}`);
      leaks++;
    }
  }
  if (leaks) process.exit(1);
}
