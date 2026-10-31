// 원격 렌더 전에 컴포지션의 <audio>·<video> 중 파일이 없는 것을 뺀다.
// 음원은 레포에 커밋하지 않으므로(CLAUDE.md 14) 클론에는 없다. 빼면 무음으로 렌더되고, 뺀 목록을 경고로 남긴다.
// CLI: node scripts/drop-missing-media.mjs "<composition dir>"  → JSON { dropped }, 항상 exit 0
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function dropMissingMedia(html, exists) {
  const dropped = [];
  const out = html.replace(/[ \t]*<(audio|video)\b[^>]*\bsrc="([^"]+)"[^>]*>[\s\S]*?<\/\1>[ \t]*\r?\n?/g, (m, _tag, src) => {
    if (exists(src)) return m;
    dropped.push(src);
    return '';
  });
  return { html: out, dropped };
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
    for (const d of r.dropped) console.error(`경고: 파일이 없어 뺌 (무음으로 렌더): ${d}`);
  }
  console.log(JSON.stringify({ dropped: r.dropped }));
}
