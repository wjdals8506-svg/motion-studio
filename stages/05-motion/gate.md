# 5단계 게이트

## 승인 요청 전 확인
- [ ] `npx hyperframes check "projects/<slug>/05_film"` 오류 0. 경고는 `05_film.md`에 적었다.
- [ ] `node scripts/film-qa.mjs "projects/<slug>"` 오류 0 (효과음은 키 모션에만, 엔드 홀드 0.6~1.4초, 카피 읽기 시간, 에셋 목록, 렌더러 사본).
- [ ] `director` 스킬 "자체 검수" 1~8을 마쳤다: `check --json` 경고 인용, `node scripts/motion-lint.mjs` 결과 0 또는 REVIEW.md에 이유, `snapshot --review` 시트(비트·컷 띠·폰) 묘사, 글자를 가린 그림·썸네일·무음·좌우 반전 보기, 낯선 눈 서브 에이전트 P0·P1. 기록은 `05_film/REVIEW.md`(P0 없음).
- [ ] 원격 렌더본을 보냈다면 아티팩트의 `sheet.jpg`·`qc.txt`를 먼저 보고 HTML 미리보기와 같음을 확인했다. 다르면 보내지 않았다.
- [ ] 승인된 결정(스타일, 정지 처리, 제목 글꼴, 거절된 표현)을 지켰다. 컷 연결이 02 설계표와 같다.
- [ ] 사용자 피드백이 `feedback.md`에 시간 위치와 함께 있고, 반영 여부가 표시됐다.
- [ ] `git status`에 음원 파일이 없다.

## 사용자에게 보여줄 것
전체 영상 미리보기(원격 무음 MP4, 허용되면 음원 합친 MP4, 또는 PC 미리보기) → 효과음 후보 → 고친 영상.

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` → 커밋·푸시(음원 제외). 다음은 6단계(최종 렌더, 덕킹·음량)이며 별도 구축 계획이 필요하다.
