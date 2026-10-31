# Motion Studio 3단계(애니매틱과 BGM) 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 2단계 컷 설계표에서 무음 애니매틱을 만들어 먼저 확인받고, 그 컷 구성으로 ElevenLabs BGM 후보를 만들어 고른 뒤, 박자를 분석해 애니매틱 타이밍을 맞추고 3단계 승인을 받는다. 파일럿 `yoon-jongshin-concert-teaser`로 검증한다.

**Architecture:** `03_animatic/timing.json` 하나가 타이밍의 원본이다. 스크립트가 컷 설계표 → `timing.json` → 애니매틱 `index.html`을 만들고, 같은 `timing.json`으로 ElevenLabs composition plan(`music_plan.json`)을 만든다. 승인한 곡은 `hyperframes audio`로 분석해 `music_map.json`을 만들고, `retime`이 컷 경계와 키 모션을 박자에 맞춰 `timing.json`을 고친 뒤 애니매틱을 다시 만든다. 음원 원본은 PC의 `media/<slug>/`에만 있고 애니매틱 폴더에는 미리보기용 사본만 복사된다(둘 다 git 제외).

**Tech Stack:** Node.js 22+ (설치본 v24.14.0), `hyperframes@0.8.221`(`audio --only beats,downbeats,bpm`, `lint`, `check`, `preview`), GSAP 3.14.2(CDN, 스파이크와 같음), ElevenLabs Music API(`music_v1`), Node 내장 `fetch`·`node:test`.

**Spec:** `docs/superpowers/specs/2026-10-30-motion-studio-design.md` (6절 3단계, 4절 BGM·음악 분석, 9절 라이선스, 14절 하네스)

**범위:** 3단계까지. 원격 MP4에 음원을 넣는 장치(암호화 임시 업로드)는 6단계에서 처음 필요하므로 이 계획에 넣지 않는다(아래 결정 1).

## 이 계획에서 정한 것 (사용자 확인 필요한 것은 표시)

1. **음원 임시 업로드는 6단계 계획으로 미룬다.** 3단계 승인은 HTML 미리보기로 하므로 원격 렌더에 음원이 필요 없다. 스펙 9절은 "3단계 계획에서 정한다"고 적었으므로 Task 1에서 "6단계 계획에서 정한다"로 고친다.
2. **3단계 안의 확인 지점은 셋이다.** (A) 무음 애니매틱 확인 → (B) BGM 후보 선택(고른 곡이 최종 곡, 다시 생성하지 않음, 스펙 4절) → (C) 박자를 맞춘 애니매틱+BGM 최종 승인. `status: approved`는 (C)에서만 쓴다. (A)·(B)는 `03_animatic.md`와 `taste/verdicts.md`에 기록한다.
3. **Beat This!는 처음에 설치하지 않는다.** `hyperframes audio`의 signal 분석이 80 BPM 클릭음에서 박자는 정확히 잡았지만(신뢰도 0.927) 마디 첫 박은 틀렸다(신뢰도 low). 마디 첫 박은 음악 계획의 구간 시작점에 가장 잘 맞는 위상을 고르는 방식(`pickDownbeats`)으로 정한다. 실제 BGM에서 박자 자체가 어긋나면 그때 Beat This!를 `HYPERFRAMES_BEAT_THIS_PYTHON`으로 붙인다.
4. **원격에서 보기.** 무음 애니매틱은 GitHub Actions로 draft MP4를 렌더해 보낼 수 있다(음원 없음, 기존 워크플로 그대로). BGM 후보 음원은 SendUserFile로 사용자에게 직접 보낸다(레포 게시가 아님). **BGM이 들어간 애니매틱은 PC 브라우저 미리보기로만 볼 수 있다.** [사용자 확인 필요]
5. **애니매틱의 회색 상자는 에이전트가 컷마다 적는다.** `timing.json`의 `boxes`(화면 비율 좌표와 짧은 이름표)로 적고, 없으면 상자 없이 카피만 나온다. 컷 번호·역할 자막은 화면 아래 가운데 작게 넣는다(애니매틱 전용, 4단계부터 쓰지 않는다).

## Global Constraints

- Node `>=22`. `hyperframes`는 `0.8.221` 고정. 새 npm 의존성 없음. 테스트는 `node:test` + `node:assert/strict`, 실행은 `npm test`.
- 사용자 PC에서 전체 영상 MP4 렌더 금지. PC에서는 `lint`, `check`, `snapshot`, `preview`만.
- `.env`는 출력·커밋 금지. 키는 `ELEVENLABS_API_KEY`로 읽고, 에러 메시지·로그에 키가 나오지 않게 한다.
- ElevenLabs 음원(BGM, 효과음)은 어떤 레포에도 커밋하지 않는다. 원본은 `media/<slug>/`, 미리보기 사본은 `projects/<slug>/03_animatic/assets/audio/`(확장자로 git 제외).
- HyperFrames 오디오 엔진을 쓸 때 `bgm.mode = "none"`.
- 컴포지션 에셋 경로는 폴더 안(`../` 금지). 폰트는 레포 `assets/fonts/pretendard/`에서 복사. 한국어 텍스트는 Pretendard, `word-break: keep-all`.
- 한 화면에 함께 놓는 요소는 하나의 `class="clip"` 안에 넣는다. GSAP 타임라인은 `paused: true`로 `window.__timelines['main']`에 등록한다. `Math.random`·`Date.now` 금지.
- 경로에 공백과 한글이 있다. 모든 스크립트와 테스트는 그 경로에서 동작해야 한다.
- 스크립트는 하네스가 부를 수 있는 CLI다: 인자 입력, JSON 출력(stdout), 실패 시 non-zero exit(스펙 14절).
- 에이전트는 결과물에 점수를 매기거나 "좋다"고 인증하지 않는다. 승인은 명시적 승인 발화로만.
- ElevenLabs 호출(크레딧 사용)과 push는 해당 태스크에서 사용자 확인 후.

## Review Focus

1. **생성된 곡 길이가 계획과 다를 때** — ElevenLabs가 30.0초 계획에 29.6초나 30.4초 곡을 주면, 타이밍을 조용히 늘이거나 자르지 말고 경고로 알려야 한다. → Task 6 `retime` 길이 경고 테스트.
2. **3초보다 짧은 음악 구간** — ElevenLabs 구간 최소 길이(Task 5에서 문서로 확인, 예상 3000ms)보다 짧은 구간이 생기면 요청 전에 이유와 함께 실패해야 한다. → Task 4 짧은 구간 테스트.
3. **박자 맞춤이 컷을 망가뜨릴 때** — 경계를 박자로 옮기다 컷이 읽기 시간보다 짧아지거나 순서가 뒤집히면 그 경계는 옮기지 않아야 한다. → Task 6 최소 길이 테스트.
4. **API 실패 메시지에 키가 섞일 때** — 응답 본문이나 예외에 키가 들어 있어도 출력에는 나오지 않아야 한다. → Task 5 `redact` 테스트.
5. **미리보기 음원 사본이 커밋될 때** — 애니매틱 폴더로 복사한 음원이 스테이징되면 커밋 전 검사가 막아야 한다. → Task 3 테스트(생성된 `<audio>` 경로가 `assets/audio/` 안이고 확장자가 차단 목록에 있음).

---

### Task 1: 3단계 틀 (질문·템플릿·게이트·상태·음악 동기화 규칙)

**Files:**
- Create: `stages/03-animatic/questions.md`, `stages/03-animatic/template.md`, `stages/03-animatic/gate.md`, `.claude/skills/director/references/music.md`
- Modify: `scripts/status.mjs` (STAGES), `scripts/status.test.mjs`, `.claude/skills/director/SKILL.md`(references 목록에 music.md), `docs/superpowers/specs/2026-10-30-motion-studio-design.md`(6절 3단계 행, 9절 172~173행), `docs/spike-report.md`(C절 변경 줄), `CLAUDE.md`(14번 규칙의 "3단계 계획에서" → "6단계 계획에서", 사용자가 이 계획을 승인하면 함께 승인된 것으로 본다)

**Interfaces:**
- Produces: 3단계 산출물 문서 `projects/<slug>/03_animatic.md`(front matter `stage: 3`, `status`, `approved_at: YYYY-MM-DDTHH:MM`). `projectStatus()`가 0~3단계를 본다.

- [ ] **Step 1: 실패하는 테스트**

`status.test.mjs`의 '0~2 모두 승인이면 3단계'를 '0~3 모두 승인이면 4단계'로 바꾸고(`03_animatic.md` 추가, `stage === 4`), 새 테스트 '3단계 초안이면 3단계'(`00~02` approved, `03_animatic.md` draft → `{ stage: 3, approved: [00,01,02], stale: [] }`)를 넣는다.

- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: 위 두 테스트 FAIL

- [ ] **Step 3: `STAGES`에 `{ n: 3, file: '03_animatic.md' }` 추가**

- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: 전부 PASS. `node scripts/status.mjs "projects/yoon-jongshin-concert-teaser"` → `"stage": 3`

- [ ] **Step 5: 단계 문서 작성**

`questions.md` (한 번에 하나, 이 순서):
1. (무음 애니매틱을 보여주고) 길거나 빠르게 느껴지는 곳, 흐름이 끊기는 곳이 있나요? (몇 초 지점으로)
2. 음악은 어떤 소리였으면 하나요? 꼭 들어갔으면 하는 악기와 피하고 싶은 소리는?
3. (후보 2~3곡을 들려주고) 어느 곡이 이 영상의 곡인가요? 고른 이유는?
4. (박자를 맞춘 애니매틱을 보여주고) 음악과 화면이 어긋나는 곳이 있나요? (몇 초 지점으로)

`template.md`: front matter(`stage: 3`, `status: draft`, `approved_at:`) + 섹션 `## 무음 애니매틱 확인`(날짜, 사용자 반응, 고친 것), `## 음악 방향`(악기, 분위기, 피할 것, 템포), `## BGM 후보`(표: 후보 | 파일(`media/<slug>/…`) | 구간 계획 요약 | 선택), `## 박자 지도`(BPM, 마디 첫 박 출처 `signal`/`plan-phase`/`beat-this`, 신뢰도), `## 타이밍 조정`(표: 대상 | 원래 | 조정 | 이유), `## 남은 문제`.

`gate.md` 승인 요청 전 확인:
- `timing.json`의 컷 수·길이가 `02_story.md` 컷 설계표와 같다(조정 전 기준).
- 무음 애니매틱 확인(A)과 후보 선택(B)이 `03_animatic.md`와 `taste/verdicts.md`에 있다.
- 음악 계획의 구간 길이 합이 영상 길이와 같고, 모든 구간이 최소 길이 이상이다.
- `retime` 결과의 경고(길이 불일치, 옮기지 않은 경계)를 사용자에게 보여줬다.
- `npx hyperframes check`가 오류 0. `assets.manifest.json` 검사 통과.
- 음원 파일이 스테이징되지 않았다(`git status`에 오디오 없음).
- 점수·자기 인증 없음.
승인 후: `status: approved`, `approved_at` → verdicts → 커밋·푸시(음원 제외). 다음은 4단계이며 별도 구축 계획이 필요하다.

`references/music.md` (director 스킬): 컷 경계는 마디 첫 박이나 구간 경계에, 키 모션은 마디 첫 박이나 강조음에 둔다. 허용 오차 ±0.3초(80 BPM 한 박 0.75초의 절반 미만). 옮겨서 컷이 읽기 시간(0.5초 + 어절당 0.3초)이나 1.0초보다 짧아지면 옮기지 않는다. 엔드 홀드는 곡의 마지막 울림 안에 둔다. 곡을 늘이거나 자르지 않는다.

- [ ] **Step 6: 스펙 수정**

6절 3단계 행: 에이전트 작업을 "회색 박스 애니매틱(무음)을 먼저 확인 → 컷 구성으로 음악 구간 계획 → BGM 후보 2~3개 → 고른 곡 분석 → 비트 지도로 타이밍 재조정"으로, 산출물에 `03_animatic.md`, `timing.json`을 더한다. 9절: "구체적인 방식은 3단계 계획에서 정한다" → "6단계 계획에서 정한다(3단계 승인은 HTML 미리보기라 원격 렌더에 음원이 필요 없다)". `docs/spike-report.md`와 `CLAUDE.md` 14번의 같은 문장도 고친다.

- [ ] **Step 7: Commit** — `git add stages/03-animatic scripts/status.* .claude/skills/director docs` / `git commit -m "feat: 3단계 틀과 음악 동기화 규칙"`

---

### Task 2: 컷 설계표 → `timing.json`

**Files:**
- Create: `scripts/timing.mjs`, `scripts/timing.test.mjs`

**Interfaces:**
- Consumes: `projects/<slug>/02_story.md`의 컷 설계표(헤더에 `길이(초)` 열이 있는 첫 표).
- Produces:
  - `readCutTable(md: string): Cut[]`, `Cut = { n: number, role: string, copy: string, dur: number, keyMotionAt: number[] }`. `copy`는 `(없음)`이면 `''`, ` / `는 줄바꿈 `\n`. `keyMotionAt`은 `키 모션` 칸의 `(\d+(?:\.\d+)?)초` 숫자들(`—`이면 `[]`).
  - `readingTime(copy: string): number` = 줄마다 `0.5 + 0.3 × 어절 수`의 합(빈 문자열 0). 어절은 공백과 ` · ` 기준.
  - `buildTiming(cuts: Cut[], opts: { bpm: number, width?: 1920, height?: 1080 }): Timing`
  - `Timing = { version: 1, bpm, width, height, duration, audio: null, beats: Beat[] }`, `Beat = { n, role, copy, start, dur, keyMotions: { at: number }[], boxes: Box[], section: null }`, `Box = { x, y, w, h, label }`(0~1 비율). `start`는 누적합, 소수 셋째 자리 반올림. `duration` = 마지막 `start + dur`.
  - CLI: `node scripts/timing.mjs "projects/<slug>" --bpm 80` → `03_animatic/timing.json`이 **없을 때만** 쓰고(있으면 exit 1, 덮어쓰기 금지 — 에이전트가 적은 `boxes`를 지키기 위해) stdout에 JSON.

- [ ] **Step 1: 실패하는 테스트**

```js
const TABLE = `| # | 역할 | 시청자가 믿게 될 것 | 카피 | 연결(서사) | 연결(디자인) | 키 모션 | 길이(초) |
|---|---|---|---|---|---|---|---|
| 1 | hook (2) | a | (없음) | b | c | — | 3.0 |
| 2 | turn (3) | a | 스며드는 / 윤종신의 목소리와 이야기 | b | c | **바람**(15.0초 시작, "스며드는" 18.0초 착지) | 6.0 |`;
test('컷 설계표를 읽는다', () => {
  assert.deepEqual(readCutTable(TABLE), [
    { n: 1, role: 'hook', copy: '', dur: 3, keyMotionAt: [] },
    { n: 2, role: 'turn', copy: '스며드는\n윤종신의 목소리와 이야기', dur: 6, keyMotionAt: [15, 18] },
  ]);
});
test('읽기 시간은 줄마다 0.5초 + 어절당 0.3초', () => {
  assert.equal(readingTime('스며드는\n윤종신의 목소리와 이야기'), 0.8 + 1.4);
  assert.equal(readingTime(''), 0);
});
test('시작 시각은 누적합', () => {
  const t = buildTiming(readCutTable(TABLE), { bpm: 80 });
  assert.deepEqual(t.beats.map(b => [b.start, b.dur]), [[0, 3], [3, 6]]);
  assert.equal(t.duration, 9);
  assert.deepEqual(t.beats[1].keyMotions, [{ at: 15 }, { at: 18 }]);
});
test('파일럿 설계표는 6컷 30초', () => {
  const md = fs.readFileSync(new URL('../projects/yoon-jongshin-concert-teaser/02_story.md', import.meta.url), 'utf8');
  const t = buildTiming(readCutTable(md), { bpm: 80 });
  assert.equal(t.beats.length, 6);
  assert.equal(t.duration, 30);
});
```
(`readingTime` 기대값은 부동소수 오차를 피해 `Math.round(x*10)/10`으로 비교해도 된다.)

- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: FAIL, `timing.mjs` 없음
- [ ] **Step 3: 구현** — 표 행은 `|`로 나누고 앞뒤 빈 칸을 버린다. 역할은 첫 단어(`hook (2)` → `hook`).
- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `git commit -m "feat: 컷 설계표에서 timing.json 만들기"`

---

### Task 3: `timing.json` → 애니매틱 `index.html`

**Files:**
- Create: `scripts/animatic.mjs`, `scripts/animatic.test.mjs`

**Interfaces:**
- Consumes: `Timing`(Task 2), `missingAssets(dir)`(`scripts/check-fonts.mjs`).
- Produces:
  - `renderAnimatic(timing: Timing): string` — HyperFrames 컴포지션 HTML. 루트 `<div id="root" data-composition-id="main" data-start="0" data-duration=duration data-width data-height>`. 컷마다 `<section class="clip beat" id="beat-<n>" data-start data-duration>` 하나, 안에 상자(`.box`, 회색 테두리, `label`)와 카피(`.copy`, Pretendard 600, 화면 높이 7%, 줄바꿈 `<br>`, `word-break: keep-all`), 아래 가운데 작은 자막 `#<n> <role>`. 키 모션마다 화면을 가로지르는 흰 막대(`.cue`) 하나를 그 시각에 0.6초 동안 GSAP로 지나가게 한다. `timing.audio`가 있으면 `<audio id="bgm" src="assets/audio/bgm.<ext>" data-start="0" data-duration=duration data-volume="1">`. 폰트 `@font-face`는 `assets/fonts/pretendard/Pretendard-Regular.woff2`, `Pretendard-SemiBold.woff2`.
  - CLI: `node scripts/animatic.mjs "projects/<slug>"` → `03_animatic/index.html`을 쓰고(매번 덮어씀, `timing.json`이 원본), 레포 `assets/fonts/pretendard/`의 두 폰트를 `03_animatic/assets/fonts/pretendard/`로 복사, `timing.audio`(레포 기준 경로, 예 `media/<slug>/bgm-2.mp3`)가 있으면 `03_animatic/assets/audio/bgm.<ext>`로 복사. 끝에 `missingAssets`가 비어 있지 않으면 exit 1. stdout `{ "out": "<path>", "beats": n, "audio": bool }`.

- [ ] **Step 1: 실패하는 테스트** (`timing`은 테스트 안에서 두 컷짜리로 만든다)
  - '컷마다 clip 하나, 시작·길이가 timing과 같다' — `data-start="3" data-duration="6"` 포함, `class="clip beat"` 개수 = 컷 수.
  - '한국어는 keep-all, 경로에 ../ 없음' — `word-break: keep-all` 포함, `../` 없음.
  - '음원이 없으면 audio 요소가 없다' / '음원이 있으면 assets/audio 안을 가리킨다' — `src="assets/audio/bgm.mp3"`, 그리고 `secret-scan.mjs`의 오디오 차단 패턴이 그 경로를 잡는다(패턴을 `export const AUDIO`로 내보내 테스트에서 import).
  - '키 모션마다 cue가 그 시각에 있다' — 키 모션 `[{at:15},{at:18}]`이면 HTML에 `.cue` 요소가 2개이고, 타임라인 스크립트에 `}, 15)`와 `}, 18)`(GSAP 위치 인자)가 들어 있다.
  - 'CLI 결과 폴더의 로컬 에셋이 모두 있다' — 임시 프로젝트 폴더(공백·한글 경로)에 `02`가 아닌 `03_animatic/timing.json`만 두고 CLI 실행 → exit 0, `missingAssets(<out dir>)` = `[]`.
- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: FAIL
- [ ] **Step 3: 구현** — `secret-scan.mjs`의 `AUDIO`를 `export`로 바꾼다. 상자 좌표는 `left: x*100%` 식 인라인 스타일.
- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: PASS
- [ ] **Step 5: 엔진 검사** — 파일럿으로 `node scripts/timing.mjs "projects/yoon-jongshin-concert-teaser" --bpm 80` → `node scripts/animatic.mjs …` → `npx hyperframes check "projects/yoon-jongshin-concert-teaser/03_animatic"` / Expected: 오류 0 (경고는 `03_animatic.md`에 적음). lint가 요구하는 속성(예: `data-hf-id`)이 빠졌으면 `renderAnimatic`에 넣고 Step 1 테스트에 단언을 더한 뒤 다시 돌린다(Ruling 기록).
- [ ] **Step 6: Commit** — `git commit -m "feat: timing.json에서 회색 상자 애니매틱 만들기"` (파일럿 `03_animatic/`은 Task 7에서 커밋)

---

### Task 4: 음악 구간 계획 + 에셋 목록 검사

**Files:**
- Create: `scripts/music-plan.mjs`, `scripts/music-plan.test.mjs`, `scripts/manifest.mjs`, `scripts/manifest.test.mjs`

**Interfaces:**
- Consumes: `Timing`.
- Produces:
  - 입력 `03_animatic/music_brief.json` (에이전트가 질문 2의 답으로 씀): `{ global: { positive: string[], negative: string[] }, sections: [{ name: string, beats: number[], positive: string[], negative: string[] }] }`.
  - `buildMusicPlan(timing: Timing, brief: MusicBrief, opts?: { minSectionMs: 3000 }): MusicPlan` — 구간마다 `duration_ms` = 그 구간 컷 길이 합 × 1000(정수). `positive_global_styles`에 `${timing.bpm} BPM`과 `instrumental`을 앞에 더한다. 모든 컷이 순서대로 정확히 한 번씩 구간에 들어가야 하고, 아니면 `Error('구간 <name>: …')`. 구간이 `minSectionMs`보다 짧으면 `Error('구간 <name> 길이 <ms>ms < 최소 3000ms')`. 반환 `{ model_id: 'music_v1', bpm, duration_ms, composition_plan: { positive_global_styles, negative_global_styles, sections: [{ section_name, positive_local_styles, negative_local_styles, duration_ms, lines: [] }] } }`.
  - `sectionStarts(plan: MusicPlan): number[]` — 구간 시작 초(0 포함).
  - CLI: `node scripts/music-plan.mjs "projects/<slug>"` → `03_animatic/music_plan.json` 쓰기, 각 컷의 `section`을 `timing.json`에 채움.
  - `manifest.mjs`: `checkManifest(entries: Entry[]): string[]`(문제 목록) — 필수 `id, path, kind, source, license, commercial, public_redistribution`. `source`가 `elevenlabs`면 `model`, `prompt`도 필수. `public_redistribution === false`면 `path`가 `media/`로 시작해야 한다(커밋되지 않는 위치). `addEntry(file: string, entry: Entry): void`(같은 `id`면 교체). CLI `node scripts/manifest.mjs "projects/<slug>"` → 문제 있으면 stderr에 한 줄씩, exit 1.

- [ ] **Step 1: 실패하는 테스트**
  - '구간 길이는 컷 길이 합' — 컷 3.0/4.5/6.0초, 구간 `[1,2]`·`[3]` → `[7500, 6000]`, `duration_ms` 13500, global 앞 두 개 `['80 BPM', 'instrumental']`.
  - '3초보다 짧은 구간은 실패' — 컷 2.0초 하나를 한 구간에 → throws `/최소 3000ms/`.
  - '빠지거나 겹친 컷은 실패' — 구간 `[1]`·`[1,2]` → throws `/구간/`.
  - 'sectionStarts' → `[0, 7.5]`.
  - 매니페스트: '공개 재배포 불가 음원이 media 밖이면 문제' / 'ElevenLabs 음원은 model·prompt 필수' / '정상 항목은 문제 없음'.
- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `git commit -m "feat: 컷 구성으로 음악 구간 계획, 에셋 목록 검사"`

---

### Task 5: ElevenLabs BGM 후보 생성

**Files:**
- Create: `scripts/music-generate.mjs`, `scripts/music-generate.test.mjs`

**Interfaces:**
- Consumes: `MusicPlan`(Task 4), `addEntry`(Task 4).
- Produces:
  - `readEnvKey(envText: string, name: string): string | null` — `NAME=value` 한 줄(따옴표 허용, `#` 주석 줄 무시).
  - `musicRequest(plan: MusicPlan, key: string, opts?: { outputFormat: 'mp3_44100_128' }): { url: string, init: RequestInit }` — `POST https://api.elevenlabs.io/v1/music?output_format=<fmt>`, 헤더 `xi-api-key`, 본문 `{ composition_plan, model_id }`(+ Step 0에서 확인한 길이 고정 옵션).
  - `redact(text: string, key: string): string` — 키가 나오는 모든 곳을 `***`로.
  - CLI: `node scripts/music-generate.mjs "projects/<slug>" --count 3` → 레포 루트 `.env`에서 키를 읽어(값 출력 금지) 후보마다 한 번 호출, `media/<slug>/bgm-<k>.mp3` 저장(이미 있으면 다음 번호), `assets.manifest.json`에 `{ id: 'bgm-<k>', path: 'media/<slug>/bgm-<k>.mp3', kind: 'music', source: 'elevenlabs', model: 'music_v1', prompt: <plan의 global+section styles 요약>, license: 'ElevenLabs Music Terms (Creator)', commercial: true, public_redistribution: false }` 추가. HTTP 실패면 `redact`한 상태 코드와 메시지만 stderr, exit 1. stdout `{ files: [...], credits_note }`.

- [ ] **Step 0: API 확인** — `https://elevenlabs.io/docs/api-reference/music/compose`를 읽고 엔드포인트, `composition_plan` 필드 이름, 구간 길이 최소·최대, 구간 길이를 지키게 하는 옵션(있으면 이름), 응답 형식(바이너리 mp3)을 확인한다. Task 4의 `minSectionMs`·필드 이름과 다르면 Task 4를 고치고 Ruling으로 남긴다.
- [ ] **Step 1: 실패하는 테스트**
  - 'env에서 키를 읽는다' — `'# x\n' + 'ELEVENLABS_API_KEY=' + '"abc"\n'` → `'abc'`, 없으면 `null`. (문자열을 쪼개 이 계획 파일과 테스트 파일이 커밋 검사에 걸리지 않게 한다.)
  - '요청은 music 엔드포인트, 키는 헤더에만' — `url`이 `/v1/music?output_format=mp3_44100_128`로 끝나고, `init.headers['xi-api-key'] === key`, `init.body`에 키 문자열이 없다.
  - 'redact는 키를 모두 가린다' — `redact('err abc / abc', 'abc') === 'err *** / ***'`.
  (테스트용 키는 `'k' + 'ey123'`처럼 쪼개서 커밋 검사에 안 걸리게 한다.)
- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: FAIL
- [ ] **Step 3: 구현** — Node 내장 `fetch`. 응답은 `arrayBuffer()`로 받아 파일로 쓴다.
- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `git commit -m "feat: ElevenLabs BGM 후보 생성"` (실제 호출은 Task 7에서 사용자 확인 후)

---

### Task 6: 박자 지도와 타이밍 재조정

**Files:**
- Create: `scripts/music-map.mjs`, `scripts/music-map.test.mjs`, `scripts/retime.mjs`, `scripts/retime.test.mjs`

**Interfaces:**
- Consumes: `Timing`, `MusicPlan`, `sectionStarts`, `readingTime`.
- Produces:
  - `normalizeAudioReport(report: object): MusicMap` — `hyperframes audio --only beats,downbeats,bpm --json`의 `items[0]`에서 `{ file, duration, bpm, beats: number[], downbeats: number[], downbeatSource: 'signal' | 'beat-this' | 'plan-phase', beatConfidence: number, downbeatConfidence: string }`. `provenance.downbeats`를 `downbeatSource`로.
  - `pickDownbeats(beats: number[], meter: number, anchors: number[]): number[]` — 위상 `p ∈ [0, meter)`마다 `beats[p], beats[p+meter], …`를 만들고, 각 anchor에서 가장 가까운 후보까지 거리 합이 가장 작은 위상을 고른다(같으면 작은 p).
  - CLI `node scripts/music-map.mjs "projects/<slug>" "<음원 경로>"` → `npx hyperframes audio <file> --only beats,downbeats,bpm --quality local --json` 실행 → 정규화 → `downbeatConfidence`가 `'low'`면 `pickDownbeats(beats, 4, sectionStarts(music_plan).filter(t => t > 0))`로 바꾸고 `downbeatSource: 'plan-phase'` → `03_animatic/music_map.json`.
  - `retime(timing: Timing, map: MusicMap, opts?: { tolerance: 0.3, minDur: 1.0 }): { timing: Timing, shifts: { what: string, from: number, to: number }[], warnings: string[] }`
    - `snap(t)`: 오차 안의 가장 가까운 downbeat → 없으면 오차 안의 가장 가까운 beat → 없으면 그대로.
    - 컷 경계(`beats[i].start`, i ≥ 1)를 차례로 snap. 옮긴 결과 앞뒤 컷 중 하나가 `max(minDur, readingTime(copy))`보다 짧아지거나 순서가 뒤집히면 그 경계는 그대로 두고 `warnings`에 `컷 <n> 시작 <t>초: 박자로 옮기면 너무 짧아져 그대로 둠`.
    - 키 모션 `at`도 snap(경계 규칙 없음).
    - `|map.duration − timing.duration| > 0.1`이면 `warnings`에 `곡 길이 <a>초 ≠ 영상 길이 <b>초`. 영상 길이는 바꾸지 않는다.
    - 소수 셋째 자리 반올림. 결과 `timing.audio`는 호출자가 채운다.
  - CLI `node scripts/retime.mjs "projects/<slug>"` → `timing.json`을 `timing.before-retime.json`으로 한 번만 보관한 뒤 덮어씀, stdout `{ shifts, warnings }`.

- [ ] **Step 1: 실패하는 테스트**
  - '정규화' — 계획 중 측정한 실제 출력(80 BPM 클릭음, `beats.times` 0.755부터 0.75 간격 15개, `downbeats.times [1.505, 4.505, 7.505, 10.505]`, `confidence: 'low'`)을 축약해 넣고 `bpm === 80`, `downbeatSource === 'signal'`, `downbeatConfidence === 'low'`.
  - 'pickDownbeats는 구간 시작에 맞는 위상을 고른다' — 같은 beats, anchors `[3, 6, 9]` → `[3.005, 6.005, 9.005]`(p=3). signal 분석은 0초의 첫 박을 자주 놓치므로 CLI는 anchors에서 0을 뺀다(`sectionStarts(plan).filter(t => t > 0)`).
  - '경계는 오차 안 마디 첫 박으로' — 컷 `[0,3)`,`[3,7.5)`, downbeats `[0.12, 3.12, 6.12]` → 경계 3 → 3.12, `shifts` 한 개.
  - '오차 밖이면 그대로' — downbeats `[3.5]`, beats `[]` → 경계 3 유지.
  - '너무 짧아지면 옮기지 않는다' — 컷 `[0,1.1)`(카피 없음), `[1.1,4)`, downbeat `[0.85]` → 경계 1.1 유지, `warnings` 한 줄.
  - '키 모션도 맞춘다' — `at: 18` , downbeat `18.12` → `18.12`.
  - '곡 길이가 다르면 경고, 영상 길이는 그대로' — `map.duration 29.6`, `timing.duration 30` → warnings에 `곡 길이`, `timing.duration === 30`.
- [ ] **Step 2: 실패 확인** — Run: `npm test` / Expected: FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — Run: `npm test` / Expected: PASS
- [ ] **Step 5: Commit** — `git commit -m "feat: 박자 지도와 타이밍 재조정"`

---

### Task 7: 파일럿 3단계와 승인

**Files:**
- Create: `projects/yoon-jongshin-concert-teaser/03_animatic.md`, `projects/yoon-jongshin-concert-teaser/03_animatic/{timing.json, timing.before-retime.json, index.html, music_brief.json, music_plan.json, music_map.json, assets/fonts/…}`, `projects/yoon-jongshin-concert-teaser/assets.manifest.json`
- Modify: `taste/verdicts.md`
- PC 전용(커밋 안 함): `media/yoon-jongshin-concert-teaser/bgm-*.mp3`, `03_animatic/assets/audio/bgm.mp3`

- [ ] **Step 1: 무음 애니매틱 (A)** — `timing.mjs` → `timing.json`에 컷마다 `boxes`를 `02_story.md`의 연결(디자인) 칸 좌표로 적는다(예: 컷 1 물방울 x0.55 y0.62) → `animatic.mjs` → `hyperframes check` 오류 0 → `npx hyperframes preview "projects/yoon-jongshin-concert-teaser/03_animatic"`. 사용자가 PC 밖에 있으면 무음이므로 기존 `render.yml`(`-f project=projects/yoon-jongshin-concert-teaser/03_animatic -f quality=draft`, 사용자 확인 후 실행)로 MP4를 받아 SendUserFile. 질문 1을 묻고, 고친 뒤 `03_animatic.md`의 무음 확인 칸과 verdicts에 기록.
- [ ] **Step 2: 음악 방향** — 질문 2 → `music_brief.json`(구간: 예 1~3 고요한 도입, 4 바람이 드는 전환, 5~6 포근한 마무리 — 실제 구간은 답에 따라) → `music-plan.mjs` → 구간 표를 사용자에게 보여줌.
- [ ] **Step 3: 후보 생성** — 크레딧 예상(30초 곡 1개 약 450, 3개 약 1,350 / 월 121,000)을 알리고 **사용자 확인 후** `music-generate.mjs --count 3`. `manifest.mjs` 검사 통과 확인. 후보 mp3를 SendUserFile로 보내고(레포 게시 아님) 질문 3. 선택을 `03_animatic.md`와 verdicts에 기록.
- [ ] **Step 4: 박자 지도와 재조정** — `music-map.mjs`(고른 곡) → `music_map.json`의 BPM·마디 첫 박 출처·신뢰도를 확인. 박자 신뢰도 < 0.6이거나 들어 보고 박이 어긋나면 멈추고 Beat This! 설치를 사용자에게 제안(결정 3). → `retime.mjs` → `timing.json`의 `audio`를 `media/yoon-jongshin-concert-teaser/bgm-<k>.mp3`로 → `animatic.mjs` → `check` → preview. shifts와 warnings를 `03_animatic.md` 타이밍 조정 표에 적는다.
- [ ] **Step 5: 최종 확인 (C)** — 질문 4 → 고칠 것 반영 → `gate.md` 확인 → 명시적 승인 요청. 승인 시 `status: approved`, `approved_at: <YYYY-MM-DDTHH:MM>` → verdicts → `git status`에 오디오가 없는지 확인 → 커밋·푸시. Verify: `node scripts/status.mjs "projects/yoon-jongshin-concert-teaser"` → `"stage": 4`, `"stale": []`.
- [ ] **Step 6: 결과 보고** — 3단계 구축 결과(스크립트, 파일럿 3단계)를 보여주고, 4단계(디자인) 계획으로 넘어갈지 묻는다.
