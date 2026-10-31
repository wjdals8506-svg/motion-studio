---
stage: 6
status: draft
approved_at:
---

# 최종: <주제>

납품 노트: `06_final/NOTE.md` (final-qa 수치 인용, 경고, 한계)

## 렌더
- run: <Actions run URL>, 렌더한 커밋 <sha>, 화질 delivery
- 무음 MP4: `media/<slug>/render/out.mp4`

## 소리
- 음량 목표: <-14 | keep> (질문 1 답)
- 섞은 소리 측정: <LUFS> / 피크 <dBFS> → 이득 <dB>, 리미터 <있음|없음>
- 합치기: `node scripts/mux-audio.mjs "projects/<slug>" --video … --lufs … --out …` (영상 `-c:v copy`)

## 완성본
- `media/<slug>/final.mp4` (커밋하지 않음), sha256 <…>, 보낸 날 <YYYY-MM-DD>

## 마지막 확인
(질문 2 답과 반영)

## 남은 문제
