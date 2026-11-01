---
name: director
description: 이 레포에서 모션그래픽 영상의 서사, 컷 사이 연결, 컷 안 구성, 모션 타이밍, 한국어 타이포를 판단할 때 쓰는 연출 스킬. 스토리라인·컷 설계표 작성(2단계), 애니매틱·디자인·모션 제작(3~5단계), 리뷰와 수정 때 반드시 먼저 읽는다.
---

# director — 연출 스킬

이 원판에서 무너지기 쉬운 곳은 효과가 아니라 **서사 → 컷 사이 연결 → 컷 안 구성** 층이다. 이 스킬은 그 세 층과 모션 타이밍의 판단 기준을 정한다. 판단(무엇을)이 먼저고, 법칙(어떻게)은 그다음이다.

## 언제 무엇을 읽는가

| 상황 | 먼저 읽을 것 |
|---|---|
| 키메시지에서 스토리라인 3안과 컷 설계표를 만들 때 (2단계) | [narrative.md](references/narrative.md), [connection.md](references/connection.md) |
| 컷 설계표의 `연결(서사)`, `연결(디자인)` 열을 채우거나 점검할 때 | [connection.md](references/connection.md) |
| 애니매틱·키 컷·전체 컷의 화면을 배치할 때 (3~5단계) | [composition.md](references/composition.md), [korean-type.md](references/korean-type.md) |
| BGM 구간을 계획하고 컷·키 모션을 박자에 맞출 때 (3단계) | [music.md](references/music.md) |
| 장면 요소와 모션을 구체화할 때 (4·5단계, 참고 자료) | [motion-principles-thedalbee.md](references/motion-principles-thedalbee.md) |
| 진입·퇴장·이징·길이·stagger를 정할 때 | [laws.md](references/laws.md), `tokens/motion.json` |
| 어떤 요소를 넣을지 말지 망설일 때, 리뷰할 때 | [never-ship.md](references/never-ship.md) |
| 한국어 헤드라인·자막·내레이션 원고를 다룰 때 | [korean-type.md](references/korean-type.md) |

## 판단 순서 (수정할 때도 이 순서)
1. 깨졌거나 사실이 아닌 것
2. 아이디어와 키메시지
3. 컷 사이 연결
4. 위계와 크기
5. 타이밍
6. 표면과 마감
7. 사운드

앞 순서의 문제가 남아 있으면 뒤 순서를 다듬지 않는다.

## 항상 지킬 것
- 모든 비트는 시청자가 믿게 될 것 하나를 산다. 그 문장을 못 쓰면 비트를 지운다.
- 컷 N의 마지막 프레임은 컷 N+1의 첫 프레임과 이어진다. 하드 컷은 의미가 있을 때만.
- 프레임당 히어로는 하나.
- never-ship 목록에 걸리는 요소는 지운다. 정당화하지 않는다.
- 이징과 길이는 `tokens/motion.json`의 값에서 고른다. 모든 요소에 같은 이징·같은 길이를 쓰지 않는다.
- 모든 트윈에 `ease`를 적는다. 진입은 감속(softLand·glide·emphasized-decelerate), 퇴장은 가속(accelExit·gentleIn·emphasized-accelerate)으로 짝을 맞춘다. GSAP 기본값(ease 생략)은 쓰지 않고, `ease: 'none'`은 진행률·일정 속도·색온도 램프에만 쓴다.
- 점수를 매기거나 스스로 "좋다"고 인증하지 않는다. 남은 문제를 그대로 적는다.
- 새 제안 전에 `taste/verdicts.md`를 읽는다. 사용자의 거절 이유는 이 스킬의 규칙보다 우선한다.

## 자체 검수 (보내기 전에, 하나라도 실패하면 사용자에게 보내지 않는다)
결함은 사용자보다 먼저 찾아야 한다. 2026-11-01까지 결함을 사람보다 먼저 잡은 기록이 없었다.
1. 측정: `npx hyperframes check --json` 경고 목록을 문서에 인용한다. 의도한 홀드에는 `data-hold`.
2. 금지 패턴: `node scripts/motion-lint.mjs <index.html>`. 결과마다 고치거나 REVIEW.md "의도적으로 남긴 경고"에 이유를 적는다.
3. 시트: `npx hyperframes snapshot <dir> --review --json`(비트 프레임, 컷마다 5프레임 띠, 폰 너비 시트). 히어로 이동은 `--range a,b --frames 8`로 따로 본다.
4. 묘사: 비트 프레임마다 "히어로 / 모든 물체 이름 / 슬라이드처럼 보이는가 / 다음 프레임을 일으키는가"를 한 문장으로. 설명이 필요한 물체는 P0.
5. 네 가지 보기: 글자를 가린 그림, 썸네일 크기(폰 시트), 무음, 좌우 반전.
6. 낯선 눈: 만든 맥락이 없는 서브 에이전트에게 스토리보드와 시트만 주고 P0·P1을 받는다. 해결책이 아니라 원인을 적게 한다.
7. 원격 렌더본: 렌더 아티팩트의 `sheet.jpg`(0.5초 간격, 시각 표시)와 `qc.txt`(정지·검은 프레임)를 보고, HTML 미리보기와 다르면 보내지 않는다(2026-11-01 HDR 합성으로 글자 창이 깨진 렌더를 그대로 보냈다).
8. 기록: REVIEW.md에 `t · 위치 · 문제 → 고칠 것 · 남길 것` 한 줄씩, P0/P1/P2, 가장 약한 샷, 측정한 것과 눈으로만 본 것, 확인하지 않은 것. 점수는 쓰지 않는다.
(출처: hf/review.md 1~4절, mm/SKILL.md never-ship 11·12, Netflix QC, Pixar Braintrust — reports/모션그래픽 미감 레퍼런스와 검수 기준.md)

## 사용자 말 → 먼저 볼 곳
| 사용자 말 | 먼저 볼 곳 |
|---|---|
| "너무 빠르다", "정신없다" | 읽기 시간(korean-type.md), 한 번에 움직이는 요소 수, 키 모션 횟수 |
| "슬라이드 같다", "PPT 같다" | 정중앙 배치 반복, 같은 진입 반복, 평평한 바탕(never-ship 슬라이드 테스트) |
| "밋밋하다", "수준이 못 미친다" | 히어로 40%, 컷 길이 대비, 2~4초마다 새로운 것, 전환의 원인 |
| "제목이 움직인다", "어지럽다" | 착지 뒤 표류·크리프(`motion-lint` drift·creep-scale) |
| "글자가 안 보인다" | 원격 렌더 시트와 HTML 미리보기 비교, 대비, 글자 창 획 면적 |
(출처: hf/motion.md 사용자 말 대응, 2026-11-01 taste/verdicts.md)

## HyperFrames에서 구현할 때 (스파이크에서 확인)
- 에셋 경로는 컴포지션 폴더 안(`../` 금지). 폰트는 프로젝트 `assets/fonts/`에 복사.
- 한 화면에 함께 놓을 요소는 하나의 장면 클립(`class="clip"`) 안에.
- 타임라인은 일시정지된 GSAP 타임라인 하나를 `window.__timelines`에 등록. `Date.now()`, `Math.random()`, 네트워크 요청 금지.
- 실측 이징은 `vendor/motionmaxxing/runtime/motion.js`의 수식을 GSAP 커스텀 이징 함수로 옮겨 쓴다.

## 원천
- motionmaxxing (Apache-2.0, 커밋 `8c8ec0f`): `vendor/motionmaxxing/` — 깊이 들어가야 할 때 원문 `references/`를 직접 읽는다.
- HyperFrames 공식 스킬 v0.8.221: `motion.md`, `review.md`.
- Material 3 모션 토큰 (Apache-2.0).
- 출처 목록과 고정 버전: `vendor/SOURCES.md`.
