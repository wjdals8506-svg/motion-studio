# 6단계 게이트

## 승인 요청 전 확인
- [ ] 원격 렌더(`render.yml`, `quality=delivery`)가 성공했고 워크플로의 길이 검사를 통과했다.
- [ ] `node scripts/final-qa.mjs "projects/<slug>" media/<slug>/final.mp4 --lufs <목표>` 오류 0 (길이, h264/aac, 해상도, true peak ≤ −1 dBTP, 목표 음량 ±1 LU).
- [ ] final-qa 경고(정지·무음 구간)를 `06_final/NOTE.md`에 시각과 함께 적었다. 점수나 "좋다"는 없다.
- [ ] 사용자가 완성본 MP4를 직접 봤고, 질문 2 답이 `feedback.md`에 있다.
- [ ] `git status`에 음원·MP4 파일이 없다.

## 사용자에게 보여줄 것
음량 두 판 MP4(측정값 한 줄씩) → 고른 완성본.

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` → 커밋·푸시(음원·MP4 제외). `node scripts/status.mjs`가 `stage: 7`이면 프로젝트 완료.
