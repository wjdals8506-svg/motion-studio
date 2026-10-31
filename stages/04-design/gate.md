# 4단계 게이트

## 승인 요청 전 확인
- [ ] 스타일 후보의 종류가 서로 다르고, 각각 Styles-20 또는 브리프에서 근거(색·모션·질감)를 댔다.
- [ ] `node scripts/design-tokens.mjs "projects/<slug>"` 오류 0. 경고는 `04_design.md`에 적었다.
- [ ] 키 컷마다 `npx hyperframes check` 오류 0, 키 모션 시각이 `03_animatic/timing.json`과 같다.
- [ ] 키 컷이 서사와 컷 연결(`02_story.md`의 연결(디자인) 열)을 바꾸지 않았다. 바꿨다면 2단계를 draft로 되돌릴지 사용자에게 물었다.
- [ ] never-ship 목록에 걸리는 요소가 없다. 새 글꼴·이미지는 라이선스 파일과 함께 커밋됐다.
- [ ] 질문 1~4의 답이 `04_design.md`와 `taste/verdicts.md`에 있다.
- [ ] `git status`에 음원 파일이 없다.
- [ ] 점수를 매기거나 "좋다"고 스스로 인증하지 않았다.

## 사용자에게 보여줄 것
스타일 후보 비교 시트와 근거 → 확정 토큰 요약 → 키 컷 미리보기(원격은 무음 MP4).

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` 기록 → (고른 스타일이 Styles-20 항목에서 왔으면) `styles/modules/<번호-이름>/`에 스타일 모듈 → 커밋·푸시(음원 제외). 다음은 5단계(모션)이며 별도 구축 계획이 필요하다.
