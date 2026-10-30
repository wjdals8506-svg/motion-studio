# 엔진 검증 스파이크 보고서

- 대상: `hyperframes@0.8.221`, 테스트 컴포지션 `spike/index.html` (1920×1080, 5초, 한글 헤드라인 + 숫자·영문 부제, GSAP 진입·퇴장)
- 일자: 2026-10-30
- 기준: `docs/superpowers/plans/2026-10-30-motion-studio-increment-1.md` Task 2~4

## A. Windows 로컬 (Task 2)

| 항목 | 결과 | 메모 |
|---|---|---|
| 환경 진단 `doctor --json` | 조건부 통과 | Chrome headless shell 152, FFmpeg/ffprobe 정상. `ok: false`의 원인은 **메모리**(총 5.9GB, 여유 1.3GB, "렌더가 실패할 수 있음")와 선택 항목(Docker, whisper-cpp, Kokoro, MusicGen 미설치)뿐. 메모리 부족은 MP4를 원격에서 렌더하는 결정을 뒷받침한다 |
| 텔레메트리 끄기 | 통과 | PC: `npx hyperframes telemetry disable` 적용. CI: 환경변수 `HYPERFRAMES_NO_TELEMETRY=1` |
| lint / check | 통과 | 오류 0. layout 9 samples, contrast 5 samples(19 checked), craft 40 samples. 경고 2개는 스파이크라 허용: 중첩 구조는 서브컴포지션 권장, 첫 프레임이 비어 있음(`first_frame_empty`) |
| 에셋 경로 규칙 | 규칙 발견 | lint가 프로젝트 루트 위로 올라가는 `../` 경로를 오류로 막는다. 공용 폰트는 레포 `assets/fonts/`에 두고, 각 컴포지션 프로젝트의 `assets/fonts/`로 복사해 쓴다 |
| 클립 구조 규칙 | 규칙 발견 | `class="clip"` 요소는 각각 화면 전체 크기 상자가 된다. 한 화면에 함께 배치할 요소는 하나의 장면 클립 안에 넣어야 겹침 오류가 나지 않는다 |
| 한글 렌더 (스냅샷) | 통과 | 0.3/2.5/4.6초 스냅샷에서 Pretendard Bold·Regular가 정상으로 보이고, 두부 문자나 대체 글꼴이 없다. 숫자·영문 혼용 줄도 정상 |
| 결정론 | 통과 | 같은 시점을 두 번 스냅샷해 SHA-256이 같았다: 정지 구간 2.5초(`5b9feac5…`), 진입 애니메이션 중 0.5초(`37fe1cc0…`) |
| 브라우저 미리보기 | 통과 (사용자 확인: 정상) | `preview --background` → `http://localhost:3002` 200. Studio에서 5초 타임라인 재생 확인, Pretendard woff2 두 파일 200으로 로드 |

## B. GitHub Actions 원격 렌더 (Task 3)

레포: https://github.com/wjdals8506-svg/motion-studio (공개). 실행: run `41057772896`.

| 항목 | 결과 | 메모 |
|---|---|---|
| 워크플로 실행 | 통과 | `gh workflow run render.yml -f project=spike -f quality=delivery`. 모든 단계 성공, 전체 48초(12:45:35 → 12:46:23 UTC). 첫 푸시에서 YAML 따옴표 오류가 나서 고쳤다 |
| 결과 규격 | 통과 | H.264, 1920×1080, 30fps, yuv420p, 5.000초, 106KB. 워크플로 안의 길이 검사(±0.1초)도 통과 |
| 한글 글꼴 (원격) | 통과 | MP4의 2.5초 프레임이 로컬 스냅샷과 같은 Pretendard로 보인다. 리눅스에서 대체 글꼴로 바뀌지 않음 |
| 결과 회수 | 조건부 통과 | `gh run download` 첫 시도에서 `HTTP 503 Egress is over the account limit`, 20초 뒤 재시도에서 성공. GitHub 문서에 아티팩트 다운로드 대역폭 한도는 문서화되어 있지 않다. 반복되면 Release 자산으로 바꾼다(자산당 2GiB 미만, 전체 크기·대역폭 한도 없음: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) |
| 무료 사용 조건 | 통과 | 공개 레포의 표준 러너는 무료·무제한 (https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job). 작업당 최대 6시간, 동시 작업 20개 (https://docs.github.com/en/actions/reference/limits) |
| 아티팩트 보관 | 메모 | 기본 90일 (https://docs.github.com/en/actions/how-tos/manage-workflow-runs/remove-workflow-artifacts). 워크플로는 14일로 지정. Free 플랜 아티팩트 저장 500MB가 공개 레포에도 적용되는지는 문서가 분명하지 않다 → 보관 14일로 짧게 유지 |

## C. 오디오·라이선스 (Task 4)

| 항목 | 결과 | 메모 |
|---|---|---|
| HyperFrames MusicGen 폴백 | 통과 (규칙으로 차단) | 로컬 음악 생성(Lyria → MusicGen `facebook/musicgen-small`, CC-BY-NC)은 `/media-use` 오디오 엔진이 HeyGen 자격 증명 없이 `bgm` 모드를 자동으로 둘 때만 실행된다. 공식 차단 스위치는 `audio_request.json`의 `bgm: { mode: "none" }`. 원판 규칙: HyperFrames 오디오 엔진을 쓸 때는 항상 `bgm.mode = "none"`이고 BGM은 우리 ElevenLabs 파이프라인에서 만든다. `transformers`·`torch`는 설치하지 않는다(현재 미설치) |
| ElevenLabs Music API (Creator) | 통과 | 유료 플랜에서 사용 가능, composition plan 지원. Creator 음악 다운로드 한도 월 250분 (https://elevenlabs.io/music-terms, https://elevenlabs.io/docs/overview/capabilities/music) |
| ElevenLabs Sound Effects API (Creator) | 조건부 통과 | 유료 플랜에서 열리는 것으로 보이나 Creator를 명시한 문장은 찾지 못함. 첫 호출에서 확인 |
| 크레딧 | 메모 | Creator 월 121,000 크레딧, 음악 분당 900, 효과음 1회 200 (https://elevenlabs.io/pricing). 단, API 요금 페이지는 달러 기준이라 API 호출 과금 방식은 미확인 |
| 상업 사용 범위 (음악) | 통과 | "필름·TV·라디오·Studio Games를 제외한 온·오프라인 상업 사용 허용", 스트리밍 배포 허용 (Music Terms Exhibit A). 별도 페이지(elevenlabs.io/creative)는 광고·마케팅에도 추가 라이선스가 필요하다고 적어 충돌 — **광고·마케팅 캠페인 영상은 미확인**으로 둔다 |
| **생성물을 공개 레포에 올리기** | **불가** | 소유권은 사용자에게 있지만, 음악은 "Music Library" 구성 금지(§4.2, 제3자가 내려받아 쓸 수 있게 공개하는 것 포함), 효과음은 "독립 오디오 파일·샘플로 공개" 금지(ElevenCreative Terms Exhibit 4). TTS는 명시 조항이 없지만 금지 사용 정책 §12(자기보다 느슨한 조건으로 제3자에게 제공 금지)에 걸릴 수 있어 같이 취급 (https://elevenlabs.io/music-terms, https://elevenlabs.io/creative-terms, https://elevenlabs.io/use-policy). 완성 MP4처럼 다른 소재와 결합된 결과물은 허용 |

### 결정: 스펙 9절의 대비책 적용

- 코드·규칙·스타일 레포(`motion-studio`)는 **공개 유지**.
- ElevenLabs 생성 음원(BGM, 효과음, 내레이션)은 **별도 비공개 레포**에 둔다(이름 제안: `motion-studio-media`). 렌더 워크플로가 GitHub Secrets의 읽기 전용 토큰으로 렌더 직전에 받아 온다. 비공개 레포는 저장만 하고 Actions를 돌리지 않으므로 무료 분 제한과 무관하다.
- 공개 레포에는 실수 방지용으로 오디오 확장자(`*.mp3 *.wav *.m4a *.aac *.ogg *.flac`)를 `.gitignore`에 넣는다.
- 공개 레포 아티팩트·Release로 나가는 완성 MP4는 "다른 소재와 결합된 결과물"이라 허용된다.
- 이 대비책은 3단계(BGM) 계획에서 구현한다. 지금은 규칙만 확정.

## D. Go / No-go

| 항목 | 판정 |
|---|---|
| Windows 미리보기, lint/check, 한글 폰트(로컬), 결정론 | Go |
| GitHub Actions 원격 렌더, 한글 폰트(원격), 무료 사용 | Go |
| 결과 회수 | Go (아티팩트 다운로드 503은 재시도로 해결, 반복 시 Release로 전환) |
| MusicGen 폴백 | Go (`bgm.mode = "none"` 규칙) |
| ElevenLabs 음악·효과음 사용 | Go (Creator, 웹 상업 사용) |
| ElevenLabs 생성물 공개 레포 게시 | 대비책 적용 (비공개 미디어 레포) |
| 메모리 5.9GB PC | 주의 — 미리보기·스냅샷은 동작. 무거운 3D·셰이더 장면에서 미리보기가 느려질 수 있음 |

**권고: Go.** 엔진은 HyperFrames 0.8.221로 계속 간다.

**사용자 판정 (2026-10-30): Go.** 비공개 미디어 레포 대비책 승인. 연출 스킬 작성 시 이전 시스템 자료는 참고하지 않는다.
