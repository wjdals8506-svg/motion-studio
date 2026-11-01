# 3단계 게이트

## 승인 요청 전 확인
- [ ] `timing.before-retime.json`의 컷 수·길이가 `02_story.md` 컷 설계표와 같다.
- [ ] 무음 애니매틱 확인(질문 1)과 곡 선택(질문 3)이 `03_animatic.md`와 `taste/verdicts.md`에 있다.
- [ ] `music_plan.json`의 구간 길이 합이 영상 길이와 같고, 모든 구간이 최소 길이 이상이다.
- [ ] `retime` 경고(곡 길이 불일치, 옮기지 않은 경계)를 사용자에게 보여줬다.
- [ ] `npx hyperframes check "projects/<slug>/03_animatic"` 오류 0.
- [ ] `node scripts/manifest.mjs "projects/<slug>"` 통과.
- [ ] `director` 스킬 "자체 검수" 1~8을 마쳤다: `check --json` 경고 인용, `node scripts/motion-lint.mjs` 결과 0 또는 REVIEW.md에 이유, `snapshot --review` 시트(비트·컷 띠·폰) 묘사, 글자를 가린 그림·썸네일·무음·좌우 반전 보기, 낯선 눈 서브 에이전트 P0·P1. 기록은 `03_animatic/REVIEW.md`(P0 없음).
- [ ] 원격 렌더본을 보냈다면 아티팩트의 `sheet.jpg`·`qc.txt`를 먼저 보고 HTML 미리보기와 같음을 확인했다. 다르면 보내지 않았다.
- [ ] `git status`에 음원 파일이 없다.
- [ ] 점수를 매기거나 "좋다"고 스스로 인증하지 않았다.

## 사용자에게 보여줄 것
무음 애니매틱 → 음악 구간 계획 → BGM 후보 → 박자를 맞춘 애니매틱+BGM 미리보기(PC 브라우저).

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` 기록 → 커밋·푸시(음원 제외). 다음은 4단계(디자인)이며 별도 구축 계획이 필요하다.
