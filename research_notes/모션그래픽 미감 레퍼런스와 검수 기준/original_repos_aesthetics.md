# 원래 참고한 모션그래픽 레포의 미감 규칙·자기 검수 절차와 우리 director 규칙의 빈 곳

조사일 2026-11-01. 로컬 원문이 우선이다. 경로는 레포 루트 기준이다.
- `mm/` = `vendor/motionmaxxing/` (Tejashmakwana/motionmaxxing 사본, 커밋 `8c8ec0f`)
- `hf/` = `node_modules/hyperframes/dist/skills/hyperframes/references/` (v0.8.221)
- `우리/` = `.claude/skills/director/`, `stages/`

비교 대상 영상은 지금 가장 최근 판인 `projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html`(3차, 글자 창 + Pexels, 2026-11-01)이다. 사용자가 "기준 이하"라고 판단한 영상이 이 판이라고 가정했다(확인 필요).

## 1. motionmaxxing과 HyperFrames 스킬은 모션, 컷 안 구성, 컷 사이 연결, 검수에 대해 어떤 구체 규칙(수치 포함)을 주는가

### Takeaway
두 원천 모두 형용사가 아니라 수치로 규칙을 준다. 진입은 감속하고 퇴장은 가속하며, 이징은 역할마다 다르게 쓴다. 장면 사이에 크로스페이드를 쓰지 않고, 컷은 움직이는 도중에 끊으며 한 물체를 넘겨 준다. 히어로는 하나이고 크기는 화면의 40% 이상이다. 2~4초마다 새로운 것이 나와야 하고, 같은 처리가 6초를 넘으면 낡아 보인다. 검수는 렌더에서 계산한 수치와 한 문장 묘사, 그리고 P0/P1/P2 목록으로 한다.

### Cited Findings
**(a) 모션 품질**
- 빠른 이동은 0.3~0.6초 걸리고 가장 빠른 프레임에서 모션 블러가 최대가 된다. 크기는 글자 크기 요소 6~12px, 화면 전체 15~20px이다. 이동 하나는 트윈 하나로 만든다. — [hf/motion.md "Moves"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- "Arrive slow, leave clean": 착지에는 꼬리가 긴 ease-out을 쓰고, 착지 시간이 떠나는 시간보다 길다. 퇴장은 한 번의 움직임으로 끝나며 "slide, stop, then leave"는 안 된다. — [hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 이징은 역할로 고른다. 착지는 `expo.out`·`power4.out`, 카메라와 색 범람은 `power2.inOut`, 줌 스루와 퇴장은 `power3.in`이다. "모든 것에 0.5초 `power2.out`"은 생성물처럼 보이는 평평한 기본값이다. — [hf/motion.md "Ease by role"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 퇴장은 진입보다 40~50% 짧다. 다음 요소는 앞 요소가 30~50% 진행됐을 때 시작한다. 글자 간격은 1프레임, 단어 간격은 60~120ms, 목록 항목 간격은 40~80ms다. — [hf/motion.md "Exits/Overlap/Stagger"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 착지한 제목은 완전히 멈춘다. 제목 진입 방식은 영화 안에서 바꾼다. 예: 단어별 `blur(6px)→0`과 opacity를 0.13초에 0.067초 간격, 회색에서 잉크로 0.07~0.1초 간격, 줄 전체 8px→0 0.13~0.2초. — [hf/motion.md "Titles"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 읽어야 하는 줄은 0.5초 + 단어당 0.3초를 머문다. 영화의 마지막 줄은 2초 이상이다. 그 뒤 블러 아웃과 페이드로 0.13~0.25초에 나간다. — [hf/motion.md "Holds"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 리듬은 속도를 대비시켜 만든다. 몽타주는 0.13~0.8초마다 컷하고, 샷 평균은 1.8~3초에 안쪽에 움직임을 둔다. 보상 전에 0.3~0.75초 멈춘다. — [hf/motion.md "Rhythm"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 생성물처럼 보이는 기본값: 제목·UI의 숨쉬기·떠다니기·맥박 루프, 착지 후에도 미끄러지거나 커지는 제목, "a slow creeping scale on a title or a slow push late in a scene", 모든 장면이 같은 방식으로 들어옴, 모든 요소가 페이드 + 위로 슬라이드. — [hf/motion.md "Defaults that look generated"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 같은 처리가 약 6초를 넘으면 낡아 보인다. 구간을 늘릴 때는 홀드나 새 처리를 넣고, 트윈을 느리게 하지 않는다. 읽을 단어는 최소 한 박 머문다. 박에 맞출 이동은 40~190ms 일찍 시작하고, 박 자체는 0ms `tl.set`이다. — [hf/film.md "On music"](node_modules/hyperframes/dist/skills/hyperframes/references/film.md)
- 측정 중앙값은 이동 10f(0.33초)다. 기본값은 translate·scale 진입 12f, opacity 6f, blur 7f, 퇴장 13~14f다. 20~30f ease-out을 모든 것에 쓰면 표본 전체보다 느리다. — [mm/references/motion.md R1.1](vendor/motionmaxxing/references/motion.md)
- 착지의 58%가 ease-out이다. 떠나는 이동의 37%(blur 퇴장은 63%)가 ease-in이고, 최고 속도는 t≈0.9에 온다. 진입은 처음 4~5f에 이동의 60~72%를 끝내고 0.4~0.6초 꼬리가 붙는다. — [mm/references/motion.md 1.3, R1.4, R1.5](vendor/motionmaxxing/references/motion.md)
- 들어올 때는 움직여야 한다(오프셋·스케일·블러 감소). opacity는 4~6f 보조로만 쓴다. 순수 opacity 페이드는 AI 기본값이다. — [mm/references/motion.md R1.6](vendor/motionmaxxing/references/motion.md)
- 형제 요소의 시작 간격은 1~3f이고 고르지 않게(3,2,2,2,2,2) 둔다. 각 이동은 간격의 약 2배 길이로 해서 꼬리가 겹치게 한다. — [mm/references/motion.md R1.8](vendor/motionmaxxing/references/motion.md)
- 오버슛은 이동의 8.8%에만 있고 늦게 작게 온다. 눈에 띄는 스프링은 영화에 한 번이다. — [mm/references/motion.md 1.6, R1.10~R1.11](vendor/motionmaxxing/references/motion.md)
- 정지 프레임 금지: 3f 넘게 멈추는 것에는 살아 있는 것 하나를 둔다. "designed breath"(0.6~1.5초, 이유를 적을 수 있고 보상 직전)는 권장한다. 사람이 만든 전체 영화의 움직임량 중앙값은 6.8(IQR 4.4~9.8)이다. — [mm/references/motion.md 1.7, R1.12](vendor/motionmaxxing/references/motion.md)
- 에너지 곡선: 가장 강한 프레임은 영화의 60~75% 지점에 하나 둔다. 그 앞은 비트가 짧아지며 올라간다(예 1.3/1.07/0.70/0.43초). 마지막은 가장 짧은 전환과 가장 오래 머무는 물체다. — [mm/references/director.md 6절](vendor/motionmaxxing/references/director.md)
- (온라인) onetake는 샷 길이를 4배 이상 차이 나게 한다(0.25초 단어 옆에 2.5초 홀드). 메트로놈처럼 컷하지 않는다. 프레임이 늘 움직이는 것도 금지한다(참고 영상은 34%가 완전 정지). 80px/f를 넘는 이동에 블러가 없으면 실패다. — [feitangyuan/onetake SKILL.md §1·§3·§6](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md)
- (온라인) charlie947 하우스 규칙: 손맛을 낼 때는 24fps에서 포즈마다 2프레임을 잡는다. 처음 3초가 훅이고, 첫 프레임이 비면 잘린다. 타자기 글자, 글로우, 바운스, 글자 그라데이션, 보라→파랑 배경은 금지다. — [charlie947/motion-graphics-skills README](https://github.com/charlie947/motion-graphics-skills)

**(b) 컷 안 구성**
- 샷의 히어로는 프레임 높이나 너비의 40% 이상을 채운다. 빈 프레임 가운데의 작은 물체는 샷이 아니다. — [hf/spec.md "Composition numbers"](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 샷마다 히어로 이동은 하나다. 보조 이동은 50~70% 거리를 가고, 100~200ms 늦게 시작하며, 나머지는 멈춘다. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 영화 전체에서 2~4초마다 새로운 것이 나온다. 음악이 있으면 마디마다 새 배치를 쓴다. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 읽을 글자는 1080에서 28px(짧은 변의 2.6%) 이상이고 0.5초 + 단어당 0.3초 머문다. 단어가 많으면 단어를 자르고 글자를 줄이지 않는다. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- BANNED by default: 어두운 공간 가운데 작은 요소가 떠 있는 바탕, 글로우·파티클, "everything centred; everything fading in at once; every element fading and sliding up", 읽는 동안 움직이는 글자, 착지 후 표류하는 제목, 장식용 모서리 라벨·프레임 테두리, 구석에 붙은 로고. 첫 렌더 뒤 영화가 쓴 기본값을 BANNED 줄에 더하며, 이 목록은 영화마다 늘어난다. — [hf/spec.md "BANNED by default"](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 제목 크기는 프레임 높이의 4~9%, 한두 줄이다. 조용한 줄은 2.5~4%, 히어로 단어는 너비의 60~90%를 채운다. 강조 단어 하나만 의미를 담은 액센트 색이다. — [hf/motion.md "Title size"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 어두운 바탕 위 화면 전체 선형 그라데이션은 H.264에서 계단이 진다. 5% 불투명도 액센트는 압축에서 사라지므로 분위기용은 15~25%로 쓴다. — [hf/look.md "Video facts"](node_modules/hyperframes/dist/skills/hyperframes/references/look.md)
- 한 줄 가운데 문장은 기준선 y 0.52~0.54, 잉크 폭 0.30~0.56W다. 마지막 제목은 x 0.46~0.47로 살짝 비키며, 정확한 중심은 템플릿으로 읽힌다. — [mm/references/layout.md R1.1, R1.2](vendor/motionmaxxing/references/layout.md)
- 히어로 1 + 보조 최대 2다. 잉크는 프레임 면적의 5~44%를 차지하지만, 빈 부분도 "무엇으로 만들어진" 바탕이어야 한다. — [mm/references/layout.md R3.1, R3.2](vendor/motionmaxxing/references/layout.md)
- 위계는 굵기가 아니라 역할별 크기로 만든다. 600은 워드마크에만 쓴다. 읽을 글자는 4% H 이상이다. — [mm/references/layout.md R4.1, R4.3](vendor/motionmaxxing/references/layout.md)
- 사라질 것은 페이드하지 않고 가린다. 페이드는 슬라이드 덱을 뜻한다. — [mm/references/layout.md R8.3](vendor/motionmaxxing/references/layout.md)
- 가장자리 자르기는 "보이는 것보다 더 있다"는 뜻이다. 거대한 잘린 단어는 영화에 한 번, 감속하는 도착으로만 쓴다. — [mm/references/layout.md R9.1~R9.6](vendor/motionmaxxing/references/layout.md)
- 레이아웃 슬롭 표: "Centre everything at exactly (0.50, 0.50)" 대신 문장 기준선 .52~.54, 마지막 제목 x .46~.47을 쓴다. 로고 밑 태그라인은 0~1줄, 0.05H, 옅은 회색이다. — [mm/references/layout.md "Slop tells for layout"](vendor/motionmaxxing/references/layout.md)

**(c) 컷 사이 연결**
- 한 영화에 전환은 3~5종을 쓰고, 각각 화면 위 무언가가 원인이어야 한다. 비트 사이 이음새 중 하드 컷은 최대 1/3이다. "worlds never crossfade into each other". — [hf/motion.md "Transitions with a cause"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 컷은 이동의 가장 빠른 프레임에서 하고, 양쪽의 방향과 속도를 맞춘다. — [hf/motion.md "Cuts"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 실측 전환 표가 있다. Dip cut(나가는 프레임을 3프레임 동안 약 40% 어둡게 한 뒤 하드 컷), Blur swap(0.13~0.2초에 8px 블러로 나가고 0.13초에 블러를 걷으며 들어옴, 바탕은 끊지 않음), Colour flood(히어로는 남고 바탕만 0.4초 `power2.inOut`) 등이다. — [hf/motion.md 표](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 사용자 말 대응표: "too fast"면 줌·팬만 0.7배 속도로 한다. "it feels like slides"면 화면 위 물체를 통해 다음 장면으로 들어가고, 이동 도중에 컷한다. — [hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 컷의 해부: A는 마지막 3~8f에 가속하고, 컷은 페이드 없이 1프레임이다. B의 첫 프레임은 이미 움직이고 있고 A의 벡터를 잇는다. 컷 쌍은 A 마지막 6f와 B 처음 6f를 함께 명세한다(물체, 위치 약 0.02 이내, 스케일, 색, 블러, 바탕, 속도). — [mm/references/transitions.md 1절, R1.1](vendor/motionmaxxing/references/transitions.md)
- 장면 사이 크로스페이드는 표본에 없다. 페이드는 단일 물체에만 쓴다. 블러를 맞춘 컷은 "exit ends at 18 px, entrance starts at 80 px, resolves in ~8 f"다. — [mm/references/transitions.md R3.2.1, 슬롭 표](vendor/motionmaxxing/references/transitions.md)
- 전환은 영화 안에 이미 있는 모양으로 만든다. 일반적인 와이프는 템플릿으로 읽힌다. 블러 문법은 하나만 쓴다. — [mm/references/transitions.md R3.2.5, R3.2.6](vendor/motionmaxxing/references/transitions.md)
- 바탕(어둠↔밝음)은 페이드로 바꾸지 않는다. 자라는 물체, 띠, 4f 회색 딥, 또는 떠나는 것에 맞춘 0.5~0.7초 색 램프로 바꾼다. — [mm/references/transitions.md 3.1, 슬롭 표](vendor/motionmaxxing/references/transitions.md); [mm/references/slop.md A7, D4](vendor/motionmaxxing/references/slop.md)
- 이음새마다 handoff를 계획한다. 운반 요소를 정하고, A의 마지막 1~3f 상태(x,y, %H, 속도 px/f, 블러 px, 바탕 hex, 글자)를 적고, B 0프레임을 그와 같게 한다. B에서는 다른 물체 하나가 0프레임에 이미 움직인다. 바탕이 다르면 무엇이 바꾸는지(번쩍임이 아님)를 적는다. — [mm/references/director.md 5절 "Handoff planning step"](vendor/motionmaxxing/references/director.md)
- (온라인) onetake: 모든 경계에서 무언가가 살아남아 다음 비트가 된다. "If nothing survives, it is a slide change". `display:none` 장면 교체는 금지다. `probe.py`의 carry 점수가 0.5 미만이면 실패이고, v1 0.00·v2 0.40은 거절, v3 0.75는 통과였다. — [onetake SKILL.md §3·§8](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md)

**(d) 검수**
- 이 내용은 2번 질문에서 자세히 다룬다. 요약하면 HF는 `check --json` 경고 → `snapshot --review` 시트 3장 → 한 문장 묘사 → 질문표 → `t · where · problem → change · what stays` P0/P1/P2 → `REVIEW.md` 순서다. mm은 G0~G5 게이트 → 한 문장 묘사 → 네 가지 보기 → 고치는 순서 → `NOTE.md` 순서다. — [hf/review.md](node_modules/hyperframes/dist/skills/hyperframes/references/review.md); [mm/references/slop.md Part 2](vendor/motionmaxxing/references/slop.md)
- GitHub의 최신 `review.md`(heygen-com/hyperframes main)는 로컬 0.8.221 판과 내용이 같다. — [heygen-com/hyperframes main review.md](https://raw.githubusercontent.com/heygen-com/hyperframes/main/skills/hyperframes/references/review.md)

### Inferences
- 원천끼리 충돌하는 지점이 셋 있다. (1) 엔드 홀드: mm은 1.4초 이하([mm/SKILL.md G3](vendor/motionmaxxing/SKILL.md)), HF는 마지막 줄 2초 이상·엔드 카드 2~3초 홀드([hf/story.md §4·§6](node_modules/hyperframes/dist/skills/hyperframes/references/story.md))다. (2) 제목 드리프트: mm은 정지 프레임 금지를 위해 1~2px/f 드리프트를 허용하고, HF는 착지 후 표류를 금지한다. (3) 정지 비율: onetake는 34% 완전 정지를 권장하고, mm은 늘 살아 있는 것 하나를 요구한다. 우리 `laws.md`는 (2)만 HF로 정했고([우리/references/laws.md "원천끼리 충돌"](.claude/skills/director/references/laws.md)), (1)·(3)은 정하지 않았다.
- 글자 창 영화에서는 "획 속 영상 재생" 자체가 살아 있는 것이다. HF는 이를 "Continuous motion that works: … footage playing"으로 인정한다([hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)). 그래서 제목에 크리프·드리프트를 따로 넣을 이유가 없다.

### Gaps
- Barty-Bart/motion-graphics는 README와 스킬 README에 수치 규칙이 거의 없다. 세부는 각 SKILL.md에 있을 것으로 보이며, 이번에는 읽지 못했다. — [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics), [explainer-engaging README](https://raw.githubusercontent.com/Barty-Bart/motion-graphics/main/skills/explainer-engaging/README.md)
- charlie947의 개별 SKILL.md(특히 `apple-design`의 "worst first" 감사 목록)는 읽지 못했다.

## 2. 원천이 정한 검수·비평 절차는 무엇이고, 우리가 실제로 하지 않는 부분은 어디인가

### Takeaway
원천의 검수는 세 단계다. 렌더에서 수치를 계산하고, 컷 띠·폰 시트·중간 프레임을 보고, 정해진 질문을 하나씩 던진다. 우리 리뷰는 이 셋을 하지 않는다. `snapshot --at` 16장을 위치 위주로 묘사하고, 사용자가 지적한 것을 고치는 데서 그친다. 지금 판(3차 글로우 키 컷)에는 REVIEW.md가 없다.

### Cited Findings
**HyperFrames review.md 절차**
- 1. 측정: `npx hyperframes check --json` 경고는 `line_unread`, `dead_stretch`(3초 넘게 변화 없음), `text_below_floor`(2.6%), `first_frame_empty`, `film_silent`(15초 넘는 무음)다. 의도한 홀드에는 `data-hold`를 단다. — [hf/review.md §1](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 2. `npx hyperframes snapshot --review`는 시트 3장을 쓴다. 장면 시작 직후와 중간, 각 `data-beat` 프레임, 모든 컷을 가로지르는 띠(−0.2초~+0.2초), 360px 폰 너비 비트 프레임이다. — [hf/review.md §1](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 3. 히어로 이동과 보상 주변은 `snapshot --range START,END --frames 8`로, 호·착지 경로는 `keyframes --shot`으로 본다. — [hf/review.md §1](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- "Trust the numbers over your eye": 잘린 라벨이나 0.6초짜리 줄은 컨택트 시트에서는 괜찮아 보인다. — [hf/review.md §1](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 비트 프레임마다 처음 보는 사람처럼 한 문장으로 **모든 물체를 이름 붙여** 묘사한다. 설명해야 하는 물체는 P0다. 프레임을 순서대로 읽으며 각 프레임이 다음을 일으키는지 본다. SPEC.md의 샷과 비교한다. 보이는 기본값을 모두 BANNED 줄에 더하고 먼저 고친다. — [hf/review.md §2](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 시트는 질문마다 한 번씩 본다. 그것으로 읽히는가, 피사체가 분리되는가, 프레이밍과 접촉, 처음 보는 시청자의 타이밍("everything moving at once on one curve" 포함), 티, 그림만으로(글자를 가리고) 서사가 읽히는가, 폰 시트에서 읽히는가. — [hf/review.md §2 표](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 노트는 한 줄 형식 `t=4.2s · where · problem → exact change · what stays`로 쓴다. P0는 읽기·계약을 깸 또는 히어로 샷의 티, P1은 영화를 약하게 함(죽은 구간, 약한 보상, 튀는 이음새), P2는 다듬기다. — [hf/review.md §3](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 고친 곳만 한 번 다시 찍는다. 점수는 매기지 않는다. 고친 것이 안 먹히면 문제 양쪽 프레임을 찍어 차이를 모두 적는다. 바빠 보이면 움직임의 1/3을 덜어낸다. 서브 에이전트에게 `STORYBOARD.md`와 시트 3장만 주고 P0·P1을 받는다("fresh pair of eyes"). 고치기 전에 커밋한다. — [hf/review.md §3](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- `REVIEW.md`에는 내린 창작 판단과 만들지 않은 스토리라인, 측정한 것과 눈으로만 본 것, 아무도 확인하지 않은 것, 가장 약한 샷과 시간이 더 있으면 바꿀 것, 의도적으로 남긴 경고와 이유를 쓴다. — [hf/review.md §4](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 의도를 눈대중 대신 단언으로 확인한다. 컴포지션 옆에 `<name>.motion.json`(`appearsBy`, `before`, `staysInFrame`, `keepsMoving`)을 두면 `check`가 `motion_frozen`·`motion_off_frame` 등을 오류로 낸다. — [hf/motion.md "Seeing motion"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- SPEC.md의 `QA:` 줄에는 확인할 프레임과 각 프레임이 보여야 할 것을 적는다. — [hf/spec.md 템플릿](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)

**motionmaxxing 절차**
- "How to see"는 순서가 있다. 1) 파일 안에 영화가 있는가(G0), 2) 스크린샷할 프레임이 하나 있는가, 3) 시트의 모든 프레임을 한 문장으로 묘사(무엇이 있나, 히어로는 무엇인가, 슬라이드로 통과할 것 같은가), 4) 같은 영상을 네 가지로 보기(썸네일 크기, 로고 가리기와 글자 가리기, 컷 2프레임 전과 전환 중간의 `mid.jpg`·`strips.jpg`, 실제 속도), 5) 고치는 순서(거짓·깨짐 → 아이디어 → 연결 → 위계 → 타이밍 → 표면 → 소리), 6) 스스로 인증하지 않기. — [mm/references/slop.md Part 2 "How to see"](vendor/motionmaxxing/references/slop.md)
- G0~G5 게이트는 렌더에서 계산한다. G0 렌더 존재, G1 증거 읽힘(0.04H, 0.55W), G2 빈 프레임 3f 초과 없음, G3 엔드 홀드 1.4초 이하·CTA 25% 이하, G4 프레임당 히어로 하나, G5 페이지 크롬 없음(`lint.mjs`). G1·G4는 눈으로 보고 그 사실을 적는다. "never estimate a number". — [mm/SKILL.md Gates](vendor/motionmaxxing/SKILL.md)
- 체크리스트 A~J. A1 장면 사이 opacity 크로스페이드, A2 컷 2f 전에 주요 물체가 0.01W 이상 움직임, A3 컷 뒤 첫 프레임이 0.02W 이상 변위, A4 같은 위치 0.03 이내의 물체·색·문자열 공유, A7 바탕이 페이드로 바뀜, B1 0.6초 넘게 아무것도 안 움직임, B3 진입 4~5f에 60~72%, B4 곡선 역할 4종 이상, B5 고른 stagger, C1 워드마크 밖의 굵은 글자, C3 opacity만으로 하는 헤드라인 진입, D4 어둠↔밝음 페이드, H2 페이드 투 블랙, I1 같은 비트 길이, I2 읽기 시간. — [mm/references/slop.md Part 2 A~J](vendor/motionmaxxing/references/slop.md)
- 계획 단계 점검으로 storyboard worksheet 체크 1~12가 있다. 비트 길이 90~210f, 모든 이음새에 운반 물체와 양끝 상태, "Picture with the text covered", 크롬 감사, "Decided or reached for?", 다른 브랜드 영화일 수 있는가. — [mm/references/director.md 7절](vendor/motionmaxxing/references/director.md)
- (온라인) onetake: 사람이 보기 전에 `verify_promo.py`를 돌린다. 리듬(같은 샷 길이, 완전 정지 구간 없음), 연속성(carry 0.5 미만), 곡선(80px/f 초과 무블러), 프레이밍(`__meta.inFrame` 요소가 화면 밖)이 실패 조건이다. 사람의 리뷰는 맨 마지막이다. — [onetake SKILL.md §8](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md)
- (온라인) charlie947: 내보내기 전에 모든 샷의 중간 프레임 하나씩을 보며 잘린 글자, 겹침, 틀린 사실을 확인한다. 측정하지 못하면 "not called done"이라고 적는다. — [charlie947 README house rule 6](https://github.com/charlie947/motion-graphics-skills)
- (온라인) awesome-claude-video-skills 비교 테스트는 16개 스킬 모두 재생·길이·글자 읽힘·움직임 4개 통과 검사를 통과했다. "How good a film looks is not scored." 비평 루프가 품질을 올렸다는 근거는 이 테스트에 없다. 운영 주체가 테스트를 직접 했다. — [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)

**우리가 실제로 한 것**
- 5단계 REVIEW.md(2·3차)는 "`snapshot --at` 16장 + 고친 뒤 4장"이다. `--review`(컷 띠·폰 시트)를 쓰지 않았다. — [projects/yoon-jongshin-concert-teaser/05_film/REVIEW.md](projects/yoon-jongshin-concert-teaser/05_film/REVIEW.md)
- 묘사는 "1.8~3.7초: … '서늘한'(왼쪽 아래)과 '바람처럼'(오른쪽 위)이 차례로 놓였다가…"처럼 위치와 사건만 적었다. 히어로, 슬라이드 여부, 모든 물체의 이름, 각 프레임이 다음을 일으키는지는 적지 않았다. — [05_film/REVIEW.md](projects/yoon-jongshin-concert-teaser/05_film/REVIEW.md)
- 3차 P0 두 건("한 글자씩", "가시성")은 모두 사용자가 먼저 지적한 것이다. 자가 점검 항목은 P1 3건(빈 구간, 배치 간격)뿐이다. — [05_film/REVIEW.md](projects/yoon-jongshin-concert-teaser/05_film/REVIEW.md), [feedback.md](projects/yoon-jongshin-concert-teaser/feedback.md)
- 현재 3차 판 `04_design/keycuts/glow/`에는 `index.html`, `timing.json`, `assets`만 있고 REVIEW.md가 없다. 4단계 게이트는 시트 리뷰를 요구하지 않는다(check 오류 0, never-ship, 시각 일치만). — [stages/04-design/gate.md](stages/04-design/gate.md)
- 15초 키 모션의 흰 덩어리 프레임과 HDR 합성 때문에 글자 창이 깨진 문제는 원격 렌더 뒤 사용자 지적("텍스트 표기 구성 자체에 지금 오류가 있는 거 같은데")으로 드러났다. 3단계 승인 때 본 렌더본도 같은 방식으로 깨져 있었다. — [projects/yoon-jongshin-concert-teaser/04_design.md "남은 문제"](projects/yoon-jongshin-concert-teaser/04_design.md)
- `film-qa.mjs`의 엔드 홀드와 카피 창 검사는 컴포지션 안 손으로 적은 `qa` 블록을 읽는다. 렌더를 측정하지 않는다. 05_film.md도 "영상과 어긋나도 film-qa가 잡지 못한다"고 적었다. — [scripts/film-qa.mjs](scripts/film-qa.mjs), [05_film.md "남은 문제"](projects/yoon-jongshin-concert-teaser/05_film.md)
- `vendor/motionmaxxing`에는 `runtime/motion.js`만 있고 `scripts/`(look.py, lint.mjs, render.mjs)가 없다. 그래서 mm 게이트 G0·G2·G3(look.py)와 G5(lint.mjs)를 계산할 도구가 이 레포에 없다. — `ls vendor/motionmaxxing` 결과(LICENSE, NOTICE, SKILL.md, references, runtime)

### Inferences
우리가 빼먹은 절차를 우선순위대로 적는다.
1. 컷 띠 시트(±0.2초)와 히어로 이동 `--range --frames 8`. 15초 흰 덩어리와 19.5초 블러 비대칭 같은 이음새 문제는 이것으로만 보인다.
2. 글자 가리기(그림만으로) 검사를 렌더에서 하는 것. 2단계 표에서 머릿속으로만 했다(3번 질문 참조).
3. "처음 보는 사람 + 모든 물체 이름 + 슬라이드인가" 형식의 묘사.
4. 기본값 이름 붙이기와 BANNED 줄. 영화마다 늘어나는 누적 목록이 우리에게는 없다. `taste/verdicts.md`는 사용자 거절을 기록하지만, 자가 발견한 기본값 목록은 아니다.
5. 폰 360px 시트.
6. `.motion.json` 단언.
7. fresh-eyes 서브 에이전트 리뷰.
8. REVIEW.md의 "가장 약한 샷", "측정한 것과 눈으로만 본 것".
9. 렌더에서 계산한 엔드 홀드·정지 구간. `final-qa`는 6단계에만 있다.

### Gaps
- `npx hyperframes snapshot --review`가 0.8.221 CLI에서 실제로 컷 띠와 폰 시트를 만드는지는 실행해 보지 않았다(문서는 로컬 판에 있음).
- `check --json`의 `dead_stretch`가 글자 창 안 영상 재생을 "변화"로 세는지는 확인하지 않았다.

## 3. 우리 30초 티저가 어겼을 가능성이 큰 규칙 (구체적으로)

### Takeaway
코드를 보면 여섯 가지가 걸린다. (1) 4컷 문장과 공연 정보는 모두 "y 오프셋 + opacity 0→1 + 블러, power2.out"으로 들어온다. 생성물 기본값인 페이드 + 위로 슬라이드다. (2) 1·3컷 제목은 몇 초 동안 느리게 크리프하고, 2컷 제목은 착지 뒤에도 표류한다. (3) 15초와 24초에 마스크색·틴트·그림자·베일이 동시에 페이드되어 세계가 크로스페이드된다. (4) 컷 길이가 4.5/4.5/6/4.5/4.5/6초로 거의 같다. (5) 제목과 정보가 대부분 정중앙에 놓인다. (6) 엔드 홀드가 약 2.2초다. 그리고 글자를 가리면 0~15초는 어두운 바탕만 남는다.

### Cited Findings (코드 위치는 `projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html` 줄 번호)
- 4컷 단어 진입은 `fromTo(s, { y: 24, opacity: 0, filter: 'blur(6px)' }, { … duration: 0.75, ease: 'power2.out' })`(119줄)다. 공연 정보 진입은 `{ y: 16, opacity: 0 } → … 0.6, 'power2.out'`(136줄)이다. 이것은 우리 never-ship이 직접 금지한 "모든 글자에 같은 작은 슬라이드 인(24px, 4~6px 블러…)"([우리/references/never-ship.md](.claude/skills/director/references/never-ship.md))이다. HF BANNED "every element fading and sliding up"([hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md))과 mm C3 "opacity 페이드 진입"([mm/references/slop.md](vendor/motionmaxxing/references/slop.md))에도 걸린다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 문장 퇴장은 `to(['#msg','#voice'], { y: -60, opacity: 0, duration: 0.9, ease: 'power2.in' })`(125줄)로 페이드 + 슬라이드다. HF 기준은 블러 아웃 0.13~0.25초 또는 장면 이동과 함께 나가는 것이고([hf/motion.md "Holds"](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)), 0.9초는 그 3.6~7배다. 목소리 선 진입도 opacity 0→1 0.6초 페이드다(121줄). — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 1컷 "서늘한"은 `scale 0.94→1.0, 4.0초, power1.out`(96줄), 3컷 "스며드는"은 `scale 0.96→1.02, 약 5.65초, ease 'none'`(106줄)이다. 5컷 `#footage`는 `scale 1→1.05, 4.4초, 'none'`(124줄)이다. HF "a slow creeping scale on a title or a slow push late in a scene"([hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md))과 우리 never-ship "장면 끝의 느린 크리프 스케일 금지"에 해당한다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 2컷 "바람처럼"은 1.2초에 착지한 뒤 `x: 160`을 `ease 'none'`으로 약 3.3초 동안 계속 민다(102줄, 30fps에서 약 1.6px/f). 우리 laws.md는 "착지한 제목은 완전히 멈춘다(기본값 HyperFrames)"로 정했다. 자기 규칙 위반이다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [우리/references/laws.md](.claude/skills/director/references/laws.md)
- 15초 키 모션(14.695~15.645초)은 이렇다. `#t3 scale 9 (0.8초 power3.in)`, `#mask backgroundColor → #fff (0.45초)`, `#tint opacity 0 (0.45초)`, `#shade opacity 0 (0.6초)`, 위아래 띠 `scaleY 0 (0.7초)`, `#veil opacity 1 (0.8초)`(108~114줄). 0.5초 안에 다섯 층이 동시에 opacity·색으로 바뀐다. HF "worlds never crossfade into each other"([hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)), mm A7·D4(바탕이 페이드로 바뀜), HF 리뷰 질문 "everything moving at once on one curve"에 걸린다. 04_design.md는 "15.2초 전후 '스며드는' 획이 화면을 덮으며 흰 덩어리처럼 보이는 프레임"을 남은 문제로 적었다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [04_design.md](projects/yoon-jongshin-concert-teaser/04_design.md)
- 24초 "가을냄새"는 `scale 9→1, 1.5초 power3.out`(129줄)이다. mm 법칙 7 "Arrival decelerates from oversize"에 맞다. 다만 같은 순간 바탕이 `#mask → #000 (0.5초)`와 `#tint opacity 1 (0.6초)`(130~131줄)의 페이드로 돌아온다(mm A7·D4). — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 4→5 컷(19.545초)에서는 커튼에 `blur 0→18px, 0.5초 power2.in`(123줄)을 건다. 그런데 도시 불빛 영상은 블러 없이 시작한다(48줄, filter는 밝기·채도뿐). mm 블러 맞춘 컷은 "exit ends at 18 px, entrance starts at 80 px, resolves in ~8 f"로 양쪽을 다 요구한다([mm/references/transitions.md 슬롭 표](vendor/motionmaxxing/references/transitions.md)). 우리는 한쪽만 있어서 튈 가능성이 있다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 컷 경계는 0/4.545/9.045/15.045/19.545/24.0/30이고(71줄), 길이는 4.545/4.5/6.0/4.5/4.455/6.0초다. 최장/최단 = 1.35배다. mm I1 "Equal beat lengths?"·Tm1 "비트는 짧아지다가 마지막이 머문다", onetake "Vary shot length by ≥ 4×", HF "shots average 1.8–3 s"에 모두 못 미친다. 2단계 컷 설계표에도 4.5/4.5/6.0/4.5/4.5/6.0으로 계획되어 있었다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [02_story.md 컷 설계표 3차](projects/yoon-jongshin-concert-teaser/02_story.md), [mm/references/slop.md I1](vendor/motionmaxxing/references/slop.md), [onetake §3](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md), [hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- 3컷(9.045~14.695초)은 세로 "스며드는" 190px(17.6% H) 한 단어가 약 5.65초 동안 선형 크리프만 한다. HF "Something new every 2–4 s"와 "Any single treatment goes stale after about 6 s"에 닿는다. 0~4.5초도 "서늘한" 한 단어다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md), [hf/film.md](node_modules/hyperframes/dist/skills/hyperframes/references/film.md)
- 세로 "스며드는"은 위아래 띠(각 138px) 안 804px에 들어가야 해서 190px보다 키울 수 없다. 획 속 영상이 거의 보이지 않고 흰 글자처럼 읽힌다. HF 히어로 40% 규칙과 HF BANNED "어두운 공간에 작은 요소"에 닿는다. — [04_design.md "남은 문제"](projects/yoon-jongshin-concert-teaser/04_design.md), [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 배치: "서늘한" `left:50%;top:50%`, "가을냄새" `left:50%;top:46%`(51·54줄), 문장 `.line { left:0; right:0; text-align:center }` `#msg top:45%`(26~27줄), 공연 정보 세 줄 가운데 71/77/83%(63~65줄). mm R1.2 "마지막 제목 x 0.46~0.47"과 HF BANNED "everything centred"에 걸린다. 2·3컷(58%, 64%)만 중심에서 비켜 있다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [mm/references/layout.md R1.2](vendor/motionmaxxing/references/layout.md)
- 마지막 컷은 "가을냄새" 아래 가운데 정렬 정보 세 줄(공연명, 기간, 도시 일곱)이다. 크기는 3.7%·3.1% H로 mm의 읽을 글자 4% H보다 작다(04_design.md 경고). 제목 + 정보 세 줄 스택은 mm never-ship 10 "web-footer ending"과 H5 "Tagline under the logo?"에 가까운 꼴이다. — [04_design.md](projects/yoon-jongshin-concert-teaser/04_design.md), [mm/SKILL.md never-ship 10](vendor/motionmaxxing/SKILL.md), [mm/references/slop.md H5](vendor/motionmaxxing/references/slop.md)
- 엔드 홀드: 마지막 정보 줄이 27.795초에 착지하고(`T.info 26.295 + 0.75×2`, 134~136줄) 30초까지 약 2.2초 정지한다. 2단계 표는 "약 1.5초"였다. 어느 쪽이든 mm G3 1.4초 이하를 넘는다. 단 HF 기준(마지막 줄 ≥2초)과는 충돌이 있다(1번 질문 Inferences). — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [02_story.md](projects/yoon-jongshin-concert-teaser/02_story.md)
- 굵기: 큰 글자, 문장, "가을냄새"가 모두 700이고 공연 줄은 600이다(04_design.md 토큰, REVIEW 3차). mm C1 "워드마크 밖의 굵은 글자"와 R4.1 "위계는 크기로"에 닿는다. 고운바탕은 400·700만 있어서 굵기 선택 폭이 좁다. — [04_design.md](projects/yoon-jongshin-concert-teaser/04_design.md), [mm/references/slop.md C1](vendor/motionmaxxing/references/slop.md)
- 이징: 쓰인 곡선은 GSAP 내장 `power1.out`, `power2.out`, `power2.in`, `power2.inOut`, `power3.in`, `power3.out`, `none`뿐이다. director SKILL.md가 요구한 `motion.js` 실측 이징(snapSettle, softLand, accelExit 등)은 하나도 쓰이지 않았다. 글자 진입은 모두 power2/power3.out 계열이라 mm B3 "처음 4~5f에 60~72%"를 만족하는지 측정한 적이 없다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [우리/SKILL.md "HyperFrames에서 구현할 때"](.claude/skills/director/SKILL.md)
- 목소리 선은 "BGM의 프레임별 크기… 음원이 아니라 측정값"으로 그린다(72줄 주석). 화면에는 "목소리" 선으로 나오지만 데이터는 피아노+현악 BGM이다. HF 리뷰는 "an object you would have to explain … is a P0"라고 한다. — [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html), [hf/review.md §2](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- 글자를 가린 그림: 0~15초는 영상이 글자 획 안에서만 보인다(설계 "가을 영상은 글자 획 안에서만 보인다"). 글자를 가리면 어두운 바탕 #12161d→#1c1611과 9% 나뭇잎 그림자만 남는다. 2단계 점검은 "글자를 가린 그림: 1 해 질 녘 억새, 2·3 호박빛 햇살 든 커튼…"이라고 적어 이를 통과로 처리했다. mm W1 "Is it a slide?"와 HF "The pictures alone"을 렌더에서 하면 0~15초가 걸린다. — [02_story.md 스토리라인 C, 점검](projects/yoon-jongshin-concert-teaser/02_story.md), [glow/index.html 22줄 `#shade opacity 0.09`](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- 위아래 띠(레터박스)는 HF BANNED "frame borders … as decoration"과 겉모양이 같다. "15초에 열린다"는 서사 역할을 한 문장으로 적어 둬야 하는 경우다. 그런데 이 띠 때문에 3컷 세로 글자를 키우지 못하는 제약도 생겼다. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md), [04_design.md](projects/yoon-jongshin-concert-teaser/04_design.md)
- 지킨 것: 가장 강한 프레임이 18.045초(60%)로 mm 60~75% 안에 있다. 중요도 3은 1/6(17%)이다. 2→3은 같은 커튼 영상 위 1프레임 단어 교체(T19)다. 1→2는 블러 12px로 오른쪽 가속 퇴장 → 같은 방향 감속 진입이다. 24초 "가을냄새"는 오버사이즈에서 감속하며 도착한다. — [02_story.md 점검](projects/yoon-jongshin-concert-teaser/02_story.md), [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)

### Inferences
- 사용자가 말한 "모션 효과·배치·컷 구성 전반이 기준 이하"는 위 목록과 대체로 겹친다. 모션은 같은 페이드 + 슬라이드와 크리프다. 배치는 정중앙과 작은 세로 글자, 정보 스택이다. 컷 구성은 같은 길이와 동시 페이드로 처리한 세계 전환이다. 다만 사용자가 어느 장면을 두고 말했는지는 확인하지 않았다.
- 15초 키 모션은 한 물체(글자 마스크)가 자라 화면이 되는 "Object becomes the world"(HF: 0.65초 ease-in-out, 주변은 약 15px 블러 + 0.3초 페이드, 새 내용은 자라는 동안 들어옴)로 다시 짤 수 있다. 실측 레시피가 HF motion.md 전환 표에 있다.
- 바탕 페이드(mask #fff/#000, tint opacity)가 "글자 창" 기법의 구현상 필요에서 나왔을 수 있다. 그렇다면 규칙 위반이라기보다 구현 기법이 연출 규칙과 충돌하는 지점이다. 4·5단계에서 해법(예: 마스크 크기 자체로 전환, 색 범람은 떠나는 물체에 맞춘 0.5~0.7초 램프)을 정해야 한다.

### Gaps
- 렌더 MP4를 프레임 단위로 측정하지 않았다(이번 과제는 파일 읽기). 실제 컷 2프레임 전·후 변위, 정지 구간 길이, 진입 곡선의 4~5f 이동 비율은 측정값이 없다.
- 05_film(2차 구성, 승인됨)과 04_design 글로우(3차) 중 어느 판을 사용자가 평가했는지 확정하지 못했다. 위 위반은 3차 기준이다.

## 4. 우리 director 규칙에서 빠졌거나 모호하거나 집행되지 않는 것

### Takeaway
director의 규칙 문장은 대부분 mm에서 옮겨 왔고 수치도 있다. 문제는 집행이다. 게이트가 그 규칙을 렌더에서 확인하지 않는다. 그리고 HF의 구성·리듬 수치 몇 개(히어로 40%, 2~4초마다 새것, 6초 낡음, 보조 이동 50~70%·100~200ms, 하드 컷 1/3 이하, 전환 3~5종)와 검수 절차(컷 띠, 폰 시트, BANNED 누적, fresh-eyes)는 아예 없거나 게이트에 연결되지 않았다.

### Cited Findings
**규칙은 있는데 집행이 안 되는 것**
- 우리 never-ship에는 "모든 글자에 같은 작은 슬라이드 인(24px, 4~6px 블러) 금지", "장면 끝의 느린 크리프 스케일 금지", "장면 사이 불투명도 크로스페이드 금지"가 이미 있다. 현재 컴포지션은 셋 다 쓴다(3번 질문). 4·5단계 게이트의 never-ship 항목은 체크박스 자기 확인이고 코드나 렌더를 검사하지 않는다. — [우리/references/never-ship.md](.claude/skills/director/references/never-ship.md), [stages/04-design/gate.md](stages/04-design/gate.md), [stages/05-motion/gate.md](stages/05-motion/gate.md)
- director SKILL.md: "이징과 길이는 `tokens/motion.json`의 값에서 고른다", "실측 이징은 `motion.js`의 수식을 GSAP 커스텀 이징 함수로 옮겨 쓴다". 글로우 키 컷은 GSAP 내장만 쓴다. 이를 검사하는 스크립트는 없다(`design-tokens.mjs`, `keycut.mjs`가 motion.json을 참조하지만 컴포지션 이징 사용은 보지 않는 것으로 보임 — 미확인). — [우리/SKILL.md](.claude/skills/director/SKILL.md), [glow/index.html](projects/yoon-jongshin-concert-teaser/04_design/keycuts/glow/index.html)
- laws.md "착지한 제목은 완전히 멈춘다"가 있는데 2컷 제목은 표류한다. — [우리/references/laws.md](.claude/skills/director/references/laws.md)
- 2단계 게이트 "모든 컷의 연결(서사)·연결(디자인)이 채워졌다"는 칸을 채웠는지만 본다. 렌더에서 A 끝·B 첫 상태가 같은지(mm A4: 0.03 이내)는 어느 게이트도 확인하지 않는다. — [stages/02-story/gate.md](stages/02-story/gate.md), [mm/references/slop.md A4](vendor/motionmaxxing/references/slop.md)
- 엔드 홀드 0.6~1.4초는 `film-qa`가 손으로 적은 `qa` 블록에서 읽는다. mm never-ship 11 "gates claimed without script numbers"와 같은 구조다. — [scripts/film-qa.mjs](scripts/film-qa.mjs), [mm/SKILL.md never-ship 11](vendor/motionmaxxing/SKILL.md)
- composition.md에 "360px 폰 너비 시트에서 읽혀야 한다"가 있지만, 그 시트를 만드는 `snapshot --review`는 어느 게이트·템플릿에도 없다(grep `--review`, `snapshot` 결과 director·stages에 0건). — [우리/references/composition.md](.claude/skills/director/references/composition.md)
- 5단계 게이트 "모든 시트 프레임을 한 문장으로 묘사"는 있다. 그런데 묘사 형식(히어로, 모든 물체 이름, 슬라이드인가, 다음을 일으키는가)이 정해져 있지 않아 위치 서술로 끝났다. — [stages/05-motion/gate.md](stages/05-motion/gate.md), [05_film/REVIEW.md](projects/yoon-jongshin-concert-teaser/05_film/REVIEW.md)
- "글자를 가린 그림"은 narrative.md에서 "머릿속으로 적어 본다"이고 never-ship에서 "시트의 글자를 손으로 가린다"다. 2단계에서 머릿속으로만 하고 렌더에서는 하지 않아, 글자 창 기법의 0~15초 빈 바탕을 놓쳤다. — [우리/references/narrative.md 81줄](.claude/skills/director/references/narrative.md), [우리/references/never-ship.md](.claude/skills/director/references/never-ship.md)

**아예 없는 규칙** (director·stages grep으로 확인)
- 히어로가 프레임 높이·너비의 40% 이상(HF spec.md). `40%` 0건. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 보조 이동 50~70% 거리, 100~200ms 늦게, 나머지 정지(HF spec.md). `50~70`·`100~200` 0건. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- 2~4초마다 새것, 마디마다 새 배치(HF spec.md), 같은 처리 6초면 낡음(HF film.md). `2~4초` 0건. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md), [hf/film.md](node_modules/hyperframes/dist/skills/hyperframes/references/film.md)
- 샷 길이 차이 비율(onetake ≥4×). director 게이트는 길이 합만 본다(2단계 "±10%"). — [stages/02-story/gate.md](stages/02-story/gate.md), [onetake §3](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md)
- `data-hold`로 의도한 홀드 표시, `.motion.json` 단언, `keyframes --shot`, `snapshot --range --frames 8`. 각각 0건. — [hf/review.md](node_modules/hyperframes/dist/skills/hyperframes/references/review.md), [hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- BANNED 줄(영화마다 누적되는 기본값 목록)과 SPEC.md의 `QA:` 줄(확인할 프레임과 보여야 할 것). `BANNED` 0건. — [hf/spec.md](node_modules/hyperframes/dist/skills/hyperframes/references/spec.md)
- fresh-eyes 서브 에이전트 리뷰(STORYBOARD + 시트 3장만 주고 P0/P1 받기). `서브 에이전트` 0건. — [hf/review.md §3](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- mm 네 가지 보기 중 썸네일 크기와 중간 프레임(컷 2프레임 전, 전환 중간). `썸네일`·`mid` 0건. — [mm/references/slop.md Part 2](vendor/motionmaxxing/references/slop.md)
- 바탕(세계) 전환을 페이드로 하지 않는다는 체크(mm A7·D4). connection.md에 크로스페이드 절은 있지만, 마스크색·틴트 같은 바탕 페이드를 따로 다루지는 않는다(`세계끼리` 0건). — [우리/references/connection.md "크로스페이드와 페이드"](.claude/skills/director/references/connection.md), [mm/references/slop.md A7, D4](vendor/motionmaxxing/references/slop.md)
- 사용자 말 → 수정 대응표("too fast", "feels like slides", "the titles move")가 우리에게 없다. — [hf/motion.md](node_modules/hyperframes/dist/skills/hyperframes/references/motion.md)
- REVIEW.md 필수 항목: 가장 약한 샷, 측정한 것과 눈으로만 본 것, 만들지 않은 스토리라인, 의도적으로 남긴 경고. 5단계 템플릿에는 "P0/P1/P2 개수, 고친 것"만 있다. — [stages/05-motion/template.md](stages/05-motion/template.md), [hf/review.md §4](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)
- "바빠 보이면 움직임 1/3 제거", "고친 것이 안 먹히면 양쪽 프레임 차이를 모두 적고 한 줄만 고친다". — [hf/review.md §3](node_modules/hyperframes/dist/skills/hyperframes/references/review.md)

**모호하거나 정하지 않은 것**
- 엔드 홀드: mm 0.6~1.4초를 film-qa 오류로 쓰지만, HF는 마지막 줄 2초 이상·엔드 카드 2~3초다. 정보 세 줄을 읽게 하려면 2초 넘게 필요한데, 둘 중 무엇을 따를지 laws.md "원천끼리 충돌"에 없다. — [우리/references/laws.md](.claude/skills/director/references/laws.md), [hf/story.md §4·§6](node_modules/hyperframes/dist/skills/hyperframes/references/story.md)
- 정지 비율: mm "no dead frame"과 onetake "Never let the frame be always in motion"(34% 정지) 중 무엇을 따를지 정하지 않았다. 그 결과 "살아 있는 것 하나" 규칙이 제목 크리프로 구현됐다. — [mm/references/motion.md R1.12](vendor/motionmaxxing/references/motion.md), [onetake §1](https://raw.githubusercontent.com/feitangyuan/onetake/main/SKILL.md)
- "하우스 스타일(글자 안의 질감)은 아이디어일 때만" 예외를 2단계 3차에서 승인했다. 하지만 mm은 이 예외를 쓸 때 "spend scale once"와 거대 단어를 한 번만 쓰라고 한다. 우리 영상은 41.7% H 거대 단어(서늘한·바람처럼)와 33% "가을냄새", 9배 스케일 다이브 두 번으로 스케일을 여러 번 썼다. 예외의 상한이 규칙에 없다. — [04_design.md "규칙 충돌과 결정"](projects/yoon-jongshin-concert-teaser/04_design.md), [mm/references/layout.md R9.6](vendor/motionmaxxing/references/layout.md), [mm/references/director.md 6절 "spending scale"](vendor/motionmaxxing/references/director.md)
- 한국어 세리프(고운바탕 400/700만 있음)로는 mm C1 "굵기 ≤550"을 지킬 수 없다. 이 충돌의 기본값이 없다. — [04_design.md](projects/yoon-jongshin-concert-teaser/04_design.md), [mm/references/slop.md C1](vendor/motionmaxxing/references/slop.md)
- mm의 계산 게이트(G0·G2·G3·G5)를 원문에서 옮겨 왔지만, 그 도구(look.py, lint.mjs)는 이 레포에 없다. 대체할 HF 도구(`check --json`, `snapshot --review`)도 게이트에 없다. — `vendor/motionmaxxing/` 목록, [우리/references/never-ship.md](.claude/skills/director/references/never-ship.md)

### Inferences
게이트에 넣을 최소 변경 후보(제안, 사용자 승인 필요):
1. 4·5단계 게이트에 `npx hyperframes check --json`(경고 목록 인용)과 `snapshot --review`(시트 3장 경로 기록)를 필수로 넣는다.
2. REVIEW.md 템플릿을 HF §2·§4 형식으로 바꾼다. 프레임마다 "히어로 / 모든 물체 / 슬라이드인가 / 다음을 일으키나", 질문표 7행, `t · where · problem → change · what stays`, 가장 약한 샷, 측정한 것과 본 것을 둔다.
3. 프로젝트 BANNED 누적 목록을 만든다(`taste/`나 프로젝트 SPEC 줄).
4. 2단계 게이트에 샷 길이 비율(예: 최장/최단 ≥ 2~4배)과 "2~4초마다 새것"을 넣는다.
5. 컴포지션 grep 검사를 추가한다. 글자 요소의 `opacity: 0` + `y` 같은 진입 반복, 착지 뒤 `ease:'none'` 이동, 바탕 요소의 opacity·색 트윈을 경고로 낸다. mm `lint.mjs` 역할을 일부 대신한다.
6. 엔드 홀드는 렌더에서 측정한다(`final-qa`의 정지 구간 측정을 5단계로 당김).
7. fresh-eyes 서브 에이전트 리뷰를 5단계 게이트 선택 항목으로 넣는다.
위 항목 중 무엇을 넣을지는 사용자가 정한다. 이 노트는 파일을 바꾸지 않았다.

### Gaps
- `scripts/keycut.mjs`, `scripts/design-tokens.mjs`가 컴포지션의 이징 사용까지 검사하는지는 소스를 끝까지 읽지 않아 확인하지 못했다.
- mm 판정(같은 비트 길이, 페이드 금지)이 감성 발라드 티저에도 그대로 맞는지는 원천도 조건부로 둔다. mm judgment.md 8절 "calm brands may fade", 사람이 만든 51편 중 22편이 조용히 끝남. 윤종신 "가을냄새"가 "calm brand" 조건에 해당하는지는 사용자 판단이 필요하다. — [mm/references/judgment.md 8절](vendor/motionmaxxing/references/judgment.md)
