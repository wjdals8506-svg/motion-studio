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
| 브라우저 미리보기 | 통과 (사용자 확인 대기) | `preview --background` → `http://localhost:3002` 200. Studio에서 5초 타임라인 재생 확인, Pretendard woff2 두 파일 200으로 로드 |

## B. GitHub Actions 원격 렌더 (Task 3)

(진행 예정)

## C. 오디오·라이선스 (Task 4)

(진행 예정)
