# 스타일 모듈 19: Grainy Gradient — 김 서린 유리창

`styles/Styles-20.md` #19 Grainy Gradient(필름 질감을 얹은 그라데이션)를 "김 서린 유리창"으로 옮긴 모듈. 파일럿 `yoon-jongshin-concert-teaser` 4단계에서 사용자가 고르고 승인했다(2026-10-31).

## 무엇을 하나
- 창밖: 해 질 녘 그라데이션 하늘, 깊이가 다른 도시 네 겹(먼 겹일수록 흐리고 하늘색에 묻힘), 거리 불빛 보케. 초점은 유리에 있어 도시 전체가 살짝 흐리다.
- 유리: 흐린 창밖 + 우윳빛 막 + 결로(작은 점과 드문 큰 물방울), 필름 그레인(초당 12장), 옅은 비네트.
- 사건: 좁은 바람 자국(`trail`), 큰 바람(`sweep`: 닿기 직전 김이 밀리는 결, 닦인 자리의 바람 얼룩, 가장자리 물방울), 다시 서리는 김(`refog`), 흐르는 물방울(`droplet`), 글꼴 모양으로 닦여 드러나는 제목(`title`), 손가락 획(`writing`, 파일럿에서는 쓰지 않음).
- 정지 처리(idle: breathe): 김의 농도와 불빛만 진폭 2% 안에서 아주 작게 산다.

## 쓰는 법
컴포지션 폴더의 `assets/js/`로 `fog-glass.js`를 복사하고(`../` 금지), `hf-seek`에서 시각만으로 그린다.
```html
<canvas id="cv" width="1920" height="1080"></canvas>
<script src="assets/js/fog-glass.js"></script>
<script>
  const fg = FogGlass.create(document.getElementById('cv'), { seed: 7, sweep: { y: 0.5, r: 0.27 } });
  const renderAt = t => fg.render({ t, cam: { x: 0, y: 0, zoom: 1 }, sweep: { progress: Math.min(1, t / 3) } });
  window.addEventListener('hf-seek', e => renderAt(e.detail.time));
  renderAt(0);
</script>
```
- 글꼴 모양 제목은 글꼴 로드 뒤 `FogGlass.makeTitle(text, cssFont, tracking)`로 글리프를 만들고 `window.__hf.buildReady`에 그 promise를 등록한다(파일럿 `04_design/keycuts/handwriting/index.html` 참고).
- 좌표는 화면 비율(0~1). 카메라는 `{ x, y, zoom }`, 세계는 화면보다 상하좌우 12% 넓다.

## 파라미터(파일럿 값)
| 항목 | 값 |
|---|---|
| 하늘 | #22233a → #564760 → #b27b6a → #dda472 |
| 김 블러 / 막 | 34px / rgba(224,214,202,0.58) |
| 그레인 | overlay 16%, 타일 6장 |
| 큰 바람 | 스탬프 반지름 0.27~0.37H, 가로 1.7배, 닦인 자리에 김 10% 남음 |
| 불빛 강조색 | 호박색, "저녁 불빛"에만 |

## 버전 기록
- 2bf4aa3(5단계): 불빛에 켜짐 순서(ord)를 넣으며 같은 난수 흐름(rng)에서 값을 더 뽑아, 시드 7의 건물·김·바람 배치가 그 전과 달라졌다. 4단계 1차 키 컷(droplet, wind, handwriting)의 승인 당시 화면은 지금 사본으로 재현되지 않는다(참고용). 재승인된 4단계(sentence)와 5단계는 바뀐 뒤 화면 기준.
- 앞으로 렌더러에 난수 값을 더할 때는 별도 흐름(예: `prng(seed ^ 0x9e3779b9)`)을 써서 기존 배치를 밀지 않는다.
- `clear`(맑은 창)와 `lightsOn`(불빛이 차례로 켜짐)을 더했다.

## 알려진 한계
- 건물은 단순한 사각형이고 깊이·흐림으로 덮었다.
- 큰 바람의 앞쪽 가장자리는 부드러운 곡선이라 손으로 닦은 느낌이 조금 남는다.
- 세계 캔버스가 2381×1339이고 프레임마다 마스크를 다시 그려, 무거운 장면에서 미리보기가 느릴 수 있다.

## 사용자 판단 기록 (이 모듈과 관련)
- 종이 질감·파스텔 후보는 이 주제에서 "캐주얼"해 보여 제외(다른 주제에서는 후보로 계속 쓴다).
- 손가락 획 글씨와 글자 아래로 흐르는 물줄기는 "피 나는 것 같다"는 이유로 제외.
