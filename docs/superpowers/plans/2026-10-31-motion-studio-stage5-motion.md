# Motion Studio 5단계(모션) 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 서사·타이밍·BGM·디자인으로 30초 전체 영상을 만들고, 키 모션에만 효과음을 붙이고, 1단 자동 검사와 2단 프레임 리뷰를 거쳐 전체 영상 미리보기로 5단계 승인을 받는다. 파일럿 `yoon-jongshin-concert-teaser`로 검증한다.

**Architecture:** `05_film/`은 영상 전체를 담는 HyperFrames 컴포지션 하나다. 비계는 4단계 `keycut.mjs`를 확장해 전체 구간(0~duration)과 `05_film/sfx.json`의 효과음 `<audio>`를 넣는다. 장면은 승인된 스타일 모듈 `styles/modules/19-grainy-gradient/fog-glass.js` 하나로 그린다(원본은 모듈, 컴포지션에는 사본). 효과음은 ElevenLabs Sound Effects로 만들어 PC의 `media/<slug>/`에만 둔다. 1단 검사(`film-qa.mjs`)는 효과음 위치·엔드 홀드·읽기 시간·에셋 목록·사본 일치를 숫자로 확인하고, 2단 리뷰는 `hyperframes snapshot --review`로 만든 시트를 에이전트가 처음 보는 사람처럼 묘사해 `REVIEW.md`에 P0/P1/P2로 남긴다(점수 없음).

**Tech Stack:** Node.js 22+, `hyperframes@0.8.221`(`check`, `snapshot --review`, `audio`), ElevenLabs Sound Effects API(`POST /v1/sound-generation`, `eleven_text_to_sound_v2`, `duration_seconds` 0.5~30, `prompt_influence` 0~1 기본 0.3, 2026-10-31 문서 확인), `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-30-motion-studio-design.md` (6절 5단계, 7절 1단·2단 QA, 6절 "효과음은 키 모션에만")

**범위:** 5단계까지. 덕킹·음량 정규화·최종 MP4·음원 원격 업로드는 6단계 계획.

## 이 계획에서 정한 것

1. **영상은 한 샷, 컴포지션 하나.** 2단계 A안대로 끊지 않는 한 샷이라 컷마다 서브 컴포지션으로 나누지 않는다. 캔버스 하나가 `hf-seek` 시각으로 모든 비트의 상태(카메라, 자국, 바람, 다시 서림, 제목)를 그리고, DOM은 카피만 맡는다. 키 컷 3개의 상태 함수를 그대로 옮기고, 비어 있던 컷 2(첫 바람, "서늘한 바람처럼"), 컷 3(불빛이 켜짐, 카메라 오른쪽 흐름), 컷 5(창밖으로 나가 도시 일곱 이름, 다시 물러남)를 새로 쓴다.
2. **시각은 `timing.json`에서만.** 하드코딩한 시각(4단계 리뷰 M4)을 없애고, 컴포지션은 비계가 넣은 `window.__timing`(컷 시작·길이·키 모션)과 `03_animatic.md` 음악 측정값(첫 음 1.52초, 강음 20.65초)을 상수 표 하나로 읽는다.
3. **효과음은 키 모션 두 곳만.** 큰 바람(15.045초), '가을냄새'가 드러남(24.045초). 후보는 각 2개, 사용자가 고른다. 크레딧 약 200 × 4 = 800, 생성 전 사용자 확인.
4. **사용자 확인용 영상.** 원격 MP4는 음원이 빠진 무음이다. 음악·효과음과 함께 보는 것은 PC 미리보기다. 휴대폰으로 소리까지 보려면 PC에서 무음 MP4에 음원만 합치는 방법이 있는데, CLAUDE.md 12번과의 관계를 사용자가 아직 정하지 않았으므로 5단계 질문에서 다시 묻는다.
5. **4단계 미룬 항목 중 5단계에서 다시 만드는 것은 함께 고친다:** 제목과 정보 줄 정렬(M5), 렌더러 사본 대조(M7), keycutWindow 부동소수 경계(M2), module.md 세계 크기(M8).

## Global Constraints

- Node `>=22`, `hyperframes` `0.8.221` 고정, 새 npm 의존성 없음, 테스트 `node:test`·`npm test`.
- PC에서 전체 영상 MP4 렌더 금지(`check`, `snapshot`, `preview`만). `.env` 출력·커밋 금지. ElevenLabs 음원은 어떤 레포에도 커밋 금지(`media/<slug>/`, 사본은 `assets/audio/` git 제외).
- 컴포지션 에셋은 폴더 안(`../` 금지), 한 화면 요소는 하나의 `clip` 안, 타임라인 `paused`, `hf-seek` 시각만으로 그림, `Math.random`·`Date.now`·rAF 금지, 비동기 준비는 `window.__hf.buildReady`.
- 승인된 결정을 따른다: 스타일 A, 김·불빛만 아주 작게 살아 있음(글자는 착지 후 정지), '가을냄새'는 Pretendard 600 글꼴 모양으로 김을 닦아 드러냄, 물줄기·손가락 획 없음, 종이·파스텔 계열 안 씀(이 주제 한정).
- 영상 속 사실은 `01_key_message.md`의 출처가 있는 것만(도시 7곳, 10. 2 시작, 11월까지).
- director 스킬(laws, never-ship, connection, composition, korean-type, music, motion-principles-thedalbee)을 먼저 읽는다. 점수·자기 인증 금지. 승인은 명시적 발화로만.
- CLI 계약: 인자, JSON stdout, 실패 시 non-zero exit, 공백·한글 경로.

## Review Focus

1. **키 모션이 아닌 곳의 효과음** — `sfx.json`에 키 모션과 0.1초 넘게 떨어진 효과음이 있으면 1단 검사가 실패해야 한다. → Task 3 테스트.
2. **엔드 홀드 길이** — 마지막 움직임이 끝난 뒤 완전 정지가 0.6~1.4초 밖이면 실패. → Task 3 테스트.
3. **읽기 시간 부족** — 카피가 화면에 있는 시간이 읽기 시간보다 짧으면 실패(4단계에서 실제로 걸렸다). → Task 3 테스트(카피 표시 구간은 `window.__copyWindows`로 컴포지션이 선언).
4. **렌더러 사본이 모듈과 다름** — 컴포지션의 `fog-glass.js`가 모듈 원본과 다르면 실패. → Task 1 테스트.
5. **효과음 생성 실패 시 크레딧 낭비** — 중간 실패에도 이미 만든 파일 목록을 stdout에 남기고 exit 1. → Task 2 테스트(순수 함수 `summarize`).

---

### Task 1: 5단계 틀과 렌더러 사본 대조

**Files:** Create `stages/05-motion/{questions,template,gate}.md`, `scripts/copies.test.mjs`. Modify `scripts/status.mjs`·`status.test.mjs`(05_film.md), `styles/modules/19-grainy-gradient/module.md`(세계 크기 2381×1339), `scripts/keycut.mjs`(M2: 경계를 반올림 값으로 비교, `dur <= 0` 컷 버림)·`keycut.test.mjs`.

- [ ] **Step 1: 실패하는 테스트** — status: '0~5 모두 승인이면 6단계'. keycut: 'start+dur 부동소수 오차로 길이 0 컷이 생기지 않는다'(컷 `[0.014+1.12]` 경계 `--from 1.134`). copies: '레포 안의 모든 fog-glass.js 사본이 모듈 원본과 같다'(`projects/**/fog-glass.js` 중 `04_design/lib/`과 `assets/js/` 사본을 `styles/modules/19-grainy-gradient/fog-glass.js`와 바이트 비교, CRLF는 LF로 맞춰 비교).
- [ ] **Step 2: 실패 확인** — `npm test` FAIL
- [ ] **Step 3: 구현** — STAGES에 `{ n: 5, file: '05_film.md' }`. keycutWindow 수정. `04_design/lib/`는 지우고 원본을 모듈로 일원화(키 컷 사본은 유지).
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: 단계 문서** — `questions.md`: 1) (전체 영상 미리보기를 보여주고) 길거나 빠른 곳, 흐름이 끊기는 곳(몇 초)? 2) (효과음 후보를 들려주고) 어느 소리가 맞나요? 3) 소리까지 휴대폰으로 보시려면 PC에서 무음 MP4에 음원만 합쳐도 될까요(CLAUDE.md 12번 관계)? 4) (고친 영상을 보여주고) 남은 어색한 곳(몇 초)? `template.md`: front matter + `## 장면 구성`(컷별 상태 함수 요약), `## 효과음`(표: 위치 | 후보 | 선택), `## 1단 자동 검사`(film-qa 결과, hyperframes check 경고), `## 2단 리뷰`(`05_film/REVIEW.md` 요약), `## 피드백 반영`(`feedback.md` 링크), `## 남은 문제`. `gate.md`: film-qa 오류 0, check 오류 0, REVIEW.md의 P0 없음, 효과음은 키 모션에만, 음원 미커밋, 점수 없음 / 승인 후: approved → verdicts → 커밋·푸시, 다음은 6단계 계획.
- [ ] **Step 6: Commit**

### Task 2: 효과음 생성

**Files:** Create `scripts/sfx-generate.mjs`, `scripts/sfx-generate.test.mjs`. Modify `scripts/music-generate.mjs`(공용 함수 `readEnvKey`, `redact`, `errorText` 재사용 — 옮기지 않고 import).

**Interfaces:**
- 입력 `05_film/sfx_brief.json`: `[{ name: 'wind', at: 15.045, prompt: '…', duration: 2.5 }]`.
- `sfxRequest(item, key, { influence = 0.5 }): { url, init }` — `POST https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128`, 본문 `{ text, duration_seconds, prompt_influence, model_id: 'eleven_text_to_sound_v2' }`, 키는 헤더에만.
- `summarize(files: string[], error?: string): { files, error? }`.
- CLI `node scripts/sfx-generate.mjs "projects/<slug>" --count 2` → 항목마다 `media/<slug>/sfx-<name>-<k>.mp3`, 매니페스트 `{ kind: 'sfx', source: 'elevenlabs', model, prompt, public_redistribution: false, … }`. 실패해도 stdout에 `summarize(files, error)`, exit 1.
- [ ] Step 1 테스트: '요청은 sound-generation, 키는 헤더에만, duration 0.5~30 밖이면 throw', 'summarize는 실패해도 만든 파일을 담는다'. Step 2 FAIL → Step 3 구현 → Step 4 PASS → Step 5 Commit.

### Task 3: 전체 영상 비계와 1단 자동 검사

**Files:** Modify `scripts/keycut.mjs`(`--film` 플래그: `05_film/`에 쓰고, `05_film/sfx.json`의 `[{ name, at, file }]`마다 `<audio id="sfx-<name>" src="assets/audio/sfx-<name>.mp3" data-start=<at> …>`, `window.__timing = { beats, cues }` 주입). Create `scripts/film-qa.mjs`, `scripts/film-qa.test.mjs`.

**Interfaces:**
- `filmQa({ timing, sfx, copyWindows, endHold, manifestProblems, copiesMatch }): { errors: string[], warnings: string[] }`
  - 효과음 `at`이 키 모션과 0.1초 넘게 떨어지면 오류(Review Focus 1).
  - `endHold`(마지막 움직임 끝 → 영상 끝) 0.6~1.4초 밖이면 오류(Focus 2).
  - `copyWindows: [{ copy, from, to }]` 각 `to − from < readingTime(copy)`면 오류(Focus 3).
  - 매니페스트 문제, 사본 불일치는 오류.
- 컴포지션은 `window.__copyWindows`와 `window.__endHold`를 선언한다. CLI `node scripts/film-qa.mjs "projects/<slug>"`는 `index.html`에서 두 값을 JSON 블록(`<script type="application/json" id="qa">`)으로 읽는다.
- [ ] Step 1 테스트: 효과음 위치, 엔드 홀드 0.5/1.2/1.5, 읽기 시간 부족, 정상 → 오류 0. `--film` 비계: 전체 길이, sfx audio 요소, `__timing` 주입. Step 2 FAIL → Step 3 구현 → Step 4 PASS → Step 5 Commit.

### Task 4: 파일럿 전체 영상

- [ ] **Step 1: 비계와 장면** — `keycut.mjs --film` → `05_film/index.html`. 모듈 렌더러로 30초 상태 함수 작성: 컷 1(키 컷 droplet), 컷 2(첫 바람 자국 왼→오, 블러 맞춤 18→6px, "서늘한 바람처럼"이 닦인 만큼 드러남), 컷 3(불빛이 하나둘 켜짐, 카메라 오른쪽 흐름, 컷 4 바람이 왼쪽 가장자리로 들어옴), 컷 4(키 컷 wind), 컷 5(카메라가 창밖으로 빠져나가 불빛 일곱, 20.65초 강음에 도시 이름이 켜지는 불빛과 함께, 다시 물러남), 컷 6(키 컷 title, 제목과 정보 줄 가운데 맞춤). 연결은 02 설계표의 연결(디자인) 좌표를 지킨다.
- [ ] **Step 2: 1단 검사** — `hyperframes check` 오류 0, `film-qa` 오류 0. 경고는 `05_film.md`에.
- [ ] **Step 3: 2단 리뷰** — `snapshot --review` 시트를 보고 모든 프레임을 한 문장으로 묘사한 뒤 `REVIEW.md`에 `t=… · 위치 · 문제 → 수정`을 P0/P1/P2로(점수 없음). P0·P1 수정.
- [ ] **Step 4: 효과음** — `sfx_brief.json`(바람: 부드러운 가을바람이 유리를 쓸고 지나가는 소리, 약 2.5초 / 제목: 손끝이 김 서린 유리를 천천히 문지르는 소리, 약 2.2초) → 사용자 확인 후 생성 → 후보를 SendUserFile → 질문 2 → `sfx.json`.
- [ ] **Step 5: 미리보기** — 무음 MP4를 Actions로(draft) → 보내기 → 질문 3(음원 합치기 허용) → 허용되면 합친 MP4도 → 질문 1, 4 → `feedback.md`에 반영 기록, 반복.
- [ ] **Step 6: 승인** — gate 확인 → 명시적 승인 → approved, verdicts, 커밋·푸시(음원 제외). status `"stage": 6`.
