// 원격 렌더 전에 컴포지션의 <audio> 중 파일이 없는 것을 뺀다.
// 음원은 레포에 커밋하지 않으므로(CLAUDE.md 14) 클론에는 없다. 빼면 무음으로 렌더되고, 뺀 목록을 경고로 남긴다.
// <video>는 음원 규칙과 무관하므로 빼지 않는다. 없으면 장면이 빠진 채 성공하지 않도록 exit 1.
// CLI: node scripts/drop-missing-media.mjs "<composition dir>"  → JSON { dropped, missing }
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function dropMissingMedia(html, exists) {
  const dropped = [];
  const missing = [];
  const out = html.replace(/[ \t]*<audio\b[^>]*\bsrc="([^"]+)"[^>]*>[\s\S]*?<\/audio>[ \t]*\r?\n?/g, (m, src) => {
    if (exists(src)) return m;
    dropped.push(src);
    return '';
  });
  for (const m of out.matchAll(/<video\b[^>]*\bsrc="([^"]+)"/g)) if (!exists(m[1])) missing.push(m[1]);
  return { html: out, dropped, missing };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  if (!dir) {
    console.error('usage: node scripts/drop-missing-media.mjs "<composition dir>"');
    process.exit(2);
  }
  const file = path.join(dir, 'index.html');
  const r = dropMissingMedia(fs.readFileSync(file, 'utf8'), src => /^(https?:|data:)/.test(src) || fs.existsSync(path.join(dir, src)));
  if (r.dropped.length) {
    fs.writeFileSync(file, r.html);
    for (const d of r.dropped) console.error(`::warning::음원 파일이 없어 뺌 (무음으로 렌더): ${d}`);
  }
  for (const v of r.missing) console.error(`::error::영상 파일이 없음: ${v}`);
  console.log(JSON.stringify({ dropped: r.dropped, missing: r.missing }));
  if (r.missing.length) process.exit(1);
}
