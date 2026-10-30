# Animation, Motion-Design and Visual Asset Libraries for a Code-Rendered (Remotion-style) Video Pipeline

All numbers observed **2026-10-30**: GitHub stars and last push from `gh api repos/...`, npm version, release date and weekly downloads (last-week) from registry.npmjs.org / api.npmjs.org. "Deterministic" means the output can be computed from a frame number alone, with no wall clock, rAF loop or accumulated state.

## Animation core: GSAP, Motion, anime.js v4, Theatre.js, react-spring, Remotion packages (URL, stars, last release, license, frame-driven use)

### Takeaway
Remotion's built-ins (`interpolate`, `spring`, `Easing` plus the @remotion/* packages) are the safest base because they are pure functions of the frame. GSAP (via the official `@remotion/gsap`, a paused timeline seeked per frame) and anime.js v4 (`seek()` in ms) are the two third-party engines that work deterministically. Motion/framer-motion and react-spring have no Remotion integration. Theatre.js is effectively dormant. Licensing matters in two places. Remotion itself needs a paid Company License for for-profit orgs with more than 3 employees. GSAP's free Webflow license forbids use in a visual no-code animation builder that competes with Webflow.

### Cited Findings
**Remotion's rule**
- Remotion requires that all animations be driven by `useCurrentFrame()`. Other methods need an integration that syncs timing — [Remotion third-party docs](https://www.remotion.dev/docs/third-party)
- Integration matrix from that page:
  - Supported via a package: GSAP, Lottie, Rive, Three.js, React Native Skia, GIF.
  - Anime.js: example repo only ([remotion-dev/anime-example](https://github.com/remotion-dev/anime-example)).
  - CSS animations: can be synced through `animation-play-state` and `animation-delay`.
  - Framer Motion: no integration, "under discussion" ([issue #399](https://github.com/remotion-dev/remotion/issues/399)).
  - react-spring: no direct compatibility. Use Remotion's own `spring()`.
  - Matter.js: "bake" the physics into a timeline first.
  - Source: [Remotion third-party docs](https://www.remotion.dev/docs/third-party)
- Remotion warns against CSS transitions and animations because they flicker during rendering — [Remotion animating properties](https://www.remotion.dev/docs/animating-properties)
- Deterministic frames are what make distributed renders such as Remotion Lambda possible — [Remotion flickering doc (source)](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/flickering.mdx)

**Remotion itself**
- [remotion-dev/remotion](https://github.com/remotion-dev/remotion): 69,019 stars, pushed 2026-10-30.
- `remotion` 4.0.539, released 2026-10-26, 3,245,130 downloads/week.
- License:
  - Free for individuals, for-profit orgs with up to 3 employees, and non-profits.
  - Otherwise a Company License is required ([remotion.pro](https://www.remotion.pro/license)).
  - The LICENSE notes that "In Remotion 5.0, the license will slightly change" (PR #3750).
  - Source: [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)

**Remotion packages** (all 4.0.539, released 2026-10-26; license is the npm/package.json field; downloads per week)

| Package | What it does | License | Downloads/week |
|---|---|---|---|
| `@remotion/transitions` | Transitions between scenes | `UNLICENSED` in package.json (in practice the Remotion License) | 695,699 |
| `@remotion/shapes` | Generate SVG shapes | MIT | 734,718 |
| `@remotion/paths` | SVG path utilities | MIT | 1,686,994 |
| `@remotion/noise` | Noise generation functions | MIT | 121,831 |
| `@remotion/lottie` | Lottie animations | Remotion License | 65,125 |
| `@remotion/three` | React Three Fiber integration | MIT | 199,763 |
| `@remotion/animation-utils` | Helpers for animating CSS properties | no license field | 49,031 |
| `@remotion/motion-blur` | Motion blur | MIT | 126,304 |
| `@remotion/layout-utils` | Layout and text-fitting utilities | MIT | 206,846 |
| `@remotion/rive` | Rive animations | Remotion License | 7,367 |
| `@remotion/light-leaks` | Light leak effects | Remotion License | 19,392 |
| `@remotion/starburst` | Starburst ray effect | Remotion License | 5,178 |
| `@remotion/svg-3d-engine` | 3D SVG extrusion effects | no license field | 1,810 |
| `@remotion/effects` | Canvas pixel effects | `UNLICENSED` in package.json; docs say Remotion License | n/a |
| `@remotion/gsap` | GSAP timelines in Remotion | MIT | n/a |
| `@remotion/rough-notation` | Rough annotation primitives | MIT | n/a |
| `@remotion/rounded-text-box` | TikTok-like rounded multiline text box | MIT | n/a |
| `@remotion/animated-emoji` | Google Fonts animated emojis | MIT | n/a |
| `@remotion/sfx` | Sound effect library | MIT | n/a |

  - Sources: npm registry; [remotion packages dir](https://github.com/remotion-dev/remotion/tree/main/packages)
- Package contents:
  - `@remotion/paths`: evolvePath, interpolatePath, warpPath, getPointAtLength, getTangentAtLength, cutPath, and others.
  - `@remotion/shapes`: arrow, callout, circle, ellipse, heart, pie, polygon, rect, spark, star, triangle.
  - `@remotion/noise`: 2D, 3D and 4D noise.
  - `@remotion/layout-utils`: measureText, fitText, fitTextOnNLines, fillTextBox.
  - `@remotion/animation-utils`: interpolateStyles, makeTransform.
  - `@remotion/motion-blur`: `<Trail>`, `<CameraMotionBlur>`, and an HTML-in-canvas motion blur.
  - Source: [Remotion docs source tree](https://github.com/remotion-dev/remotion/tree/main/packages/docs/docs)
- `<Trail>` and `<CameraMotionBlur>` work by manipulating the time context. Calling `useCurrentFrame()` outside the blur component breaks the effect — [motion-blur common mistake](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/motion-blur/common-mistake.mdx)
- `@remotion/transitions` ships 23 presentations: blur-slide, book-flip, clock-wipe, cross-zoom, crosswarp, cube, dissolve, dreamy-zoom, fade, film-burn, flip, iris, linear-blur, none, push-cut, ripple, slide, swap, wipe, zoom-blur and zoom-in-out, plus custom and custom-html-in-canvas. Timings: linearTiming, springTiming and custom — [Remotion docs tree](https://github.com/remotion-dev/remotion/tree/main/packages/docs/docs/transitions/presentations)
- Several presentations (film-burn, crosswarp, book-flip and others) are built on HTML-in-canvas and adapted from MIT-licensed gl-transitions shaders. Previewing them needs Chrome with `chrome://flags/#canvas-draw-element` — [film-burn doc](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/transitions/presentations/film-burn.mdx)
  - The guide says "For rendering, you don't need to do anything" — [HTML-in-canvas guide](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/html-in-canvas-guide.mdx)
  - HTML-in-canvas is available from v4.0.455 and is an experimental Chromium API — same source.
- `@remotion/effects` (from v4.0.464):
  - About 80 effects, listed in the docs tree: blur, glow, chromatic-aberration, film-burn, halftone, LUT, lens-blur, fractal-noise, turbulent-displace, shatter, light-leak, page-turn, vignette, zoom-blur, scanlines, tv-signal-off, among others.
  - Applied through an `effects` prop on canvas-based components (`<Solid>`, `<HtmlInCanvas>`, `<Video>`, `<Img>`, `<RemotionRiveCanvas>`, shapes).
  - Custom effects go through `createEffect()` (Canvas 2D, WebGL2 or WebGPU).
  - Sources: [Remotion effects docs](https://www.remotion.dev/docs/effects); [docs tree](https://github.com/remotion-dev/remotion/tree/main/packages/docs/docs/effects)

**GSAP**
- [greensock/GSAP](https://github.com/greensock/GSAP): 29,928 stars, last push 2026-04-13. `gsap` 3.15.0, released 2026-04-13, 7,990,988 downloads/week. npm license field: "Standard 'no charge' license" — npm
- Standard "No Charge" License, published by Webflow, effective 2025-04-30 and last modified 2025-05-30:
  - Free for commercial use.
  - Formerly paid plugins (SplitText, MorphSVG and others) are now free.
  - Prohibited: using GSAP in visual, no-code animation builders that compete with Webflow's animation features without written consent.
  - AI-generated GSAP code is explicitly not a prohibited use.
  - Webflow can terminate the license.
  - Source: [GSAP Standard License](https://gsap.com/standard-license/)
- `@remotion/gsap` (from v4.0.517, MIT) builds a paused GSAP timeline and seeks it to the current frame — [Remotion GSAP docs](https://www.remotion.dev/docs/gsap)

**Motion (formerly framer-motion)**
- [motiondivision/motion](https://github.com/motiondivision/motion): 34,666 stars, pushed 2026-10-30, MIT.
- `motion` and `framer-motion` 14.8.0, released 2026-10-29.
- Weekly downloads: 34,079,637 for `motion` and 67,237,934 for `framer-motion`.
- Packages: motion, framer-motion, motion-dom, motion-utils.
- Source: GitHub/npm
- Its imperative animation controls expose `pause()` and a settable time position "to scrub through the animation" — [motion.dev controls](https://motion.dev/dom/controls)

**anime.js v4**
- [juliangarnier/anime](https://github.com/juliangarnier/anime): 74,058 stars, pushed 2026-08-21, MIT. `animejs` 4.5.0, released 2026-06-22, 1,233,151 downloads/week.
- v4 timelines and animations have `seek(time)` (in ms) and can be created with `autoplay: false` — [anime.js timeline seek](https://animejs.com/documentation/timeline/timeline-methods/seek)
- The Engine exposes `update()`, `pause()` and `resume()`, plus `timeUnit`, `speed`, `fps`, `precision` and `pauseOnDocumentHidden` — [anime.js engine](https://animejs.com/documentation/engine)
- v4 includes `splitText`, `morphTo`, `createDrawable` and `createMotionPath` — same source.
- A third-party tutorial (Chinese, unverified) warns that v4 seeks in ms while GSAP seeks in seconds, so the bridge must use `(frame / fps) * 1000` — [Remotion Lab tutorial](https://remotionlab.pages.dev/tutorials/animejs-v4-integration)

**Theatre.js**
- [theatre-js/theatre](https://github.com/theatre-js/theatre): 12,813 stars, last push **2024-08-14**, Apache-2.0. `@theatre/core` 0.7.2, released **2024-05-19**, 24,403 downloads/week — GitHub/npm
- The README still says 1.0 is "around the corner" and that development moved to a private repo. No 2026 activity was found — [theatre-js README](https://github.com/theatre-js/theatre)

**react-spring**
- [pmndrs/react-spring](https://github.com/pmndrs/react-spring): 29,255 stars, pushed 2026-10-30, MIT. `@react-spring/web` 10.1.2, released 2026-06-24, 7,276,099 downloads/week — GitHub/npm
- Remotion says it is not directly compatible. Use `spring()` from remotion instead — [Remotion third-party](https://www.remotion.dev/docs/third-party)

**Alternative renderer**
- [motion-canvas/motion-canvas](https://github.com/motion-canvas/motion-canvas): 19,595 stars, pushed 2026-07-02, MIT.
- `@motion-canvas/core` 3.17.2 was last released **2024-12-14** (9,156 downloads/week). Release cadence has stalled — GitHub/npm

**Easing utilities**
- `bezier-easing` 3.2.0, released 2026-10-07, MIT, 2,633,078 downloads/week.
- `d3-ease`: last push 2023-10-06, BSD-3.
- `tween.js`: 10,149 stars, pushed 2026-10-29.
- Source: npm/GitHub

### Inferences
- Default stack: Remotion `interpolate`/`spring`/`Easing` plus @remotion/paths, shapes, noise, transitions, motion-blur, layout-utils and effects. Add `@remotion/gsap` for designers who think in GSAP timelines, or when SplitText or MorphSVG is needed.
- anime.js v4 is a viable MIT alternative to GSAP. It avoids the Webflow non-compete clause and has a built-in splitText and morph. It has no official Remotion package, so the seek bridge has to be written and tested.
- Motion and react-spring are worth using only for their math (spring and easing presets), not their runtime. Their animation loops are wall-clock driven. Component libraries built on Motion (magicui, motion-primitives, animate-ui, react-bits) would need porting to `useCurrentFrame()`.
- GSAP's Webflow clause matters if this pipeline is ever sold as a visual or no-code animation-builder product. Rendering videos with it, or using it in an AI code-gen pipeline, appears fine per the FAQ.
- Remotion licensing is the bigger commercial cost item. The user's company needs a Company License once it has more than 3 employees. Several high-value packages (transitions, effects, light-leaks, starburst, lottie, rive) are under the Remotion License, not MIT.

### Gaps
- No official statement was found on whether Motion's `animate().time` setter produces frame-exact output inside a headless renderer. This was not verified by test.
- The anime.js docs page does not explain whether the default main loop can be disabled. A manual `engine.update()` exists, but interaction with seek-driven rendering is untested.
- Remotion Company License pricing was not retrieved (remotion.pro is JS-rendered). The content of the Remotion 5.0 license change (PR #3750) was not read.

## Vector/animation assets: Lottie, dotLottie, Rive, LottieFiles, open icon/illustration sets with commercial-safe licenses

### Takeaway
Lottie works in Remotion through `@remotion/lottie` + `lottie-web`, using `goToAndStop` per frame. lottie-web's own maintenance has slowed (last release May 2025), and expressions can break determinism. Rive is supported via `@remotion/rive`. Free LottieFiles animations are commercially usable under the Lottie Simple License. For icons, Lucide (ISC), Tabler (MIT), Phosphor (MIT), Material Symbols (Apache-2.0) and Fluent Emoji (MIT) are safe. Among illustrations, Open Peeps (CC0) is the most permissive. unDraw is free commercially but forbids redistribution in packs and AI training.

### Cited Findings
**Lottie runtimes**
- [airbnb/lottie-web](https://github.com/airbnb/lottie-web): 32,291 stars, last push 2025-09-01, MIT.
- `lottie-web` 5.13.0, released **2025-05-21**, 10,353,059 downloads/week.
- Source: GitHub/npm

**@remotion/lottie**
- Uses lottie-web and SVG only. Other renderers, `setSubFrame()` and `setLocationHref()` are unsupported.
- Expression support is limited. Remotion seeks with `.goToAndStop()`, and depending on the expression "the frame might not render deterministically, leading to flickering". This cannot be fixed without an upstream change to lottie-web.
- Remote files and metadata (`getLottieMetadata`) are supported.
- Source: [@remotion/lottie docs source](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/lottie/index.mdx)
- After Effects content reaches Remotion by importing it through Lottie — [Remotion third-party](https://www.remotion.dev/docs/third-party)

**dotLottie and LottieFiles**
- [LottieFiles/dotlottie-web](https://github.com/LottieFiles/dotlottie-web): 932 stars, pushed 2026-10-30, MIT.
- `@lottiefiles/dotlottie-web` 0.82.0 was released 2026-10-30 (2,365,630 downloads/week). `@lottiefiles/dotlottie-react` 0.21.0 has 1,970,801 downloads/week.
- `LottieFiles/lottie-react` is **archived**.
- Source: GitHub/npm
- Licensing:
  - Free public LottieFiles animations fall under the **Lottie Simple License**: personal and commercial use, attribution not required.
  - You may not scrape or compile the animations to build a competing service.
  - Individual creators can add restrictions, so check each animation's page.
  - Sources: [LottieFiles help: commercial use](https://help.lottiefiles.com/hc/en-us/articles/900002438343-Can-I-use-a-free-animation-on-Lottiefiles-for-commercial-business-use); [LottieFiles licensing basics](https://help.lottiefiles.com/animation-licensing-basics-)
  - LottieFiles' "Commercial Use Policies" page lists Free/Individual plans as non-commercial. This appears to cover platform tools rather than the public files, but it conflicts on the surface — [LottieFiles Commercial Use Policies](https://help.lottiefiles.com/commercial-use-guide)

**Rive**
- [rive-app/rive-wasm](https://github.com/rive-app/rive-wasm): 1,017 stars, pushed 2026-10-30, MIT.
- `@rive-app/canvas` 2.49.0, released 2026-10-29 (1,553,198 downloads/week). `@rive-app/react-canvas` 4.38.0 has 1,300,568 downloads/week.
- `@remotion/rive` provides `<RemotionRiveCanvas>` under the Remotion License.
- Sources: GitHub/npm; [@remotion/rive docs](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/rive/index.mdx)

**Icon sets** (stars, last push, license, React package and downloads/week)

| Set | Stars | Last push | License | React package | Downloads/week |
|---|---|---|---|---|---|
| [Lucide](https://github.com/lucide-icons/lucide) | 25,391 | 2026-10-30 | ISC (npm) | `lucide-react` 1.65.0 | 130,088,213 |
| [Tabler](https://github.com/tabler/tabler-icons) | 22,505 | n/a | MIT | `@tabler/icons-react` 3.50.0 | 5,063,519 |
| Phosphor ([core](https://github.com/phosphor-icons/core)) | n/a | n/a | MIT | `@phosphor-icons/react` 2.1.10 | 7,379,747 |
| [Material Design Icons (Google)](https://github.com/google/material-design-icons) | 54,184 | n/a | Apache-2.0 | n/a | n/a |
| [Bootstrap Icons](https://github.com/twbs/icons) | 8,164 | n/a | MIT | n/a | n/a |
| [Iconify](https://github.com/iconify/iconify) (aggregator) | 6,376 | n/a | MIT | n/a | n/a |
| [Templarian MaterialDesign](https://github.com/Templarian/MaterialDesign) (community) | 11,318 | 2025-01-20 | NOASSERTION | n/a | n/a |

  - Phosphor's React package was last released 2025-05-22.
  - Iconify is an aggregator, and each icon set carries its own license.
  - Source: GitHub/npm
- Emoji:
  - [microsoft/fluentui-emoji](https://github.com/microsoft/fluentui-emoji): MIT.
  - [googlefonts/noto-emoji](https://github.com/googlefonts/noto-emoji): OFL-1.1 per GitHub.
  - [jdecked/twemoji](https://github.com/jdecked/twemoji) is the maintained Twemoji fork, MIT per GitHub.
  - Source: GitHub
- Illustrations:
  - [unDraw license](https://undraw.co/license): free for commercial use without attribution. No redistribution in packs, no building a competing service, and **no use to train or develop AI/ML models**.
  - [Open Peeps](https://openpeeps.com): CC0.

### Inferences
- Lottie remains the main AE-to-code bridge, but lottie-web is in maintenance mode. Lottie files should be pre-tested for expressions, or "baked" (expressions converted to keyframes in AE/Bodymovin) before use.
- dotLottie, the actively maintained ThorVG/WASM runtime, has no Remotion wrapper. Using it would need a custom frame-seek component.
- The pipeline is AI-driven, so unDraw's AI clause needs a careful read. Generating videos that use the art is probably fine; feeding the art into model training is not.

### Gaps
- Twemoji artwork has historically been CC-BY 4.0 (attribution required) even though the code is MIT. GitHub's license field shows only MIT, and this was not verified from the repo's LICENSE-GRAPHICS file.
- The licensing of Google's animated Noto emoji used by `@remotion/animated-emoji` was not verified.
- Rive's frame-exact seeking behaviour inside `@remotion/rive` (especially state machines) is not documented on the page read.
- Humaaans, Storyset and Blush were not checked.

## Kinetic typography and text effects: text splitting, variable-font animation, text-on-path

### Takeaway
In a frame-based renderer, the strongest options are:
- GSAP SplitText, now free, rewritten in 3.13 with masking and autoSplit, driven via `@remotion/gsap`.
- anime.js v4 `splitText`.
- Remotion's `@remotion/layout-utils` (measureText, fitText, fitTextOnNLines, fillTextBox) and `@remotion/rounded-text-box`.
- `@remotion/paths` (getPointAtLength, getTangentAtLength) for text-on-path.
- chenglou/pretext, a very popular new text measurement and layout engine that works without the DOM.

Older split libraries (splitting, split-type) are stale.

### Cited Findings
- GSAP SplitText:
  - Splits text into chars, words and lines.
  - Optional masking wrappers for reveals.
  - `autoSplit` re-splits on font load or resize.
  - Adds aria-label and aria-hidden by default.
  - Rewritten in v3.13.0 at "half the size, 14 new features".
  - Source: [GSAP SplitText docs](https://gsap.com/docs/v3/Plugins/SplitText/)
  - Free for commercial use under the Webflow license — [GSAP Standard License](https://gsap.com/standard-license/)
- anime.js v4 includes `splitText` — [anime.js engine/docs](https://animejs.com/documentation/engine)
- `splitting` 1.1.0 was last released 2024-05-31 (9,583 downloads/week). `split-type` 0.3.4 was last released 2023-10-22 (61,209 downloads/week) — npm
- [chenglou/pretext](https://github.com/chenglou/pretext):
  - "Fast, accurate & comprehensive text measurement & layout".
  - 50,963 stars, pushed 2026-10-15.
  - `@chenglou/pretext` 1.0.0, released 2026-10-14, MIT on npm (GitHub license field NOASSERTION), 2,326,518 downloads/week.
  - Source: GitHub/npm
- `opentype.js` 2.0.0, released 2026-05-06, MIT, 4,007,481 downloads/week. It is used for glyph outlines, which enable text-to-SVG-path morphing and stroke drawing — npm
- `flubber` (shape morphing) 0.4.2 was last released 2018-03-01 but still has 180,962 downloads/week — npm
- Remotion layout-utils: measureText, fitText, fitTextOnNLines, fillTextBox, plus a debug page and a best-practices page. Other Remotion text packages:
  - `@remotion/rounded-text-box`: TikTok-style caption boxes.
  - `@remotion/captions`: 1,691,925 downloads/week.
  - `@remotion/google-fonts`: 1,016,769 downloads/week.
  - `@remotion/fonts`.
  - Sources: [docs tree](https://github.com/remotion-dev/remotion/tree/main/packages/docs/docs/layout-utils); npm
- The Remotion agent skill includes an arabic-text reference (RTL handling) — [remotion-dev/skills](https://github.com/remotion-dev/skills)

### Inferences
- Variable-font animation needs no library. Interpolate `font-variation-settings` (wght, wdth, slnt) from `useCurrentFrame()`. Fonts must be fully loaded before rendering, which `@remotion/google-fonts` and `@remotion/fonts` handle with delayRender.
- For Korean kinetic typography, character-level splitting on Hangul syllables works with any splitter. Line-based splitting depends on font metrics, which is where pretext or measureText helps.

### Gaps
- No maintained, dedicated "variable font animation" library was found, and the search was not exhaustive.
- No Remotion-official text-on-path helper beyond the path utilities was confirmed.

## 3D and shaders: three.js / react-three-fiber in video renders, gl-transitions, noise

### Takeaway
`@remotion/three` (MIT) is the proven path. Inside `<ThreeCanvas>`, drive R3F from `useCurrentFrame()`, not `useFrame()`, and render with the `angle` GL backend. gl-transitions, with 100+ MIT GLSL transitions, now has an official `@gl-transitions/remotion` adapter, and Remotion's own shader transitions are ports of it. pmndrs postprocessing and drei are active. `@remotion/noise` covers deterministic noise.

### Cited Findings
- `@remotion/three`:
  - `<ThreeCanvas>` lets you use `useCurrentFrame()` inside an R3F Canvas.
  - `<ThreeWebGPUCanvas>` supports WebGPURenderer and TSL.
  - `<Sequence>` inside the canvas needs `layout="none"`.
  - `useOffthreadVideoTexture()` gives frame-exact video textures.
  - Three.js needs the `angle` OpenGL renderer: `Config.setChromiumOpenGlRenderer('angle')` or `chromiumOptions: { gl: "angle" }` for SSR and Lambda.
  - A starter template exists: [remotion-dev/template-three](https://github.com/remotion-dev/template-three), 117 stars, pushed 2026-10-22.
  - Source: [Remotion three docs](https://www.remotion.dev/docs/three)
- Core 3D libraries:
  - [mrdoob/three.js](https://github.com/mrdoob/three.js): 117,215 stars. `three` 0.187.0, released 2026-10-30, 31,164,701 downloads/week, MIT.
  - [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber): 33,365 stars. `@react-three/fiber` 9.8.2, released 2026-10-14, 8,614,013 downloads/week.
  - [pmndrs/drei](https://github.com/pmndrs/drei): 10,080 stars, `@react-three/drei` 10.7.9.
  - [pmndrs/postprocessing](https://github.com/pmndrs/postprocessing): 2,903 stars, Zlib, 6.39.5.
  - `@react-three/postprocessing` 3.2.2, MIT.
  - [pmndrs/maath](https://github.com/pmndrs/maath): 1,336 stars, MIT.
  - Source: GitHub/npm
- gl-transitions:
  - [gl-transitions/gl-transitions](https://github.com/gl-transitions/gl-transitions): 2,215 stars, pushed 2026-10-28.
  - `gl-transitions` 2.0.0 was released 2026-10-25. v2 renamed the transitions under the same v1 spec.
  - "100+ transitions", all MIT except two under BSD.
  - Official `@gl-transitions/remotion` package used with `@remotion/transitions`, with an `examples/remotion` app.
  - Sources: [gl-transitions README](https://github.com/gl-transitions/gl-transitions/blob/master/README.md); npm
- Remotion's shader presentations (film-burn, crosswarp, book-flip) are adapted from gl-transitions (MIT) — [film-burn doc](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/transitions/presentations/film-burn.mdx)
- Noise:
  - `@remotion/noise` provides noise2D, noise3D and noise4D — [docs tree](https://github.com/remotion-dev/remotion/tree/main/packages/docs/docs/noise)
  - `simplex-noise` 4.0.3 was last released 2024-07-26, MIT, 577,949 downloads/week. It is stable and seedable.
  - `josephg/noisejs` was last pushed 2022.
  - Source: npm/GitHub
- Particles: [tsparticles](https://github.com/tsparticles/tsparticles), 9,060 stars, pushed 2026-10-27, MIT — GitHub

### Inferences
- R3F's `useFrame`, drei components with internal clocks (`<Float>`, `<Sparkles>`, `MeshWobbleMaterial`, `<Stars>` with speed), physics engines and three's `Clock` all read wall-clock time and break determinism. Their time uniforms must be driven from `frame / fps`.
- Particle systems (tsparticles) are time and state accumulating, so they are not deterministic per frame unless re-simulated from frame 0 or baked. This follows the Matter.js "bake" advice on the Remotion third-party page.

### Gaps
- No specific benchmark was found for WebGL render cost on Remotion Lambda versus local GPU (angle vs swangle vs vulkan).
- drei's per-component clock usage was not audited from source.

## Motion design knowledge: easing/curve references, motion principles, motion design tokens, "awesome motion design" lists

### Takeaway
The best machine-readable motion token source is Material 3. Its token file in material-web gives exact durations, cubic-beziers and spring stiffness/damping, which can be ported directly into a pipeline's token file. IBM Carbon offers productive and expressive easing modes, Apache-2.0. For curated knowledge, a new genre has appeared: "motion design agent skills" repos aimed at AI coding agents (remotion-dev/skills, iart-ai/motion-skills, bang-motion). Classic awesome-lists for motion design are small. Beware that easings.net's repo is GPL-3.0.

### Cited Findings
- Material 3 motion tokens (material-web, Apache-2.0, 11,383 stars):
  - **Durations:** short1–4 = 50/100/150/200 ms; medium1–4 = 250/300/350/400 ms; long1–4 = 450/500/550/600 ms; extra-long1–4 = 700/800/900/1000 ms.
  - **Standard easings:** standard = `cubic-bezier(0.2, 0, 0, 1)`; standard-accelerate = `cubic-bezier(0.3, 0, 1, 1)`; standard-decelerate = `cubic-bezier(0, 0, 0, 1)`.
  - **Emphasized easings:** emphasized-decelerate = `cubic-bezier(0.05, 0.7, 0.1, 1)`; emphasized-accelerate = `cubic-bezier(0.3, 0, 0.8, 0.15)`. In "latest", emphasized is aliased to standard.
  - **Legacy easing:** `cubic-bezier(0.4, 0, 0.2, 1)`.
  - **Spatial springs:** damping 0.9; stiffness fast 1400, default 700, slow 300.
  - **Effects springs:** damping 1; stiffness fast 3800, default 1600, slow 800.
  - Source: [material-web _md-sys-motion.scss](https://github.com/material-components/material-web/blob/main/tokens/versions/latest/sass/_md-sys-motion.scss)
  - Third-party ports disagree on the "emphasized" curve, which shows version drift between M3 and M3 Expressive — [web search summary of docs.rs ports](https://docs.rs/crate/hydrolysis-m3/latest/source/src/theme/motion/tokens.rs)
- IBM Carbon motion package ([carbon](https://github.com/carbon-design-system/carbon), 9,591 stars, Apache-2.0):
  - Easing names: standard, entrance, exit. Modes: productive, expressive.
  - Duration tokens: fast01/02, moderate01/02, slow01/02.
  - Values are generated from `tokens/motion.tokens.json`.
  - Source: [carbon packages/motion/src/index.ts](https://github.com/carbon-design-system/carbon/blob/main/packages/motion/src/index.ts)
- [ai/easings.net](https://github.com/ai/easings.net): 8,712 stars, **GPL-3.0** — GitHub. `bezier-easing` (MIT) or Remotion's `Easing.bezier` are license-safe ways to use curves — npm
- Agent-skill and knowledge repos:
  - [remotion-dev/skills](https://github.com/remotion-dev/skills): 5,899 stars, pushed 2026-10-26, no license. It contains `remotion-best-practices` references on effects, 3D, captions, maps render-stability, arabic-text, timeline structure and more.
  - [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills): 1,092 stars, MIT. "50 open-source skills… motion graphics, animation & video — kinetic typ[ography]".
  - [bangtutorial/bang-motion](https://github.com/bangtutorial/bang-motion): 772 stars, MIT. Openers, promos, bumpers, kinetic typography and explainer styles.
  - [frankxai/awesome-motion-design-agent-skills](https://github.com/frankxai/awesome-motion-design-agent-skills): 86 stars, CC0, covering GSAP, Motion, Remotion, Lottie and Rive.
  - [lucasmaiaesilva/awesome-motion-design-web](https://github.com/lucasmaiaesilva/awesome-motion-design-web): 27 stars.
  - Source: GitHub
  - The Remotion monorepo also contains `template-prompt-to-motion-graphics` ("SaaS template for AI-powered animation generation") — [remotion packages](https://github.com/remotion-dev/remotion/tree/main/packages)
- Animated UI component libraries (design references, built on Motion and wall-clock driven):
  - [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits): 50,712 stars, license NOASSERTION.
  - [magicuidesign/magicui](https://github.com/magicuidesign/magicui): 22,969 stars, MIT.
  - [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives): 6,864 stars, MIT.
  - [imskyleen/animate-ui](https://github.com/imskyleen/animate-ui): 4,751 stars, NOASSERTION.
  - Source: GitHub

### Inferences
- A pipeline "motion token" file should copy M3's duration scale and its standard and emphasized beziers. M3's spring stiffness and damping map onto Remotion `spring({config:{stiffness, damping}})` after unit conversion. M3's damping is a ratio, while Remotion's is a coefficient, so this needs calibration.
- The agent-skill repos are the most directly reusable "knowledge" for an LLM-driven pipeline. Quality varies; only remotion-dev/skills is first-party.

### Gaps
- Carbon's actual cubic-bezier and millisecond values live in a generated file and were not extracted.
- The official m3.material.io motion pages (JS-rendered) were not read directly.
- Disney's 12 principles and other motion-principles documents were not surveyed with sources.

## Which are proven in Remotion / frame-based renderers, and which break determinism

### Takeaway
Proven (first-party package or docs):
- Remotion core and @remotion/*.
- GSAP via `@remotion/gsap`.
- Lottie (with expression caveats).
- Rive.
- three.js/R3F via `<ThreeCanvas>`.
- gl-transitions via `@gl-transitions/remotion`.
- Skia, GIF.
- CSS animations only when paused and delayed per frame.

Workable with a custom bridge: anime.js v4 (official example repo).

Break determinism unless re-architected:
- CSS transitions and animations left running.
- framer-motion/Motion components.
- react-spring.
- R3F `useFrame` / three `Clock`.
- Physics engines (Matter.js etc.).
- Particle systems.
- Lottie expressions that depend on time or state.
- Theatre.js's sequence player, and any rAF/Date.now-based library.

### Cited Findings
- All animation must come from `useCurrentFrame()`. The third-party page lists the official integrations: GSAP, Lottie, Rive, Three, Skia and GIF as packages, CSS via animation-play-state/delay, and an anime.js example — [Remotion third-party](https://www.remotion.dev/docs/third-party)
- Framer Motion has no integration (issue #399), and react-spring is not compatible — same source.
- GSAP is deterministic through a paused timeline seeked to the frame — [Remotion GSAP](https://www.remotion.dev/docs/gsap)
- Lottie expressions may render non-deterministically and flicker — [@remotion/lottie docs](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/lottie/index.mdx)
- In R3F, animations should come from Remotion hooks rather than `useFrame()` — [Remotion three](https://www.remotion.dev/docs/three)
- CSS transitions flicker during render — [Remotion animating properties](https://www.remotion.dev/docs/animating-properties)
- Matter.js physics should be "baked" into a timeline ([discussion #4373](https://github.com/orgs/remotion-dev/discussions/4373); example [hylarucoder/remotion-physics](https://github.com/hylarucoder/remotion-physics)) — [Remotion third-party](https://www.remotion.dev/docs/third-party)
- HTML-in-canvas shader transitions and effects need a Chrome flag for Studio preview but nothing extra for rendering — [HTML-in-canvas guide](https://github.com/remotion-dev/remotion/blob/main/packages/docs/docs/html-in-canvas-guide.mdx)

### Inferences
- Rule of thumb: a library is safe if (a) it exposes a pure `f(t)`, or a seek/goTo on a paused instance, and (b) it has no internal state accumulated across frames. Remotion renders frames out of order and in parallel chunks on Lambda, so any accumulating state (particles, physics, spring velocity carried between frames) breaks.
- Theatre.js's `sequence.position` is a settable value, so it could in principle be frame-driven. Given its dormant status (last release May 2024), it is not recommended for a new pipeline.

### Gaps
- None of the "workable with bridge" claims for anime.js v4, Motion `.time` or dotLottie `setFrame` were verified by an actual render test here. A spike test (render twice, diff frames) is recommended before adopting each.
