import { test } from 'node:test';
import assert from 'node:assert/strict';
import { audioTracks, checkSources, parseLoudness, mixFilter, planGain, muxArgs } from './mux-audio.mjs';

const BGM = '<audio id="bgm" src="assets/audio/bgm.mp3" data-start="0" data-duration="30" data-media-start="0" data-volume="0.55" data-fade-in="1.5" data-fade-out="2.5"></audio>';

test('audioTracks는 파일럿 bgm 태그를 읽는다', () => {
  assert.deepEqual(audioTracks(`<div>${BGM}</div>`), [
    { id: 'bgm', src: 'assets/audio/bgm.mp3', start: 0, duration: 30, mediaStart: 0, volume: 0.55, fadeIn: 1.5, fadeOut: 2.5 },
  ]);
});

test('audioTracks는 없는 속성에 기본값을 쓰고, 길이가 없으면 실패한다', () => {
  assert.deepEqual(audioTracks('<audio id="x" src="a.mp3" data-start="2" data-duration="4"></audio>'), [
    { id: 'x', src: 'a.mp3', start: 2, duration: 4, mediaStart: 0, volume: 1, fadeIn: 0, fadeOut: 0 },
  ]);
  assert.throws(() => audioTracks('<audio id="x" src="a.mp3" data-start="2"></audio>'), /data-duration/);
});

test('checkSources는 없는 음원 경로를 돌려준다', () => {
  const tracks = audioTracks(BGM + '<audio id="s" src="assets/audio/s.mp3" data-start="1" data-duration="1"></audio>');
  const missing = checkSources(tracks, 'film', p => !p.endsWith('bgm.mp3'));
  assert.equal(missing.length, 1);
  assert.match(missing[0], /bgm\.mp3$/);
});

test('페이드 아웃은 클립 끝 기준', () => {
  const [t] = audioTracks('<audio id="x" src="a.mp3" data-start="2" data-duration="10" data-fade-out="2.5"></audio>');
  const f = mixFilter([t], { duration: 30 });
  assert.match(f, /afade=t=out:st=7\.5:d=2\.5/);
  assert.match(f, /adelay=2000:all=1/);
  assert.match(f, /atrim=duration=30/);
  assert.doesNotMatch(f, /afade=t=in/);
});

test('planGain: −19.8/−6.6을 −14로 → +5.8 dB, 리미터', () => {
  assert.deepEqual(planGain({ lufs: -19.8, peak: -6.6 }, -14), { gainDb: 5.8, limit: true });
});

test('planGain: keep → 0 dB, 리미터 없음', () => {
  assert.deepEqual(planGain({ lufs: -19.8, peak: -6.6 }, 'keep'), { gainDb: 0, limit: false });
});

test('planGain: keep이어도 피크가 −1.5를 넘으면 리미터', () => {
  assert.deepEqual(planGain({ lufs: -12, peak: -0.5 }, 'keep'), { gainDb: 0, limit: true });
  assert.match(mixFilter(audioTracks(BGM), { duration: 30, limit: true }), /,alimiter=limit=0\.841:level=false\[mix\]$/);
});

test('audioTracks는 data-src를 src로 읽지 않고, 빈 숫자 속성은 실패한다', () => {
  assert.equal(audioTracks('<audio id="x" data-src="x.mp3" src="a.mp3" data-start="0" data-duration="1"></audio>')[0].src, 'a.mp3');
  assert.throws(() => audioTracks('<audio id="x" src="a.mp3" data-start="0" data-duration="1" data-volume=""></audio>'), /data-volume/);
});

test('planGain: −16/−9를 −14로 → +2 dB, 리미터 없음', () => {
  assert.deepEqual(planGain({ lufs: -16, peak: -9 }, -14), { gainDb: 2, limit: false });
});

test('mixFilter는 이득과 리미터를 마지막에 붙인다', () => {
  const tracks = audioTracks(BGM);
  const f = mixFilter(tracks, { duration: 30, gainDb: 5.8, limit: true });
  assert.match(f, /volume=5\.8dB,alimiter=limit=0\.841:level=false\[mix\]$/);
  assert.doesNotMatch(mixFilter(tracks, { duration: 30 }), /dB/);
  assert.match(mixFilter(tracks, { duration: 30 }), /\[mix\]$/);
});

test('muxArgs는 영상만 복사하고 원래 오디오를 쓰지 않는다', () => {
  const args = muxArgs({ video: 'v.mp4', inputs: ['a.mp3'], filter: 'F', out: 'o.mp4' });
  for (const a of ['-map', '0:v', '-c:v', 'copy', '[mix]', 'F', 'o.mp4']) assert.ok(args.includes(a), a);
  assert.ok(!args.some(a => a.includes('0:a')));
  assert.deepEqual(args.slice(0, 5), ['-y', '-i', 'v.mp4', '-i', 'a.mp3']);
});

test('parseLoudness는 ebur128 요약을 읽는다', () => {
  const stderr = [
    '[Parsed_ebur128_0 @ 0] t: 29.9 TARGET:-23 LUFS M: -20.0 S: -19.0 I: -30.0 LUFS LRA: 3.0 LU FTPK: -7.0 dBFS TPK: -6.6 dBFS',
    '[Parsed_ebur128_0 @ 0] Summary:', '',
    '  Integrated loudness:', '    I:         -19.8 LUFS', '    Threshold: -30.0 LUFS', '',
    '  Loudness range:', '    LRA:         5.0 LU', '',
    '  True peak:', '    Peak:       -6.6 dBFS',
  ].join('\r\n');
  assert.deepEqual(parseLoudness(stderr), { lufs: -19.8, peak: -6.6 });
  assert.throws(() => parseLoudness('no summary'), /Summary/);
});
