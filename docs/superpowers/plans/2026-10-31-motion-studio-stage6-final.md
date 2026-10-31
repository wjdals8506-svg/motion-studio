# Motion Studio 6단계(최종) 구축 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 승인된 `05_film/`을 GitHub Actions에서 최종 화질 무음 MP4로 렌더하고, PC에서 음원만 합쳐(영상 재인코딩 없음) 음량을 맞춘 완성본 MP4를 만들고, 자동 측정과 사용자의 마지막 확인으로 6단계 승인을 받는다. 파일럿 `yoon-jongshin-concert-teaser`로 검증하고, 승인되면 원판 첫 버전이 완성된다.

**Architecture:** 렌더는 기존 `render.yml`(`--quality delivery`) 그대로다. 음원이 레포에 없으니 `drop-missing-media.mjs`가 `<audio>`를 빼고 무음 MP4가 나온다. `scripts/mux-audio.mjs`가 `05_film/index.html`의 `<audio>` 속성(시작, 길이, 볼륨, 페이드)을 그대로 ffmpeg 필터로 옮겨 섞고, 측정한 음량에 맞춰 선형 이득(필요하면 리미터)을 준 뒤 `-c:v copy`로 영상에 붙인다. `scripts/final-qa.mjs`는 완성본을 ffprobe·ffmpeg 측정 필터로 재서 오류·경고를 낸다. 결과는 `06_final/NOTE.md`에 수치로 남긴다.

**Tech Stack:** Node.js 22+, `hyperframes@0.8.221`(원격 렌더만), ffmpeg·ffprobe(PC, `ebur128=peak=true`, `freezedetect`, `silencedetect`, `alimiter`), `gh` CLI(`workflow run`, `run watch`, `run download`), `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-30-motion-studio-design.md` (6절 6단계, 5절 믹스·마스터 표, 7절 "최종 MP4" 검사·납품 노트, 9절 음원 임시 업로드)

## 이 계획에서 정한 것

1. **음원 넣기는 PC 합치기로 한다(CLAUDE.md 14번이 6단계 계획에 맡긴 결정).** 원격은 지금처럼 무음 MP4만 렌더하고, PC에서 음원을 섞어 `-c:v copy`로 붙인다. 사용자가 5단계에서 이미 허용한 방식이다("합쳐서 보내봐", verdicts 39행). 암호화 임시 업로드는 하지 않는다. 키를 Secrets에 두고, 임시 브랜치를 만들었다 지우고, 음원이 든 MP4가 Actions 아티팩트로 남는다(공개 레포의 아티팩트는 GitHub에 로그인한 사람이면 받을 수 있다). PC 합치기는 음원이 PC를 떠나지 않는다. **CLAUDE.md 12번·14번과 스펙 9절을 이 결정으로 고친다**(Task 1, 이 계획 승인이 곧 그 변경 승인).
2. **완성본 MP4도 커밋하지 않는다.** 음원이 들어 있으므로 `media/<slug>/final.mp4`에 두고 SendUserFile로 보낸다. `06_final/NOTE.md`에 경로·sha256·렌더 run URL을 적는다(스펙 "MP4 링크 또는 파일").
3. **음량 목표는 프로젝트마다 고른다.** 스펙 기준은 −14 LUFS·−1 dBTP다. 그런데 파일럿은 사용자가 "BGM 음량 낮게"로 −19.8 LUFS를 승인했고, verdicts에 "6단계 음량 정규화 때 이 '낮게'를 기준으로 삼는다"고 적었다. 그래서 두 판(`--lufs -14`, `--lufs keep`)을 만들어 들려주고 사용자가 고른다(질문 1). true peak ≤ −1 dBTP는 어느 쪽이든 지킨다.
4. **이득은 선형으로 준다.** 승인 때 들은 강약을 바꾸지 않도록 `loudnorm` 동적 모드 대신 `측정 → 목표와의 차이만큼 volume`을 쓴다. 올린 뒤 피크가 −1.5 dBFS를 넘을 것으로 예상되면 `alimiter=limit=0.841:level=false`를 붙인다.
5. **덕킹(`data-fx-carve`)·HyperFrames `normalize-audio`는 만들지 않는다.** 파일럿에 내레이션·효과음이 없다. 내레이션이 있는 프로젝트가 생기면 그때 추가한다.
6. **하지 않는 것:** 승인된 앞 단계 파일의 미룬 정리(정보 줄 토큰 1.25배, `04_design.md`의 지운 lib 경로 언급). 고치면 4단계부터 다시 승인해야 해서 다음 프로젝트 때 함께 정리한다.

## Global Constraints

- Node `>=22`, `hyperframes` `0.8.221` 고정, 새 npm 의존성 없음, 테스트 `node:test`·`npm test`.
- PC에서 영상 프레임을 렌더·재인코딩하지 않는다. PC의 ffmpeg는 음원 섞기, `-c:v copy` 붙이기, 측정(ffprobe, `ebur128`, `freezedetect`, `silencedetect`)만 한다.
- `.env` 출력·커밋 금지. 음원과 음원이 든 MP4는 어떤 레포에도 커밋 금지(`media/<slug>/`). `git status`에 음원·MP4가 없어야 한다.
- `bgm.mode`는 `"none"`. 점수·자기 인증 금지. 승인은 명시적 발화로만.
- CLI 계약: 인자, JSON stdout, 실패 시 non-zero exit, 공백·한글 경로(ffmpeg는 `spawnSync` 인자 배열로 부른다. 셸 문자열 금지).

## Review Focus

1. **PC에 음원 파일이 없음** — `05_film/assets/audio/bgm.mp3`가 없으면 무음 완성본을 만들지 말고 빠진 파일을 말하고 exit 1. → Task 2 `checkSources` 테스트.
2. **무음 MP4에 이미 오디오 스트림이 있음** — 완성본에는 새로 섞은 소리만 들어가야 한다(`-map 0:v`만, `0:a` 없음). → Task 2 `muxArgs` 테스트.
3. **−14로 올리면 피크가 넘침** — 파일럿은 +5.8 dB면 예상 피크 −0.8 dBFS. 리미터가 붙어야 한다. `keep`이면 이득 0, 리미터 없음. → Task 2 `mixFilter` 테스트.
4. **페이드 아웃 위치** — 페이드는 클립 끝(`data-start + data-duration`) 기준이지 음원 파일 끝 기준이 아니다. → Task 2 `mixFilter` 테스트.
5. **완성본 길이 어긋남** — 섞은 소리가 영상보다 길거나 짧아 길이가 0.1초 넘게 다르면 오류. → Task 3 `finalQa` 테스트.

---

### Task 1: 6단계 틀과 규칙 정리

**Files:** Create `stages/06-final/{questions,template,gate}.md`. Modify `scripts/status.mjs`·`status.test.mjs`, `CLAUDE.md`(12번, 14번), 스펙 9절(173행)과 5절 믹스·마스터 행(72행).

- [ ] **Step 1: 실패하는 테스트** — `'0~6 모두 승인이면 stage 7, stale 없음'`: 일곱 파일 모두 `approved`, `approved_at` 오름차순 → `{ stage: 7, approved: [...7개], stale: [] }`. `'05까지 승인이고 06_final.md가 draft면 stage 6'`.
- [ ] **Step 2: 실패 확인** — `npm test` FAIL(STAGES에 6이 없음)
- [ ] **Step 3: 구현** — `STAGES`에 `{ n: 6, file: '06_final.md' }`.
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: 규칙 문서** — CLAUDE.md 12번 끝을 "PC에서는 `lint`, `check`, `snapshot`, `preview`와, 원격 무음 MP4에 음원만 섞어 붙이기(`-c:v copy`, 영상 재인코딩 없음)·MP4 측정(ffprobe, ffmpeg 측정 필터)만."으로. 14번의 "원격 렌더에 필요하면 … 6단계 계획에서 정한다" 부분을 "원격 렌더에는 음원을 올리지 않는다. 원격은 무음 MP4를 만들고 음원은 PC에서 합친다(`scripts/mux-audio.mjs`, 사용자 결정 2026-10-31 "합쳐서 보내봐", 6단계 계획). 음원이 든 완성본 MP4도 커밋하지 않고 `media/<slug>/`에 둔다."로. 스펙 9절도 같은 내용, 72행 비고에 "덕킹은 내레이션이 생길 때 추가, 이득은 선형 + 필요 시 리미터"를 덧붙인다.
- [ ] **Step 6: 단계 문서** — `questions.md`: 1) (−14 LUFS 판과 승인 때 음량 판을 함께 보내고) 어느 음량으로 할까요? 2) (고른 완성본을 보고) HTML 미리보기와 다르게 보이거나 들리는 곳이 있나요(몇 초)? `template.md`: front matter(`stage: 6`) + `## 렌더`(run URL, 렌더한 커밋, 화질) / `## 소리`(음량 목표, 측정 전→후 LUFS·피크, 이득, 리미터 여부) / `## 완성본`(`media/<slug>/final.mp4`, sha256, 보낸 날) / `## 마지막 확인`(질문 2 답, 반영) / `## 남은 문제`. `06_final/NOTE.md`는 같은 수치를 `final-qa` JSON 그대로 인용하고 경고(정지·무음 구간)와 한계를 적는다(점수·"좋다" 없음). `gate.md`: final-qa 오류 0, 경고를 NOTE.md에 적음, 사용자가 MP4를 봄, `git status`에 음원·MP4 없음 / 승인 후: approved → verdicts → 커밋·푸시, status `stage: 7`이면 프로젝트 완료.
- [ ] **Step 7: Commit** — `git add stages/06-final scripts/status.mjs scripts/status.test.mjs CLAUDE.md docs/superpowers/specs` → `feat: 6단계 틀, PC 음원 합치기 규칙`

### Task 2: 음원 합치기

**Files:** Create `scripts/mux-audio.mjs`, `scripts/mux-audio.test.mjs`.

**Interfaces:**
- `audioTracks(html: string): Track[]` — 모든 `<audio>`에서 `{ id, src, start, duration, mediaStart, volume, fadeIn, fadeOut }`. 없는 속성 기본값: `mediaStart 0`, `volume 1`, `fadeIn 0`, `fadeOut 0`. `data-duration`이 없으면 오류(길이를 모르면 섞을 수 없음).
- `checkSources(tracks, dir: string, exists = fs.existsSync): string[]` — `path.join(dir, src)`가 없는 트랙의 경로 목록.
- `parseLoudness(stderr: string): { lufs: number, peak: number }` — `ebur128=peak=true` 요약의 `I: … LUFS`와 `True peak` 아래 `Peak: … dBFS`.
- `mixFilter(tracks, { duration, gainDb = 0, limit = false }): string` — 트랙 i(입력 i+1)마다 `atrim=start=mediaStart:duration=duration`, `asetpts=PTS-STARTPTS`, `volume`, `afade=t=in:st=0:d=fadeIn`(0이면 생략), `afade=t=out:st=duration−fadeOut:d=fadeOut`(0이면 생략), `adelay=start×1000:all=1` → `amix=inputs=n:normalize=0` → `apad` → `atrim=duration=<영상 길이>` → `gainDb ≠ 0`이면 `volume=<gainDb>dB` → `limit`이면 `alimiter=limit=0.841:level=false` → `[mix]`.
- `planGain(measured: { lufs, peak }, target: number | 'keep'): { gainDb, limit }` — `keep`이면 `{ 0, false }`. 숫자면 `gainDb = target − lufs`(소수 둘째 자리 반올림), `limit = peak + gainDb > −1.5`.
- `muxArgs({ video, inputs: string[], filter, out }): string[]` — `-y -i video (-i input)… -filter_complex filter -map 0:v -map [mix] -c:v copy -c:a aac -b:a 192k -movflags +faststart out`.
- CLI `node scripts/mux-audio.mjs "projects/<slug>" --video <무음.mp4> --lufs <-14|keep> --out <완성본.mp4>` → 1차로 섞은 소리만 `-f null -`에 `ebur128=peak=true`로 재고 → `planGain` → 2차 합치기 → stdout `{ out, measured, gainDb, limit }`. 음원이 없으면 `{ missing: [...] }`와 exit 1.

- [ ] **Step 1: 실패하는 테스트**
  - `'audioTracks는 파일럿 bgm 태그를 읽는다'`: 파일럿 85행 태그 → `{ id: 'bgm', src: 'assets/audio/bgm.mp3', start: 0, duration: 30, mediaStart: 0, volume: 0.55, fadeIn: 1.5, fadeOut: 2.5 }`. 속성 없는 태그 → 기본값. `data-duration` 없는 태그 → throw.
  - `'checkSources는 없는 음원 경로를 돌려준다'`(Focus 1): `exists = p => !p.endsWith('bgm.mp3')` → bgm 경로 1개.
  - `'페이드 아웃은 클립 끝 기준'`(Focus 4): `start 2, duration 10, fadeOut 2.5` → 필터에 `afade=t=out:st=7.5:d=2.5`와 `adelay=2000:all=1`, `atrim=duration=30`(영상 길이 30).
  - `'planGain: −19.8/−6.6을 −14로 → +5.8 dB, 리미터'`, `'keep → 0 dB, 리미터 없음'`, `'−16/−9를 −14로 → +2 dB, 리미터 없음'`(Focus 3). `mixFilter`에 `gainDb 5.8, limit true` → `volume=5.8dB`, `alimiter=limit=0.841:level=false` 포함. `gainDb 0` → `dB` 없음.
  - `'muxArgs는 영상만 복사하고 원래 오디오를 쓰지 않는다'`(Focus 2): 인자에 `-map 0:v`, `-c:v copy`, `-map [mix]`가 있고 `0:a`가 없다.
  - `'parseLoudness는 ebur128 요약을 읽는다'`: 요약 문자열 고정 예제(`I: -19.8 LUFS`, `True peak:\n    Peak: -6.6 dBFS`) → `{ lufs: -19.8, peak: -6.6 }`.
- [ ] **Step 2: 실패 확인** — `npm test` FAIL(모듈 없음)
- [ ] **Step 3: 구현** — 위 시그니처. 정규식은 Edit 도구로 쓴다(Git Bash heredoc이 역슬래시를 먹는다).
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: Commit** — `feat: 무음 MP4에 음원을 섞어 붙이는 mux-audio`

### Task 3: 완성본 측정

**Files:** Create `scripts/final-qa.mjs`, `scripts/final-qa.test.mjs`.

**Interfaces:**
- Consumes: `parseLoudness`(Task 2).
- `parseIntervals(stderr, kind: 'freeze' | 'silence'): { from, to }[]` — `lavfi.freezedetect.freeze_start/freeze_end`, `silence_start`/`silence_end`. 끝이 없으면 `to = null`(영상 끝까지).
- `finalQa({ probe, loudness, freezes, silences, expect: { duration, width, height, lufs } }): { errors, warnings }` — `probe`는 `ffprobe -show_streams -show_format -of json` 결과.
  - 오류: 길이 차 > 0.1초, 비디오 코덱 ≠ `h264`, 오디오 스트림 없음 또는 코덱 ≠ `aac`, 해상도가 `data-width/height`와 다름, true peak > −1 dBTP, `expect.lufs`가 숫자이고 `|lufs − 목표| > 1`.
  - 경고: 정지 구간(`freezedetect=n=0.003:d=2`)과 무음 구간(`silencedetect=n=-50dB:d=1`)마다 `t=from~to`. 사용자가 판단할 일이라 오류가 아니다.
- CLI `node scripts/final-qa.mjs "projects/<slug>" <완성본.mp4> --lufs <-14|keep>` → 기대값은 `05_film/index.html` 루트의 `data-duration/width/height`. stdout `{ errors, warnings, measured: { duration, width, height, vcodec, acodec, lufs, peak } }`, 오류 있으면 exit 1.

- [ ] **Step 1: 실패하는 테스트**
  - `'정상 완성본은 오류 0'`: 30.02초, h264/aac, 1920×1080, −14.2 LUFS, −1.4 dBTP, 목표 −14.
  - `'길이 0.15초 차이는 오류'`(Focus 5), `'오디오 스트림 없으면 오류'`, `'peak −0.8은 오류'`, `'목표 −14인데 −16.5면 오류'`, `'keep이면 LUFS는 보지 않지만 peak는 본다'`.
  - `'정지·무음 구간은 경고로 시각과 함께'`: `parseIntervals`로 고정 stderr 예제(`freeze_start: 27.6`, `freeze_end: 30`)를 읽어 경고 `정지 t=27.6~30`.
- [ ] **Step 2: 실패 확인** — `npm test` FAIL
- [ ] **Step 3: 구현**
- [ ] **Step 4: 통과 확인** — `npm test` PASS
- [ ] **Step 5: Commit** — `feat: 완성본 MP4 측정 final-qa`

### Task 4: 파일럿 완성본

- [ ] **Step 1: 원격 렌더** — `gh workflow run render.yml -f project=projects/yoon-jongshin-concert-teaser/05_film -f quality=delivery` → `gh run watch` → `gh run download <id> -n render-<id> -D media/yoon-jongshin-concert-teaser/render`. 워크플로의 길이 검사 통과 확인.
- [ ] **Step 2: 두 판 합치기** — `05_film/assets/audio/bgm.mp3`가 `media/<slug>/bgm-3.mp3`와 같은지 sha256으로 확인 → `mux-audio --lufs -14 --out media/<slug>/final-14.mp4`, `--lufs keep --out media/<slug>/final-keep.mp4` → 각각 `final-qa`. 오류가 있으면 고치고 다시.
- [ ] **Step 3: 질문 1** — 두 MP4를 SendUserFile(측정값 한 줄씩) → 고른 판을 `media/<slug>/final.mp4`로 복사.
- [ ] **Step 4: 질문 2** — 화면이나 소리를 고쳐야 하면 `feedback.md`에 시간 위치와 함께 적는다. 화면 수정은 5단계로 되돌린다(`05_film.md` → draft, 6단계 다시).
- [ ] **Step 5: 기록** — `06_final.md`(template), `06_final/NOTE.md`(final-qa JSON 인용, 경고, 남은 문제, sha256, run URL). gate 확인.
- [ ] **Step 6: 승인** — 명시적 승인 → approved, verdicts, 커밋·푸시(음원·MP4 제외). `status.mjs` → `{"stage":7, "stale":[]}`이면 파일럿 완료, 원판 첫 버전 완성.
