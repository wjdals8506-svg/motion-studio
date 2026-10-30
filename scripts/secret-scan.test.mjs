import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findSecrets } from './secret-scan.mjs';

test('ElevenLabs 형식 키를 찾는다', () => {
  assert.equal(findSecrets('key: sk_' + 'a1'.repeat(24)).length, 1);
});

test('API 키 대입문을 찾는다', () => {
  // 값을 쪼개 둬서 이 파일 자체가 커밋 검사에 걸리지 않게 한다.
  assert.equal(findSecrets('ELEVENLABS_API_KEY=' + 'abc123def456ghi789').length, 1);
});

test('빈 대입과 일반 문장은 통과', () => {
  assert.equal(findSecrets('ELEVENLABS_API_KEY=\n키는 .env에 둔다').length, 0);
});

test('GitHub 토큰 형식을 찾는다', () => {
  assert.equal(findSecrets('ghp_' + 'A'.repeat(36)).length, 1);
});
