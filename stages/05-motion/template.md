---
stage: 5
status: draft
approved_at:
---

# 모션: <주제>

컴포지션: `05_film/index.html` (타이밍 원본 `03_animatic/timing.json`, 디자인 원본 `04_design/design_tokens.json`, 렌더러 `styles/modules/<모듈>/`)

## 장면 구성
| 컷 | 시간대 (초) | 무엇이 일어나나 (상태 함수 요약) | 연결 (02 설계표) |
|---|---|---|---|

## 소리
- BGM 볼륨: <0~1>, 페이드 인 <초>·아웃 <초> (`<audio id="bgm" data-volume data-fade-in data-fade-out>`)

## 효과음
| 위치 (키 모션) | 후보 (PC 전용 `media/<slug>/`) | 선택 |
|---|---|---|

## 1단 자동 검사
- `npx hyperframes check`: 오류 <n>, 경고 <요약>
- `node scripts/film-qa.mjs "projects/<slug>"`: 오류 <n>, 경고 <요약>

## 2단 리뷰
`05_film/REVIEW.md` 요약 (P0 / P1 / P2 개수, 고친 것)

## 피드백 반영
`feedback.md` (시간 위치 · 요청 · 반영 여부)

## 남은 문제
