# 5단계 영상 자체 검수 (2026-11-01, 실사 구성)

`05_film/index.html`의 화면은 4단계 승인 키 컷 `04_design/keycuts/tone-a/`와 같다. HTML 차이는 주석, `qa` 블록, `window.__timing` 사본, buildReady 이름뿐이다. 자체 검수와 낯선 눈 점검 기록은 `04_design/keycuts/tone-a/REVIEW.md`(P0 없음, P1 다섯 중 넷 고침)에 있고, 화면이 같아 낯선 눈 점검은 다시 돌리지 않았다.

1. `npx hyperframes check --json`: 오류 0, 경고 0.
2. `node scripts/motion-lint.mjs`: 0건.
3. `node scripts/film-qa.mjs`: 오류 0, 경고 0. 효과음 없음(sfx.json 빈 목록, 2026-10-31 사용자 "효과음 다 빼고"), 끝 정지 1.0초(29초 어두워짐 끝 → 30초), 글자 노출 시간 6개 모두 읽기 시간 이상.
4. `snapshot --review`: 13프레임이 4단계 키 컷 시트와 같다(호박빛 톤, 글자 자리·시각 같음).
5. 원격 렌더(run 41300715621): `sheet.jpg`가 미리보기와 같음, `qc.txt` 정지·검은 화면 없음. bgm-3을 PC에서 합쳐(영상 재인코딩 없음) `media/yoon-jongshin-concert-teaser/5단계-영상-실사.mp4`로 보냄.
