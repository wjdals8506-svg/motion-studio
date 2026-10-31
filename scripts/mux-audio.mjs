// 6단계: 원격 무음 MP4에 05_film/index.html의 <audio>를 그대로 섞어 붙인다. 영상은 -c:v copy(재인코딩 없음, CLAUDE.md 12번).
// 이득은 선형(측정 → 목표와의 차이만큼 volume), 올린 뒤 피크가 −1.5 dBFS를 넘을 것 같으면 리미터. 음원은 PC를 떠나지 않는다(CLAUDE.md 14번).
// CLI: node scripts/mux-audio.mjs "projects/<slug>" --video <무음.mp4> --lufs <-14|keep> --out <완성본.mp4>  → JSON, 실패 시 exit 1
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const num = (tag, name, d) => (attr(tag, name) === undefined ? d : Number(attr(tag, name)));
const r3 = x => Number(x.toFixed(3));

export function audioTracks(html) {
  return [...html.matchAll(/<audio\b[^>]*>/g)].map(([tag]) => {
    const id = attr(tag, 'id');
    if (attr(tag, 'data-duration') === undefined) throw new Error(`<audio id="${id}">에 data-duration이 없음`);
    return {
      id, src: attr(tag, 'src'), start: num(tag, 'data-start', 0), duration: num(tag, 'data-duration'),
      mediaStart: num(tag, 'data-media-start', 0), volume: num(tag, 'data-volume', 1),
      fadeIn: num(tag, 'data-fade-in', 0), fadeOut: num(tag, 'data-fade-out', 0),
    };
  });
}

export const checkSources = (tracks, dir, exists = fs.existsSync) =>
  tracks.map(t => path.join(dir, t.src)).filter(p => !exists(p));

export function parseLoudness(stderr) {
  const i = stderr.lastIndexOf('Summary:');
  if (i < 0) throw new Error('ebur128 Summary:가 없음');
  const s = stderr.slice(i);
  return { lufs: Number(s.match(/I:\s+(-?[\d.]+) LUFS/)[1]), peak: Number(s.match(/Peak:\s+(-?[\d.]+) dBFS/)[1]) };
}

// 트랙 i는 ffmpeg 입력 i+1(입력 0은 영상)
export function mixFilter(tracks, { duration, gainDb = 0, limit = false }) {
  const chains = tracks.map((t, i) => {
    const f = [`atrim=start=${t.mediaStart}:duration=${t.duration}`, 'asetpts=PTS-STARTPTS', `volume=${t.volume}`];
    if (t.fadeIn > 0) f.push(`afade=t=in:st=0:d=${t.fadeIn}`);
    if (t.fadeOut > 0) f.push(`afade=t=out:st=${r3(t.duration - t.fadeOut)}:d=${t.fadeOut}`);
    f.push(`adelay=${Math.round(t.start * 1000)}:all=1`);
    return `[${i + 1}:a]${f.join(',')}[a${i}]`;
  });
  const tail = [`amix=inputs=${tracks.length}:normalize=0`, 'apad', `atrim=duration=${duration}`];
  if (gainDb !== 0) tail.push(`volume=${gainDb}dB`);
  if (limit) tail.push('alimiter=limit=0.841:level=false');
  return `${chains.join(';')};${tracks.map((_, i) => `[a${i}]`).join('')}${tail.join(',')}[mix]`;
}

export function planGain(measured, target) {
  if (target === 'keep') return { gainDb: 0, limit: false };
  const gainDb = Math.round((target - measured.lufs) * 100) / 100;
  return { gainDb, limit: measured.peak + gainDb > -1.5 };
}

export const muxArgs = ({ video, inputs, filter, out }) => [
  '-y', '-i', video, ...inputs.flatMap(a => ['-i', a]), '-filter_complex', filter,
  '-map', '0:v', '-map', '[mix]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out,
];

export const compositionDuration = html =>
  Number(html.match(/data-composition-id="[^"]*"[^>]*data-duration="([\d.]+)"/)?.[1]);

export function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`ffmpeg 실패: ${(r.stderr ?? String(r.error)).slice(-800)}`);
  return r.stderr;
}

export const lufsArg = v => (v === 'keep' ? 'keep' : Number(v));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [dir] = process.argv.slice(2);
  const opt = k => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : undefined; };
  const video = opt('--video'), out = opt('--out'), target = lufsArg(opt('--lufs'));
  if (!dir || !video || !out || !(target === 'keep' || Number.isFinite(target))) {
    console.error('usage: node scripts/mux-audio.mjs "<project dir>" --video <silent.mp4> --lufs <-14|keep> --out <final.mp4>');
    process.exit(2);
  }
  try {
    const film = path.join(dir, '05_film');
    const html = fs.readFileSync(path.join(film, 'index.html'), 'utf8');
    const tracks = audioTracks(html);
    const missing = checkSources(tracks, film);
    if (!tracks.length || missing.length) {
      console.log(JSON.stringify({ missing, error: tracks.length ? '음원 파일이 없음' : '<audio>가 없음' }));
      process.exit(1);
    }
    const duration = compositionDuration(html);
    const inputs = tracks.map(t => path.join(film, t.src));
    const pre = ['-i', video, ...inputs.flatMap(a => ['-i', a])];
    const measured = parseLoudness(ffmpeg([...pre, '-filter_complex', `${mixFilter(tracks, { duration })};[mix]ebur128=peak=true[m]`, '-map', '[m]', '-f', 'null', '-']));
    const { gainDb, limit } = planGain(measured, target);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    ffmpeg(muxArgs({ video, inputs, filter: mixFilter(tracks, { duration, gainDb, limit }), out }));
    console.log(JSON.stringify({ out, measured, gainDb, limit }));
  } catch (e) {
    console.log(JSON.stringify({ error: e.message }));
    process.exit(1);
  }
}
