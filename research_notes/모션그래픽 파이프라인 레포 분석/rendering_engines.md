# Code-based Video Rendering Engines for an AI-Agent-Driven Motion Graphics Pipeline

Observation date for all GitHub/npm numbers: **2026-10-30** (via `gh api` and `npm view`). Star counts are GitHub stargazers on that date.

## Which engines exist, are current, and what are their core specs?

### Takeaway
Only three engines are both actively developed and production-scale in late Oct 2026: **Remotion** (React, source-available, company license), **HyperFrames** (HTML + seekable animation, Apache-2.0, HeyGen) and **ManimCE** (Python, MIT, math/explainer niche). Motion Canvas, Theatre.js and editly are effectively dormant; Revideo moved to `midrender/revideo` and is low-activity.

### Cited Findings

**Snapshot table (observed 2026-10-30)**

| Engine | Repo | Stars | Latest release / last push | License | Stack | Commits since 2026-01-01 |
|---|---|---|---|---|---|---|
| Remotion | github.com/remotion-dev/remotion | 69,019 | v4.0.539 (2026-10-26); push 2026-10-30 | Remotion License (source-available, GitHub reports NOASSERTION) | TypeScript / React | 100+ (API cap) |
| HyperFrames (HeyGen) | github.com/heygen-com/hyperframes | 75,744 | v0.8.221 (2026-10-30); repo created 2026-03-10 | Apache-2.0 | TypeScript, HTML/CSS + GSAP etc. | 100+ |
| ManimCE | github.com/ManimCommunity/manim | 42,018 | v0.22.1 (2026-10-27) | MIT | Python | 100+ |
| 3b1b/manim (ManimGL) | github.com/3b1b/manim | 95,891 | v1.7.2 (2024-12-13); push 2026-09-09 | MIT | Python / OpenGL | n/a |
| Motion Canvas | github.com/motion-canvas/motion-canvas | 19,595 | v3.17.2 (2024-12-14; npm modified 2025-02-16); last code commit 2025-02-16, only a docs-domain commit 2026-07-02 | MIT | TypeScript, Canvas2D | 1 |
| Revideo | github.com/midrender/revideo (moved from redotvideo) | 4,159 | no GitHub releases; npm @revideo/core 0.11.0 (2026-07-10); push 2026-07-15 | MIT | TypeScript (Motion Canvas lineage) | 19 |
| Theatre.js | github.com/theatre-js/theatre | 12,813 | npm @theatre/core 0.7.2 (2024-05-19); last main commit 2024-04-11 "Add the 1.0 notice" | core Apache-2.0, studio AGPL-3.0 | TypeScript | 0 |
| editly | github.com/mifi/editly | 5,573 | v0.15.0-rc.1 (2025-01-19); push 2025-05-12 | MIT | TypeScript + FFmpeg | 0 |
| etro | github.com/etro-js/etro | 1,153 | v0.14.1 (2026-08-12); push 2026-10-24 | GPL-3.0 | TypeScript, browser | n/a |
| reactive-video (mifi) | github.com/mifi/reactive-video | 219 | no releases; push 2026-10-22 | GPL-3.0 | TypeScript/React | n/a |
| Diffusion Studio core | github.com/diffusionstudio/core | 1,250 | v1.1.1 (2024-10-29); push 2025-11-18 | MPL-2.0 | TypeScript, WebCodecs | n/a |
| Mediabunny (library, not an engine) | github.com/Vanilagy/mediabunny | 7,411 | v1.64.0 (2026-10-29) | MPL-2.0 | TypeScript media muxing/demuxing | n/a |

Source for all rows: GitHub REST API (`gh api repos/<repo>`, `/releases/latest`, `/commits?since=`) and npm registry, queried 2026-10-30 — [Remotion](https://github.com/remotion-dev/remotion), [HyperFrames](https://github.com/heygen-com/hyperframes), [ManimCE](https://github.com/ManimCommunity/manim), [3b1b/manim](https://github.com/3b1b/manim), [Motion Canvas](https://github.com/motion-canvas/motion-canvas), [Revideo](https://github.com/midrender/revideo), [Theatre.js](https://github.com/theatre-js/theatre), [editly](https://github.com/mifi/editly), [etro](https://github.com/etro-js/etro), [Diffusion Studio](https://github.com/diffusionstudio/core), [Mediabunny](https://github.com/Vanilagy/mediabunny).

**Remotion license (precise)**
- Free License eligibility: an individual; a for-profit organization with **up to 3 employees**; a non-profit; or someone evaluating and not yet using it commercially. Free users may use it commercially to create videos/images and modify it, but may not "copy or modify Remotion code for the purpose of selling, renting, licensing, relicensing, or sublicensing your own derivate of Remotion." Everyone else needs a Company License. — [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- Company License pricing (remotion.pro, observed 2026-10-30): **Creators** $25/month per seat (manual creation incl. Remotion Studio, 1 seat per user); **Automators** $0.01 per render with a **$100/month minimum** (shown as 10,000 renders for $100; for batch rendering/automated video products; automation developers need no seat); **Enterprise** from $500/month (custom terms, includes "Editor Starter", monthly consulting, compliance forms). Free tier described as "individuals and companies of up to 3 people"; company license "required for collaborations and companies of 4+ people." The page does not define what counts as a render. — [remotion.pro/license](https://www.remotion.pro/license)
- Planned **Remotion 5.0** license change: contractors will count toward team size (closing the "only contractors" loophole), the license is tied to new terms & conditions, and LICENSE.md will prohibit operating a bring-your-own-code rendering service. — [remotion PR #3750](https://github.com/remotion-dev/remotion/pull/3750)

**Rendering method / determinism**
- Remotion: a composition is a React component that is "a function of the current frame number"; rendered via headless Chrome + FFmpeg. — [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)
- HyperFrames: video defined as HTML with `data-start`/`data-duration`/`data-track-index` attributes; animations via GSAP, CSS, Lottie, Three.js, Anime.js, WAAPI or custom frame adapters; "The renderer seeks each frame in headless Chrome and encodes the result with FFmpeg, so the same input produces the same video." Packages: CLI, core (incl. linter), engine (Puppeteer + FFmpeg), producer (capture/encode/audio mix), studio, player web component, WebGL shader transitions, AWS Lambda. No build step. — [HyperFrames README](https://github.com/heygen-com/hyperframes)
- HyperFrames determinism caveat (from its own guide): requires paused timelines, no wall clocks, no unseeded randomness, and "breaking them fails quietly"; Remotion's model is "one pure function of the frame number, no timeline to register." — [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)
- HyperFrames reportedly borrowed low-level patterns from Remotion (Chrome launch flags, image2pipe streaming into FFmpeg) — secondary source summary via [search aggregation incl. dev.to review](https://dev.to/andrew-ooo/hyperframes-review-heygens-html-to-video-for-ai-agents-170i) (unverified against code).
- Revideo: scenes are TypeScript generator functions (`makeScene2D`, `yield*` animations); headless `renderVideo()` runs "anywhere Node and a headless browser run", incl. Cloud Run; parallelized rendering across workers; React `<Player/>` preview; `<Video/>`/`<Audio/>` with audio export; anonymous PostHog telemetry on by default (`DISABLE_TELEMETRY=true`). Now "the engine behind Midrender." — [Revideo README](https://github.com/midrender/revideo)
- ManimCE: `--renderer [cairo|opengl]`; `-t/--transparent` renders with alpha; `--format [png|png-sequence|gif|mp4|webm|mov]`; quality presets up to `-qk` 3840x2160@60fps; `--max-inflight-encoders` overlaps encoding with rendering (no documented multi-machine parallel rendering). — [Manim configuration docs](https://docs.manim.community/en/stable/guides/configuration.html)
- Theatre.js: README still says "Theatre.js 1.0 is around the corner"; core Apache, studio AGPL-3.0; still integrated downstream by Threlte (@threlte/theatre). It is an animation/keyframe editor library, not a video renderer. — [theatre-js/theatre](https://github.com/theatre-js/theatre), [ecosyste.ms index](https://awesome.ecosyste.ms/projects/github.com%2Ftheatre-js%2Ftheatre), [@threlte/theatre](https://www.npmjs.com/package/@threlte/theatre)

**Scaling**
- Remotion Lambda limits: default 1000 concurrent executions per region per account (lower for new accounts), function timeout max 15 min, RAM up to 10 GB, disk up to 10 GB; renders split across many functions. — [Remotion Lambda limits](https://www.remotion.dev/docs/lambda/limits)
- HyperFrames has an AWS Lambda distributed render package (`@hyperframes/aws-lambda`); its own guide calls Remotion Lambda "a mature, heavily documented rendering system" and its own "newer." — [HyperFrames README](https://github.com/heygen-com/hyperframes); [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)

**Alpha / codecs (Remotion, documented)**
- Alpha via WebM VP8/VP9 + `yuva420p` (PNG frames) or ProRes `4444`/`4444-xq` + `yuva444p10le` for FCP/Premiere/Resolve. WebM alpha can **flicker at Lambda chunk boundaries** (VP8/VP9 alpha depends on earlier frames) — docs recommend ProRes for transparent Lambda renders. `<OffthreadVideo>` needs `transparent` prop (slower). — [Remotion transparent videos](https://www.remotion.dev/docs/transparent-videos)

### Inferences
- Both web engines (Remotion, HyperFrames) share the same physical pipeline (headless Chrome screenshot → FFmpeg), so they share the same ceiling: anything Chrome can render (CSS, SVG, Canvas, WebGL/three.js, Lottie) is available, and color/precision is limited to 8-bit sRGB browser compositing before encoding. True 10-bit/HDR or wide-gamut broadcast deliverables are not natively a strength of either (not verified in docs — see Gaps).
- HyperFrames' 75.7k stars accrued in ~7.5 months since repo creation (2026-03-10); star velocity is a weak quality signal and may reflect HeyGen marketing reach. Remotion's 69k stars come with ~5+ years of production history and 539 patch releases in v4.
- Motion Canvas (last real code Feb 2025) and Theatre.js (last code Apr 2024) should be treated as unmaintained for a new pipeline core. Revideo is alive but small (19 commits in 2026) and now a company's (Midrender) engine.

### Gaps
- No primary-source benchmark numbers for render speed (fps/minute) for any engine; HyperFrames' only speed data is a single unrepeated agent run (see below).
- Not verified: Remotion/HyperFrames support for 10-bit, HDR, Rec.709 tagging accuracy, or color-managed pipelines. I found no docs page on color accuracy in the Remotion transparent-video docs.
- Revideo's history as a Motion Canvas fork is from background knowledge; the current README only says it "borrows concepts from Remotion and Rive" and is "zero dep" in its core.
- I did not verify a maintained standalone Lottie-to-video renderer repo; Lottie is covered as an adapter inside HyperFrames (README) and Remotion (`@remotion/lottie`, not fetched this session).

## How well does each work with AI coding agents?

### Takeaway
HyperFrames was designed agent-first (plain HTML, non-interactive CLI, linter, 7 skills, Claude Code plugin, 27 KB llms.txt). Remotion has caught up with an official 13-skill set, markdown-negotiated docs and an llms.txt. Motion Canvas/Revideo only have large llms.txt dumps; Manim has none.

### Cited Findings
- HyperFrames: "Write HTML. Render video. Built for agents." Ships 7 skills; core set `/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry` (~450 ready-made blocks: transitions, kinetic type, captions, charts, maps, 3D, camera moves), `/media-use`; on-demand `/figma`, `/slideshow`, `/remotion-to-hyperframes`. Claude Code plugin via `claude plugin marketplace add heygen-com/hyperframes`; also Codex, Cursor, Gemini CLI, Copilot. CLI non-interactive by default; includes lint, frame inspection, timeline edit. — [HyperFrames README](https://github.com/heygen-com/hyperframes)
- Remotion official skills (repo `remotion-dev/remotion/packages/skills`, install `npx skills add remotion-dev/skills` or `gh skill install remotion-dev/skills`): `/remotion-best-practices`, `-create`, `-markup`, `-studio`, `-render`, `-maps`, `-captions`, `-saas`, `-interactivity`, `-docs`, `-license` (from v4.0.540), `-upgrade`, `-multimedia` (Mediabunny). Targets Claude Code, Codex, Kimi Code, Cursor. — [Remotion skills docs](https://www.remotion.dev/docs/ai/skills)
- Remotion docs: append `.md` to any docs URL for raw markdown; docs honor `Accept: text/markdown`, so agents like Claude Code fetch markdown automatically. — [Remotion AI docs](https://www.remotion.dev/docs/ai)
- A third-party source claims Remotion deprecated its MCP server in favor of Agent Skills — not confirmed in official docs. — [search summary of tella.com / composio](https://www.tella.com/blog/how-to-use-remotion-agent-skills-with-claude-code)
- llms.txt HTTP checks (2026-10-30): remotion.dev/llms.txt 200 (2.2 KB index); hyperframes.heygen.com/llms.txt 200 (27 KB); motioncanvas.io/llms.txt 200 (121 KB); docs.re.video/llms.txt 200 (1.19 MB); docs.manim.community/llms.txt 404. — direct `curl` of each URL ([remotion](https://www.remotion.dev/llms.txt), [hyperframes](https://hyperframes.heygen.com/llms.txt), [motion canvas](https://motioncanvas.io/llms.txt), [revideo](https://docs.re.video/llms.txt))
- Revideo README: "A scene is plain TypeScript, so Claude or Codex can produce one from a prompt." (marketing claim, no skills shipped). — [Revideo README](https://github.com/midrender/revideo)
- Head-to-head agent test (HyperFrames' own guide, i.e. vendor-authored): one unrepeated Claude Code (Opus 5.5) run, Remotion 12m30s vs HyperFrames 11m50s to MP4; guide admits "a single run decides nothing about quality"; HyperFrames needs no node_modules (Remotion ~950 MB). — [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)
- Community anecdote (secondary): HyperFrames described as easier to start but token-hungry, slower and weaker at design than Remotion. — [search aggregation, e.g. cutback.video comparison](https://cutback.video/blog/hyperframes-vs-remotion-vs-selects) (anecdotal, unverified)

### Inferences
- For an agent-driven pipeline, HyperFrames' HTML + `data-*` timeline is the lowest-friction authoring surface, but its silent-failure determinism contract (paused timelines, no wall clock) means the pipeline must run its linter and frame-diff checks. Remotion's "pure function of frame" model fails more loudly and is easier to verify, at the cost of a React/bundler project.
- Both now have first-party skills, so "agent support" no longer differentiates strongly; quality of the component catalog (HyperFrames ~450 blocks vs Remotion templates/ecosystem) matters more.

### Gaps
- No independent, repeated benchmark of agent success rate or visual quality across engines.
- Did not verify whether Remotion currently ships an MCP server.

## What production users and showcases exist?

### Takeaway
Remotion has the longest production record (official showcase, GitHub Unwrapped, self-reported 300+ companies); HyperFrames is used in production at HeyGen and lists ~10 adopters; Manim's showcase is 3Blue1Brown-style math content.

### Cited Findings
- HyperFrames ADOPTERS.md production list: HeyGen (powers AI video composition/rendering across its product), tldraw (automated PR walkthrough videos), reap.video, Typeframe, THU-MAIC/OpenMAIC, Mini Course Generator, PandaStudio, Skyflo; "exploring": TanStack, OptinMonster. — [HyperFrames ADOPTERS.md](https://github.com/heygen-com/hyperframes/blob/main/ADOPTERS.md)
- Remotion: official showcase page (not accepting new submissions); automation page cites GitHub Unwrapped; success story MakeStories (Web Stories → MP4 rendering service); "300+ companies" is Remotion's own marketing figure. — [Remotion showcase](https://remotion.dev/showcase), [Remotion automate](https://www.remotion.dev/automate), [success stories](https://v3.remotion.dev/success-stories)
- Revideo powers Midrender. — [Revideo README](https://github.com/midrender/revideo)

### Inferences
- Showcases for all engines skew toward explainer, product-launch, data-viz, captions and personalized-video use; I found no evidence of broadcast-network (TV) deliverables produced on any of these engines.

### Gaps
- Fireship/Remotion link unconfirmed. No verified broadcast/TV production case studies for any engine.

## Known limitations and failure modes

### Takeaway
Browser-capture engines inherit headless-Chrome problems (fonts, memory/shm, GPU, chunk-boundary codec artifacts); Manim is limited in typography/compositing and scaling; dormant engines carry maintenance risk.

### Cited Findings
- Remotion fonts: renders run in a fresh headless Chrome, so fonts visible in Studio can be missing; load via `@remotion/fonts`/`@remotion/google-fonts` (uses `delayRender()`); macOS system fonts absent on Linux render servers. — [crepal.ai blog (third-party)](https://crepal.ai/blog/aivideo/blog-how-to-use-custom-fonts-in-remotion/)
- Remotion memory: a user limited to `--concurrency 2` by memory; containers mis-detect cores and spawn too many Chrome instances. — [remotion-dev discussion #862](https://github.com/orgs/remotion-dev/discussions/862)
- Remotion GPU: an older default GL backend could crash long renders via a small memory leak; default now left to Chrome except on Lambda. — [Remotion Chromium flags](https://cloudrun.remotion.dev/docs/chromium-flags)
- Headless Chrome in Docker crashes from insufficient `/dev/shm`; fix via larger `--shm-size`. — [webscraft headless Chrome guide](https://webscraft.org/blog/obmezhennya-headless-chrome-tipovi-problemi-v-prodaksheni?lang=en)
- Remotion alpha: WebM alpha flicker at Lambda chunk boundaries; use ProRes 4444. — [Remotion transparent videos](https://www.remotion.dev/docs/transparent-videos)
- HyperFrames: determinism rules "fail quietly"; Studio "neither replaces editing the source for real structural changes"; Lambda path newer; migration skill flags (does not translate) React state/`useEffect`/third-party React UI. — [HyperFrames vs Remotion guide](https://hyperframes.heygen.com/guides/hyperframes-vs-remotion)
- HyperFrames requires Node ≥22. — [HyperFrames README](https://github.com/heygen-com/hyperframes)
- Revideo sends telemetry by default. — [Revideo README](https://github.com/midrender/revideo)
- Theatre.js studio is AGPL-3.0 (copyleft concern if embedded in a distributed product). etro and reactive-video are GPL-3.0. — [Theatre.js](https://github.com/theatre-js/theatre); GitHub API license fields for [etro](https://github.com/etro-js/etro), [reactive-video](https://github.com/mifi/reactive-video)

### Inferences
- For broadcast deliverables, plan to render ProRes 4444 (alpha) or high-bitrate intermediates and do final color/loudness conformance (Rec.709 tagging, EBU R128/ATSC A/85) in a separate FFmpeg/NLE stage; none of the engines documents broadcast-compliance tooling.

### Gaps
- No source on color accuracy / color-space tagging for Remotion or HyperFrames output; no HN thread found on Remotion flicker/color.

## Recommendation

### Takeaway
Use **HyperFrames** or **Remotion** as the rendering core; add **Manim** only as a specialist sub-renderer for math/diagram scenes. Avoid Motion Canvas, Theatre.js, editly as the core due to dormancy.

### Cited Findings
- HyperFrames: Apache-2.0, "no per-render fees or commercial-use thresholds", agent skills + ~450 block catalog, Lambda rendering, production at HeyGen. — [HyperFrames README](https://github.com/heygen-com/hyperframes)
- Remotion: most mature Lambda, larger ecosystem; but 4+ person companies pay ($25/seat/mo or $0.01/render, $100/mo min), and 5.0 will count contractors and forbid BYO-code render services. — [remotion.pro/license](https://www.remotion.pro/license), [PR #3750](https://github.com/remotion-dev/remotion/pull/3750)

### Inferences
- **Primary pick for an AI-agent pipeline: HyperFrames** — permissive license (no future license risk if the pipeline becomes a product/service), HTML authoring that LLMs write natively, adapter model that admits GSAP/Lottie/three.js (the tools motion designers already use), and first-party skills. Mitigate its youth (v0.x, ~7 months old, very high release cadence → API churn) by pinning versions and adding frame-diff regression tests.
- **Strong alternative: Remotion** — if the team is ≤3 people (free) or accepts the license, it is the safer, more battle-tested engine with more deterministic-by-construction semantics and a mature Lambda. Avoid it if the pipeline will be offered as a rendering service to third parties (prohibited by 5.0 terms).
- **Manim (CE)** for mathematically precise explainer segments, composited as ProRes/mov alpha layers.
- **Theatre.js** could serve only as a keyframe-authoring UI layered on a web renderer, but it is unmaintained since 2024 and studio is AGPL.

### Gaps
- No apples-to-apples render-speed or visual-quality benchmark exists; recommendation relies on maintenance, licensing and architecture rather than measured output quality.
