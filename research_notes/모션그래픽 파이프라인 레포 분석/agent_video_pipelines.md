# Open-source "topic/brief → finished video" agent pipelines (motion-graphics focus)

Observation date for all repo numbers: **2026-10-30**, taken from the GitHub REST API (`gh api repos/<owner>/<repo>`). "Pushed" is the date of the last git push (`pushed_at`), not the API's `updated_at`, which also changes when a repo is starred. Statements marked **[README]** are the project's own claims and were not tested. **[paper]** marks numbers from the authors' own arXiv paper. **[verified]** marks something read directly from repo files or API metadata.

## Q1. Which repos exist, and which are credible?

### Takeaway
Three groups are clearly credible. (a) Peer-reviewed code-as-video research agents: Code2Video (ICML 2026), TheoremExplainAgent (ACL 2025 Oral) and Paper2Video. (b) Production frameworks built for coding agents: HyperFrames (~75.7k★, Apache-2.0), Remotion plus its official agent skills and prompt templates. (c) Very popular stock-footage short makers: MoneyPrinterTurbo (~136k★) and ShortGPT, which do no motion graphics. Several names in the brief did not check out as expected. "MotionAgent" (ModelScope) is stale and is a generative-video app. The best-known "VideoAgent" repos are about video understanding and editing, not motion graphics.

### Cited findings — inventory (verified via GitHub API, 2026-10-30)

**Code-as-video, motion graphics / explainer (most relevant)**
| Repo | ★ | Last push | Created | License | Stack | Credibility notes |
|---|---|---|---|---|---|---|
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | 75,745 | 2026-10-30 | 2026-03-10 | Apache-2.0 | TS; HTML/CSS/GSAP → headless Chrome → FFmpeg | Backed by HeyGen and actively developed. Ships 7 agent skills plus a ~450-block catalog **[README]** |
| [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | 69,019 | 2026-10-30 | 2020-06-23 | Source-available (API: NOASSERTION; "company license needed for some entities") | React → video | Mature engine. AI support comes via [remotion-dev/skills](https://github.com/remotion-dev/skills) (5,899★, pushed 2026-10-26) and templates |
| [remotion-dev/template-prompt-to-motion-graphics-saas](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas) | 288 | 2026-10-16 | — | Remotion license | Next.js + LLM → Remotion TSX | Official prompt-to-motion-graphics template |
| [remotion-dev/template-prompt-to-video](https://github.com/remotion-dev/template-prompt-to-video) | 169 | 2026-10-16 | — | Remotion license | OpenAI + ElevenLabs → timeline.json → Remotion | Official template. It is a mirror of `packages/template-ai-video` in the monorepo |
| [showlab/Code2Video](https://github.com/showlab/Code2Video) | 2,186 | 2026-08-24 | 2025-09-29 | MIT | Python, Manim CE 0.19 | ICML 2026; NeurIPS 2025 DL4C workshop **[README]** |
| [TIGER-AI-Lab/TheoremExplainAgent](https://github.com/TIGER-AI-Lab/TheoremExplainAgent) | 1,513 | 2025-07-27 | 2025-02-16 | MIT | Python, Manim, LiteLLM, Kokoro TTS | ACL 2025 main, Oral **[README]**. No push in about 15 months |
| [showlab/Paper2Video](https://github.com/showlab/Paper2Video) | 2,398 | 2026-03-05 | 2025-10-03 | MIT | Python, Beamer slides, CAMEL | NeurIPS 2025 SEA workshop **[README]** |
| [OpenSenseNova/SenseNova-6.8-Code2Video](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video) | 209 | 2026-10-27 | 2026-10-24 | none in API | Fine-tuned Qwen3.8-27B model + Claude Code skill `code-video` | Brand new (6 days old at observation). Qualitative results only, by the authors' own statement **[README]** |
| [HarleyCoops/Math-To-Manim](https://github.com/HarleyCoops/Math-To-Manim) | 2,812 | 2026-10-29 | 2025-01-20 | MIT | Python, Manim; several harnesses (Codex SDK, Google ADK, Claude) | Hobby or individual project, but very active. The README admits some films are unrendered **[README]** |
| [marcelo-earth/generative-manim](https://github.com/marcelo-earth/generative-manim) | 935 | 2026-09-17 | 2023-03-20 | Apache-2.0 | GPT/Claude → Manim; web app + API | Early pioneer. Now points users to its successor desktop app, "Animo" **[README]** |
| [nexu-io/html-video](https://github.com/nexu-io/html-video) | 4,785 | 2026-06-21 | 2026-05-27 | Apache-2.0 | Meta-layer over HyperFrames; 21 templates | From the Open Design team. Only the HyperFrames engine is wired up; Remotion and Motion Canvas are "Planned" **[README]** |
| [latent-spaces/brag](https://github.com/latent-spaces/brag) | 19,544 | 2026-10-23 | 2026-06-16 | MIT | Agent skill on HyperFrames ("/brag-slim" variant uses no HyperFrames) | Popular single-purpose launch-video skill |
| [MrTsepa/manim-ai-agent](https://github.com/MrTsepa/manim-ai-agent) | 13 | 2026-03-11 | 2026-01-08 | MIT | Manim harness for coding agents | Tiny, but its render → review loop is clean (see Q2) |
| [qnguyen3/STEMViz](https://github.com/qnguyen3/STEMViz) | 80 | 2025-10-04 | 2025-10-02 | NOASSERTION | Manim + LLM | Small; abandoned after 2 days of pushes |

**Stock-footage / slideshow short makers (not motion graphics; useful for TTS, subtitle and asset plumbing)**
| Repo | ★ | Last push | License | Notes |
|---|---|---|---|---|
| [harry0703/MoneyPrinterTurbo](https://github.com/harry0703/MoneyPrinterTurbo) | 136,420 | 2026-10-30 | MIT | Highest-starred repo in the space. Topic → script → stock clips (Pexels/Pixabay/Coverr) + TTS + subtitles **[README]** |
| [RayVentura/ShortGPT](https://github.com/RayVentura/ShortGPT) | 8,090 | 2025-02-10 | MIT | Stale (no push in about 20 months) |
| [gyoridavid/short-video-maker](https://github.com/gyoridavid/short-video-maker) | 1,448 | 2025-06-21 | MIT | Remotion-based MCP/REST server. Stale since 2025-06 |
| [ATH-MaaS/Pixelle-Video](https://github.com/ATH-MaaS/Pixelle-Video) | 29,571 | 2026-06-14 | Apache-2.0 | "AI fully automated short video engine". The API redirected from AIDC-AI/Pixelle-Video. README not reviewed |

**Generative-video "AI director" agents (shot/storyboard pipelines over T2V/I2V models, not code)**
| Repo | ★ | Last push | License | Notes |
|---|---|---|---|---|
| [HKUDS/ViMax](https://github.com/HKUDS/ViMax) | 12,804 | 2026-09-30 | MIT | Idea2Video and Script2Video; v1.2.0 Web UI dated 2026-07-20 **[README]** |
| [HITsz-TMG/VideoClaw](https://github.com/HITsz-TMG/VideoClaw) | 1,882 | 2026-08-26 | MIT | A request for `HITsz-TMG/FilmAgent` returned this repo (created 2024-08-29), so FilmAgent appears to have been renamed or redirected. Script → character/scene design → storyboard → reference frames → Wan/Kling video → edit **[README]** |
| [HKUDS/VideoAgent](https://github.com/HKUDS/VideoAgent) | 1,980 | 2026-07-22 | MIT | EMNLP 2026. Video *understanding, editing and remaking*, per the repo description. Not a brief-to-motion-graphics pipeline |
| [modelscope/motionagent](https://github.com/modelscope/motionagent) | 316 | 2024-09-02 | Apache-2.0 | "Convert ideas into motion pictures" (repo description). Stale for more than 2 years; generative video, not motion graphics |

**Benchmarks released as repos**
- [code2video-compass/Code2Video-Compass](https://github.com/code2video-compass/Code2Video-Compass): 8★, created 2026-10-21, Apache-2.0 code, CC BY-NC 4.0 dataset (see Q4).

### Inferences
- Credibility (peer review, stars, maintenance) splits into two sources. Academia supplies the strongest evidence about the pipeline *pattern*: planner/coder/critic agents and VLM layout critique, with measured gains. Industry (HyperFrames, Remotion) supplies the strongest *production substrate*: deterministic rendering, linting, contact-sheet review and design tokens. No single repo combines rigorous evaluation with a production-grade motion-graphics engine.
- Star counts in the HTML-video/agent-skill space (HyperFrames 75k in 7 months, brag 19.5k in 4.5 months) show very fast hype-driven growth. They indicate adoption interest, not output quality.
- The research Manim repos (TheoremExplainAgent; Code2Video less so) are slowing down. They are best treated as reference designs, not dependencies.

### Gaps
- No repos were found named exactly "storyboard-to-animation" or with an "AutoAgents-style" video pipeline. The GitHub searches `"storyboard agent video generation"`, `"text to animation agent"` and `"motion graphics llm"` returned zero results.
- I did not read the Pixelle-Video, VideoAgent (HKUDS) or MotionAgent READMEs in depth, so their pipelines are characterised only from repo descriptions.
- I found no independent quality audit (third-party review or bake-off) of any of these repos.

---

## Q2. Per-repo pipeline: stages, intermediate artifacts, visual feedback, quality evidence

### Takeaway
Every strong motion-graphics pipeline follows the same shape: **brief → structured plan/storyboard (JSON or Markdown spec) → per-scene code → render → automated checks (compile/lint) → visual review of rendered frames (VLM or the agent itself, on contact sheets) → targeted code fix**. The stock-footage tools stop at **script → keyword search → stock clips → TTS/subtitles → compose** and have no visual QA.

### Cited findings

**Code2Video (showlab)**
- Three agents. The **Planner** expands the storyboard. The **Coder** synthesises debuggable Manim code. The **Critic** refines layout "with anchors". The best Manim code came from Claude-4-Opus; the critic uses Gemini (gemini-2.5-pro-preview-05-06) — [README](https://github.com/showlab/Code2Video)
- Planner stages: an outline (sections with id, title, content summary, examples, audience awareness), then a storyboard (each section → title, lecture lines, paired animations), then **asset retrieval**. An asset prompt identifies the needed visuals, which are kept in a persistent cache reused across sections. Reference images come from Google Images, icons/logos from IconFinder — [arXiv 2510.01174 (HTML)](https://arxiv.org/html/2510.01174)
- Critic **"visual anchor prompt"**: the canvas is discretised into a **6×6 anchor grid** mapped to Manim coordinates. Placement works at point level (small labels) and region level (large elements). An **occupancy table** records each element's anchors, scale and *code lines*, so a visual defect can be traced back to the source code and free anchors can be found. The critic checks the rendered video plus code for overlap, occluded lecture lines and large empty areas — [arXiv HTML](https://arxiv.org/html/2510.01174)
- **ScopeRefine** auto-fix escalates in three steps: fix the error line ±1 (up to K₁ tries), then the lecture-line block (K₂ tries), then regenerate the whole section from its storyboard. The paper does not give K values — [arXiv HTML](https://arxiv.org/html/2510.01174)
- Artifacts on disk: `json_files/` (topic lists, metadata), `prompts/`, `assets/icons` (cache), `assets/reference`, `CASES/<prefix>/` outputs — [README](https://github.com/showlab/Code2Video)
- Quality evidence **[paper]**: on the 117-topic MMMC benchmark, Code2Video with Claude Opus 4.1 scores Aesthetics 87.9 and TeachQuiz 86.0. Direct code generation with the same LLM scores 37.8 and 40.0. Human 3Blue1Brown videos score 99.7 and 97.1. Veo3 scores 9.0 and 2.5. Cost is about 13.8 min and 43.1K tokens per video, against 2.8 min and 2.3K for direct generation — [arXiv HTML Table 1](https://arxiv.org/html/2510.01174)
- Human study **[paper]**: Code2Video (Claude Opus 4.1) scores Aesthetics 81.8 and Quiz 80.3, against 96.5 and 78.8 for human 3B1B. The paper reports aesthetics–quiz correlation r = 0.971 — [arXiv HTML Table 8](https://arxiv.org/html/2510.01174). The abstract headline is "40% improvement over direct code generation" — [arXiv abs](https://arxiv.org/abs/2510.01174)

**TheoremExplainAgent (TIGER-AI-Lab)**
- Prompt files in the repo show these stages **[verified]**: scene plan → **vision storyboard** → **technical implementation** → **animation narration** → code generation → fix error → `prompt_visual_self_reflection` → `prompt_visual_fix_error`. Further files cover a Manim cheatsheet, color cheatsheet, font size, banned reasonings, plugin detection, and RAG query generation per stage — [repo tree, task_generator/prompts_raw](https://github.com/TIGER-AI-Lab/TheoremExplainAgent)
- CLI flags: `--use_rag` (Chroma DB over Manim docs), `--use_visual_fix_code` ("Use VLM to fix code with rendered visuals"), `--use_context_learning`, `--only_plan` (generates the scene outline and implementation plans only, which is a natural approval gate), `--only_render`, `--only_combine`, and per-scene concurrency — [README](https://github.com/TIGER-AI-Lab/TheoremExplainAgent)
- Results **[paper]**: 240-theorem TheoremExplainBench, 5 automated metrics, o3-mini agent success rate 93.8% and overall score 0.77, and "most of the videos exhibit minor issues with visual element layout" — [arXiv 2502.19400](https://arxiv.org/abs/2502.19400)

**Paper2Video / PaperTalker (showlab)**
- Input is LaTeX paper source plus reference image and audio. Stages: Beamer slide generation with **tree-search visual choice for layout refinement** (`--if_tree_search`, default True), subtitling, cursor grounding, speech synthesis and talking-head rendering. Generation is parallel per slide. Built on the CAMEL multi-agent framework — [README](https://github.com/showlab/Paper2Video); [arXiv 2510.05096](https://arxiv.org/abs/2510.05096)
- `--beamer_templete_prompt` is an optional style-guidance text, which works as a crude style guide — [README](https://github.com/showlab/Paper2Video)

**HyperFrames (HeyGen) — the most production-oriented agent loop found**
- Render contract **[verified, skills/hyperframes/SKILL.md]**: timed elements carry `class="clip"`, `data-start` and `data-duration`. Each composition registers one paused GSAP timeline. Banned: `Date.now()`, unseeded `Math.random()`, network fetches and infinite repeats, so "everything visible is a function of timeline time". Content stays in the 90% action-safe box and key text in the 80% title-safe box. Copy, brand colours and swappable media are variables (`data-var-text`, `var(--id)`) — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- Work loop with a **human gate** **[verified]**: for a new film over ~15 s, the agent writes **three storylines in words only** and the person picks one. It then writes `SPEC.md`, where "every adjective is a number" and default tells are "banned by name". After that come `hyperframes check --json` (lint), `snapshot --review` and `REVIEW.md`. Rendering happens only after the person approves the Studio preview, unless they asked for no stops — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- Visual QA **[verified, references/review.md]**:
  - `check` warns on measurable craft issues: `line_unread` (a line on screen too briefly), `dead_stretch` (>3 s with nothing changing), `text_below_floor` (text below 2.6% of the frame's short side) and `first_frame_empty`.
  - `snapshot --review` writes three contact sheets: scene start/mid plus beats, cut strips (−0.2 s to +0.2 s), and beats at 360 px phone width.
  - Each issue is logged as `t=… · where · problem → exact change · what stays`, ranked P0/P1/P2.
  - The rules say "Never score the film out of 10", and an optional fresh-eyes sub-agent receives only `STORYBOARD.md` and the sheets.
  - [review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md)
- Design system: **frame.md** is "your design system, ready for video", a `DESIGN.md` superset that inverts web design tokens for the camera, with a gallery of named looks. The catalog has ~450 blocks (transitions, kinetic type, charts, maps, 3D) — [README](https://github.com/heygen-com/hyperframes) **[README]**
- The skill routes by video type (launch, explainer, music, data, vertical, 3D, character) to per-type reference docs, with `references/motion.md` covering eases, cuts and "defaults that look generated" — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)

**SenseNova 6.8 Code2Video (SenseTime OpenSenseNova)**
- A fine-tuned Qwen3.8-27B (512K context) driven through Claude Code with a `code-video` skill. The workflow is: write a spec, render every frame as a function of time, review contact sheets as images, verify the delivered file. There are eight craft guides. A prompt-enhancement template expands a short request into `dense_prompt.md` (a "production brief") using a strong model. Deliverables are `out/final.mp4` and `SPEC.md`, with "at least two visual review passes" — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video) **[README]**
- Runs take **10+ hours and 2,000+ turns**. The authors say the model is "clearly behind the strongest proprietary models on visual polish", and they report qualitative examples only — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)
- The full trajectories (messages, tool calls, rendered review images) are published on HF, which is useful for studying real agent loops — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)

**Math-To-Manim (HarleyCoops)**
- A six-stage chain of **validated JSON artifacts**: `01_intent.json` → knowledge map → curriculum → math dossier → shot list → `06_scene_spec.json`. Each stage prompt contains the stage charter, the previous stage's JSON and a shared **"Cinematic Charter"** (a style guide). Tools include `execute_math_check` (AST/NumPy sandbox to verify maths) and `verify_scene` — [README](https://github.com/HarleyCoops/Math-To-Manim) **[README]**
- In one documented run the model "reviewed its own renders. Four passes over contact sheets", with each revision logged. A separate "Jev" critic is "advisory by default". Renders are done in parallel animation ranges and verified with ffprobe — [README](https://github.com/HarleyCoops/Math-To-Manim) **[README]**
- The README states that one headline film "is not yet rendered" — [README](https://github.com/HarleyCoops/Math-To-Manim)

**manim-ai-agent (MrTsepa)**
- Loop: plan → implement → render → review (GIF + key frames) → self-critique → **external GPT-vision critique, scored 0–10** → iterate until score ≥ 9, then ask the user about higher quality. A scene library (`scene_library.yaml`), reusable `layouts.py` and `primitives.py`, and a `@register_scene` registry let each scene reuse earlier work — [README](https://github.com/MrTsepa/manim-ai-agent). Contrast this with HyperFrames, which explicitly bans 0–10 scoring because "a score finds nothing to fix" — [review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md)

**Remotion official AI templates**
- *Prompt-to-motion-graphics*: User Prompt → **Validation** (a cheap classifier rejects non-visual prompts) → **Skill Detection** (injects guidance skills such as charts, typography, transitions, sequencing, spring-physics, social-media and 3d, plus example-code skills) → one-shot code generation → sanitisation → in-browser Babel compile → live preview. The generated code follows a **"constants-first design"**: all text, colours and timing are declared as editable constants at the top. There is no render-and-critique loop — [README](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas)
- *Prompt-to-video*: a CLI generates the story script, images (OpenAI) and voiceover with timestamps (ElevenLabs), then assembles a **`timeline.json`** with Elements (backgrounds plus enter/exit transitions and animations), Text and Audio blocks synced by timestamps. Remotion renders the timeline — [README](https://github.com/remotion-dev/template-prompt-to-video)
- Agent skills: `remotion-best-practices`, `-captions`, `-create`, `-docs`, `-interactivity`, `-maps`, `-markup`, `-multimedia`, `-render`, `-saas`, … **[verified dir listing]** — [remotion-dev/skills](https://github.com/remotion-dev/skills)

**html-video (nexu-io)**
- Pipeline: source fetch (URL or repo → Markdown) → the agent reads the material plus the chosen template's style → emits a **content-graph** IR (nodes: entity, data, text; edges: sequence, dependency, contrast) that is topologically sorted into frame order and timing → one self-contained animated HTML file per frame → HyperFrames renders each to webm → ffmpeg concat, with optional MiniMax music and narration. "The agent decides the storyboard and the engine decides how to draw it" — [README](https://github.com/nexu-io/html-video)

**Stock-footage group**
- MoneyPrinterTurbo: LLM script → stock clips from Pexels, Pixabay or Coverr (or the user's own media) → many TTS options (Edge TTS free, Azure, ElevenLabs, Kokoro, …) → subtitles from TTS timestamps (default "edge" mode) or faster-whisper — [README](https://github.com/harry0703/MoneyPrinterTurbo)
- ShortGPT: an "LLM oriented video editing language", where an `EditingEngine` uses "Editing Markup Language and JSON". It has short/long/translation engines, Pexels and web asset sourcing, TinyDB persistence and MoviePy rendering — [README](https://github.com/RayVentura/ShortGPT)
- short-video-maker: per scene, text + Pexels search terms → Kokoro TTS → Whisper captions → Pexels background → Remotion composition. Fallback search terms are `nature`, `globe`, `space`, `ocean`. English-only voice. Exposed over MCP and REST for n8n agents — [README](https://github.com/gyoridavid/short-video-maker)

**Generative "AI director" group**
- ViMax: Idea2Video and Script2Video, covering story, characters, script, storyboard, shots and video. It includes **reference-image management and consistency checks** (the README notes image generators "may generate unusable images even if given the correct… reference"), an Agent Loop/TUI for plan revision, and render checkpoints — [README](https://github.com/HKUDS/ViMax)
- VideoClaw: script → character/scene design (reference art) → storyboard (shot angle, action, references) → reference frames → video (first-frame, first+last-frame, or reference-image modes on Wan or Kling) → edit. The user can intervene at any stage. It added Pixelle-Video HTML templates for explainer shorts (2026-05-13) — [README](https://github.com/HITsz-TMG/VideoClaw)

### Inferences
- The visual-feedback loop is the main differentiator between the motion-graphics tools and the slideshow makers. Its forms are a VLM critic on rendered frames (Code2Video, TEA's `--use_visual_fix_code`, manim-ai-agent), contact-sheet self-review (HyperFrames, SenseNova, Math-To-Manim) and tree-search over layout candidates (Paper2Video).
- The two strongest ideas for fixing layout are complementary and do not compete. Code2Video's **anchor grid + occupancy table** makes VLM feedback actionable by mapping pixels to code lines. HyperFrames's **measurable lint rules** (text floor, dead stretch, unread lines, safe areas) catch problems that a VLM misses on a contact sheet.
- Two styles of critic appear: numeric score gating (manim-ai-agent: iterate to ≥ 9/10) and ranked, actionable defect lists (HyperFrames P0/P1/P2 with an exact change per issue). The second style is the more professional pattern.

### Gaps
- Code2Video's critic iteration count and its K₁/K₂ values are not stated in the paper.
- I did not open TEA's `prompt_visual_self_reflection.txt` to confirm what the VLM sees (single frames or the full video).
- None of the motion-graphics agent repos publish a sample gallery with failure rates. Apart from the papers, quality evidence is the authors' own showcase videos.

---

## Q3. Recurring architecture patterns worth reusing

### Takeaway
Six patterns recur among the best systems:
1. A staged pipeline with persisted, schema-validated artifacts per stage (intent → outline → storyboard → spec → scene code).
2. A numeric spec / design-token layer that the code reads from.
3. Retrieval of both API knowledge (RAG over docs, curated skills and examples) and visual assets, with caching.
4. Deterministic code rendering, so fixes are local edits.
5. A two-tier QA loop: machine-checkable lint first, then visual review of contact sheets with a defect list that maps back to code.
6. Explicit human approval gates at storyline/plan and at preview, before the final render.

### Cited findings
- **Structured storyboard / staged artifacts**:
  - Code2Video's outline → storyboard (lecture lines + animations) — [arXiv HTML](https://arxiv.org/html/2510.01174)
  - TEA's scene plan → vision storyboard → technical implementation → narration — [repo](https://github.com/TIGER-AI-Lab/TheoremExplainAgent)
  - Math-To-Manim's six validated JSON files, `01_intent.json` … `06_scene_spec.json` — [README](https://github.com/HarleyCoops/Math-To-Manim)
  - html-video's content-graph IR — [README](https://github.com/nexu-io/html-video)
  - Remotion's `timeline.json` — [README](https://github.com/remotion-dev/template-prompt-to-video)
  - HyperFrames's `SPEC.md` + `STORYBOARD.md` + `REVIEW.md` — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md), [review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md)
- **Design tokens / style system**:
  - HyperFrames frame.md (a DESIGN.md superset for video) and brand colours as CSS variables — [README](https://github.com/heygen-com/hyperframes), [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
  - Remotion's constants-first generated code — [README](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas)
  - Math-To-Manim's "Cinematic Charter" injected into every stage — [README](https://github.com/HarleyCoops/Math-To-Manim)
  - TEA's color and font-size cheatsheet prompts — [repo](https://github.com/TIGER-AI-Lab/TheoremExplainAgent)
- **"Every adjective as a number" spec**: HyperFrames SPEC.md, with generated-looking defaults banned by name — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md). SenseNova says coordinates, durations, beats and camera paths are "explicit numbers that can be checked against the brief" — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)
- **Critic / verifier loops**: Code2Video Critic (VLM + anchor grid) and ScopeRefine for compile errors — [arXiv HTML](https://arxiv.org/html/2510.01174); TEA visual self-reflection and VLM code fix — [repo](https://github.com/TIGER-AI-Lab/TheoremExplainAgent); HyperFrames lint, contact sheets, P0–P2 notes and an optional fresh-eyes sub-agent — [review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md); Math-To-Manim math verification tool — [README](https://github.com/HarleyCoops/Math-To-Manim); Paper2Video tree search over layouts — [README](https://github.com/showlab/Paper2Video)
- **Human approval gates**: HyperFrames (pick 1 of 3 storylines; render only after preview approval) — [SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md); TEA `--only_plan` — [README](https://github.com/TIGER-AI-Lab/TheoremExplainAgent); manim-ai-agent asks the user before a high-quality render — [README](https://github.com/MrTsepa/manim-ai-agent); VideoClaw lets the user intervene at each stage — [README](https://github.com/HITsz-TMG/VideoClaw); ViMax Agent Loop for plan revision — [README](https://github.com/HKUDS/ViMax)
- **Asset retrieval**: Code2Video (IconFinder + Google Images, persistent per-run cache) — [arXiv HTML](https://arxiv.org/html/2510.01174); HyperFrames `/media-use` and the ~450-block registry, "use before hand-building any named visual" — [README](https://github.com/heygen-com/hyperframes); stock search in MoneyPrinterTurbo and short-video-maker — [MPT](https://github.com/harry0703/MoneyPrinterTurbo), [SVM](https://github.com/gyoridavid/short-video-maker)
- **Knowledge retrieval for code correctness**: TEA RAG over Manim docs — [README](https://github.com/TIGER-AI-Lab/TheoremExplainAgent); Remotion skill detection that injects only the relevant guidance and examples — [README](https://github.com/remotion-dev/template-prompt-to-motion-graphics-saas)
- **Determinism and editability**: HyperFrames "same input, same frames, same output" — [README](https://github.com/heygen-com/hyperframes); SenseNova's iterative note → code edit → re-render — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)
- **Prompt enhancement → dense brief** before production: SenseNova `dense_prompt.md` — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)
- **Scene-level parallelism**: TEA `--max_scene_concurrency`; Paper2Video slide-wise parallelism; ViMax parallel shot generation — [TEA](https://github.com/TIGER-AI-Lab/TheoremExplainAgent), [arXiv 2510.05096](https://arxiv.org/abs/2510.05096), [ViMax](https://github.com/HKUDS/ViMax)

### Inferences
- A professional pipeline could reasonably combine these stages:
  1. Brief → dense brief.
  2. Human gate: pick a storyline.
  3. Storyboard JSON with per-scene beats, durations and anchor/region placements.
  4. Design tokens (a frame.md-style file) that the scene code consumes as variables.
  5. Per-scene code built from a block library.
  6. Lint with numeric craft rules.
  7. Contact-sheet critic with P0/P1 lines traced back to the scene file.
  8. Human gate at preview.
  9. Final render.

  Every stage in this list is used by at least one credible repo above.
- Code2Video's paper is the only source with a controlled ablation-style comparison (agentic vs direct code, same LLM). It showed roughly 2× aesthetics and quiz scores. That is the best available evidence that the planner + critic overhead (~5× time, ~19× tokens with Claude Opus 4.1) pays off.

### Gaps
- No repo publishes a formal JSON Schema for its storyboard that I verified file-by-file. Math-To-Manim mentions "strict contract validation" of six JSON artifacts, but I did not open the schemas.
- No evidence was found on how well VLM critics agree with professional motion designers' judgement. Code2Video's r = 0.971 is between its own aesthetics and quiz metrics, not between critic and expert.

---

## Q4. Published evaluations / benchmarks of agent-generated video quality

### Takeaway
There are four main benchmarks: MMMC/TeachQuiz (Code2Video, 117 topics), TheoremExplainBench (240 theorems, 5 metrics), the Paper2Video benchmark (101 papers, 4 metrics) and Code2Video-Compass (2,104 tasks; HTML/SVG/Canvas/Three.js rendered via Remotion; 15 MLLMs; Oct 2026). PhysicsSolutionAgent (Jan 2026) adds a 15-metric automated checker. No public leaderboard of motion-graphics agent quality was found, and SenseNova explicitly calls a systematic benchmark "an important open problem".

### Cited findings
- **MMMC (Code2Video)**: 117 curated topics inspired by 3Blue1Brown. Metrics are TeachQuiz (a VLM "unlearns" the topic and then must recover it by watching the video), VLM-as-judge aesthetics across 5 dimensions, and efficiency (tokens, time). Headline numbers are in Q2 — [README](https://github.com/showlab/Code2Video); [arXiv HTML](https://arxiv.org/html/2510.01174); dataset at [HF YanzheChen/MMMC](https://huggingface.co/datasets/YanzheChen/MMMC)
- **TheoremExplainBench**: 240 theorems across STEM, 5 automated metrics. The evaluation needs Gemini and GPT-4o and includes image, text and video eval prompts. o3-mini scores 93.8% success and 0.77 overall — [arXiv 2502.19400](https://arxiv.org/abs/2502.19400); [repo eval_suite](https://github.com/TIGER-AI-Lab/TheoremExplainAgent)
- **Paper2Video benchmark**: 101 papers with author-made talks. Metrics are Meta Similarity, PresentArena, PresentQuiz and IP Memory; PresentQuiz and IP Memory use Gemini-generated questions — [arXiv 2510.05096](https://arxiv.org/abs/2510.05096); [README](https://github.com/showlab/Paper2Video)
- **Code2Video-Compass** (arXiv 2610.28416, released Oct 2026):
  - 2,104 tasks (T2V 718 / I2V 693 / V2V 693), 10 categories and 24 subtypes.
  - Code is HTML/CSS, SVG, Canvas or Three.js, **rendered through Remotion**.
  - 12 objective metrics: execution success, token consumption, technical quality, aesthetic quality, motion smoothness, local/global text-video alignment, perceptual/structural fidelity, sequence alignment, appearance and motion fidelity.
  - 5 subjective, Gemini-judged metrics: instruction following, content coherence, visual design, motion quality, viewer engagement.
  - 15 MLLMs were evaluated. Per-task QA checklists are included.
  - [README](https://github.com/code2video-compass/Code2Video-Compass). It is the closest existing benchmark to "motion graphics as code".
- **PhysicsSolutionAgent** (arXiv 2601.13453, Jan 2026): physics explainer videos up to 6 min on Manim, with VLM feedback for iterative improvement and 15 automated quantitative checks. On 32 videos it reports 100% completion and an average automated score of 3.8/5 with GPT-5-mini. Failure modes are "visual layout inconsistencies and errors in how visual content is interpreted during feedback". No code repo was found on the abstract page — [arXiv 2601.13453](https://arxiv.org/abs/2601.13453)
- SenseNova reports qualitative results only: "We have not yet built a systematic benchmark for code-driven video" — [README](https://github.com/OpenSenseNova/SenseNova-6.8-Code2Video)
- Community discussion is thin. The HN Algolia search found "Show HN: HyperFrames" (2026-04-16) with 6 points and 0 comments, and "Show HN: Generate short videos with one click" (MoneyPrinterTurbo-style, 2024-11-15) with 2 points. Commercial launches in the space drew more discussion: "Launch HN: Golpo – AI-generated explainer videos" (116 points, 93 comments, 2025-08-13) and "Launch HN: Mosaic – Agentic Video Editing" (148 points, 134 comments, 2025-11-19) — [HN 47797513](https://news.ycombinator.com/item?id=47797513), [HN 42150493](https://news.ycombinator.com/item?id=42150493), [HN 44891090](https://news.ycombinator.com/item?id=44891090), [HN 45980760](https://news.ycombinator.com/item?id=45980760)

### Inferences
- Recurring failure mode: TEA ("minor issues with visual element layout" in most videos), PhysicsSolutionAgent ("visual layout inconsistencies"), and Code2Video's design of its critic around overlap, occlusion and empty space all point to **layout as the dominant failure of agent-generated motion graphics**. Layout QA should be the first investment.
- Existing benchmarks score educational effectiveness (quiz-based) or generic visual metrics. None scores brand or design-system adherence, typographic hierarchy or motion craft (easing, holds, cut rhythm). HyperFrames's lint rules come closest, but they are a tool, not a benchmark.
- Code2Video-Compass's Gemini-judged "visual design" and "motion quality" dimensions are probably the most reusable rubric for an internal eval harness.

### Gaps
- I did not obtain Code2Video-Compass leaderboard numbers (which MLLMs rank highest). The README lists the metrics but no results table.
- The breakdown of TheoremExplainBench's five metric names was not read from the paper body.
- No Reddit discussion was checked. HN coverage of these open-source repos is sparse, so independent practitioner opinion on output quality is largely missing.
