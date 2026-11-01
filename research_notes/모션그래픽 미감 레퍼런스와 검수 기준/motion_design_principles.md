# 모션 디자인 원칙: 공식 디자인 시스템·애니메이션 고전·모션 교육자 기준 정리

> 조사일 2026-11-01. 대상: 30초 한국어 콘서트 티저(HTML+GSAP, HyperFrames). 큰 세리프 단어가 스톡 영상을 비추는 창, 80 BPM에 약 4.5초마다 컷, 15초 획 속 푸시인, 한 줄 메시지, 마지막 타이틀과 정보 카드.
> 표기: **[UI 전용]** = 화면 조작 반응용이라 영상에 그대로 옮기면 안 됨, **[영상 적용]** = 영상에도 그대로 쓸 수 있음, **[변환 적용]** = 원리는 쓰되 수치는 영상용으로 늘려야 함.
> 이번 조사에서 m3.material.io, m2.material.io, ibm.com/design 페이지는 JS 렌더링 때문에 본문을 읽지 못했다. Material 수치는 Google 공식 GitHub 문서(material-components-android)에서 가져왔다.

## 1. 주요 디자인 시스템(Material 3, Apple HIG, IBM Carbon, Microsoft Fluent)이 말하는 모션과, 그중 영상에 쓸 수 있는 것

### Takeaway
네 시스템 모두 같은 뼈대를 가진다. 들어올 때는 감속(decelerate/ease-out), 나갈 때는 가속(accelerate/ease-in), 계속 화면에 있는 요소는 standard(양쪽 ease), 이동 거리와 면적이 클수록 길게, 강한 표현(expressive)은 드물게 중요한 순간에만 쓴다. ms 수치(50~1000ms)는 UI 반응 기준이라 영상에서는 그대로 쓰지 않는다. 대신 곡선 모양(cubic-bezier), 들어옴/나감 비대칭, 거리에 따른 길이 조절, 강한 모션을 아끼는 원칙은 영상에도 그대로 옮길 수 있다.

### Cited Findings
**Material Design 3 (Google)**
- M3 easing 토큰 값: Emphasized(경로 `M 0,0 C 0.05,0, 0.133333,0.06, 0.166666,0.4 C 0.208333,0.82, 0.25,1, 1,1`)는 화면 안에서 시작하고 끝나는 일반 M3 애니메이션용. Emphasized Decelerate `cubic-bezier(0.05, 0.7, 0.1, 1)`는 들어옴, Emphasized Accelerate `cubic-bezier(0.3, 0, 0.8, 0.15)`는 나감. Standard `cubic-bezier(0.2, 0, 0, 1)`, Standard Decelerate `cubic-bezier(0, 0, 0, 1)`, Standard Accelerate `cubic-bezier(0.3, 0, 1, 1)`, Linear `cubic-bezier(0,0,1,1)`는 "단순하고 스타일 없는 모션"에만 쓴다. — [material-components-android Motion.md (Google 공식)](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- M3 duration 토큰: Short1~4 = 50/100/150/200ms, Medium1~4 = 250/300/350/400ms, Long1~4 = 450/500/550/600ms, ExtraLong1~4 = 700/800/900/1000ms. "애니메이션이 차지하는 면적이나 이동 거리가 커질수록 duration도 커져야 한다." — [Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- 기능 위주 모션에는 standard 계열, 표현 위주 모션에는 emphasized 계열을 쓰고, 둘 다 들어올 때 decelerate, 나갈 때 accelerate로 짝을 맞춘다. — [Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- M3 전환 패턴 4종: Container transform(내용을 담은 요소가 커지거나 형태를 바꿔 새 화면이 됨), Shared axis(공간적·내비게이션 관계를 x/y/z축 이동으로 보여줌), Fade through(서로 관계가 약한 화면 사이), Fade(화면 경계 안에서 들어오고 나가는 요소). — [Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- M3 Expressive(2025)의 스프링 기반 모션은 공식 문서 본문을 확인하지 못했다. 서드파티 구현들은 위치·크기 같은 spatial 속성에는 스프링(약간의 overshoot)을 쓰고, 불투명도·색 같은 effects 속성에는 duration+easing 쌍을 유지한다고 정리한다(서드파티라 신뢰도 낮음). — [pub.dev material_3_expressive](https://pub.dev/documentation/material_3_expressive/1.0.8/), [Koder motion physics spec](https://meta.koder.dev/specs/themes/motion/physics/)

**IBM Carbon**
- 두 가지 모드가 있다. Productive는 효율적이고 반응이 빠르며 눈에 덜 띈다(버튼, 드롭다운, 표). Expressive는 생동감 있고 눈에 띄는데, 새 페이지 열기·주요 액션·알림처럼 중요한 순간에 쓴다. "Reserve expressive motion for occasional, important moments." Productive는 expressive보다 훨씬 빠르다. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- Carbon 곡선. Standard: productive `cubic-bezier(0.2, 0, 0.38, 0.9)` / expressive `cubic-bezier(0.4, 0.14, 0.3, 1)`. Entrance: productive `cubic-bezier(0, 0, 0.38, 0.9)` / expressive `cubic-bezier(0, 0, 0.3, 1)`. Exit: productive `cubic-bezier(0.2, 0, 1, 0.9)` / expressive `cubic-bezier(0.4, 0.14, 1, 1)`. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- 사용 구분: 요소가 동작 내내 화면에 남아 있으면 standard, 화면을 완전히 떠나면 exit. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- Duration 토큰: fast-01 70ms, fast-02 110ms, moderate-01 150ms, moderate-02 240ms, slow-01 400ms(큰 확장, 중요한 알림), slow-02 700ms(배경 어둡게 하기). 거리가 길거나 크기 변화가 크면 더 길게 잡는다. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- 구현 가이드. 큰 전환이나 전체 화면 전환에는 시선을 이어 줄 연속 요소를 둔다. 관련된 움직임끼리는 일관된 관계를 가져야 한다. 사용자가 모션을 자주 의식한다면 줄이거나 없앤다. 전달할 메시지는 모션 없이 정지 상태로도 전달되어야 한다. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)

**Microsoft Fluent (WinUI)**
- 표준 duration: ControlNormal 250ms, ControlFast 167ms, ControlFaster 83ms. — [Microsoft Learn: Timing and easing](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing)
- Fast Out, Slow In `cubic-bezier(0, 0, 0, 1)`는 들어오는 요소용이다. 화면에 들어서자마자 강한 마찰을 받아 멈추므로 먼 곳에서 빠르게 날아와 정지한 느낌을 준다. Slow Out, Fast In `cubic-bezier(1, 0, 1, 1)`는 나가는 요소용이고, 새 내용에 자리를 비켜 주려고 가속하며 빠져나가는 느낌을 준다. — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing)
- "모션은 현실에 기반하지만 디지털 매체이므로 속도와 성능에 대한 기대가 있다." 의도적으로 극단적인 easing을 써서 시스템 전체의 물리감을 통일한다. — [Microsoft Learn](https://learn.microsoft.com/en-us/windows/apps/design/motion/timing-and-easing)

**Apple HIG**
- "Add motion purposefully, supporting the experience without overshadowing it. Don't add motion for the sake of adding motion." 과도한 애니메이션은 주의를 흩뜨리고 신체적 불편을 줄 수 있다. — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- 중요한 정보를 모션만으로 전달하지 않는다(모션은 선택 사항이어야 함). 피드백 애니메이션은 짧고 정확하게, 자주 일어나는 상호작용에는 모션을 피하고, 애니메이션이 끝날 때까지 사용자를 기다리게 하지 않는다. 30~60fps를 일정하게 유지한다. — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion)

### Inferences
- **[변환 적용] 들어옴/나감 비대칭.** 네 시스템이 모두 같은 규칙을 둔다. 티저에서는 단어 창이 들어올 때 decelerate(`cubic-bezier(0.05,0.7,0.1,1)` 또는 GSAP `expo.out`/`power4.out`에 가까움), 나갈 때 accelerate(`cubic-bezier(0.3,0,0.8,0.15)`, GSAP `power3.in`에 가까움)로 짝을 맞춘다. 나감은 들어옴보다 짧게 잡는다(Fluent의 "자리를 비켜 준다"는 설명). GSAP 이름과의 대응은 곡선 모양을 비교한 추정이다.
- **[변환 적용] ms를 영상 길이로 늘리기.** UI 기준 최대값이 700ms~1000ms(Carbon slow-02, M3 ExtraLong4)이므로, 1920px 화면을 가로지르는 큰 영상 이동은 그 이상이 되어야 한다. 80 BPM에서 1박 = 0.75초(30fps에서 22.5프레임)라서, 큰 등장은 1박(0.75초), 작은 부속 요소는 반 박(0.375초) 단위로 맞추면 "거리가 클수록 길게" 원칙과 박자를 함께 지킬 수 있다(추론).
- **[영상 적용] Expressive는 드물게.** Carbon 원칙을 티저에 적용하면, 강하고 눈에 띄는 모션(15초 푸시인, 최종 타이틀)은 1~2회로 제한하고 나머지 컷은 productive에 가깝게 절제해야 대비가 생긴다.
- **[영상 적용] 연속 요소.** Carbon의 "큰 전환에는 연속 요소"와 M3 Container transform은 15초 획 속 푸시인과 같은 구조다. 획(글자)이 다음 화면의 창이 되도록 같은 요소를 유지한 채 확대한다.
- **[UI 전용]** 사용자 입력 반응, cancel 가능성, 자주 쓰는 상호작용 회피, 70~250ms 마이크로 인터랙션 수치는 영상에 해당하지 않는다.

### Gaps
- m3.material.io의 choreography/transition 본문(스태거 간격 수치 등)은 JS 렌더링 때문에 읽지 못했다. Material 2의 "standard curve 0.4,0,0.2,1, 들어옴 225ms/나감 195ms" 같은 널리 알려진 값도 m2.material.io를 읽지 못해 이번 조사에서는 확인하지 못했다.
- M3 Expressive 스프링 파라미터(stiffness, damping)의 공식 값은 확인하지 못했다(서드파티 자료뿐).
- IBM Design Language의 "classic principles" 페이지는 본문이 잘려 읽지 못했다.

## 2. 디즈니 12원칙(Thomas & Johnston, The Illusion of Life)을 모션그래픽·키네틱 타이포에 적용하는 방법

### Takeaway
12원칙의 출처는 Johnston & Thomas의 1981년 책 *The Illusion of Life: Disney Animation*이다. 모션그래픽에서 가장 확실하게 옮겨지는 원칙은 slow in/slow out(easing), staging, timing, follow-through/overlap(레이어 간 프레임 오프셋), anticipation/overshoot다. UX 모션 연구자 Issara Willenskomer는 "easing만은 언제나 적용된다"고 말한다. School of Motion은 overlap을 "레이어 키프레임을 1~2프레임씩 밀기"라는 구체 기법으로 가르친다.

### Cited Findings
- 출처: *The Illusion of Life: Disney Animation* (1981), Ollie Johnston & Frank Thomas. — [Wikipedia: Twelve basic principles of animation](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Staging: 핵심 아이디어로 시선을 이끌고 불필요한 디테일을 덜어낸다. 원문 정의는 "the presentation of any idea so that it is completely and unmistakably clear". — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Anticipation: 동작 전에 준비 동작을 넣어 관객이 다음 동작을 예상하게 한다(투수의 와인드업, 점프 전 무릎 굽힘). — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Follow through & overlapping action: 본체가 멈춘 뒤에도 느슨한 부분은 계속 움직였다가 돌아온다. 부분마다 움직이는 속도가 다르고, "drag"로 몇 프레임 뒤처진다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Slow in & slow out: 시작과 끝(극단 포즈) 근처에 프레임을 많이, 중간에 적게 둔다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Arcs: 자연스러운 움직임은 곡선 경로를 따르고, 기계적인 움직임이 예외다. 빠를수록 호가 평평해진다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Secondary action: 주 동작을 돕는 부가 움직임. 주의를 빼앗으면 빼거나, 큰 동작의 시작과 끝에 배치한다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Timing: 동작에 들이는 프레임 수가 속도를 정하고 무게(가벼운 것은 빨리 반응), 분위기, 성격을 전달한다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Exaggeration: 사실보다 밀어붙이되 요소 간 균형을 위해 절제한다. Solid drawing: 좌우가 똑같이 거울 대칭인 "twins"는 생기가 없다고 경고한다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Willenskomer(UX in Motion)의 입장: 12원칙은 2D로 물리적 현실을 보여 주려고 만든 것이라 대부분 UX에 잘 옮겨지지 않지만, easing은 예외다. "You want all motion to always ease." Staging은 UX에서 레이아웃에 해당한다. — [Adobe Blog (2016)](https://blog.adobe.com/en/publish/2016/11/08/redesigning-the-12-principles-of-animation-for-motion-design)
- School of Motion의 follow-through 강의: "when an object moves different parts of that object move at different times." 한 덩어리로 회전시키면 깃털이 판자처럼 보인다. 핀마다 키프레임을 **1프레임씩** 밀면 끝부분이 채찍처럼 따라오고, **2프레임씩** 밀면 더 부드럽고 overlap이 눈에 띈다. 베이스 회전에 들어간 작은 사전 하강은 anticipation, 끝의 overshoot는 그래프 에디터에서 키프레임 그룹을 더 내려 키운다. — [School of Motion: Follow-Through in After Effects](https://www.schoolofmotion.com/blog/animation-tricks-follow-through-after-effects)
- 모든 레이어를 같은 간격으로 지연하면 의도된 overlap이 아니라 기술적 지연처럼 보인다. 미니멀 그래픽에 반동을 크게 주면 만화처럼 보인다(교육자 1차 자료가 아니라 2차 정리). — [playbooks.com follow-through skill 정리](https://playbooks.com/skills/dylantarre/animation-principles/follow-through-overlapping), [Pixune](https://pixune.com/blog/follow-through-and-overlapping-action/)

### Inferences
원칙별 티저 체크리스트. 프레임은 30fps 가정, 모두 추론이다.
- **Slow in/out [영상 적용]:** 모든 위치·스케일 트윈에 ease를 준다. `linear`는 의도적으로 기계적인 표현(일정 속도로 흐르는 배경 드리프트 등)에만 쓴다.
- **Anticipation [영상 적용]:** 15초 푸시인 직전 3~6프레임 동안 아주 조금 뒤로 빠지거나(scale 1.00→0.98) 잠깐 멈춘 뒤 들어가면 "들어간다"는 예고가 된다. 수치는 School of Motion의 "작은 dip"을 영상용으로 옮긴 추정값이다.
- **Overlap/offset [영상 적용]:** 단어의 글자들, 또는 단어 창→부제→정보 줄을 한꺼번에 움직이지 않는다. 2~4프레임(약 0.07~0.13초) 간격으로 밀되 간격을 균일하게 두지 않는다(예: 0, 3, 5, 9프레임). School of Motion의 1~2프레임은 한 오브젝트 안의 관절 기준이라, 별개의 텍스트 요소에는 그보다 큰 값이 맞다고 본다.
- **Follow-through/overshoot [변환 적용]:** 세리프 단어가 멈출 때 1~3% 정도 지나쳤다가 돌아오는 정착(GSAP `back.out(1.2)` 수준 이하)을 준다. 고급스러운 세리프 톤에서는 반동이 크면 만화 같아진다.
- **Staging [영상 적용]:** 한 순간에 읽을 대상은 하나만 둔다(3장 참고).
- **Arcs [변환 적용]:** 카메라 푸시인이나 단어 이동에 약간의 곡선(x와 y의 ease를 다르게)을 준다. 직선으로만 움직이면 기계적으로 보인다.
- **Timing [영상 적용]:** 무거운 큰 세리프는 느리게(1박 이상), 작은 정보 텍스트는 가볍게(반 박) 움직여 무게 차이를 보여 준다.
- **Solid drawing / twins [변환 적용]:** 완전한 좌우 대칭 중앙 정렬 구도가 반복되면 생기가 없다. 비대칭 배치를 섞는다.
- **Squash & stretch:** 세리프 타이포에는 거의 쓰지 않는다(브랜드 톤에 맞지 않음, 추론).

### Gaps
- School of Motion의 12원칙 전반 커리큘럼(Animation Bootcamp)은 유료라 본문을 확인하지 못했다. Motion Design School의 공식 자료도 이번 조사 범위에서 찾지 못했다.
- 키네틱 타이포에서 글자 간 스태거 권장 수치(ms)를 1차 교육자 자료로 확인하지 못했다.

## 3. School of Motion 등 교육자가 가르치는 easing, 그래프 에디터, spacing, "선형으로 움직이는 것은 없다"

### Takeaway
그래프 에디터에는 Speed graph(속도, 움직임의 "느낌")와 Value graph(속성의 실제 값)가 있다. 교육자들은 기본 Easy Ease가 원하는 결과인 경우가 드물다고 가르친다. 곡선을 직접 다뤄서 빠르게 튀어나와 급정지하거나, 지나쳤다가 정착하는 식으로 성격을 부여한다. 아마추어 티는 대부분 easing이 없거나 기본값 그대로인 데서 난다.

### Cited Findings
- Speed graph는 "A visual representation of the speed of your movements", Value graph는 "A visual representation of the actual value of the property". 바운스는 value graph로 보고, 타임 리맵의 가감속은 speed graph로 조절한다. — [School of Motion: Graph Editor](https://www.schoolofmotion.com/blog/graph-editor-after-effects)
- School of Motion은 기본 Easy Ease 키프레임이 프로젝트에 필요한 것인 경우가 드물다고 말한다. 곡선으로 만들 수 있는 성격의 예로 순간 튀어나와 즉시 멈추기, 튀는 공, 위치를 지나쳤다가 정착하는 텍스트(overshoot)를 든다. 프리셋(Flow 등)보다 곡선 읽는 법을 먼저 익히라고 한다. — [School of Motion: Graph Editor](https://www.schoolofmotion.com/blog/graph-editor-after-effects)
- 곡선의 접선(tangent)을 완전히 평평하게 두지 말라는 팁이 있다. 작은 기울기만 남겨도 생동감이 생긴다(AnimationMentor 쪽 팁이라는 2차 인용). — [검색 결과 요약 중 AnimationMentor](https://www.animationmentor.com/?p=96605)
- 흔한 실수는 easing을 신경 쓰지 않는 것이다. 현실의 물체는 가속해서 움직이기 시작하고 멈추기 전에 감속하며, 이 패턴을 무시하면 이상하게 보인다. — [Val Head: Common animation mistakes](https://valhead.com/2019/02/18/common-animation-mistakes/)
- "You want all motion to always ease." — Issara Willenskomer, [Adobe Blog](https://blog.adobe.com/en/publish/2016/11/08/redesigning-the-12-principles-of-animation-for-motion-design)
- Spacing(Slow in/out의 다른 이름): 극단 근처에 프레임을 몰아 둔다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)

### Inferences
- **[영상 적용] GSAP 기본값 금지.** GSAP 기본 ease는 `power1.out`이다(GSAP 문서 기준이나 이번 조사에서 URL로 재확인하지 못함). AE의 Easy Ease에 해당하는 "아무 생각 없는 기본값"이므로, 모든 트윈에 ease를 명시하도록 lint 규칙을 둘 수 있다.
- **[영상 적용] 속도 곡선을 비대칭으로.** 프로 느낌의 들어옴은 대체로 "빠르게 도달하고 오래 감속"한다(M3 Emphasized Decelerate `0.05,0.7,0.1,1`, Fluent `0,0,0,1`이 전형). 양쪽이 대칭인 `sine.inOut`류는 화면 안에서 위치만 옮기는 경우에만 쓴다.
- **[영상 적용] 정착 구간을 두기.** 감속 꼬리가 길면 "멈춘 뒤에도 미세하게 살아 있는" 느낌이 난다. 정지가 완전히 죽지 않도록, 홀드 중에도 영상 창 안 푸티지나 배경을 아주 느리게(예: 4.5초 동안 scale 1.00→1.03) 드리프트시킨다. 추정값이다.
- 검수 방법: 각 트윈을 speed graph로 상상했을 때 사다리꼴(일정 속도 구간)이 보이면 linear 의심, 양 끝이 같은 종 모양이면 기본 ease 의심.

### Gaps
- School of Motion의 "Intro to the Graph Editor" 영상 본편 내용(influence %, 예: 들어옴 쪽 influence 80% 이상 같은 구체 수치)은 영상이라 텍스트로 확인하지 못했다. 업계에서 흔히 말하는 "influence 70~90%"는 출처 미확인이다.
- "nothing moves linearly"라는 문구 자체의 1차 출처는 찾지 못했다(같은 취지의 Willenskomer와 Val Head 발언은 있음).

## 4. 모션 위계, "한 번에 한 초점", 안무(choreography)와 staging 원칙

### Takeaway
화면에서 보여 줄 것은 한 번에 하나다(staging의 "completely and unmistakably clear"). 강한 모션은 드물게 쓰고(Carbon expressive), 관련된 움직임끼리 일관된 관계를 둔다. 컷 판단은 Murch의 Rule of Six(감정 > 이야기 > 리듬 > 시선 흐름 > 2D 화면면 > 3D 공간) 순으로 한다. 컷 사이에서는 eye-trace(시선 위치)를 이어야 한다.

### Cited Findings
- Staging: 핵심 아이디어로 시선을 이끌고 불필요한 디테일을 덜어낸다. Secondary action이 주의를 빼앗으면 뺀다. — [Wikipedia](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Carbon: expressive는 "occasional, important moments"에만, 관련된 움직임은 통일된 관계로, 사용자가 모션을 자주 의식하면 줄인다. 큰 전환에는 연속 요소를 둔다. — [Carbon Motion](https://carbondesignsystem.com/elements/motion/overview/)
- Apple: 모션은 경험을 돕되 압도하지 않아야 하고, 모션을 위한 모션은 넣지 않는다. — [Apple HIG Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- M3 전환 선택: 관계가 있으면 shared axis(같은 축 이동), 요소가 다음 화면이 되면 container transform, 관계가 약하면 fade through. — [Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- Walter Murch의 Rule of Six(*In the Blink of an Eye*, 1995): 감정 51%, 이야기 23%, 리듬 10%, 시선 흐름(eye-trace) 7%, 2D 화면면 5%, 3D 공간 4%. 무언가를 포기해야 하면 아래 항목부터 포기한다. 숫자는 2차 자료가 전하는 내용이다. — [UT Austin RTF wiki](https://wikis.utexas.edu/display/rtf318/Murch%27s+Rule+of+Six), [No Film School](https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch)
- Eye-trace는 관객 관심 초점이 프레임 안 어디에 있고 어떻게 움직이는지에 관한 기준이다. — [Artlist: Eye trace and rule of six](https://artlist.io/blog/eye-trace-and-rule-of-six-editing/)

### Inferences
- **[영상 적용] 초점 1개 규칙.** 각 박(0.75초) 구간에서 "새로 움직이기 시작하는" 주요 요소는 하나만 둔다. 부속 텍스트는 주 요소가 정착하기 시작한 뒤(주 동작 길이의 50~70% 지점) 들어오게 한다. Secondary action은 "큰 동작의 시작과 끝"에 둔다는 고전 원칙을 적용한 추론이다.
- **[영상 적용] 컷 간 시선 잇기.** 4.5초 컷이 바뀔 때 앞 컷이 끝나는 초점 위치와 다음 컷이 시작하는 초점 위치를 맞추거나(매치), 의도적으로 반대편으로 튀게 한다. 아무 위치나 되는 대로 두지 않는다. 컷 설계표에 "끝 초점 좌표 / 시작 초점 좌표" 열을 두면 검수할 수 있다.
- **[영상 적용] 전환 문법 일관성.** 같은 의미 관계의 컷 전환에는 같은 축과 같은 방향을 쓴다(shared axis). 15초 푸시인은 container transform 문법(획이 곧 다음 화면)이므로 티저 안에서 한 번만 쓰는 강한 순간으로 남긴다.
- **[영상 적용] 리듬은 감정과 이야기 아래.** Murch 순위를 따르면, 80 BPM 박에 맞추는 것(리듬)은 메시지가 읽히는 것(이야기)보다 아래다. 한 줄 메시지는 박자보다 읽기 시간을 먼저 확보한다.
- **[영상 적용] 위계 = 크기 × 움직임 양 × 지속 시간.** 가장 중요한 단어가 가장 크고, 가장 많이 움직이고, 가장 오래 머무르게 한다. 정보 카드 같은 부속 요소는 짧은 fade나 작은 이동(productive)만 준다(Carbon productive/expressive를 위계에 대응시킨 추론).

### Gaps
- 모션그래픽 전용 "motion hierarchy" 개념의 1차 정의(School of Motion, Motionographer)는 이번 조사에서 본문을 확보하지 못했다.
- 화면 텍스트 홀드(읽기) 시간의 한국어 기준(Netflix Korean Timed Text Style Guide의 초당 글자 수)은 접근한 URL이 포르투갈어판으로 연결되어 확인하지 못했다. 참고로 같은 페이지의 브라질 포르투갈어 기준은 성인 17자/초, 한 줄 최대 42자다. 한국어에는 적용되지 않는다. — [Netflix Partner Help (포르투갈어판으로 연결됨)](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215600497-Korean-Timed-Text-Style-Guide)

## 5. 이 자료들이 말하는 아마추어 티

### Takeaway
출처들에서 공통으로 확인되는 아마추어 티는 다음과 같다. easing 없음 또는 기본 ease, 모든 레이어를 동시에 움직이거나 균일한 지연으로 움직임, 한 덩어리로 딱딱하게 움직임(overlap 없음), 이유 없는 모션, 반동 과다, 좌우 대칭 "twins" 구도. "모든 것이 fade", "홀드 없음"은 1차 자료에서 직접 문구로 확인하지 못했고 원칙에서 끌어낸 추론이다.

### Cited Findings
- easing을 신경 쓰지 않는 것이 대표적인 실수다. 물리 법칙을 무시한 가감속은 "조금 이상해" 보인다. — [Val Head](https://valhead.com/2019/02/18/common-animation-mistakes/)
- 기본 Easy Ease는 필요한 것이 아닌 경우가 대부분이다. 프리셋에 의존하기 전에 곡선을 이해해야 한다. — [School of Motion: Graph Editor](https://www.schoolofmotion.com/blog/graph-editor-after-effects)
- 부드러운 물체를 한 덩어리로 회전시키면 깃털이 "판자"처럼 보인다(overlap 없음). — [School of Motion: Follow-Through](https://www.schoolofmotion.com/blog/animation-tricks-follow-through-after-effects)
- 모든 레이어를 같은 양만큼 지연하면 의도된 overlap이 아니라 기술적 지연처럼 보이고, 미니멀 그래픽에 큰 반동은 만화처럼 보인다(2차 정리 자료). — [playbooks.com](https://playbooks.com/skills/dylantarre/animation-principles/follow-through-overlapping)
- follow-through가 지나치면 주 동작에서 주의를 빼앗는다. — [Pixune](https://pixune.com/blog/follow-through-and-overlapping-action/)
- 모션을 위한 모션, 과도한 애니메이션 금지. — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/motion); 사용자가 모션을 자주 의식하면 줄인다 — [Carbon](https://carbondesignsystem.com/elements/motion/overview/)
- 좌우 거울 대칭 "twins"는 생기가 없다. — [Wikipedia (Thomas & Johnston)](https://en.wikipedia.org/wiki/Twelve_basic_principles_of_animation)
- Linear는 "simple, non-stylized motion"에만 쓴다. — [Material Motion.md](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)

### Inferences
티저 검수 체크리스트. 각 항목은 위 출처에서 끌어낸 추론이다.
1. 명시되지 않은 ease나 `linear`가 있는가(의도적 드리프트 제외).
2. 들어옴과 나감이 같은 곡선·같은 길이인가(나감이 더 짧고 accelerate여야 함).
3. 한 박 안에서 두 개 이상의 주요 요소가 동시에 움직이기 시작하는가.
4. 스태거 간격이 전부 같은 값인가(예: 모두 0.1초).
5. 멈춤에 정착(감속 꼬리나 1~3% overshoot)이 없이 "탁" 멈추는가, 반대로 반동이 커서 만화 같은가.
6. 모든 전환이 opacity fade뿐인가. M3도 fade는 관계가 약한 경우의 선택지일 뿐이다. 관계가 있는 컷은 shared axis나 container transform 문법을 쓴다.
7. 메시지와 타이틀에 읽고 머무를 홀드가 있는가(모션이 끝난 뒤 정지 상태로 메시지가 전달되는가, Carbon과 Apple의 "정지 상태로도 전달" 원칙).
8. 강한 모션(푸시인, 큰 스케일)이 2회를 넘는가(Carbon "occasional").
9. 모든 컷이 중앙 정렬 좌우 대칭인가(twins).
10. 컷 사이 초점 위치가 계획 없이 튀는가(eye-trace).
11. 의미 없는 장식 모션(이유를 한 줄로 설명할 수 없는 움직임)이 있는가.

### Gaps
- School of Motion이나 Motionographer가 직접 쓴 "아마추어 모션그래픽 티 목록" 글은 이번 조사에서 1차 본문을 확보하지 못했다. 위 목록은 공식 가이드와 고전 원칙에서 끌어낸 것이다.
- "모든 것이 fade", "홀드 없음"을 아마추어 티로 직접 명시한 권위 있는 1차 출처는 찾지 못했다.
