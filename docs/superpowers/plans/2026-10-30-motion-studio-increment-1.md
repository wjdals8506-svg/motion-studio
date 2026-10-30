# Motion Studio 원판 1차 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HyperFrames 엔진 검증 스파이크를 통과시키고, 원판의 뼈대(레포, 비밀값 보호, 원격 렌더, 0~2단계 도구, director 스킬 v0)를 만든 뒤 파일럿 영상으로 0~2단계를 실제로 돌려 승인받는다.

**Architecture:** 공개 GitHub 레포 하나. HyperFrames(HTML+GSAP)를 엔진으로 버전 고정해 쓰고, 미리보기와 검사용 프레임 캡처는 PC에서, MP4 렌더는 GitHub Actions에서 한다. 단계 진행 상태는 각 단계 산출물 파일의 front matter `status:`로 기록하고, Claude Code는 `CLAUDE.md`와 `stages/`의 질문 목록·템플릿·게이트를 따라 사용자와 대화하며 진행한다.

**Tech Stack:** Node.js 22+ (설치본 v24.14.0), `hyperframes@0.8.221`, GSAP(HyperFrames 경유), Node 내장 `node:test`, FFmpeg/ffprobe, GitHub CLI 2.102, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-30-motion-studio-design.md`

**범위:** 이 계획은 1차 구축분이다(스펙 12절의 "엔진 검증 스파이크"와 "0~2단계 도구 + 파일럿"). 3단계(애니매틱·BGM) 이후는 파일럿이 2단계 승인을 받은 뒤 별도 계획으로 쓴다.

## Global Constraints

- Node `>=22`. `hyperframes`는 `0.8.221`로 정확히 고정한다(`^`·`~` 금지). 업그레이드는 사용자 승인 후에만.
- 사용자 PC에서 **전체 영상 MP4 렌더 금지**. `hyperframes render`는 GitHub Actions에서만 실행한다. PC에서는 `lint`, `check`, `snapshot`, `preview`만 쓴다.
- `.env`는 절대 커밋하지 않는다. 내용을 출력하거나 로그에 남기지 않는다.
- 레포는 GitHub **공개** 저장소다. 커밋되는 모든 파일(코드, 폰트, 에셋, vendor 사본)은 상업 사용과 공개 재배포가 가능한 라이선스여야 하고, 라이선스 파일을 함께 둔다.
- 새 npm 의존성은 `hyperframes` 하나뿐이다. 테스트는 `node:test` + `node:assert/strict`.
- 레포 경로에 공백과 한글이 있다(`19_Motion Graphic Make System`, `김정민`). 모든 스크립트와 명령은 경로를 따옴표로 감싸고 공백·한글 경로에서 동작해야 한다.
- 한국어 텍스트는 `word-break: keep-all`. 폰트는 레포에 커밋한 로컬 폰트만 `@font-face`로 쓴다(미리보기와 원격 렌더가 같은 글꼴을 쓰게).
- 에이전트는 결과물에 점수를 매기거나 스스로 품질을 인증하지 않는다.
- 단계 승인은 사용자의 명시적 승인 발화로만 기록한다.
- 외부로 나가는 행동(GitHub 레포 생성, push, 워크플로 실행)은 해당 태스크에서 사용자 확인 후 한다.

## Review Focus

1. **이전 단계 수정** — 사용자가 승인된 1단계(키메시지)를 다시 열면 2단계 산출물은 "stale"로 표시되어 재승인 대상이 되어야 한다. 조용히 유지되면 안 된다. → Task 5 `stale` 테스트.
2. **`.env` 밖으로 새는 키** — 사용자가 키를 마크다운이나 스크립트에 붙여 넣어도 커밋이 막혀야 한다. → Task 1 `findSecrets` 테스트와 pre-commit 훅.
3. **공백·한글 경로** — 프로젝트 폴더나 레포 경로에 공백·한글이 있어도 상태 스크립트가 동작해야 한다. → Task 5 경로 테스트.
4. **미리보기와 원격 렌더의 글꼴 차이** — 브라우저 미리보기에서 보이던 한글이 Actions 렌더에서 대체 글꼴로 바뀌면 안 된다. → Task 3 렌더 결과 프레임 확인 단계.
5. **애매한 승인 발화** — "괜찮네", "음…" 같은 말을 승인으로 기록하면 안 된다. → Task 5 `CLAUDE.md` 규칙, Task 7 파일럿 검증 단계.

---

### Task 1: 레포 기반과 비밀값 보호

**Files:**
- Create: `.gitignore`, `package.json`, `README.md`, `.githooks/pre-commit`, `scripts/secret-scan.mjs`
- Test: `scripts/secret-scan.test.mjs`
- Move: `Styles-20.md` → `styles/Styles-20.md`

**Interfaces:**
- Produces: `findSecrets(text: string): Array<{ rule: string, index: number }>` (named export, `scripts/secret-scan.mjs`). CLI로 실행하면 `git diff --cached --name-only --diff-filter=ACM`의 각 파일을 검사하고, 하나라도 걸리면 파일명과 규칙명만 출력(값은 출력 금지)하고 exit 1.
- Produces: `npm test` = `node --test scripts/`

- [ ] **Step 1: git 초기화**

Run: `git init -b main` (레포 루트에서). `.env`가 이미 있으므로 다음 단계 전에 아무것도 `git add` 하지 않는다.

- [ ] **Step 2: `.gitignore` 작성**

포함: `.env`, `.env.*`(단 `!.env.example`), `node_modules/`, `.hyperframes/`, `renders/`, `out/`, `*.log`.

Run: `git check-ignore .env`
Expected: `.env` 출력, exit 0.

- [ ] **Step 3: 실패하는 테스트 작성** (`scripts/secret-scan.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findSecrets } from './secret-scan.mjs';

test('ElevenLabs 형식 키를 찾는다', () => {
  assert.equal(findSecrets('key: sk_' + 'a1'.repeat(24)).length, 1);
});
test('API 키 대입문을 찾는다', () => {
  assert.equal(findSecrets('ELEVENLABS_API_KEY=' + 'abc123def456ghi789').length, 1);
});
test('빈 대입과 일반 문장은 통과', () => {
  assert.equal(findSecrets('ELEVENLABS_API_KEY=\n키는 .env에 둔다').length, 0);
});
test('GitHub 토큰 형식을 찾는다', () => {
  assert.equal(findSecrets('ghp_' + 'A'.repeat(36)).length, 1);
});
```

- [ ] **Step 4: 실패 확인**

Run: `node --test scripts/`
Expected: FAIL (`secret-scan.mjs` 없음)

- [ ] **Step 5: `findSecrets`와 CLI 구현**

규칙 3개: `elevenlabs-key` = `/sk_[a-f0-9]{48}/i`, `api-key-assignment` = `/[A-Z0-9_]*(API_KEY|TOKEN|SECRET)\s*[=:]\s*\S{8,}/`, `github-token` = `/gh[pousr]_[A-Za-z0-9]{36,}/`. CLI 부분은 `import.meta.url`이 실행 파일일 때만 동작.

- [ ] **Step 6: 테스트 통과 확인**

Run: `node --test scripts/`
Expected: 4 pass

- [ ] **Step 7: pre-commit 훅 연결**

`.githooks/pre-commit`: `node scripts/secret-scan.mjs || exit 1`. Run: `git config core.hooksPath .githooks`.
검증: 임시 파일 `tmp-leak.md`에 `ELEVENLABS_API_KEY=` 뒤에 영숫자 18자를 붙인 가짜 키 한 줄 작성 → `git add tmp-leak.md` → `git commit -m test` 가 실패하고 `tmp-leak.md · api-key-assignment`만 출력되는지 확인 → `git reset tmp-leak.md` 후 파일 삭제.

- [ ] **Step 8: `package.json`, README, Styles-20 이동**

`package.json`: `"name": "motion-studio"`, `"private": true`, `"type": "module"`, `"engines": {"node": ">=22"}`, `"scripts": {"test": "node --test scripts/"}`, `"devDependencies": {"hyperframes": "0.8.221"}`. Run `npm install`으로 `package-lock.json` 생성.
`git mv`는 아직 추적 전이므로 일반 이동으로 `styles/Styles-20.md`.
README: 한 단락 소개 + 스펙 링크 + "새 영상은 Claude Code에서 `새 영상: <주제>`".

- [ ] **Step 9: 커밋**

Run: `git status --short` 에 `.env`가 없는지 확인 후
```bash
git add .gitignore package.json package-lock.json README.md .githooks scripts styles docs reports research_notes
git commit -m "chore: repo foundation with secret guard"
```

---

### Task 2: 엔진 스파이크 A — Windows 로컬 (미리보기, 검사, 한글, 결정론)

**Files:**
- Create: `spike/` (`npx hyperframes init spike` 결과), `assets/fonts/pretendard/` (Pretendard woff2 + `LICENSE` — SIL OFL 1.1), `docs/spike-report.md`

**Interfaces:**
- Produces: `assets/fonts/pretendard/` 경로와 `@font-face` 선언 방식(`font-family: 'Pretendard'`, 상대 경로). 이후 모든 컴포지션이 이 방식을 쓴다.
- Produces: `docs/spike-report.md` — 체크 항목별 `통과/실패/메모` 표. Task 3, 4가 행을 추가한다.

- [ ] **Step 1: 프로젝트 생성과 환경 진단**

Run: `npx hyperframes init spike` → `cd spike` → `npx hyperframes doctor --json`
Expected: `.ok` 가 `true`. 아니면 `npx hyperframes browser ensure` 후 재시도. 결과를 spike-report에 기록.

- [ ] **Step 2: 텔레메트리 끄기 확인**

`npx hyperframes docs telemetry` 또는 CLI 스킬의 `references/upgrade-info-misc.md`에서 끄는 방법(환경변수/설정)을 찾아 적용하고 spike-report에 그 설정을 기록.

- [ ] **Step 3: 한글 폰트 커밋**

Pretendard 공식 릴리스(github.com/orioncactus/pretendard)에서 Regular/Bold woff2와 OFL 라이선스 파일을 `assets/fonts/pretendard/`에 둔다.

- [ ] **Step 4: 테스트 컴포지션 작성** (`spike/index.html`)

1920×1080, `data-duration="5"`. 내용: 한글 헤드라인 "사람의 손이 닿은 디테일"(Pretendard Bold, keep-all) + 숫자·영문 섞인 부제 "2026년 10월 · HyperFrames v0.8"; GSAP 일시정지 타임라인으로 헤드라인 진입(감속, 0.6s), 부제 stagger 진입, 4.2s부터 가속 퇴장. 폰트는 `../assets/fonts/pretendard/` 상대 경로.

- [ ] **Step 5: 검사**

Run: `npx hyperframes lint` → `npx hyperframes check --json`
Expected: 오류 0, samples > 0.

- [ ] **Step 6: 한글 렌더 확인**

Run: `npx hyperframes snapshot --at 0.3,2.5,4.6`
`.hyperframes/artifacts/snapshots/`의 PNG를 열어 한글이 Pretendard로(두부 문자·대체 글꼴 없이) 보이는지 확인. 결과를 spike-report에 기록.

- [ ] **Step 7: 결정론 확인**

같은 시점(`--at 2.5`)을 두 번 스냅샷하고 두 PNG의 SHA-256을 비교.
Run: `node -e "const c=require('crypto'),f=require('fs');for(const p of process.argv.slice(1))console.log(c.createHash('sha256').update(f.readFileSync(p)).digest('hex'),p)" "<png1>" "<png2>"`
Expected: 두 해시가 같다. 다르면 spike-report에 실패로 기록.

- [ ] **Step 8: 브라우저 미리보기 (사용자 확인)**

Run: `npx hyperframes preview --background` → URL이 200을 응답하는지 확인 → 사용자에게 URL을 주고 재생이 매끄러운지, 한글이 정상인지 확인받는다. 결과를 spike-report에 기록.

- [ ] **Step 9: 커밋**

```bash
git add spike assets docs/spike-report.md
git commit -m "spike: local HyperFrames preview, checks, Korean font, determinism"
```

---

### Task 3: 엔진 스파이크 B — GitHub Actions 원격 렌더

**Files:**
- Create: `.github/workflows/render.yml`
- Modify: `docs/spike-report.md` (원격 렌더 행 추가)

**Interfaces:**
- Consumes: `spike/` 컴포지션, `package-lock.json`, `assets/fonts/`
- Produces: 워크플로 `render.yml` — `workflow_dispatch` 입력 `project`(레포 루트 기준 컴포지션 폴더 경로, 예: `spike`, `projects/<slug>/05_film`) 와 `quality`(`draft|looks|delivery`, 기본 `delivery`). 결과 아티팩트 이름 `render-<run_id>`, 파일 `out.mp4`. 이후 6단계가 이 워크플로를 그대로 쓴다.

- [ ] **Step 1: 워크플로 작성**

`ubuntu-latest`, `actions/setup-node`(22, npm 캐시), `sudo apt-get install -y ffmpeg`, `npm ci`, `npx hyperframes browser ensure`, 컴포지션 폴더에서 `npx hyperframes render --quality ${{ inputs.quality }} --output "$GITHUB_WORKSPACE/out/out.mp4"`, ffprobe로 길이를 구해 루트 `data-duration`과 ±0.1s 이내인지 검사(아니면 실패), `actions/upload-artifact`로 `out/out.mp4` 업로드. 텔레메트리 끄기 설정(Task 2 Step 2)을 env에 넣는다. Secrets는 쓰지 않는다.

- [ ] **Step 2: 공개 레포 생성 (사용자 확인)**

사용자에게 레포 이름을 확인받는다(제안: `motion-studio`). 승인 후 Run: `gh repo create <name> --public --source . --push`
Expected: 원격 `origin` 연결, `main` 푸시. push 직전 `git ls-files | grep -x .env` 결과가 비어 있어야 한다.

- [ ] **Step 3: 원격 렌더 실행**

Run: `gh workflow run render.yml -f project=spike -f quality=delivery` → `gh run watch`
Expected: 성공. 실패 시 로그의 `✗`/`Fix:` 줄을 spike-report에 기록하고 Step 1로.

- [ ] **Step 4: 결과 회수와 확인**

Run: `gh run download <run_id> -D renders/spike` → `ffprobe -v error -show_entries format=duration -of csv=p=0 "renders/spike/render-<run_id>/out.mp4"`
Expected: `5.0` 근처. 프레임 확인: `ffmpeg -ss 2.5 -i <mp4> -frames:v 1 renders/spike/frame-2.5.png` 후 PNG를 Task 2 Step 6의 스냅샷과 나란히 보고 한글 글꼴이 같은지 확인. 사용자에게 MP4를 전달해 확인받는다.

- [ ] **Step 5: 비용·한도 기록**

spike-report에 렌더 소요 시간, 공개 레포의 Actions 사용 조건(무료 여부, 작업 시간 제한), 아티팩트 보관 기간·크기 한도를 GitHub 공식 문서 URL과 함께 기록.

- [ ] **Step 6: 커밋과 푸시**

```bash
git add .github docs/spike-report.md
git commit -m "spike: remote MP4 render on GitHub Actions"
git push
```

---

### Task 4: 스파이크 C — 오디오·라이선스 확인과 Go/No-go 게이트

**Files:**
- Create: `.env.example`
- Modify: `docs/spike-report.md`

**Interfaces:**
- Produces: `.env.example` — `ELEVENLABS_API_KEY=` 와 MusicGen 폴백을 끄는 설정(찾은 경우)을 값 없이 나열.
- Produces: spike-report의 최종 Go/No-go 표.

- [ ] **Step 1: MusicGen 폴백 끄는 방법 확인**

HyperFrames `/media-use` 스킬과 소스에서 음악 생성 백엔드 선택 로직을 찾아, 로컬 `facebook/musicgen-small` 폴백을 막는 설정을 확인한다. 설정이 없으면 "원판에서는 HyperFrames의 음악 생성 명령을 쓰지 않고 ElevenLabs만 호출한다"를 규칙으로 기록.

- [ ] **Step 2: ElevenLabs 확인 (공식 문서·약관 기준, URL 기록)**

(a) Creator 요금제에서 Music API, Sound Effects API 사용 가능 여부와 월 크레딧, (b) 생성물을 공개 레포에 원본 파일로 올려도 되는지(소유권·재배포 조항), (c) 상업 사용 범위(웹 허용, 방송 제외 재확인). 실제 API 호출은 하지 않는다.

- [ ] **Step 3: spike-report 결론 작성**

항목: Windows 미리보기, check/lint, 한글 폰트(로컬·원격), 결정론, 원격 렌더, Actions 한도, 텔레메트리, MusicGen 폴백, ElevenLabs 3항목. 각 `통과/실패/조건부` + 근거. 실패가 있으면 대안을 적되 **엔진을 바꾸지 않는다**.

- [ ] **Step 4: 사용자 게이트**

spike-report를 사용자에게 보여주고 Go/No-go 승인을 받는다. No-go면 이 계획을 멈춘다.

- [ ] **Step 5: 커밋과 푸시**

```bash
git add .env.example docs/spike-report.md
git commit -m "spike: audio and license checks, go/no-go report"
git push
```

---

### Task 5: 단계 프레임워크 — CLAUDE.md, 0~2단계 질문·템플릿·게이트, 상태 스크립트

**Files:**
- Create: `CLAUDE.md`, `stages/00-intake/{questions.md,template.md,gate.md}`, `stages/01-key-message/{…}`, `stages/02-story/{…}`, `taste/verdicts.md`, `projects/.gitkeep`, `scripts/status.mjs`
- Test: `scripts/status.test.mjs`

**Interfaces:**
- Produces: 단계 산출물 파일 규약 — 각 파일 첫머리 front matter:
  ```
  ---
  stage: 0
  status: draft        # draft | approved
  approved_at:         # YYYY-MM-DD, approved일 때만
  ---
  ```
  단계 파일 이름: `00_brief.md`, `01_key_message.md`, `02_story.md` (3단계 이후는 다음 계획에서 `STAGES` 배열에 추가).
- Produces: `projectStatus(dir: string): { stage: number, approved: string[], stale: string[] }` (named export, `scripts/status.mjs`). `stage` = 승인되지 않은 첫 단계 번호(모두 승인이면 `STAGES.length`). `stale` = 승인되지 않은 단계보다 뒤에 있는데 존재하는 파일. CLI: `node scripts/status.mjs "<project dir>"` → JSON 출력.
- Produces: `STAGES` 배열 export — `[{ n: 0, file: '00_brief.md' }, { n: 1, file: '01_key_message.md' }, { n: 2, file: '02_story.md' }]`.

- [ ] **Step 1: 실패하는 테스트 작성** (`scripts/status.test.mjs`)

헬퍼 `dir()`은 `fs.mkdtempSync(path.join(os.tmpdir(), '상태 테스트 '))`로 공백·한글이 든 임시 폴더를 만든다. 헬퍼 `write(d, file, status)`는 `---\nstage: 0\nstatus: <status>\n---\n` 만 있는 파일을 쓴다.

```js
test('빈 프로젝트는 0단계', () => {
  assert.deepEqual(projectStatus(dir()), { stage: 0, approved: [], stale: [] });
});
test('브리프 승인, 키메시지 초안이면 1단계', () => {
  const d = dir(); write(d, '00_brief.md', 'approved'); write(d, '01_key_message.md', 'draft');
  assert.deepEqual(projectStatus(d), { stage: 1, approved: ['00_brief.md'], stale: [] });
});
test('0~2 모두 승인이면 3단계', () => {
  const d = dir(); for (const f of ['00_brief.md','01_key_message.md','02_story.md']) write(d, f, 'approved');
  assert.equal(projectStatus(d).stage, 3);
});
test('앞 단계를 다시 열면 뒤 단계는 stale', () => {
  const d = dir(); write(d, '00_brief.md', 'approved'); write(d, '01_key_message.md', 'draft'); write(d, '02_story.md', 'approved');
  assert.deepEqual(projectStatus(d), { stage: 1, approved: ['00_brief.md'], stale: ['02_story.md'] });
});
test('front matter 없는 파일은 draft로 본다', () => {
  const d = dir(); fs.writeFileSync(path.join(d, '00_brief.md'), '# 브리프');
  assert.equal(projectStatus(d).stage, 0);
});
```

- [ ] **Step 2: 실패 확인**

Run: `node --test scripts/`
Expected: status 테스트 FAIL (모듈 없음), secret-scan 테스트는 통과.

- [ ] **Step 3: `projectStatus`와 CLI 구현**

front matter는 첫 줄이 `---`일 때 다음 `---`까지에서 `status:` 값만 읽는다(YAML 라이브러리 금지).

- [ ] **Step 4: 테스트 통과 확인**

Run: `node --test scripts/`
Expected: 전부 pass

- [ ] **Step 5: 단계 문서 작성**

각 단계 폴더에 세 파일. `questions.md` = 그 단계에서 사용자에게 한 번에 하나씩 묻는 질문 목록, `template.md` = 산출물 골격(front matter 포함), `gate.md` = 승인 전에 에이전트가 확인할 체크리스트와 사용자에게 보여줄 것.

- **00-intake**가 반드시 확정할 것: 용도, 시청자, 배포 채널, 길이(초), 화면 비율, 톤(형용사 3개 이하), 내레이션 여부, 꼭 넣을 것/절대 피할 것. 승인 대상: 한 페이지 브리프.
- **01-key-message**: 리서치 출처 목록(URL), 서로 다른 키메시지 후보 3~5개(각 한 문장), 선택된 한 문장과 선택 이유. 승인 대상: 한 문장.
- **02-story**: 종류가 다른 스토리라인 3안(각 3~5줄) → 선택 → 컷 설계표. 표 열: `#`, `역할`, `시청자가 믿게 될 것`, `카피`, `연결(서사)`, `연결(디자인)`, `키 모션`, `길이(초)`. 컷 길이 합 = 브리프 길이(±10%). 내레이션이 있으면 원고 초안(숫자·영문은 괄호에 한글 읽기 병기). 승인 대상: 스토리라인과 컷 설계표.

- [ ] **Step 6: `CLAUDE.md` 작성**

규칙(명령형, 짧게):
1. `새 영상: <주제>` → `projects/<slug>/` 생성(slug는 영문 소문자 kebab-case, 사용자에게 확인) → 0단계 시작.
2. `이어서 <slug>` 또는 새 대화 → `node scripts/status.mjs "projects/<slug>"` 결과로 현재 단계와 stale 파일을 사용자에게 알린다.
3. 현재 단계가 승인되기 전에는 다음 단계 파일을 만들지 않는다.
4. `status: approved`는 사용자가 "승인", "통과", "다음 단계로" 등 명시적으로 승인했을 때만 쓴다. 애매하면 승인 여부를 묻는다.
5. 승인된 단계를 고치면 그 파일을 `draft`로 되돌리고, stale이 된 뒤 단계들과 다시 해야 할 범위를 설명한다.
6. 단계마다 사용자의 승인·거절과 이유를 `taste/verdicts.md`에 날짜·프로젝트·단계와 함께 한 줄씩 추가한다. 새 제안 전에 이 파일을 읽는다.
7. 점수 매기기, 자기 품질 인증 금지.
8. 질문은 `stages/<단계>/questions.md`에서 한 번에 하나씩.
9. PC에서 MP4 렌더 금지(Global Constraints). `.env` 내용 출력·커밋 금지.
10. 연출 판단은 `.claude/skills/director` 스킬을 따른다.
11. 단계 승인 시 산출물을 커밋하고 푸시한다.

`taste/verdicts.md`: 형식 한 줄 예시(`- 2026-11-01 · <slug> · 1단계 · 거절 · "…" (이유)`)와 빈 목록.

- [ ] **Step 7: 커밋과 푸시**

```bash
git add CLAUDE.md stages taste projects/.gitkeep scripts
git commit -m "feat: stage framework for stages 0-2 with status script"
git push
```

---

### Task 6: director 스킬 v0 (서사·연결·구성 규칙)와 모션 토큰

**Files:**
- Create: `vendor/motionmaxxing/` (원본 `LICENSE`, `NOTICE`, `SKILL.md`, `references/`), `vendor/SOURCES.md`, `.claude/skills/director/SKILL.md`, `.claude/skills/director/references/{laws.md,never-ship.md,narrative.md,connection.md,composition.md,korean-type.md}`, `tokens/motion.json`
- Test: `scripts/director.test.mjs`

**Interfaces:**
- Produces: `.claude/skills/director/SKILL.md` front matter `name: director`, `description:`(언제 쓰는지 한 문장). 본문은 각 reference를 언제 읽는지 표로 링크.
- Produces: `tokens/motion.json` 형식:
  ```json
  { "durations_ms": { "<name>": number }, "easings": { "<name>": [x1, y1, x2, y2] }, "stagger_frames": { "<name>": number }, "end_hold_s": [0.6, 1.4], "source": { "<key>": "<url@commit>" } }
  ```

- [ ] **Step 1: 사용자 게이트 — 이전 자료 참고 여부**

휴지통의 이전 시스템 `lessons_learned.md`와 `06_art_direction/` 플레이북을 참고할지 사용자에게 묻는다. 승인 시 복원해 읽기만 하고(레포에 커밋하지 않음), 반영한 항목을 `vendor/SOURCES.md`에 "이전 시스템 교훈"으로 적는다.

- [ ] **Step 2: 원본 고정 사본 가져오기**

`Tejashmakwana/motionmaxxing`의 현재 커밋 SHA를 `gh api repos/Tejashmakwana/motionmaxxing/commits/main --jq .sha`로 얻고 그 커밋의 `LICENSE`, `NOTICE`, `SKILL.md`, `references/`를 `vendor/motionmaxxing/`에 둔다. HyperFrames `skills/hyperframes/references/motion.md`와 `review.md`는 `hyperframes@0.8.221` 태그 기준 URL만 `vendor/SOURCES.md`에 기록(복사하지 않음). Material 3 토큰 파일 URL도 기록.

- [ ] **Step 3: 실패하는 테스트 작성** (`scripts/director.test.mjs`)

```js
const skill = fs.readFileSync('.claude/skills/director/SKILL.md', 'utf8');
const tokens = JSON.parse(fs.readFileSync('tokens/motion.json', 'utf8'));

test('SKILL.md front matter에 name과 description이 있다', () => {
  assert.match(skill, /^---\n[\s\S]*?^name: director$[\s\S]*?^description: .+$[\s\S]*?^---$/m);
});
test('SKILL.md가 링크한 references 파일이 모두 존재한다', () => {
  const links = [...skill.matchAll(/\]\((references\/[^)]+\.md)\)/g)].map(m => m[1]);
  assert.ok(links.length >= 6);
  for (const l of links) assert.ok(fs.existsSync(path.join('.claude/skills/director', l)), l);
});
test('easings는 [x1,y1,x2,y2]이고 x1,x2는 0~1', () => {
  for (const [name, v] of Object.entries(tokens.easings)) {
    assert.equal(v.length, 4, name);
    assert.ok(v[0] >= 0 && v[0] <= 1 && v[2] >= 0 && v[2] <= 1, name);
  }
});
test('M3 두 개 + motionmaxxing 12개 이징이 있다', () => {
  assert.ok(Object.keys(tokens.easings).length >= 14);
  for (const n of ['standard', 'emphasized-decelerate', 'cruise', 'glide', 'softInOut']) assert.ok(n in tokens.easings, n);
});
test('end_hold_s는 [0.6, 1.4]', () => assert.deepEqual(tokens.end_hold_s, [0.6, 1.4]));
```

motionmaxxing의 이징 중 3차 베지어로 표현되지 않는 것(스프링 등)이 있으면, 그 이징만 `easings` 대신 `springs`에 두고 테스트의 14개 조건을 그 수만큼 줄인다.

- [ ] **Step 4: 실패 확인**

Run: `node --test scripts/`
Expected: director 테스트 FAIL

- [ ] **Step 5: 토큰과 스킬 작성**

`tokens/motion.json`: Material 3 지속시간(50~1000ms 스케일)과 `standard [0.2,0,0,1]`, `emphasized-decelerate [0.05,0.7,0.1,1]` + motionmaxxing 12개 이징(이름과 값은 vendor 사본의 런타임/레퍼런스에서 그대로) + stagger(글자 1프레임, 형제 요소 3프레임) + 엔드 홀드.
references 내용 출처:
- `laws.md`: motionmaxxing 12개 법칙과 수치, HyperFrames motion.md의 진입·퇴장 규칙(퇴장은 진입보다 40~50% 짧게, 가장 빠른 프레임에서 컷).
- `never-ship.md`: motionmaxxing never-ship 목록 + "모든 요소에 같은 이징·같은 길이 금지".
- `narrative.md`: 키메시지 → 비트마다 하나의 믿음, 스토리라인 3안은 종류가 달라야 함.
- `connection.md`: 컷 사이 서사·디자인 연결 유형(매치 컷, 형태·색·위치 이어짐, 움직임 위 컷)과 02-story 표의 `연결` 열 작성법.
- `composition.md`: 컷 안 위계, 헤드라인 크기(프레임 높이의 7~11%), 세이프 영역(액션 90%, 타이틀 80%), 한 화면 모션 어휘 1~2개.
- `korean-type.md`: keep-all, Pretendard 위계, 숫자·영문 한글 읽기 정규화.
각 규칙 끝에 출처 키를 괄호로 단다.

- [ ] **Step 6: 테스트 통과 확인**

Run: `node --test scripts/`
Expected: 전부 pass

- [ ] **Step 7: 커밋과 푸시**

```bash
git add vendor .claude/skills/director tokens scripts/director.test.mjs
git commit -m "feat: director skill v0 and motion tokens"
git push
```

---

### Task 7: 파일럿 0~2단계와 1차 게이트

**Files:**
- Create: `projects/<slug>/00_brief.md`, `01_key_message.md`, `02_story.md`
- Modify: `taste/verdicts.md`

**Interfaces:**
- Consumes: `CLAUDE.md`, `stages/00~02`, `scripts/status.mjs`, director 스킬.

- [ ] **Step 1: 파일럿 주제 받기**

사용자에게 파일럿 주제를 묻는다. `새 영상: <주제>` 흐름으로 slug를 확인받고 폴더를 만든다.

- [ ] **Step 2: 0단계 진행**

`stages/00-intake/questions.md`로 한 번에 하나씩 묻고 `00_brief.md`를 템플릿대로 작성 → 사용자 명시 승인 → `status: approved` → verdict 기록 → 커밋·푸시.
검증: `node scripts/status.mjs "projects/<slug>"` → `"stage": 1`.

- [ ] **Step 3: 1단계 진행**

리서치 후 키메시지 후보 3~5개 → 선택 → 승인 → 기록 → 커밋·푸시.
검증: status `"stage": 2`.

- [ ] **Step 4: 2단계 진행**

스토리라인 3안 → 선택 → 컷 설계표(컷 길이 합이 브리프 길이 ±10%, 모든 컷의 `연결` 두 열이 채워짐) → 승인 → 기록 → 커밋·푸시.
검증: status `"stage": 3`, `stale: []`.

- [ ] **Step 5: 애매한 승인 확인**

진행 중 사용자의 애매한 반응을 승인으로 기록하지 않았는지 `taste/verdicts.md`와 각 파일 `approved_at`을 대화 기록과 대조한다.

- [ ] **Step 6: 1차 게이트**

사용자에게 1차 구축 결과(원판 뼈대 + 파일럿 0~2단계)를 보여주고 승인받는다. 승인 후 3단계(애니매틱·BGM) 계획을 새로 쓴다.
