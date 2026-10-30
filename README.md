# Motion Studio

주제 한 줄에서 출발해 키메시지, 서사, 애니매틱과 BGM, 디자인, 모션을 단계마다 미리보기로 승인받으며 모션그래픽 영상을 만드는 원판이다. 렌더링 엔진은 [HyperFrames](https://github.com/heygen-com/hyperframes)이고, 설계는 [docs/superpowers/specs/2026-10-30-motion-studio-design.md](docs/superpowers/specs/2026-10-30-motion-studio-design.md)에 있다.

새 영상은 Claude Code에서 `새 영상: <주제>`로 시작한다.

클론한 뒤 한 번 실행: `npm install` 과 `git config core.hooksPath .githooks` (커밋 전 API 키 검사).
