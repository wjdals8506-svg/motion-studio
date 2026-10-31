// music_plan.json으로 ElevenLabs Music API를 불러 BGM 후보를 만든다. 크레딧을 쓰므로 사용자 확인 후에만 실행한다.
// 음원은 PC의 media/<slug>/에만 저장한다(레포 커밋 금지, CLAUDE.md 14). 키 값은 어디에도 출력하지 않는다.
// CLI: node scripts/music-generate.mjs "projects/<slug>" --count 3  → JSON
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { addEntry } from './manifest.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ENDPOINT = 'https://api.elevenlabs.io/v1/music';

export function readEnvKey(envText, name) {
  for (const line of envText.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[1] === name) return m[2].replace(/^(['"])(.*)\1$/, '$2') || null;
  }
  return null;
}

export function musicRequest(plan, key, { outputFormat = 'mp3_44100_128' } = {}) {
  return {
    url: `${ENDPOINT}?output_format=${outputFormat}`,
    init: {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        composition_plan: plan.composition_plan,
        model_id: plan.model_id,
        respect_sections_durations: true,
      }),
    },
  };
}

export const redact = (text, key) => (key ? text.split(key).join('***') : text);

export function promptSummary(plan) {
  const cp = plan.composition_plan;
  const sections = cp.sections.map(s => `${s.section_name}(${(s.duration_ms / 1000).toFixed(1)}s): ${s.positive_local_styles.join(', ')}`);
  return [cp.positive_global_styles.join(', '), cp.negative_global_styles.map(x => `-${x}`).join(', '), ...sections].join(' | ');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = process.argv[2];
  const i = process.argv.indexOf('--count');
  const count = i > 0 ? Number(process.argv[i + 1]) : 1;
  if (!dir || !(count >= 1 && count <= 3)) {
    console.error('usage: node scripts/music-generate.mjs "<project dir>" --count <1~3>');
    process.exit(2);
  }
  const envFile = path.join(ROOT, '.env');
  const key = fs.existsSync(envFile) ? readEnvKey(fs.readFileSync(envFile, 'utf8'), 'ELEVENLABS_API_KEY') : null;
  if (!key) {
    console.error('.env에 ELEVENLABS_API_KEY가 없음');
    process.exit(1);
  }
  const slug = path.basename(path.resolve(dir));
  const plan = JSON.parse(fs.readFileSync(path.join(dir, '03_animatic', 'music_plan.json'), 'utf8'));
  const mediaDir = path.join(ROOT, 'media', slug);
  fs.mkdirSync(mediaDir, { recursive: true });
  const files = [];
  for (let c = 0; c < count; c++) {
    let k = 1;
    while (fs.existsSync(path.join(mediaDir, `bgm-${k}.mp3`))) k++;
    const { url, init } = musicRequest(plan, key);
    let res;
    try {
      res = await fetch(url, init);
    } catch (e) {
      console.error(`요청 실패: ${redact(String(e.message), key)}`);
      process.exit(1);
    }
    if (!res.ok) {
      console.error(`ElevenLabs ${res.status}: ${redact((await res.text()).slice(0, 500), key)}`);
      process.exit(1);
    }
    const rel = `media/${slug}/bgm-${k}.mp3`;
    fs.writeFileSync(path.join(ROOT, rel), Buffer.from(await res.arrayBuffer()));
    addEntry(path.join(dir, 'assets.manifest.json'), {
      id: `bgm-${k}`, path: rel, kind: 'music', source: 'elevenlabs', model: plan.model_id,
      prompt: promptSummary(plan), license: 'ElevenLabs Music Terms (Creator)',
      commercial: true, public_redistribution: false,
    });
    files.push(rel);
  }
  console.log(JSON.stringify({ files, credits_note: `곡당 약 ${Math.round((plan.duration_ms / 60000) * 900)} 크레딧(분당 900 기준)` }));
}
