# 5단계 게이트

## 승인 요청 전 확인
- [ ] `npx hyperframes check "projects/<slug>/05_film"` 오류 0. 경고는 `05_film.md`에 적었다.
- [ ] `node scripts/film-qa.mjs "projects/<slug>"` 오류 0 (효과음은 키 모션에만, 엔드 홀드 0.6~1.4초, 카피 읽기 시간, 에셋 목록, 렌더러 사본).
- [ ] `05_film/REVIEW.md`에 P0가 없고, 모든 시트 프레임을 한 문장으로 묘사했다. 점수는 없다.
- [ ] 승인된 결정(스타일, 정지 처리, 제목 글꼴, 거절된 표현)을 지켰다. 컷 연결이 02 설계표와 같다.
- [ ] 사용자 피드백이 `feedback.md`에 시간 위치와 함께 있고, 반영 여부가 표시됐다.
- [ ] `git status`에 음원 파일이 없다.

## 사용자에게 보여줄 것
전체 영상 미리보기(원격 무음 MP4, 허용되면 음원 합친 MP4, 또는 PC 미리보기) → 효과음 후보 → 고친 영상.

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` → 커밋·푸시(음원 제외). 다음은 6단계(최종 렌더, 덕킹·음량)이며 별도 구축 계획이 필요하다.
