---
stage: 6
status: approved
approved_at: 2026-11-01T20:35
---

# 최종: 윤종신 콘서트 예고

납품 노트: `06_final/NOTE.md` (final-qa 수치 인용, 경고, 한계)

## 렌더
- run: https://github.com/wjdals8506-svg/motion-studio/actions/runs/41301979470, 렌더한 커밋 0967595, 화질 delivery
- 무음 MP4: `media/yoon-jongshin-concert-teaser/render/out.mp4` (1920×1080, h264, 30.0초). 렌더 시트가 HTML 미리보기와 같음, qc 정지·검은 화면 없음

## 소리
- 음량 목표: −14 LUFS (질문 1 사용자 "−14 LUFS", 2026-11-01). 비교용으로 보낸 두 판:
  - −14 LUFS 판: `media/yoon-jongshin-concert-teaser/final-14.mp4` — 섞은 소리 −19.8 LUFS / 피크 −6.6 dBFS → 이득 +5.8 dB, 리미터 있음 → 측정 −14.0 LUFS, 피크 −1.5 dBTP
  - 승인 때 들은 음량 판: `media/yoon-jongshin-concert-teaser/final-keep.mp4` — 이득 0, 리미터 없음 → 측정 −19.8 LUFS, 피크 −6.6 dBTP
- 휴대폰 확인용 사본: 납품본(34MB)이 원격 전송 한도 30MB를 넘어, 같은 화면의 미리보기 화질 원격 렌더(run 41300715621)에 같은 음량 처리를 한 `확인용-음량-14LUFS.mp4`·`확인용-음량-승인때.mp4`(각 약 11MB)를 보냄. PC에서 영상 재인코딩 없음.
- 합치기: `node scripts/mux-audio.mjs "projects/yoon-jongshin-concert-teaser" --video media/yoon-jongshin-concert-teaser/render/out.mp4 --lufs <-14|keep> --out …` (영상 `-c:v copy`)

## 완성본
- `media/yoon-jongshin-concert-teaser/final.mp4` (커밋하지 않음, = final-14.mp4), sha256 0b35fc7e664ac70bb5b05a458412e8363a347c01468a7fe6ea2251a3036e4def, 보낸 날 2026-11-01. final-qa 오류 0(−14.0 LUFS, 피크 −1.5 dBTP)

## 마지막 확인
- 질문 2 "미리보기와 다르게 보이거나 들리는 곳": "없음, 승인" (2026-11-01). 반영할 것 없음.

## 남은 문제
- 9~12초 카트리지 접사는 다른 컷보다 밝고 뿌옇고, 그 위 글자 대비가 가장 낮다(휴대폰 폭).
- 5초 풀이 가장 밝은 컷이다. 첫 장면 헤드셸의 동전, 카트리지의 "DN 241" 각인, 첫·끝 턴테이블이 다른 기기인 것, 공연 그림이 15초부터인 것은 그대로다.
- 이 파일럿은 스톡 영상에 글자를 얹은 단순한 구조다. 다음 제작의 기준이 아니다(사용자 원칙 2026-11-01).
