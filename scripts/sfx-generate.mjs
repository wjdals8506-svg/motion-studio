// 05_film/sfx_brief.json으로 ElevenLabs Sound Effects를 불러 키 모션 효과음 후보를 만든다. 크레딧을 쓰므로 사용자 확인 후에만 실행한다.
// API: POST /v1/sound-generation (eleven_text_to_sound_v2, duration_seconds 0.5~30, 2026-10-31 문서 확인).
// 음원은 PC의 media/<slug>/에만 저장한다(CLAUDE.md 14). 키 값은 어디에도 출력하지 않는다.
// CLI: node scripts/sfx-generate.mjs "projects/<slug>" --count 2  → JSON { files, error? }, 실패해도 만든 파일을 남기고 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readEnvKey, errorText } from './music-generate.mjs';
import { addEntry } from './manifest.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const MODEL = 'eleven_text_to_sound_v2';

export function sfxRequest(item, key, { influence = 0.5 } = {}) {
  if (!(item.duration >= 0.5 && item.duration <= 30)) throw new Error(`효과음 ${item.name} 길이 ${item.duration}초: 0.5~30초여야 함`);
  return {
    url: 'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
    init: {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: item.prompt, duration_seconds: item.duration, prompt_influence: influence, model_id: MODEL }),
    },
  };
}

// 크레딧을 쓰기 전에 모든 항목을 먼저 검사한다(5단계 리뷰 I6)
export const validateBrief = brief => brief.forEach(item => sfxRequest(item, ''));

export const summarize = (files, error) => (error ? { files, error } : { files });

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  const i = process.argv.indexOf('--count');
  const count = i > 0 ? Number(process.argv[i + 1]) : 1;
  if (!dir || !(count >= 1 && count <= 3)) {
    console.error('usage: node scripts/sfx-generate.mjs "<project dir>" --count <1~3>');
    process.exit(2);
  }
  const envFile = path.join(ROOT, '.env');
  const key = fs.existsSync(envFile) ? readEnvKey(fs.readFileSync(envFile, 'utf8'), 'ELEVENLABS_API_KEY') : null;
  if (!key) { console.error('.env에 ELEVENLABS_API_KEY가 없음'); process.exit(1); }
  const slug = path.basename(path.resolve(dir));
  const brief = JSON.parse(fs.readFileSync(path.join(dir, '05_film', 'sfx_brief.json'), 'utf8'));
  const mediaDir = path.join(ROOT, 'media', slug);
  fs.mkdirSync(mediaDir, { recursive: true });
  const files = [];
  const fail = msg => { console.error(msg); console.log(JSON.stringify(summarize(files, msg))); process.exit(1); };
  try { validateBrief(brief); } catch (e) { fail(e.message); }
  for (const item of brief) for (let c = 0; c < count; c++) try {
    let k = 1;
    while (fs.existsSync(path.join(mediaDir, `sfx-${item.name}-${k}.mp3`))) k++;
    let req, res;
    try { req = sfxRequest(item, key); res = await fetch(req.url, req.init); } catch (e) { fail(`요청 실패: ${errorText(String(e.message), key)}`); }
    if (!res.ok) fail(`ElevenLabs ${res.status}: ${errorText(await res.text(), key)}`);
    const rel = `media/${slug}/sfx-${item.name}-${k}.mp3`;
    fs.writeFileSync(path.join(ROOT, rel), Buffer.from(await res.arrayBuffer()));
    addEntry(path.join(dir, 'assets.manifest.json'), {
      id: `sfx-${item.name}-${k}`, path: rel, kind: 'sfx', source: 'elevenlabs', model: MODEL,
      prompt: `${item.prompt} (${item.duration}s, 위치 ${item.at}s)`, license: 'ElevenLabs Terms (Creator), 독립 파일 공개 금지',
      commercial: true, public_redistribution: false,
    });
    files.push(rel);
  } catch (e) { fail(`중간 실패(이미 만든 파일은 위 목록): ${errorText(String(e.message), key)}`); }
  console.log(JSON.stringify(summarize(files)));
}
