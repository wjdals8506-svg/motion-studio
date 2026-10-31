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
- 점수를 매기거나 스스로 "좋다"고 인증하지 않는다. 남은 문제를 그대로 적는다.
- 새 제안 전에 `taste/verdicts.md`를 읽는다. 사용자의 거절 이유는 이 스킬의 규칙보다 우선한다.

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
