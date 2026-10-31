# Motion Studio 4단계(디자인) 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 서사·애니매틱·BGM 위에 영상의 시각 언어를 정한다. 스타일 후보 1~3개를 같은 히어로 프레임으로 비교해 고르고, 가장 어렵고 중요한 키 컷 2~3개를 실제 스타일로 움직여 본 뒤, 색·글자·질감·모션을 `design_tokens.json`으로 확정해 4단계 승인을 받는다. 파일럿 `yoon-jongshin-concert-teaser`로 검증한다.

**Architecture:** `04_design/design_tokens.json`이 디자인의 원본이다. 검사 스크립트가 대비·글자 크기·글꼴 파일·모션 이름을 확인하고, CSS 변수로 바꿔 준다. 키 컷은 `04_design/keycuts/<이름>/`의 독립 HyperFrames 컴포지션이고, 비계(scaffold) 스크립트가 `timing.json`의 해당 시간대(컷, 카피, 키 모션 시각, BGM 구간)와 토큰을 넣은 빈 틀을 만든다. 장면 자체(김 서린 유리, 바람, 손글씨)는 에이전트가 director 스킬을 따라 손으로 쓴다. 스타일 후보 비교는 `hyperframes compare`로 한 장의 시트를 만든다.

**Tech Stack:** Node.js 22+, `hyperframes@0.8.221`(`compare`, `check`, `snapshot`, `preview`), GSAP 3.14.2, Canvas 2D·SVG(필요하면 three.js — 4절 스택), `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-30-motion-studio-design.md` (6절 4단계, 5절 Styles-20, 7절 연출 규칙, 13절 빌더 재량)

**범위:** 4단계까지. 효과음, 1단 자동 검사 확장, 2단 시각 리뷰(`REVIEW.md`)는 5단계 계획에서 한다.

## 이 계획에서 정한 것 (사용자 확인 필요한 것은 표시)

1. **스타일 후보는 히어로 프레임 한 장으로 비교한다.** 후보마다 18.045초("스며드는" 착지) 한 장면만 정지 화면으로 만들어 `hyperframes compare`로 나란히 보여준다. 움직임은 고른 뒤 키 컷에서 본다. 후보는 Styles-20 어휘와 브리프 톤(따뜻한, 포근한, 잔잔한 / 화려한 것 피함)에서 근거를 들어 고른다(스펙 5절). 컷 길이·서사는 바꾸지 않는다.
2. **키 컷은 파일럿에서 셋을 제안한다.** ① 컷 4 큰 바람(13.545~19.545초, 영상의 정점), ② 컷 6 김 위 손글씨 '가을냄새'(24.045~30초, 마지막 이미지), ③ 컷 1 물방울(0~3.045초, 첫인상). 셋 다 키 모션 또는 첫·끝 이미지라 가장 어렵고 중요하다. 사용자가 줄이거나 바꿀 수 있다.
3. **키 컷은 무음 MP4로 원격 확인한다.** 음원이 없는 원격 렌더에서 `<audio>`가 없는 파일을 가리키면 깨지므로(3단계 리뷰 M12), 렌더 워크플로가 없는 미디어 요소를 렌더 전에 빼고 경고한다(Task 3). 음악과 함께 보는 것은 PC 미리보기. **음악을 붙여 휴대폰으로 보려면 PC에서 무음 MP4에 음원만 합치는(재인코딩 없음) 방법이 있는데, CLAUDE.md 12번에 걸리는지 사용자 판단이 필요하다.** [사용자 확인 필요]
4. **정지 장면 처리 충돌은 질문으로 정한다.** laws.md는 3프레임 넘는 정지에 미세한 움직임을 요구하고, 사용자가 준 참고 자료(@thedalbee)는 "끝나면 멈춘다"고 한다. 4단계 질문 4로 묻고 답을 토큰의 `motion.idle`과 verdicts에 남긴다.
5. **새 글꼴은 레포에 파일과 라이선스가 있을 때만 쓴다.** 손글씨 느낌을 위해 새 한글 글꼴이 필요하면 OFL 등 공개 재배포 가능한 글꼴을 `assets/fonts/<이름>/`에 라이선스와 함께 넣는다(Global Constraints). CDN 글꼴은 쓰지 않는다. 손으로 그린 SVG 경로로 대신할 수도 있다(빌더 재량).
6. **스타일 모듈은 승인된 것만 만든다.** 4단계 승인 뒤 고른 스타일이 Styles-20 항목에서 왔으면 키 컷의 효과 코드를 `styles/modules/<번호-이름>/`으로 옮겨 재사용 모듈로 남긴다(스펙 5절 "쓰일 때 만들고 검증해 쌓는다").

## Global Constraints

- Node `>=22`. `hyperframes` `0.8.221` 고정. 새 npm 의존성 없음(three.js가 필요하면 GSAP처럼 고정 버전 CDN `<script>`, 사용 전 Ruling). 테스트 `node:test`, `npm test`.
- PC에서 전체 영상 MP4 렌더 금지. `lint`, `check`, `snapshot`, `compare`, `preview`만.
- `.env` 출력·커밋 금지. ElevenLabs 음원은 어떤 레포에도 커밋 금지(미리보기 사본은 `assets/audio/` 아래, git 제외).
- 컴포지션 에셋은 폴더 안(`../` 금지). 글꼴은 레포 `assets/fonts/`에서 복사. 한국어는 `word-break: keep-all`.
- 한 화면에 함께 놓는 요소는 하나의 `class="clip"` 안에. GSAP 타임라인은 `paused: true`로 `window.__timelines['main']`. `Math.random`·`Date.now`·`requestAnimationFrame` 시간 금지 — 캔버스 그리기는 타임라인 시각(`tl.time()` 또는 `onUpdate`)으로만 하고, 난수는 시드 고정 PRNG.
- 커밋되는 모든 파일(글꼴, 이미지, 코드)은 상업 사용·공개 재배포 가능한 라이선스. 실존 인물 사진·AI 얼굴·앨범 아트·공식 포스터 금지(0단계 브리프 메모).
- 영상 속 사실·수치는 `01_key_message.md`의 출처가 있는 것만.
- director 스킬(composition.md, korean-type.md, laws.md, never-ship.md, connection.md, motion-principles-thedalbee.md)을 먼저 읽고 판단한다. 점수·자기 인증 금지. 승인은 명시적 승인 발화로만.
- 스크립트는 CLI 계약을 지킨다: 인자 입력, JSON stdout, 실패 시 non-zero exit, 공백·한글 경로.

## Review Focus

1. **대비가 모자란 색 조합** — 김 서린 유리처럼 밝고 뿌연 배경 위에 밝은 글자를 두면 읽히지 않는다. 토큰 검사가 글자색·배경색 대비 4.5 미만(보조 3.0 미만)을 실패로 잡아야 한다. → Task 2 대비 테스트.
2. **바닥보다 작은 읽는 글자** — 공연 정보 줄(설계표 0.035H)처럼 읽어야 하는 글자가 2.6% H 미만이면 실패, 4% H 미만이면 경고로 알려야 한다. → Task 2 크기 테스트.
3. **레포에 없는 글꼴** — 토큰이 손글씨 글꼴을 이름만 적고 파일·라이선스가 없으면, 미리보기는 시스템 글꼴로 그럴듯하게 보이고 원격 렌더에서 다른 글꼴로 바뀐다. 검사가 막아야 한다. → Task 2 글꼴 테스트.
4. **키 컷 시간대 밖의 키 모션** — 키 컷 범위에 걸친 키 모션 시각을 지역 시각으로 바꿀 때 범위 밖 시각을 넣거나 BGM 구간이 어긋나면 안 된다. → Task 3 시각 변환 테스트.
5. **원격 렌더에서 없는 음원** — 커밋된 컴포지션이 클론에 없는 `assets/audio/…`를 가리켜도 렌더가 깨지지 않고, 음원을 뺐다는 경고가 남아야 한다. → Task 3 미디어 제거 테스트.

---

### Task 1: 4단계 틀 (질문·템플릿·게이트·상태)

**Files:**
- Create: `stages/04-design/questions.md`, `stages/04-design/template.md`, `stages/04-design/gate.md`
- Modify: `scripts/status.mjs`, `scripts/status.test.mjs`

**Interfaces:**
- Produces: 4단계 산출물 문서 `projects/<slug>/04_design.md`(front matter `stage: 4`, `status`, `approved_at: YYYY-MM-DDTHH:MM`).

- [ ] **Step 1: 실패하는 테스트** — '0~3 모두 승인이면 4단계'를 '0~4 모두 승인이면 5단계'(`04_design.md` 추가, `stage === 5`)로 바꾼다.
- [ ] **Step 2: 실패 확인** — `npm test` / Expected: 그 테스트 FAIL
- [ ] **Step 3: `STAGES`에 `{ n: 4, file: '04_design.md' }` 추가**
- [ ] **Step 4: 통과 확인** — `npm test` PASS. 파일럿 status → `"stage": 4`
- [ ] **Step 5: 단계 문서 작성**

`questions.md` (한 번에 하나, 이 순서):
1. (스타일 후보 1~3개를 같은 히어로 프레임 비교 시트와 근거로 보여주고) 어느 쪽이 이 영상의 세계인가요? 다른 안에서 가져오고 싶은 것이 있나요?
2. (고른 스타일로 키 컷을 움직여 보여주고) 움직임이 어색하거나 과한 곳이 있나요? (몇 초 지점으로)
3. 색, 글자, 질감 중 바꾸고 싶은 것이 있나요?
4. 움직임이 끝난 장면은 완전히 멈추는 게 좋을까요, 아주 작게 살아 있는 게 좋을까요? (예: 김이 천천히 번지는 정도)

`template.md`: front matter + `## 스타일 후보`(표: 후보 | Styles-20 근거 | 색·모션·질감 근거 | 선택), 비교 시트 경로, `## 확정 토큰 요약`(색, 글자 역할별 크기, 질감, 모션, `idle`), `## 키 컷`(표: 이름 | 시간대 | 무엇을 검증하나 | 미리보기·MP4 | 사용자 반응), `## 규칙 충돌과 결정`(정지 처리 등), `## 남은 문제`.

`gate.md` 승인 요청 전 확인:
- 스타일 후보의 종류가 서로 다르고, 각각 Styles-20 또는 브리프에서 근거를 댔다.
- `node scripts/design-tokens.mjs "projects/<slug>"` 오류 0(경고는 `04_design.md`에 적음).
- 키 컷마다 `npx hyperframes check` 오류 0, 키 모션 시각이 `timing.json`과 같다.
- 키 컷이 서사·컷 연결(02의 연결(디자인) 열)을 바꾸지 않았다. 바꿨다면 2단계를 draft로 되돌릴지 사용자에게 물었다.
- never-ship 목록에 걸리는 요소가 없다. 새 글꼴·이미지는 라이선스 파일과 함께 커밋됐다.
- 질문 1~4의 답이 `04_design.md`와 `taste/verdicts.md`에 있다. 점수·자기 인증 없음.
승인 후: `status: approved`, `approved_at` → verdicts → (Styles-20 근거 스타일이면) 스타일 모듈 → 커밋·푸시. 다음은 5단계이며 별도 구축 계획이 필요하다.

- [ ] **Step 6: Commit** — `git commit -m "feat: 4단계 틀"`

---

### Task 2: 디자인 토큰 검사와 CSS 변수

**Files:**
- Create: `scripts/design-tokens.mjs`, `scripts/design-tokens.test.mjs`

**Interfaces:**
- Consumes: `tokens/motion.json`(easings, measured_eases 키 이름).
- Produces:
  - 토큰 형식 `04_design/design_tokens.json`:
    ```json
    { "version": 1,
      "source": { "style": "19 Grainy Gradient", "why": "…" },
      "colors": { "ground": "#1d1a17", "ink": "#f3ede4", "muted": "#a39a8e", "accent": "#e7b77a" },
      "type": {
        "families": { "sans": "Pretendard" },
        "roles": { "headline": { "family": "sans", "weight": 600, "size_h": 0.09, "line": 1.25, "tracking": -0.02, "readable": true } }
      },
      "texture": {},
      "motion": { "enter": "emphasized-decelerate", "exit": "emphasized-accelerate", "idle": "still" } }
    ```
    `texture`는 자유 형식(숫자·문자열). `motion.idle`은 `"still"` 또는 `"breathe"`(질문 4의 답).
  - `contrast(hexA: string, hexB: string): number` — WCAG 2.x 상대 휘도 대비(1~21).
  - `checkTokens(tokens: object, opts: { motion: object, fontExists: (family: string) => boolean }): { errors: string[], warnings: string[] }`
    - 오류: `colors`의 `ground, ink, muted, accent`가 없거나 `#rrggbb`가 아님 / `contrast(ink, ground) < 4.5` / `contrast(muted, ground) < 3.0` / 역할의 `family`가 `families`에 없음 / `fontExists(family이름)`이 false / `readable` 역할의 `size_h < 0.026` / `motion.enter`·`motion.exit`이 `motion.easings`나 `motion.measured_eases`의 키가 아님 / `motion.idle`이 `still`·`breathe`가 아님.
    - 경고: `readable` 역할의 `size_h < 0.04`(director composition.md "읽어야 하는 글자는 4% H 이상").
  - `tokensToCss(tokens: object, height: number): string` — `:root { --color-ground: #…; …; --font-sans: 'Pretendard', sans-serif; --type-headline-size: 97px; --type-headline-weight: 600; --type-headline-line: 1.25; --type-headline-tracking: -0.02em; }` (`size`는 `Math.round(size_h × height)`).
  - CLI `node scripts/design-tokens.mjs "projects/<slug>"` → `04_design/design_tokens.json` 검사. `fontExists`는 레포 `assets/fonts/<family 소문자, 공백→-)>/`에 `.woff2` 하나 이상과 `LICENSE*` 파일이 있는지. stdout `{ errors, warnings }`, 오류 있으면 exit 1.

- [ ] **Step 1: 실패하는 테스트**
  - '대비 계산' — `contrast('#000000', '#ffffff')` 반올림 21, `contrast('#777777', '#ffffff')` 약 4.48(소수 둘째 자리 4.48).
  - '정상 토큰은 오류 없음' — 위 예시 토큰, `fontExists: () => true`, `motion: { easings: { 'emphasized-decelerate': [], 'emphasized-accelerate': [] }, measured_eases: {} }` → `errors` `[]`.
  - '글자 대비 부족은 오류' — `ink: '#d8d4cc'`, `ground: '#e9e6e0'` → errors 하나 `/ink/`.
  - '읽는 글자 2.6% 미만은 오류, 4% 미만은 경고' — `info` 역할 `size_h 0.02` → error `/info/`; `0.035` → error 없음, warning `/info/`.
  - '레포에 없는 글꼴은 오류' — `families.hand = 'Nanum Pen'`, 역할이 `hand` 사용, `fontExists: f => f === 'Pretendard'` → error `/Nanum Pen/`.
  - '모션 이름은 motion.json에 있어야 한다' — `enter: 'bouncy'` → error `/bouncy/`.
  - 'CSS 변수' — `tokensToCss(예시, 1080)`에 `--color-ink: #f3ede4`, `--type-headline-size: 97px`, `--font-sans: 'Pretendard', sans-serif` 포함.
- [ ] **Step 2: 실패 확인** — `npm test` FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: Commit** — `git commit -m "feat: 디자인 토큰 검사와 CSS 변수"`

---

### Task 3: 키 컷 비계와 원격 렌더의 없는 미디어 처리

**Files:**
- Create: `scripts/keycut.mjs`, `scripts/keycut.test.mjs`, `scripts/drop-missing-media.mjs`, `scripts/drop-missing-media.test.mjs`
- Modify: `.github/workflows/render.yml` (렌더 전 단계)

**Interfaces:**
- Consumes: `Timing`(3단계 `timing.json`, `retimed` 포함), `tokensToCss`, `checkTokens`(Task 2), `missingAssets`(`check-fonts.mjs`).
- Produces:
  - `keycutWindow(timing: Timing, from: number, to: number): { duration: number, beats: { n, copy, start, dur }[], cues: { at: number, n: number }[], mediaStart: number }` — 범위와 겹치는 컷만, 시각은 지역 시각(`− from`, 범위 안으로 자름, 소수 셋째 자리). `cues`는 `from ≤ at < to`인 키 모션만. `mediaStart = from`. `from < 0`, `to > duration`, `from ≥ to`면 throw.
  - `renderKeycut(win, { css: string, audio: boolean, width, height }): string` — HyperFrames 컴포지션 틀: 루트 `data-duration=win.duration`, 컷마다 빈 `<section class="clip" id="beat-<n>">`(카피는 `data-copy` 속성과 주석으로만, 화면 요소는 에이전트가 채움), `<style>`에 `css`, 큐 시각을 담은 `window.__cues = [...]`, `audio`면 `<audio id="bgm" src="assets/audio/bgm.<ext>" data-start="0" data-duration=… data-media-start=mediaStart>`.
  - CLI `node scripts/keycut.mjs "projects/<slug>" --name <이름> --from <초> --to <초>` → 토큰 검사 오류가 있으면 exit 1 → `04_design/keycuts/<이름>/index.html`이 **있으면 덮어쓰지 않고 exit 1**(에이전트가 손으로 쓴 장면 보호) → 틀 쓰기, 토큰이 쓰는 글꼴 파일·라이선스 복사, `timing.audio`가 있으면 음원 사본 복사 → `missingAssets` 확인 → stdout `{ out, duration, cues }`.
  - `dropMissingMedia(html: string, exists: (src: string) => boolean): { html: string, dropped: string[] }` — `<audio …src="x"…></audio>`·`<video …>` 중 `exists(src)`가 false인 요소를 지운다.
  - CLI `node scripts/drop-missing-media.mjs "<composition dir>"` → `index.html`을 고쳐 쓰고 stdout `{ dropped }`, 지운 것이 있으면 stderr에 경고(exit 0).
  - `render.yml`: "Check local assets" 다음에 `node scripts/drop-missing-media.mjs "${{ inputs.project }}"` 단계 추가.

- [ ] **Step 1: 실패하는 테스트**
  - 'keycutWindow는 범위의 컷과 큐를 지역 시각으로' — 파일럿형 timing(컷 4 13.545+6, 키 모션 15.045·18.045, 컷 5 19.545+4.5, 컷 6 24.045+5.955 키 모션 24.045), `from 13.545, to 19.545` → `duration 6`, beats `[{ n: 4, start: 0, dur: 6 }]`(copy 포함), cues `[{ at: 1.5, n: 4 }, { at: 4.5, n: 4 }]`, `mediaStart 13.545`.
  - '범위에 걸친 컷은 잘라서 넣는다' — `from 18, to 21` → beats `[{ n: 4, start: 0, dur: 1.545 }, { n: 5, start: 1.545, dur: 1.455 }]`, cues `[{ at: 0.045, n: 4 }]`.
  - '범위가 영상 밖이면 실패' — `from 25, to 31` throws.
  - 'renderKeycut' — `data-duration="6"`, `class="clip"` 1개, `--color-ink`, `window.__cues = [1.5,4.5]`, `audio: true`면 `data-media-start="13.545"` 그리고 src가 `assets/audio/`로 시작, `../` 없음.
  - 'CLI는 손으로 쓴 키 컷을 덮어쓰지 않는다' — 임시 프로젝트(공백·한글 경로)에 `03_animatic/timing.json`·`04_design/design_tokens.json`(정상) 두고 실행 → exit 0, `missingAssets` `[]`; 다시 실행 → exit 1.
  - 'dropMissingMedia는 없는 음원만 지운다' — html에 `<audio id="bgm" src="assets/audio/bgm.mp3" data-start="0"></audio>`와 `<audio src="assets/sfx/a.wav"></audio>`, `exists = s => s.includes('sfx')` → 결과 html에 `bgm.mp3` 없음, `a.wav` 있음, `dropped` `['assets/audio/bgm.mp3']`.
- [ ] **Step 2: 실패 확인** — `npm test` FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: 원격 확인** — 사용자 확인 후 `gh workflow run render.yml -f project=projects/yoon-jongshin-concert-teaser/03_animatic -f quality=draft` → 성공하고 로그에 `assets/audio/bgm.mp3`를 뺐다는 경고가 있다(3단계 M12가 실제로 풀렸는지 확인).
- [ ] **Step 6: Commit** — `git commit -m "feat: 키 컷 비계, 원격 렌더에서 없는 미디어 빼기"`

---

### Task 4: 파일럿 4단계와 승인

**Files:**
- Create: `projects/yoon-jongshin-concert-teaser/04_design.md`, `…/04_design/{design_tokens.json, candidates/<id>/index.html, candidates/compare.png, keycuts/<이름>/index.html, …}`
- Modify: `taste/verdicts.md`, (승인 후, 조건부) `styles/modules/<번호-이름>/`, `styles/Styles-20.md`(쓰인 모듈 표시)
- PC 전용(커밋 안 함): 키 컷의 `assets/audio/`

- [ ] **Step 1: 스타일 후보** — `taste/verdicts.md`, `motion-principles-thedalbee.md`, Styles-20 4절을 읽고 서로 다른 후보 2~3개를 고른다. 후보마다 `candidates/<id>/index.html`에 18.045초 히어로 프레임(창, 바람 자국, "스며드는")만 정적으로 만들고 `npx hyperframes compare <후보 경로들> --at 0 --labels … --out "…/04_design/candidates/compare.png"`. 비교 시트를 SendUserFile로 보내고 후보별 근거(색·모션·질감, Styles-20 번호)와 함께 질문 1.
- [ ] **Step 2: 토큰** — 고른 후보로 `design_tokens.json` → `design-tokens.mjs` 오류 0. 새 글꼴이 필요하면 결정 5. 질문 4(정지 처리)를 묻고 `motion.idle`에 반영.
- [ ] **Step 3: 키 컷** — 결정 2의 키 컷마다 `keycut.mjs`로 틀 → 장면을 손으로 쓴다(02의 연결(디자인) 좌표, 03_animatic.md 음악 측정표의 시각: 첫 음 1.52초, 20.65초 강음 등) → `hyperframes check` 오류 0 → `snapshot --review`로 직접 확인(남은 문제는 그대로 적음) → 사용자 확인 후 `render.yml`(`quality=draft`)로 무음 MP4 → SendUserFile → 질문 2·3. 고칠 것 반영.
- [ ] **Step 4: 승인** — `gate.md` 확인 → 명시적 승인 요청. 승인 시 `status: approved`, `approved_at` → verdicts → 결정 6의 스타일 모듈(`module.md`: 출처·Styles-20 번호·파라미터·쓰는 법, 효과 코드 파일) → `git status`에 음원 없음 확인 → 커밋·푸시. Verify: status `"stage": 5`, `"stale": []`.
- [ ] **Step 5: 결과 보고** — 4단계 구축 결과를 보여주고 5단계(모션·효과음·QA) 계획으로 넘어갈지 묻는다.
