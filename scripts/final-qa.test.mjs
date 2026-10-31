import { test } from 'node:test';
import assert from 'node:assert/strict';
import { finalQa, parseIntervals } from './final-qa.mjs';

const probe = (over = {}) => ({
  streams: [
    { codec_type: 'video', codec_name: 'h264', width: 1920, height: 1080 },
    { codec_type: 'audio', codec_name: 'aac' },
  ],
  format: { duration: '30.020000' },
  ...over,
});
const expect = { duration: 30, width: 1920, height: 1080, lufs: -14 };
const ok = { probe: probe(), loudness: { lufs: -14.2, peak: -1.4 }, freezes: [], silences: [], expect };

test('정상 완성본은 오류 0', () => {
  assert.deepEqual(finalQa(ok), { errors: [], warnings: [] });
});

test('길이 0.15초 차이는 오류', () => {
  const r = finalQa({ ...ok, probe: probe({ format: { duration: '30.15' } }) });
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /길이/);
});

test('영상 스트림이 29초인데 소리로 컨테이너가 30초면 오류', () => {
  const [v, a] = probe().streams;
  const r = finalQa({ ...ok, probe: probe({ streams: [{ ...v, duration: '29.000000' }, { ...a, duration: '30.000000' }], format: { duration: '30.0' } }) });
  assert.equal(r.errors.length, 1);
  assert.match(r.errors[0], /영상 스트림/);
});

test('오디오 스트림 없으면 오류', () => {
  const r = finalQa({ ...ok, probe: probe({ streams: [probe().streams[0]] }) });
  assert.match(r.errors.join(), /오디오/);
});

test('비디오 코덱이 h264가 아니거나 해상도가 다르면 오류', () => {
  const r = finalQa({ ...ok, probe: probe({ streams: [{ codec_type: 'video', codec_name: 'hevc', width: 1280, height: 720 }, probe().streams[1]] }) });
  assert.equal(r.errors.length, 2);
});

test('peak −0.8은 오류', () => {
  assert.match(finalQa({ ...ok, loudness: { lufs: -14, peak: -0.8 } }).errors.join(), /peak/);
});

test('목표 −14인데 −16.5면 오류', () => {
  assert.match(finalQa({ ...ok, loudness: { lufs: -16.5, peak: -3 } }).errors.join(), /LUFS/);
});

test('keep이면 LUFS는 보지 않지만 peak는 본다', () => {
  const keep = { ...expect, lufs: 'keep' };
  assert.deepEqual(finalQa({ ...ok, loudness: { lufs: -19.8, peak: -6.6 }, expect: keep }).errors, []);
  assert.equal(finalQa({ ...ok, loudness: { lufs: -19.8, peak: -0.5 }, expect: keep }).errors.length, 1);
});

test('정지·무음 구간은 경고로 시각과 함께', () => {
  const stderr = [
    '[freezedetect @ 0] lavfi.freezedetect.freeze_start: 27.6',
    '[freezedetect @ 0] lavfi.freezedetect.freeze_duration: 2.4',
    '[freezedetect @ 0] lavfi.freezedetect.freeze_end: 30',
    '[Parsed_silencedetect_0 @ 0] silence_start: 0',
    '[Parsed_silencedetect_0 @ 0] silence_end: 1.524399 | silence_duration: 1.524399',
    '[Parsed_silencedetect_0 @ 0] silence_start: 28.495374',
  ].join('\r\n');
  const freezes = parseIntervals(stderr, 'freeze');
  const silences = parseIntervals(stderr, 'silence');
  assert.deepEqual(freezes, [{ from: 27.6, to: 30 }]);
  assert.deepEqual(silences, [{ from: 0, to: 1.524399 }, { from: 28.495374, to: null }]);
  const r = finalQa({ ...ok, freezes, silences });
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, ['정지 t=27.6~30', '무음 t=0~1.52', '무음 t=28.5~끝']);
});
