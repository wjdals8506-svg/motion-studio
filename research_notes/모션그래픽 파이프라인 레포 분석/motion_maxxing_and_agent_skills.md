# motion-maxxing and comparable AI-agent motion-graphics skill repos

All GitHub numbers were observed on **2026-10-30** through the GitHub API (`gh api repos/...`). Stars move daily, and third-party lists quote older snapshots, so the counts below differ from those in other sources. "Verified" means I read it from the API, the file tree or the file contents. "Claim" means the README asserts it and I could not check it independently.

---

## 1. motion-maxxing: identity, metadata, engine, structure, principles, workflow, evidence

### Takeaway
The repo is spelled **"motionmaxxing"**, with no hyphen. Its URL is https://github.com/Tejashmakwana/motionmaxxing. It is a single Claude Code / SKILL.md agent skill by Tejas Makwana, published 2026-10-06 as one 2-commit code dump, and it had 1,134 stars and 108 forks by 2026-10-30. It does not target Remotion. It ships its own seek-safe GSAP runtime (`runtime/motion.js`) on plain HTML, renders frame by frame through headless Chrome and ffmpeg, and declares compatibility with HyperFrames. Its value is in the craft data it encodes: 12 ease curves fitted to measured moves, numeric timing laws, a "never ship" list, and scripted render gates G0-G5. The before/after demos and the measurement corpus are the author's own and have not been independently tested.

### Cited Findings

**Name collision / disambiguation (verified)**
- `gh search repos motion-maxxing` (with the hyphen) returns no relevant repo, only an unrelated spam repo. `gh search repos motionmaxxing` returns the real one plus derivatives — [GitHub search](https://github.com/search?q=motionmaxxing&type=repositories)
- **Tejashmakwana/motionmaxxing** is the original and the most relevant. Its description: "Looksmaxxing for motion graphics. An agent skill that turns AI slop videos into films that look made by a motion designer." — [repo](https://github.com/Tejashmakwana/motionmaxxing)
- Other repos share the name or build on it, all with 0-2 stars: `subh05sus/motionmaxxing-releases` (a macOS brew package, releases only, no source); `GuilhermeRossiKirsten/motionmaxxing` (no description); `ghostbyte0x/reelmaxxing` (a reels skill "built on motionmaxxing", 2 stars); `mgbn01/motion-kit` (a Portuguese "V3 layer over motionmaxxing"); `222103-1/motion-glare`; `almanalaysay93-gif/designme` (a 23-agent studio that bundles motionmaxxing) — [GitHub search](https://github.com/search?q=motionmaxxing&type=repositories)
- The top forks (massinissa92, Wilson9u, and others) have 0-1 stars and none has been pushed since 2026-10-06, so no active fork lineage exists — [forks API](https://github.com/Tejashmakwana/motionmaxxing/forks)

**Metadata (verified, 2026-10-30)**
- Stars 1,134; forks 108; watchers 5; open issues 1; license Apache-2.0; created 2026-10-06T18:18Z; last push 2026-10-06T18:20Z; repo size about 21.8 MB; topics: agent-skills, ai, claude-code, gsap, hyperframes, motion-graphics, motionmaxxing, video — [repo API](https://api.github.com/repos/Tejashmakwana/motionmaxxing)
- **Only 2 commits**, both by Tejashmakwana on 2026-10-06: "motionmaxxing: looksmaxxing for motion graphics" and "docs: trim license line". There are no releases. The development history is not public; the repo is a snapshot — [commits](https://github.com/Tejashmakwana/motionmaxxing/commits/main)
- The single issue (#1, open, 2026-10-16, by thekeith) reads "Stop browser automation from leaving Chrome clones behind on macOS" — [issues](https://github.com/Tejashmakwana/motionmaxxing/issues/1)
- Owner account: created 2021-09-02, 14 followers, 22 public repos, no bio. The README links X handle @makwanatejas170 and says the skill "lives inside FinalMotion" (finalmotion.video) — [user API](https://github.com/Tejashmakwana), [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
- The README labels its status "early release". It "works end to end on the author's machine and has been used on a handful of real briefs, but it has not had a wide test" — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)

**Engine / tech stack (verified from the tree and files)**
- The engine is `runtime/motion.js`, "one plain `<script>` on top of GSAP, with no build step". GSAP 3.12.5 is vendored (`runtime/vendor/gsap.min.js`). The film is plain HTML (`templates/film.html` becomes `film/index.html`) — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md), [runtime/README.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/runtime/README.md)
- Rendering is "Deterministic frame-by-frame render through Chrome and ffmpeg" (`scripts/render.mjs`, which uses the DevTools protocol). It requires Node 22+, Python 3, ffmpeg and Google Chrome. ElevenLabs (voice, SFX, music) and the Codex CLI image generator are optional — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
- `hero3d` provides vendored Three.js r186 (logo extruded from SVG, coin, glass slab, phone) with bloom and depth of field. `native-ui` provides true-proportion iOS furniture. Inter Variable is the default font — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
- **HyperFrames relationship:** the SKILL.md description says it works "in HyperFrames or plain HTML". `providers.sh` checks for HyperFrames. The skill says it wins over the HyperFrames house style where they disagree ("decoratives, ghost text, hairlines, eyebrow or progress patterns, bold headings") — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md), [references/world.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/references/world.md)
- **License caveat:** GSAP is under the GreenSock Standard License, which the README itself says "is not open source". The Apache-2.0 license covers only the skill's own code — [README / NOTICE](https://github.com/Tejashmakwana/motionmaxxing/blob/main/NOTICE)
- Rendering defaults: 1920x1080, 30 fps. The runtime supports `clock: 'smooth'` or `'twos'` (animation on twos). WebGL hero scenes render at about 7-11 fps at 1080p on an Apple GPU — [runtime/README.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/runtime/README.md), [KNOWN-LIMITS](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/KNOWN-LIMITS.md)

**Directory structure (verified)**
- `SKILL.md` (about 20 KB): the laws, a 12-item "never ship" list, the gates and the 10-step process.
- `references/` holds 14 craft files of 9-60 KB each: judgment, idea, world, director, brand, layout, motion, transitions, type, ui-demo, close, sound-sync, slop, tools. About 470 KB of craft text in total.
- `runtime/` holds motion.js, hero3d/, native-ui/, fonts and vendored GSAP and Three.js.
- `scripts/` has 13 files: providers.sh, brand.mjs, fetch_logo.mjs, precedent.py, imagegen.py, voice.py, sync.mjs, mix.py, render.mjs, look.py, lint.mjs, blind_review.py, _cdp.mjs.
- `library/moments.jsonl` has 716 rule-only precedent rows.
- `taste/verdicts.md` and `taste/edits.md` record the user's rejections and before/after fixes.
- `studies/` holds calibration strips of invented brands.
- `examples/` contains demo, 3d-hero, phone and selftest.
- `docs/` contains HOW-IT-WAS-BUILT, KNOWN-LIMITS and the showcase media.
- Source: [repo tree](https://github.com/Tejashmakwana/motionmaxxing)

**Encoded principles (verified as content; the numbers are claims about the author's private corpus)**
- **Method (claim):** 53 frame-accurate "pro moments" (3-7 s each) from published launch films were recreated as GSAP timelines. Six model-assisted analyst agents, reviewed by a human, turned them into about 150 WHEN/DO/BECAUSE rules. Seeking every frame at 29.97 fps yielded 4,288 distinct moves. The source films are kept private and are not redistributed — [HOW-IT-WAS-BUILT](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/HOW-IT-WAS-BUILT.md)
- **12 measured eases (claim for the fit; the functions themselves are shipped as `M.ease.*`):** cruise (linear, 18% of moves), glide 14%, softInOut 14%, softLand 9% (12 f), gentleIn 9%, snapSettle 6%, whip 6% (7 f), accelExit 5%, crashOut 4%, popOver 2%, crashIn 1%, bounceHard <1%. "89% of measured moves fall within RMSE 0.12 of one of them" — [HOW-IT-WAS-BUILT](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/HOW-IT-WAS-BUILT.md)
- **Timing numbers (claim):** the median move is 10 f (0.33 s); translate and scale entries take 11-12 f, opacity 6 f, blur 7-8 f. Landings ease out 58% of the time and exits ease in 37%. Overshoot appears in 8.8% of moves and is late. Logos crash in from about 3.5x; "nothing grows from zero". Transform entries outnumber opacity fades 3,392 to 584. 96% of moments use hard cuts, a median of about 20 per moment, and the cuts land on motion. The median sibling stagger is 3 f. The median camera push is 1.46x. End holds run 0.6-1.4 s — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md), [HOW-IT-WAS-BUILT](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/HOW-IT-WAS-BUILT.md)
- **12 craft laws in SKILL.md:**
  - every beat "buys one belief"
  - show it, then say it
  - the last frame of one shot hands off to the first frame of the next
  - cut on motion
  - landings decelerate and exits accelerate
  - almost nothing fades
  - arrivals come from oversize
  - no dead frames
  - one system per film (one clock, one blur grammar, one accent)
  - one focal point inside a built world
  - words move at speech rhythm (2-12 f apart)
  - demos are physical (the cursor parks, a press squashes 2-3 f)

  [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- **Typography and layout defaults:** the brand's own face, else Inter at 400-550 weight in sentence case. Headlines run 7-11% of frame height (9% typical), supporting type 5-7%, hero numbers 22-29% (used once). Wordmarks run 0.22-0.38 of frame width. Hooks last 3-6 s, proofs 3-7 s, and the CTA 2-3.5 s and no more than 25% of the film. Cuts come every 0.3-2.3 s — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- **"Never ship" list:** page chrome/HUD (corner labels, counters such as "02 / SPEAK", timecodes, progress bars); deck layouts ("headline left, device right"); generic web-component UI cards; the name's first association; invented stats; slogan copy ("Not just X. It's Y."); a house style used as a default (giant cropped word, circle wipe, caret-typed headline); flat swatch grounds; pinned objects; web-footer endings; self-certification; a film that was never looked at — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- **Slop autopsy (claim):** 25 ranked default patterns from rejected AI films. Several were caused by the skill's own earlier wording ("alternate flat grounds", "a recurring carrier"), and the fix was to rewrite the skill — [HOW-IT-WAS-BUILT](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/HOW-IT-WAS-BUILT.md)
- **Gates (verified as scripts):**
  - G0, render exists — `look.py`
  - G1, proof readable: UI text at least 0.04 H — judged by eye
  - G2, no run of more than 3 flat frames — `look.py`
  - G3, end hold at most 1.4 s and final shot at most 25% — `look.py`
  - G4, one hero per frame — judged by eye
  - G5, no page chrome — `lint.mjs`, a DOM lint with rule IDs C1-C7, D1, P1, T1, V1-V5

  [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)

**Brief-to-video workflow (verified from SKILL.md)**
- The process has 10 steps:
  - 0: toolbox and taste (`providers.sh`; read taste/verdicts)
  - 1: brand capture from a URL (`brand.mjs` writes board.png, BRAND.md, fonts and screens; `fetch_logo.mjs` pulls the official mark from SVGL, Simple Icons or the site, and never redraws a logo)
  - 2: "one true thing", plus the PAGE frame (Problem, Audience, Goal, Emotion)
  - 3: at least 3 ideas of different kinds, cover-the-logo and competitor-swap tests, and an optional `precedent.py` lookup
  - 4: `STORYBOARD.md` with the world per act and a beat table (role, "buys", copy, entry/exit, handoff, frames)
  - 5: optional VO (`voice.py` with ElevenLabs, then `sync.mjs` to align word timings to frames, at 2.5-3 words/s)
  - 6: build the hardest beat first, check stills, and run `Motion.selfTest` for seek-determinism
  - 7: half-scale render, `look.py` (contact sheet, cuts, gates), `lint.mjs`, then fixes in a fixed priority order over 2-3 passes
  - 8: SFX, music and a mix to -14 LUFS / -1 dBTP (`mix.py`)
  - 9: final render with optional shutter blur and grain; deliverables are final.mp4, index.html, STORYBOARD.md and a **mandatory NOTE.md** that quotes the gate numbers and never certifies the film as good

  [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- The idea and storyboard go to the user for approval before the build — [README protocol](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
- `blind_review.py` builds a randomised A/B page, and the user's reactions are appended to `taste/verdicts.md`. This is a persistent taste memory — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)

**Evidence of output quality**
- Three before/after comparisons are committed as MP4/GIF: Cluely (30 s with sound, 1920x600 side-by-side), Spotify (15 s) and Wispr Flow (24 s with sound). README claim: both Cluely arms were "generated with GPT-6.1" and the difference is the skill — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md), [docs/media](https://github.com/Tejashmakwana/motionmaxxing/tree/main/docs/media)
- README claim: in the author's blind A/B rounds on an earlier generation of the skill, "9 of 10 picks went to the with-skill film; one rater, so read it as a signal, not a benchmark" — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
- A third-party Traditional Chinese tutorial (AI郵報, 24 Oct 2026) calls it an early version. It labels the demos "非本站實測" (not tested by this site) and the comparisons as the author's own material, not an independent benchmark — [aiposthub](https://www.aiposthub.com/ai-animation-motionmaxxing-prompt-workflow/)
- motionmaxxing is listed in zhuyansen/awesome-claude-video-skills, graded "SAFE" on security, but it is **not** among the 16 skills that list ran end to end — [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)
- The self-reported known limits:
  - the lint cannot see text inside a canvas, WebGL or images
  - G1 and G4 are judged by eye
  - `look.py` counts show/hide events as cuts (the hero banner reports 33 "cuts")
  - ElevenLabs music misses tempo and length
  - the SFX normaliser can corrupt very short clips
  - `fetch_logo.mjs` can return a header ribbon instead of the mark
  - `brand.mjs` fails on sites that block headless Chrome

  [KNOWN-LIMITS](https://github.com/Tejashmakwana/motionmaxxing/blob/main/docs/KNOWN-LIMITS.md)
- Aggregator listings exist (EveryDev.ai, SkillsLLM). I found no independent reviews or ratings — [EveryDev](https://www.everydev.ai/tools/motionmaxxing), [SkillsLLM](https://skillsllm.com/skill/motionmaxxing)

### Inferences
- 1.1k stars in 24 days with a 2-commit history, a low-follower owner and a link to a commercial product (FinalMotion) suggest a viral launch, likely from X, rather than a proven, maintained project. Treat it as a well-documented **craft knowledge base** rather than as maintained software.
- The most reusable parts for our pipeline do not depend on the engine: the 12 named eases, the numeric timing tables, the never-ship list, the G0-G5 gate definitions, and the NOTE.md honesty contract. They can be ported to Remotion (`Easing.bezier`) or HyperFrames.
- The GSAP license (not open source) and the ElevenLabs dependency are practical constraints if we adopt the runtime directly.

### Gaps
- I could not verify the 53-moment corpus, the 4,288-move measurement or the ease fit. The source recreations are private by design.
- No independent render tests of motionmaxxing exist. Its before/after videos are self-produced.
- I did not open the X announcement thread or check for HN/Reddit discussion of motionmaxxing. The search found only aggregator and tutorial pages.
- I did not look into what FinalMotion (finalmotion.video) is or how it relates commercially.

---

## 2. Comparable repos that package motion-design expertise for AI agents

### Takeaway
The field is crowded. One curated awesome list counts 379 video-skill repos. The credible anchors are three official vendor packs: **HyperFrames skills (HeyGen)**, **remotion-dev/skills** and **greensock/gsap-skills**. A handful of individual-author craft packs (Barty-Bart, charlie947, onetake, explainroo) add direction and taste on top. Motion Canvas and Manim have only thin, mostly hobby-grade agent tooling.

### Cited Findings (all metadata observed 2026-10-30)

| Repo | Maintainer | Stars / forks | Last push | License | What it encodes | Maturity |
|---|---|---|---|---|---|---|
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) (skills in `skills/`) | HeyGen (org) | 75,745 / 6,899 | 2026-10-30; release v0.8.221 on 2026-10-30 | Apache-2.0 | HTML-to-video by seeking a paused GSAP timeline; skills: hyperframes, hyperframes-cli, hyperframes-registry, media-use, remotion-to-hyperframes, slideshow, figma (370 files under `skills/`) | Official and very active (several releases per day) |
| [remotion-dev/skills](https://github.com/remotion-dev/skills) | Remotion (org; commits by Jonny Burger) | 5,899 / 656 | 2026-10-26; 93 commits | none set in API (Remotion's own license applies to the framework) | 12 skills: best-practices, create, markup, studio, render, captions, docs, interactivity, maps, multimedia, saas, upgrade | Official; mostly API correctness, little design direction |
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills) | GreenSock (org) | 17,533 / 1,081 | 2026-07-29; 24 commits | MIT | 8 skills: gsap-core, timeline, scrolltrigger, plugins, utils, react, frameworks, performance | Official; API correctness for web animation, not video direction |
| [Tejashmakwana/motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing) | Tejas Makwana | 1,134 / 108 | 2026-10-06 (2 commits) | Apache-2.0 | See section 1 | Early release, single dump |
| [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) | Bart (individual; sells a Skool course) | 942 / 140 | 2026-10-13; 10 commits | NOASSERTION (README says MIT) | 6 skills: motion-broll (B-roll timed to a transcript), object-separation, explainer-high-energy (12-20 s beat-locked kinetic type), explainer-default (45-90 s UI-rebuild demo), explainer-engaging (10-30 s one-take), sound-effects | Individual, focused |
| [charlie947/motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills) | Charlie Hills (newsletter author) | 487 / 67 | 2026-10-11; 28 commits | MIT | 15 skills: brand-intake, motion-brief-writer, launch-video, apple-launch-film, vox-explainer, animated-chart, title-sequence-3d, reel-export, reference-to-motion, motion-prompt-writer, and others; built on HyperFrames; "rules that came out of real rejected drafts" | Individual; has a validate script |
| [feitangyuan/onetake](https://github.com/feitangyuan/onetake) | individual | 3,514 / 240 | 2026-10-21 | NOASSERTION | "Motion films that never cut to the next slide… one continuous camera, continuity measured by an oracle" | Individual; was a top-2 pick in the awesome-list test |
| [vincentsch/explainroo](https://github.com/vincentsch/explainroo) | individual | 690 / 49 | 2026-10-20 | MIT | Explainers and product demos: local Kokoro voice, Whisper word timing, canvas renderer to narrated MP4 | Individual; fastest in the awesome-list test |
| [vibe-motion/skills](https://github.com/vibe-motion/skills) | vibe-motion (org) | 1,450 / 89 | 2026-10-05 | none | 16 effect-specific skills (brand-launch-video-star, disney-animation-rule-skill, remotion-3d-ticker, threejs-earth-render…) | Small org |
| [digitalsamba/claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit) | Digital Samba (org) | 2,387 / 404 | 2026-10-28 | MIT | "AI-native video production toolkit for Claude Code" | Company-maintained |
| [calesthio/OpenMontage](https://github.com/calesthio/OpenMontage) | individual | 73,163 / 9,573 | 2026-10-28 | AGPL-3.0 | "12 production pipelines, 100+ tools, 700+ agent skill and production-knowledge files" | Large; AGPL |
| [haidrrrry/claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill) | individual | 721 / 98 | 2026-08-12; 9 commits | MIT | A single Remotion motion-graphics SKILL.md plus a demo | Hobby; stale |
| [Liamrjohnston/remotion-motion-graphics-skill](https://github.com/Liamrjohnston/remotion-motion-graphics-skill) | individual | 147 / 14 | 2026-07-24 | MIT | 4 Remotion skills: motion-graphics, cinematic-camera, article-highlights, terminal-inserts | Hobby; stale |
| [abhiemj/manim-mcp-server](https://github.com/abhiemj/manim-mcp-server) | individual | 655 / 96 | 2025-05-19; 11 commits | MIT | An MCP server that runs Manim code | Abandoned (no push for 17 months) |
| [apoorvlathey/motion-canvas-skills](https://github.com/apoorvlathey/motion-canvas-skills) | individual | 2 / 0 | 2026-01-26; 3 commits | MIT | A Motion Canvas SKILL.md | Negligible |
| [zhuyansen/awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills) | individual (Agent Skills Hub) | 1,242 / 122 | 2026-10-29; 45 commits | NOASSERTION | Awesome list: 379 repos by type, each security-graded, plus an end-to-end test of 16 | Active curation |

Further details:
- **HyperFrames skill contract and process:**
  - 12 hard contract rules: `class="clip"` with data-start/duration; one paused timeline per composition registered on `window.__timelines`; no `Date.now()`, unseeded random numbers or `repeat:-1`; animate transforms, not left/top; and others.
  - A work loop for films over about 15 s: `references/story.md` (three storylines, the person picks), then `SPEC.md` ("every adjective as a number, the defaults banned by name, the shots by frame"), then `check --json`, then `snapshot --review`, then `REVIEW.md`.
  - The render happens only after the person approves the Studio preview.

  [skills/hyperframes/SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- **HyperFrames motion reference:** "Measured frame by frame from the official HyperFrames launch films".
  - Fast moves take 0.3-0.6 s with motion blur.
  - "Arrive slow, leave clean"; ease by role: expo.out/power4.out on arrival, power2.inOut on camera moves, power3.in on exits.
  - "The same `power2.out` at 0.5 s on everything is the flat default that makes a film feel generated."
  - Springs by damping ratio: 0.7-0.85 reads premium.
  - Exits are 40-50% shorter than entrances; overlap at 30-50%; stagger letters 1 f apart, words 60-120 ms, list items 40-80 ms.
  - Beat-grid frames per beat = fps×60/BPM, computed per index to avoid drift.
  - Cut at the fastest frame of a move.

  [references/motion.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/motion.md)
- **HyperFrames review reference:** `check` warns on `line_unread`, `dead_stretch` (more than 3 s with no change), `text_below_floor` (under 2.6% of the short side), `first_frame_empty` and `film_silent` (over 15 s with no sound). `snapshot --review` writes contact sheets per scene and beat, a strip across every cut (−0.2 to +0.2 s), and phone-width (360 px) sheets. The agent describes each beat frame "as a stranger would" — [references/review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md)
- **HyperFrames per-type references:** launch, explainer, music, data, vertical, 3d and character, plus storyboard, spec, sound and captions — [repo tree](https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes/references)
- **Official HeyGen demo:** `heygen-com/website-to-hyperframes-demo` (73 stars, 1 commit, 2026-04-20) ships SCRIPT.md, STORYBOARD.md and index.html — [repo](https://github.com/heygen-com/website-to-hyperframes-demo)
- **remotion-markup:** a technical-correctness skill. Drive animation with `useCurrentFrame()` and `interpolate()`; CSS transitions and Tailwind animation classes will not render; use `Easing.bezier()`/`Easing.spring()`; get fps from `useVideoConfig()`; preserve user edits. Install with `npx skills add remotion-dev/skills`. Docs at remotion.dev/docs/ai/skills — [remotion-markup SKILL.md](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/SKILL.md), [README](https://github.com/remotion-dev/skills)
- **Awesome-list test of 16 skills** (a single 15-second, 5-line brief):
  - All 16 passed 4 basic checks, and so did Claude Code with no skill, which made a passing film in 4.4 min.
  - Times: explainroo 2.0 min; remotion-dev/skills 4.5 min, "close to the no-skill film"; Barty-Bart 4.7 min, "a look of its own"; charlie947 7.0 min, "close to the no-skill film"; onetake 8.5 min; hyperframes 23.5 min, "a look of its own".
  - Picks: explainroo for speed, onetake for one-idea films, remotion-dev/skills to build your own design.
  - The "look" ratings were judged by eye by the list author, a single rater.

  [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills), [RESULTS.md](https://github.com/zhuyansen/agent-skills-hub/blob/main/ops/video-runs/RESULTS.md)
- **Motion Canvas:** the core repo has 19,595 stars, MIT, last push 2026-07-02. The only agent tooling found is negligible: apoorvlathey/motion-canvas-skills (2 stars) and trenaudie/MotionCanvasAgent (0 stars, last updated 2025-07) — [motion-canvas](https://github.com/motion-canvas/motion-canvas), [GitHub search](https://github.com/search?q=motion+canvas+agent&type=repositories)
- **Manim:** ManimCommunity/manim has 42,018 stars and was pushed 2026-10-29; 3b1b/manim has 95,891. Agent tooling is small: mathifylabs/ManimAgentPrompts (18 stars, an open system-prompt spec for "layout-safe" Manim, last push 2026-01); bassimeledath/manimate (4 stars, an agent skill); paulnegz/manim-mcp (22 stars) — [ManimCommunity](https://github.com/ManimCommunity/manim), [GitHub search](https://github.com/search?q=manim+mcp&type=repositories)

### Inferences
- **Credible and active:** the HyperFrames skills (official, daily releases, the deepest process references) and remotion-dev/skills (official, weekly updates). gsap-skills is official but last pushed 2026-07-29 and covers web animation rather than video direction.
- The official Remotion skills make renders reliable but carry no taste. Per the awesome-list test their unprompted films look like the default, so a professional pipeline must add its own direction layer on top: motionmaxxing-style laws, or the HyperFrames story/spec/review loop.
- Individual craft packs (Barty-Bart, charlie947, onetake, motionmaxxing) launched in a burst between late September and early October 2026, most with few commits and some already idle. Treat them as idea sources, not dependencies.
- For math or explainer diagrams, Manim agent tooling is immature and the main MCP server is abandoned. A custom wrapper would be needed.

### Gaps
- I did not read the full SKILL.md files of Barty-Bart, charlie947, onetake or explainroo, so their specific craft rules are not captured here.
- No one has run an independent quality benchmark that includes motionmaxxing alongside the HyperFrames skills.
- I did not fetch the hyperframes.heygen.com docs or the remotion.dev AI docs pages directly; their content is summarised from the repo files.
- The star counts in the awesome list's test table (for example "hyperframes 60,291") are from an earlier snapshot than my 2026-10-30 figures.

---

## 3. What the best ones encode that a professional pipeline should copy

### Takeaway
The strongest repos (motionmaxxing and the HyperFrames skill) agree on one pattern. **Direction comes before animation, with human approval gates. Motion values are numeric and role-based rather than one default ease. Every frame must be a deterministic function of time. Machine-checked review runs on the actual render, with an honest note instead of self-certification.**

### Cited Findings
- **Stage-gated direction:**
  - motionmaxxing: brand inventory, then PAGE, then 3 or more idea kinds with cover-the-logo tests, then STORYBOARD.md with a "buys ___" line per beat. The idea and storyboard are shown to the user before the build — [motionmaxxing SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
  - HyperFrames: three storylines, the person picks, SPEC.md turns adjectives into numbers, and the render happens only after the preview is approved — [hyperframes SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- **Role-based easing instead of one default:**
  - motionmaxxing: "Land decelerates, leave accelerates", 12 named eases, a median move of 10 f, overshoot rare — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
  - HyperFrames: "Ease by role"; exits 40-50% shorter; a flat `power2.out` 0.5 s everywhere "makes a film feel generated" — [motion.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/motion.md)
- **Cutting grammar:**
  - motionmaxxing: cut on motion, scenes start already moving, no default fade to black — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
  - HyperFrames: cut at the fastest frame with matched direction and speed — [motion.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/motion.md)
- **Determinism / seek-safety:**
  - motionmaxxing: `Motion.selfTest` proves that jumping to a frame equals playing to it — [README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md)
  - HyperFrames: no `Date.now()`, unseeded random numbers or timers — [hyperframes SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
  - Remotion: everything is frame-driven via `useCurrentFrame()`, and CSS animations are banned — [remotion-markup](https://github.com/remotion-dev/skills/blob/main/skills/remotion-markup/SKILL.md)
- **Render-based QA with numbers:**
  - motionmaxxing: G0-G5 (no more than 3 flat frames, end hold ≤ 1.4 s, the chrome lint) — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
  - HyperFrames: `dead_stretch` over 3 s, `text_below_floor` at 2.6%, `first_frame_empty`, cut strips, phone-width sheets — [review.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/review.md)
  - Both have the agent describe each frame "as a stranger would" before judging.
- **An explicit anti-slop list:** page chrome, deck layouts, caret-typed headlines, stat slides and slogan copy are named and banned — [motionmaxxing SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- **Honesty artifact:** a mandatory NOTE.md that quotes the script numbers, separates real from generated, and never certifies quality — [motionmaxxing SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md). The HyperFrames equivalent is REVIEW.md — [hyperframes SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- **Real assets over invented ones:**
  - motionmaxxing: capture the brand from its URL and fetch official logos, never redrawing them — [SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
  - HyperFrames: "Show real things from their source… draw only what has none" — [hyperframes SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- **Taste memory:** blind A/B review with verdicts appended to `taste/verdicts.md` — [motionmaxxing SKILL.md](https://github.com/Tejashmakwana/motionmaxxing/blob/main/SKILL.md)
- **Audio standards:** -14 LUFS / -1 dBTP mix, word-level VO alignment to frames, and silence before the hit — [motionmaxxing README](https://github.com/Tejashmakwana/motionmaxxing/blob/main/README.md). A beat grid computed per index to avoid drift — [HyperFrames motion.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/references/motion.md)
- **Counterpoint:** in the awesome-list test, Claude Code with no skill passed the same 4 functional checks. The author's view is that "A skill earns its place with a look, a workflow, or footage to edit" — [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)

### Inferences
- motionmaxxing and the HyperFrames motion reference independently converge on near-identical timing doctrine: decelerating arrivals, accelerating and shorter exits, rare and late overshoot, cuts on motion, and stagger of about 1 f for letters. That convergence is the strongest available signal that these values are sound defaults.
- The best design for our system is probably the official engine layer (HyperFrames or Remotion skills) for correctness, a direction and gate layer modelled on motionmaxxing (never-ship list, numeric laws, G0-G5, NOTE.md), and stage approvals between story, spec/storyboard, hero-beat stills and the full render. This matches the user's existing stage-gated preference.

### Gaps
- No controlled evidence shows that any of these skills beats a strong baseline prompt on professional-grade quality. All the quality evidence is either self-produced or rated by eye by one person.
