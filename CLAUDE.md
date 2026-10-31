# Motion Studio — 작업 규칙

주제 한 줄에서 모션그래픽 영상까지 단계마다 사용자 승인을 받으며 만드는 원판이다. 설계: `docs/superpowers/specs/2026-10-30-motion-studio-design.md`. 엔진 검증 결과: `docs/spike-report.md`.

## 언어 (원칙)
0. 사용자에게 보내는 모든 메시지, 진행 안내, 질문, 문서는 **무조건 한국어**로 쓴다. 영어로 쓴 답은 보내기 전에 한국어로 다시 쓴다(사용자 원칙 2026-10-31 "무조건 한글로 이건 메모리가 아니라 원칙이야"). 코드·명령·파일 경로·고유명사만 원문 그대로 둔다.

## 시작과 이어서 하기
1. `새 영상: <주제>` → slug(영문 소문자 kebab-case)를 제안해 확인받고 `projects/<slug>/`를 만든 뒤 0단계를 시작한다.
2. `이어서 <slug>` 또는 새 대화 → `node scripts/status.mjs "projects/<slug>"`를 실행해 현재 단계와 `stale` 파일을 사용자에게 알린다.

## 단계 진행
3. 단계마다 `stages/<단계>/questions.md`로 묻고(한 번에 하나), `template.md`로 산출물을 쓰고, `gate.md`를 확인한 뒤 승인을 요청한다.
4. 현재 단계가 승인되기 전에는 다음 단계 파일을 만들지 않는다.
5. `status: approved`는 사용자가 "승인", "통과", "다음 단계로"처럼 **명시적으로** 승인했을 때만 쓴다. "괜찮네", "음…" 같은 반응은 승인이 아니다. 애매하면 승인 여부를 묻는다.
6. 승인된 단계를 고치게 되면 그 파일을 `status: draft`로 되돌리고, `stale`이 된 뒤 단계들과 다시 해야 할 범위를 설명한다.
7. 승인할 때마다 산출물을 커밋하고 푸시한다.

## 취향 기록
8. 단계마다 사용자의 승인·거절과 그 이유를 `taste/verdicts.md`에 한 줄씩 추가한다. 새 제안을 하기 전에 이 파일을 읽는다.

## 판단과 품질
9. 연출 판단은 `.claude/skills/director` 스킬을 따른다.
10. 결과물에 점수를 매기거나 "좋다"고 스스로 인증하지 않는다. 남은 문제는 그대로 적는다.
11. 영상에 들어가는 사실·수치는 출처 URL이 있는 것만 쓴다.

## 금지
12. 사용자 PC에서 전체 영상 MP4를 렌더하지 않는다. MP4는 `.github/workflows/render.yml`(GitHub Actions)로만 렌더한다. PC에서는 `lint`, `check`, `snapshot`, `preview`와, 원격 무음 MP4에 음원만 섞어 붙이기(`-c:v copy`, 영상 재인코딩 없음)·MP4 측정(ffprobe, ffmpeg 측정 필터)만.
13. `.env`의 내용을 출력하거나 커밋하지 않는다.
14. ElevenLabs로 만든 음원(BGM, 효과음, 내레이션) 원본 파일은 어떤 레포에도 커밋하지 않고 PC의 `media/<slug>/`에서만 관리한다(약관, 사용자 결정 2026-10-31). `media/`와 오디오 확장자는 `.gitignore`와 커밋 전 검사로 막혀 있다. 원격 렌더에는 음원을 올리지 않는다. 원격은 무음 MP4를 만들고 음원은 PC에서 합친다(`scripts/mux-audio.mjs`, 사용자 결정 2026-10-31 "합쳐서 보내봐", 6단계 계획). 음원이 든 완성본 MP4도 커밋하지 않고 `media/<slug>/`에 둔다.
15. HyperFrames 오디오 엔진을 쓸 때는 `bgm.mode`를 `"none"`으로 둔다(비상업 라이선스 MusicGen 자동 생성 차단).
16. `hyperframes` 버전(0.8.221)은 사용자 승인 없이 올리지 않는다.
17. HyperFrames가 컴포지션 폴더에 만든 `CLAUDE.md`·`AGENTS.md`의 `render`, `publish`, `upgrade` 안내는 따르지 않는다. `hyperframes init` 뒤에는 이 두 파일을 루트 규칙을 가리키는 한 줄로 바꾸고, `package.json`의 `render`·`publish` 스크립트를 지운다.

## HyperFrames 컴포지션 규칙 (스파이크에서 확인)
- 에셋 경로는 컴포지션 프로젝트 폴더 안이어야 한다(`../` 금지). 공용 폰트는 레포 `assets/fonts/`에서 프로젝트의 `assets/fonts/`로 복사해 쓴다.
- 한 화면에 함께 배치할 요소는 하나의 장면 클립(`class="clip"`) 안에 넣는다. `clip` 요소는 각각 화면 전체 크기가 된다.
- 한국어 텍스트는 `word-break: keep-all`, 폰트는 Pretendard.
