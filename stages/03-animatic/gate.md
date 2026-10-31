# 3단계 게이트

## 승인 요청 전 확인
- [ ] `timing.before-retime.json`의 컷 수·길이가 `02_story.md` 컷 설계표와 같다.
- [ ] 무음 애니매틱 확인(질문 1)과 곡 선택(질문 3)이 `03_animatic.md`와 `taste/verdicts.md`에 있다.
- [ ] `music_plan.json`의 구간 길이 합이 영상 길이와 같고, 모든 구간이 최소 길이 이상이다.
- [ ] `retime` 경고(곡 길이 불일치, 옮기지 않은 경계)를 사용자에게 보여줬다.
- [ ] `npx hyperframes check "projects/<slug>/03_animatic"` 오류 0.
- [ ] `node scripts/manifest.mjs "projects/<slug>"` 통과.
- [ ] `git status`에 음원 파일이 없다.
- [ ] 점수를 매기거나 "좋다"고 스스로 인증하지 않았다.

## 사용자에게 보여줄 것
무음 애니매틱 → 음악 구간 계획 → BGM 후보 → 박자를 맞춘 애니매틱+BGM 미리보기(PC 브라우저).

## 승인 후
`status: approved`, `approved_at: YYYY-MM-DDTHH:MM` → `taste/verdicts.md` 기록 → 커밋·푸시(음원 제외). 다음은 4단계(디자인)이며 별도 구축 계획이 필요하다.
