// 6단계: 완성본 MP4를 재서 오류(길이, 코덱, 해상도, true peak ≤ −1 dBTP, 목표 음량 ±1 LU)와 경고(정지·무음 구간)를 낸다.
// 측정은 디코딩만 한다(렌더·재인코딩 없음). 점수는 없다. 경고는 사용자가 판단하도록 NOTE.md에 적는다.
// CLI: node scripts/final-qa.mjs "projects/<slug>" <완성본.mp4> --lufs <-14|keep>  → JSON, 오류 있으면 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseLoudness, compositionDuration, ffmpeg, lufsArg } from './mux-audio.mjs';

const r2 = x => Number(x.toFixed(2));

export function parseIntervals(stderr, kind) {
  const out = [];
  for (const [, edge, v] of stderr.matchAll(new RegExp(`${kind}_(start|end): (-?[\\d.]+)`, 'g'))) {
    if (edge === 'start') out.push({ from: Number(v), to: null });
    else if (out.length && out.at(-1).to === null) out.at(-1).to = Number(v);
  }
  return out;
}

export function finalQa({ probe, loudness, freezes, silences, expect }) {
  const errors = [];
  const v = probe.streams.find(s => s.codec_type === 'video');
  const a = probe.streams.find(s => s.codec_type === 'audio');
  const duration = Number(probe.format.duration);
  if (!(Math.abs(duration - expect.duration) <= 0.1)) errors.push(`길이 ${duration}초: 컴포지션 ${expect.duration}초와 0.1초 넘게 다름`);
  if (v?.codec_name !== 'h264') errors.push(`비디오 코덱 ${v?.codec_name ?? '없음'}: h264여야 함`);
  if (v && (v.width !== expect.width || v.height !== expect.height)) errors.push(`해상도 ${v.width}×${v.height}: ${expect.width}×${expect.height}여야 함`);
  if (a?.codec_name !== 'aac') errors.push(`오디오 ${a ? `코덱 ${a.codec_name}` : '스트림 없음'}: aac여야 함`);
  if (!(loudness.peak <= -1)) errors.push(`true peak ${loudness.peak} dBTP: −1 이하여야 함`);
  if (expect.lufs !== 'keep' && !(Math.abs(loudness.lufs - expect.lufs) <= 1)) errors.push(`통합 음량 ${loudness.lufs} LUFS: 목표 ${expect.lufs} ±1`);
  const span = (label, { from, to }) => `${label} t=${r2(from)}~${to === null ? '끝' : r2(to)}`;
  const warnings = [...freezes.map(f => span('정지', f)), ...silences.map(s => span('무음', s))];
  return { errors, warnings };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir, mp4] = process.argv.slice(2);
  const i = process.argv.indexOf('--lufs');
  const target = lufsArg(i > 0 ? process.argv[i + 1] : undefined);
  if (!dir || !mp4 || !(target === 'keep' || Number.isFinite(target))) {
    console.error('usage: node scripts/final-qa.mjs "<project dir>" <final.mp4> --lufs <-14|keep>');
    process.exit(2);
  }
  try {
    const html = fs.readFileSync(path.join(dir, '05_film', 'index.html'), 'utf8');
    const root = html.match(/<[^>]*data-composition-id="[^"]*"[^>]*>/)[0];
    const expect = {
      duration: compositionDuration(html), lufs: target,
      width: Number(root.match(/data-width="(\d+)"/)[1]), height: Number(root.match(/data-height="(\d+)"/)[1]),
    };
    const p = spawnSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4], { encoding: 'utf8' });
    if (p.status !== 0) throw new Error(`ffprobe 실패: ${p.stderr}`);
    const probe = JSON.parse(p.stdout);
    const hasAudio = probe.streams.some(s => s.codec_type === 'audio');
    const log = ffmpeg(['-i', mp4, '-vf', 'freezedetect=n=0.003:d=2', ...(hasAudio ? ['-af', 'silencedetect=n=-50dB:d=1,ebur128=peak=true'] : []), '-f', 'null', '-']);
    const loudness = hasAudio ? parseLoudness(log) : { lufs: NaN, peak: NaN };
    const r = finalQa({ probe, loudness, freezes: parseIntervals(log, 'freeze'), silences: parseIntervals(log, 'silence'), expect });
    const v = probe.streams.find(s => s.codec_type === 'video'), a = probe.streams.find(s => s.codec_type === 'audio');
    r.measured = { duration: Number(probe.format.duration), width: v?.width, height: v?.height, vcodec: v?.codec_name, acodec: a?.codec_name, ...loudness };
    console.log(JSON.stringify(r, null, 2));
    if (r.errors.length) process.exit(1);
  } catch (e) {
    console.log(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
}
