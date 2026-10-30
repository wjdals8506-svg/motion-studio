# 컷 사이 연결

컷 설계표의 `연결(서사)`, `연결(디자인)` 열을 쓰거나 점검할 때, 애니매틱·모션 단계에서 이음새를 만들 때, 리뷰에서 "슬라이드 넘기는 것 같다"는 지적을 고칠 때 읽는다.

## 원칙
- 모든 비트는 다음 비트를 일으킨다. 지금 물체를 다음 물체로 바꾸며 장면을 떠난다. 동기가 있는 이음새의 영화는 편집된 것으로, 리셋의 영화는 슬라이드쇼로 읽힌다. (출처: mm/SKILL.md 판단 3, mm/references/judgment.md 1절 3)
- 이음새를 비트보다 먼저 계획한다. 비트 N의 마지막 프레임이 비트 N+1의 첫 프레임이다. (출처: mm/SKILL.md 법칙 3, mm/references/director.md 5절)
- 대상의 자기 몸짓을 이음새로 쓴다: 화면을 채우는 클릭, 숫자가 되는 캐럿, 입력창이 되는 문장, 다음 배경이 되는 아이콘. (출처: mm/references/judgment.md 1절 3)
- 이음새는 짝으로 쓴다. A의 마지막 6프레임과 B의 첫 6프레임을 함께 정한다(물체, 위치 약 0.02 이내, 크기, 색, 블러, 배경, 속도). (출처: mm/references/transitions.md R1.1, R3.2.4)

## 컷의 해부
- A는 마지막 3~8f 동안 컷으로 가속한다(커지는 이동 폭, 마지막 프레임에 가장 큰 축소 단계, 늘어나는 블러, 동작의 정점). (출처: mm/references/transitions.md 1절)
- 컷은 한 프레임, 페이드 0. (출처: mm/references/transitions.md 1절)
- B의 첫 프레임은 이미 움직이거나 이미 만들어져 있다. 필요하면 벡터가 이어지는 빈 프레임 0~3개를 둔다. (출처: mm/references/transitions.md 1절)
- B의 진입은 A의 벡터를 이어 간다. 위·왼쪽으로 휩했으면 새 단어도 위·왼쪽으로 흐른다. (출처: mm/references/transitions.md 1절)
- 클립은 정점(최고 속도, 최대 압축, 아직 줄어드는 로크업)에서 끝난다. (출처: mm/references/transitions.md R1.2)

## 움직임 위에서 컷
- 컷은 이동의 가장 빠른 프레임에 둔다. 정착한 뒤에 자르지 않는다. (출처: mm/references/transitions.md T1, hf/motion.md)
- 양쪽의 방향과 속도를 맞춘다. 속도가 안 맞으면 이징을 거울처럼 맞춘다(나갈 때 가속, 들어올 때 같은 강도의 감속). (출처: hf/motion.md)
- 들어오는 장면이 비어 있거나 한 프레임짜리면 다 만들어진 상태로 도착시킨 뒤 움직인다. (출처: mm/references/transitions.md T1)
- 이음새에서 튀면 컷 직전·직후를 스냅샷해 두 상태의 차이를 찾는다. (출처: hf/motion.md, hf/review.md 1절)

## 이어짐의 장치 (강한 순서)
- 운반 물체: 같은 물체가 같은 화면 위치에. 나머지가 바뀌면 양쪽에 강한 블러. (출처: mm/references/director.md 5절)
- 같은 자세와 속도: B는 A가 아직 향하던 자세에서 같은 방향으로 흐르며 열린다(카드 0.43H → 0.42H). (출처: mm/references/director.md 5절)
- 같은 레이아웃 기하: 같은 격자·열 위치에서 내용만 바뀐다(열 0.18 / 0.39 / 0.62 / 0.83). (출처: mm/references/director.md 5절, mm/references/layout.md R5.7)
- A에서 시작해 B에서 끝나는 전환: A에서 시작한 와이프·스미어·색 램프가 B의 첫 2~3프레임에 끝난다. (출처: mm/references/director.md 5절, mm/references/transitions.md T7)
- 블러를 맞춘 컷: 퇴장은 18px 블러로 끝나고 진입은 80px에서 시작해 약 8f에 걷힌다. 들어오는 쪽 블러가 같거나 커야 이음새가 숨는다. (출처: mm/references/transitions.md R6.1)
- 이어지는 내레이션: 한 문장이 컷을 넘어가고 화면 글자는 다음 조각만 나른다. (출처: mm/references/director.md 5절)
- 효과가 환경이 된다: 폭발의 색이 다음 장면의 배경이 된다. (출처: mm/references/director.md 5절, mm/references/transitions.md T3)

## 운반 물체 (carrier)
- 운반 물체는 선택이다. 영화 형태가 넘겨주기의 사슬일 때 시스템 단계에서 고른다. (출처: mm/references/director.md 4절 6)
- 이음새마다 움직이거나, 크기가 바뀌거나, 역할이 바뀐다. 세 샷 이상 같은 좌표에 고정하지 않는다. (출처: mm/references/director.md 4절 6, mm/references/slop.md N8)
- 반복 캐릭터는 매번 UI 슬롯에 도킹하고 순간 사이에 크기를 최대 6배까지 바꾼다(0.25W → 0.22W → 0.036W). (출처: mm/references/transitions.md R2.2)
- 로고의 점이 되는 작은 점, 모티프로 만든 로크업은 하우스 스타일이다. 아이디어가 정확히 그것일 때만 쓰고, 아니면 로고는 원인(클릭, 결과, 카메라 이동)으로 도착한다. (출처: mm/references/director.md 4절 6)

## 형태·색·위치의 이어짐
- 형태: 결과가 상자로 나오면 A의 컨테이너를 gentleIn으로 약 9% 수축시킨 뒤 온전한 크기의 새 컨테이너로 한 번에 교체한다. 로딩 프레임을 쓰지 않는다. (출처: mm/references/transitions.md R4.1)
- 형태: 줄이 다른 것으로 바뀌면 클립 가장자리로 5f 동안 가속하며 쓸거나, 두 개의 부드러운 마스크를 지우는 앞선이 약 0.1초 앞서게 돌린다. (출처: mm/references/transitions.md R8.1)
- 색: 배경은 하드 컷이나 커지는 물체로만 바뀐다. 장면 안에서 바뀌어야 하면 떠나는 것에 맞춰 0.5~0.7초(15~21f) 직선 색 트랙 하나로. 플래시·크로스페이드 금지. (출처: mm/references/director.md 4절 4, mm/references/transitions.md R15.1)
- 색: A의 마지막 동작이 만든 효과(폭발, 커지는 원, 이동하는 띠, 깃털 와시)가 화면을 채워 B의 배경이 된다. 흰 플래시는 쓰지 않는다. (출처: mm/references/transitions.md R3.1)
- 색: 밝은 → 어두운 반전이 드러나면 4프레임 회색 딥(30% → 65% → 평평한 회색 1f → 베일) 안에 숨기고 물체의 동작을 넘긴다. (출처: mm/references/transitions.md R5.1)
- 위치: 운반 물체는 위치를 약 0.02 이내로, 크기·색·속도 벡터까지 맞추고 B는 동작 중에 시작한다. (출처: mm/references/transitions.md T2)
- 크기: 줌 트윈은 "카메라", 1프레임 스케일 컷은 "다른 거리"라고 말한다. 스케일 컷이면 같은 프레임에 내용도 바꾸고 배경은 자기 스케일·드리프트를 유지한다. (출처: mm/references/transitions.md R14.1)
- 전환은 영화 안에 이미 사는 형태로 만든다(주제의 표식이 만드는 물결, 셀 격자, 고리). 일반 와이프·슬라이드 인은 템플릿으로 읽힌다. (출처: mm/references/transitions.md R3.2.5)
- 블러 문법이 하나여야 전환도 하나의 문법이다. 선명한 스텝 영화는 T1·T2·T4·T9·T10·T14·T19, 스미어 영화는 여기에 블러 맞춤 휩을 더한다. (출처: mm/references/transitions.md R3.2.6)

## 하드 컷이 의미를 가질 때
- 하드 컷은 쉼이 아니라 결정이다: 새 작업, 펀치라인, 대조. (출처: mm/references/judgment.md 1절 3)
- 원고의 대조어("하지만", "이제는 아니다", "대신")는 turn을 받는다: 배경·색·크기·카메라의 변화. (출처: mm/references/idea.md 5절)
- 막·챕터가 바뀌면 배경 변화 + 운반 물체로 알린다. 번호·제목·라벨로 알리지 않는다. (출처: mm/references/director.md 5절, mm/references/transitions.md T15)
- 주장 → 대상으로 넘어가는 하드 컷은 "보여주고 나서 말하기"의 컷이다. (출처: mm/SKILL.md 법칙 2)
- 원천 충돌: motionmaxxing 표본은 거의 모든 이음새가 하드 컷이되 움직임·운반 물체·와이프·블러로 보이지 않게 만든 것이다. HyperFrames는 "비트 사이 이음새의 하드 컷은 최대 3분의 1, 하드 컷은 장면 안(펀치 인)에", "영화 하나에 원인 있는 전환 3~5종"이라 한다. **기본값**: 맞춘 물체·움직임 없는 맨 하드 컷은 비트 사이 이음새의 3분의 1 이하, 나머지 이음새는 운반 물체·움직임 위 컷·효과가 배경이 되기 등으로 잇는다. (출처: mm/references/transitions.md 서문, hf/motion.md, 대응은 원판 규칙)
- 원천 충돌: HyperFrames 전환 표에는 색 범람과 클릭 지점에서 열리는 원형 아이리스가 있지만 motionmaxxing은 "비트 사이 색 범람·원형 와이프"를 never-ship 하우스 스타일로 둔다. **기본값은 motionmaxxing**(둘이 다르면 motionmaxxing이 이긴다는 원문 규칙). 아이디어가 정확히 그것일 때만 쓰고 이유를 적는다. (출처: mm/SKILL.md never-ship 7, mm/SKILL.md 원천과 윤리, hf/motion.md)

## 크로스페이드와 페이드
- 장면 사이 크로스페이드 금지. 하드 컷, B의 배경색으로 칠한 깃털 와이프, 또는 효과가 B가 되기. (출처: mm/references/transitions.md R3.2.1)
- 페이드는 단일 물체(헤드라인 한 줄 0.75 → 0.18을 4f, 마지막 구절 10f 선형)나 같은 중심에서 정체성 하나를 바꿀 때(아이콘 디졸브 8f)만. (출처: mm/references/transitions.md R3.2.1)
- 예외 조건: 차분한 브랜드 목소리, 의미가 곧 디졸브(사생활, 잊힘), 실제 초점 이동을 따라 하는 블러. (출처: mm/references/slop.md Part 1b)

## 전환 유형 고르기 (무엇이 바뀌는가로)
- 상태만 바뀜(같은 화면, 새 순간): 움직임 위 하드 컷 + 운반 물체. 대안은 1프레임 잔상. (출처: mm/references/transitions.md 3.1절)
- 배경(어두움 ↔ 밝음): 효과가 배경이 되기(구슬 → 원판 17배, 띠, 와시). 대안은 띠 안에 숨긴 컷, 4f 회색 딥. (출처: mm/references/transitions.md 3.1절)
- 거리(같은 대상, 다른 크기): 1f 스케일 컷 + 같은 프레임의 내용 점프(1프레임에 3.7배). 대안은 스냅이 있는 당겨 빼기(비율 0.56~0.77 + 0.3~0.6초 꼬리). (출처: mm/references/transitions.md 3.1절)
- 대상(글자 → 화면, 화면 → 다른 화면): 내용이 많으면 B에서 끝나는 와이프(깃털 0.31~0.42, 0.56초, B의 배경색). 대안은 컨테이너 교체, 가림(올라오는 카드). (출처: mm/references/transitions.md 3.1절, R7.1)
- 글자 줄 → 글자 줄: 1f 하드 교체. 대안은 5f 클립 와이프. (출처: mm/references/transitions.md 3.1절)
- 질문 → 답·이름: 지우는 앞선이 약 0.1초 앞서는 두 마스크. (출처: mm/references/transitions.md 3.1절)
- 목록·입력 → 결과: 컨테이너 교체(0.70 → 0.64W 후 온전한 크기로 교체). (출처: mm/references/transitions.md 3.1절)
- 넓이를 보여줄 몽타주: 스트로브(첫 판 2f, 이후 4f씩). (출처: mm/references/transitions.md 3.1절)
- 컷 간격: 비트 안에서는 0.3~2.3초마다 컷한다. 끝으로 갈수록 장면이 짧아지고 마지막이 머문다. (출처: mm/references/transitions.md R3.2.2)
- 내레이션 주도면 시작점을 말한 단어에 두고 와이프·드러냄은 단어보다 먼저 시작한다(약 0.16초 앞). 음악 주도면 일정 간격(10f를 네 번)으로 컷하고 컷마다 상태를 완성한다. (출처: mm/references/transitions.md R3.2.3)

## 컷 설계표 연결 열 쓰는 법
- `연결(서사)`: 이 컷이 다음 컷을 **일으키는** 이유를 쓴다. 인과("그래서"), 대조("그런데"), 확대(같은 사례가 커짐) 중 하나와 무엇이 넘어가는지. 다음 컷의 믿음 문장과 이어 읽혀야 한다. (출처: mm/references/judgment.md 1절 3, mm/references/director.md 2절)
- `연결(디자인)`: 무엇이(운반 요소) / 어떻게(장치: 운반 물체, 같은 자세, 같은 기하, A→B 와이프, 블러 맞춤, 효과→배경, 컨테이너 교체) / A의 끝 상태 → B의 첫 상태(위치, 크기 %H, 속도, 블러, 배경색, 글자)를 쓴다. (출처: mm/references/director.md 5절 넘겨주기 계획)
- 배경이 바뀌는 이음새는 어떤 커지는 물체나 띠가 바꾸는지 적는다. 컷 프레임은 최고 속도나 홀드 직전으로 적는다. 내레이션이 이음새를 넘으면 컷에 떨어지는 단어를 적는다. (출처: mm/references/director.md 5절)
- 서사 좋은 예: `그래서 → 찍힌 영수증이 무엇이 되는지 궁금하게 넘긴다(인과).` (출처: mm/references/judgment.md 1절 3)
- 서사 좋은 예: `그런데 → 같은 영수증 더미가 한 달 치로 커진다(확대, 같은 사례 유지).` (출처: mm/references/director.md 2절)
- 서사 나쁜 예: `다음 기능 소개.` 이유: 원인이 없는 리셋이고 기능 목록으로 읽힌다. (출처: mm/references/director.md 3절)
- 서사 나쁜 예: `분위기 전환.` 이유: 시청자 상태 변화가 아니라 효과다. (출처: mm/references/director.md 2절)
- 디자인 좋은 예: `영수증 카드(운반 물체) / 위로 가속하며 컷 / A 끝: x0.50 y0.42, 0.30H, 위쪽 40px/f, 블러 6px → B 첫 프레임: 같은 위치·크기의 가계부 행 슬롯으로 들어가며 감속.` (출처: mm/references/director.md 5절, mm/references/transitions.md T2)
- 디자인 좋은 예: `초록 체크(효과→배경) / 체크의 원이 0.5초에 화면을 채워 다음 장면의 배경이 됨, 플래시 없음.` (출처: mm/references/transitions.md R3.1)
- 디자인 나쁜 예: `페이드.` 이유: 장면 크로스페이드이고 넘어가는 물체가 없다. (출처: mm/references/transitions.md R3.2.1)
- 디자인 나쁜 예: `로고 알약을 세 컷 모두 오른쪽 아래 같은 자리에.` 이유: 고정된 물체다. 이음새마다 위치·크기·역할이 바뀌어야 한다. (출처: mm/references/slop.md N8)
- 점검: 모든 이음새에 운반 요소와 양쪽 상태가 있다. 운반 물체가 있으면 이음새마다 위치·크기·역할 중 하나가 다르다. (출처: mm/references/director.md 7절 점검 3·9)
