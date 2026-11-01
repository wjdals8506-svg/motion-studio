# 4단계 게이트

## 승인 요청 전 확인
- [ ] 스타일 후보의 종류가 서로 다르고, 각각 Styles-20 또는 브리프에서 근거(색·모션·질감)를 댔다.
- [ ] `node scripts/design-tokens.mjs "projects/<slug>"` 오류 0. 경고는 `04_design.md`에 적었다.
- [ ] 키 컷마다 `npx hyperframes check` 오류 0, 키 모션 시각이 `03_animatic/timing.json`과 같다.
- [ ] 키 컷이 서사와 컷 연결(`02_story.md`의 연결(디자인) 열)을 바꾸지 않았다. 바꿨다면 2단계를 draft로 되돌릴지 사용자에게 물었다.
- [ ] never-ship 목록에 걸리는 요소가 없다. 새 글꼴·이미지는 라이선스 파일과 함께 커밋됐다.
- [ ] 질문 1~4의 답이 `04_design.md`와 `taste/verdicts.md`에 있다.
- [ ] `director` 스킬 "자체 검수" 1~8을 마쳤다: `check --json` 경고 인용, `node scripts/motion-lint.mjs` 결과 0 또는 REVIEW.md에 이유, `snapshot --review` 시트(비트·컷 띠·폰) 묘사, 글자를 가린 그림·썸네일·무음·좌우 반전 보기, 낯선 눈 서브 에이전트 P0·P1. 기록은 `04_design/keycuts/<이름>/REVIEW.md`(P0 없음).
- [ ] 원격 렌더본을 보냈다면 아티팩트의 `sheet.jpg`·`qc.txt`를 먼저 보고 HTML 미리보기와 같음을 확인했다. 다르면 보내지 않았다.
- [ ] `git status`에 음원 파일이 없다.
- [ ] 점수를 매기거나 "좋다"고 스스로 인증하지 않았다.

## 사용자에게 보여줄 것
스타일 후보 비교 시트와 근거 → 확정 토큰 요약 → 키 컷 미리보기(원격은 무음 MP4).

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` 기록 → (고른 스타일이 Styles-20 항목에서 왔으면) `styles/modules/<번호-이름>/`에 스타일 모듈 → 커밋·푸시(음원 제외). 다음은 5단계(모션)이며 별도 구축 계획이 필요하다.
