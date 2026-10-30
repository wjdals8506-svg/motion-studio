# BGM Pipeline: Open-Source Repos vs ElevenLabs Music (generation, analysis, fitting, SFX, mix)

Observed **2026-10-30**. GitHub numbers come from `gh api repos/<owner>/<name>` (stars, `pushed_at`, SPDX license) on that date. Hugging Face licenses come from the HF models API (`cardData.license`) on the same date. PyPI release dates come from `pypi.org/pypi/<pkg>/json`.

Labels used below:
- **[V]**: verified directly today (API metadata, LICENSE text, or the official doc page).
- **[R]**: README or model-card claim by the project itself, not independently tested.
- **[S]**: secondary source (blog, news, issue tracker).

Context: this is for a HyperFrames (HTML/GSAP) + Claude Code pipeline. Music is picked at the animatic stage, and its beat/bar/section map drives cut and key-motion timing. SFX accent key motions. Outputs must be cleared for commercial use.

---

## 0. Most important finding: HyperFrames already ships half of this layer

HyperFrames (`heygen-com/hyperframes`, Apache-2.0 [V], 75,758★, pushed 2026-10-30 [V]) already has these pieces:

| Need | What HyperFrames has | Source |
|---|---|---|
| Beat grid | `npx hyperframes beats [file] --json` returns `{bpm, beatTimes}` and writes `beats/<audio>.json`, which Studio shows as a beat grid. Fails if the track has no steady beat. [V] | `skills/hyperframes-cli/references/beats.md` |
| Beats / downbeats / sections / onsets / LUFS | `npx hyperframes audio …` reports moments, onsets, loudness (BS.1770 LUFS), silence and kind. Beats/downbeats come from a provider ladder: `api` (HeyGen), `apple-mu`, **`beat-this`**, `signal`. Sections come from `api`, `apple-mu` or `signal`. `--quality local` is the default (audio stays on the machine). [V] | `docs/packages/cli.mdx` §`audio` |
| Beat This! integration | The `beat-this` provider is enabled by setting `HYPERFRAMES_BEAT_THIS_PYTHON` to a Python that has `beat-this` installed, with `small0` weights on disk. The CLI never downloads them itself. [V] | `packages/cli/src/audio/analysis/providers/beatThis.ts` |
| Ducking | Voiceover **carve** (`data-fx-carve`, `sources:["voiceover"]`, `strength`, or `duckDb`/`headroomDb`) dips the music only where the voice sits. [V] | `docs/reference/audio-effects.mdx` |
| Loudness | `npx hyperframes normalize-audio --reference/--target … --write` or `--lufs=-16` (default target -16). [V] | `skills/media-use/references/local.md` |
| Looping | Native `<audio loop data-duration=…>` repeats a short bed for a longer slot. [V] | `docs/guides/voice-and-audio.mdx` |
| Beat-driven components | `beat-accent`, `beat-timeline`, `beat-pulse-background`, `icon-morph-beat`, `beat-freeze-cut` registry items; each beat label owns an SFX cue. [V] | `registry/components/*`, `docs/catalog/*` |
| Music-to-video guidance | Maps "phrases, energy, onsets, silences, rolls, drops, hard stops" before planning visuals. Calm music is paced by phrase, not forced onto beats. [V] | `docs/guides/music-to-video.mdx` |
| BGM sourcing | With a HeyGen credential it searches HeyGen's music catalog. Without one it generates locally: **Lyria RealTime (Gemini key) → MusicGen `facebook/musicgen-small`**. [V] | `skills/media-use/audio/references/bgm.md` |

**License trap [V]:** the local fallback is `facebook/musicgen-small`, and MusicGen weights are **CC-BY-NC-4.0** (HF API: `facebook/musicgen-large` → `cc-by-nc-4.0`). With the stock fallback, a run that has no HeyGen key and no Gemini key produces **non-commercial BGM without warning**. Pin BGM to your own generator (ElevenLabs or ACE-Step) or disable the MusicGen fallback. Commercial terms for Lyria RealTime output were **not verified** in this pass.

Implication: you don't need a separate beat-sync repo. Add a stronger generator, a labeled section map (from the generation plan), and a length-fitting step, and wire them into the HyperFrames audio tooling.

---

## 1. Music generation

### 1.1 Comparison table (observed 2026-10-30)

| Model | Repo | ★ / last push [V] | Code license [V] | Weights license [V] | Instrumental | BPM / key / structure control | Max length | VRAM | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **ElevenLabs Music v2.5** (API) | — | — | proprietary | proprietary; outputs owned by user | `force_instrumental` (prompt mode only) [V] | Composition plan: up to 30 chunks, 3–120 s each, with per-chunk positive/negative styles. BPM/key go as style text ("120 BPM", "C major"), not a hard parameter [V] | `music_length_ms` 3,000–600,000 ms [V] (overview page says 5 min, a doc conflict) | n/a | **Primary** |
| **ACE-Step 1.5** | github.com/ace-step/ACE-Step-1.5 | 14,194 / 2026-10-11 | MIT | **MIT** (HF `ACE-Step/Ace-Step1.5`, `acestep-v15-xl-turbo`) | Yes: lyrics mode "instrumental" (CLI) [R] | **Hard params**: `bpm` 30–300, `key_scale`, `time_signature`, `audio_duration` 10–600 s. Structure via lyric tags (`[Verse 1]`…). `task_type` repaint/cover/lego/extract/complete [V: docs/en/API.md] | 600 s [R] | <4 GB (2B turbo, INT8 + offload) up to ≥24 GB (XL sft + 4B LM) [R] | **Primary open-source** |
| ACE-Step v1 | github.com/ace-step/ACE-Step | 5,002 / 2026-02-15 | Apache-2.0 | — | — | — | — | — | superseded by 1.5 |
| HeartMuLa (oss-3B) | github.com/HeartMuLa/heartlib | 3,774 / 2026-10-08 | Apache-2.0 | **apache-2.0** (relicensed 2026-01-20 [R]; HF tag [V]) | not documented | lyrics + tags; no BPM parameter documented | `--max_audio_length_ms` default 240,000 [R] | not stated; RTF ≈1.0 [R] | Secondary (songs with lyrics; less tempo control) |
| DiffRhythm v1.2 | github.com/ASLP-lab/DiffRhythm | 2,355 / **2025-11-27** | Apache-2.0 | DiT apache-2.0, but **VAE = `stable-audio-community`** (HF `ASLP-lab/DiffRhythm-vae`) [V] | yes (instrumental mode since 2025-03-09) [R] | style text or reference audio; no BPM parameter | 95 s (base) / 285 s (full) [R] | ≥8 GB with `--chunked` [R] | Avoid v1 (VAE license); DiffRhythm 2 weights are apache-2.0 [V], but its VAE was not checked |
| YuE (v1) | github.com/multimodal-art-projection/YuE (v1 on `YuE-v1` branch) | 12,902 / 2026-10-30 | Apache-2.0 | apache-2.0 (`m-a-p/YuE-s1-7B-anneal-en-cot`) | vocal-song model | genre tags + `[verse]/[chorus]` | ~minutes | 24 GB+ | Legacy |
| **YuE2** | same repo (main) | same | Apache-2.0 | **cc-by-nc-4.0** (`m-a-p/YuE2-3B`, `YuE2-Vae`) [V] | yes, via `yue2-music` agent skill (2026-09-25) [R] | ABC score / chord plan (`cot`) | not stated | 24 GB BF16, Linux only [R] | **Avoid for a company pipeline**: README says companies must contact the authors for a commercial license; individual creators may monetize [R] |
| Tencent SongGeneration / LeVo (v2) | `github.com/tencent-ailab/SongGeneration` → **HTTP 404 today** [V] | — | unknown | HF mirrors `lglg666/SongGeneration-v2-large`: license **unknown**, empty card [V]; vllm-omni tracker says NOASSERTION/custom Tencent terms [S] | partly (section blocks) [S] | section tags (intro/verse/chorus/bridge) [S] | — | 10 GB min, 24 GB recommended [S] | **Avoid**: official repo gone, license unclear |
| Stable Audio Open 1.0 | github.com/Stability-AI/stable-audio-tools | 3,895 / 2026-10-24 | MIT | **Stability AI Community License** [V] | yes (no vocals at all) | text; timing conditioning | **47 s** [R] | ~consumer GPU | SFX/stingers, not BGM |
| **Stable Audio 3** (small / small-music / small-sfx / medium) | HF `stabilityai/stable-audio-3-*` (gated) | — | reference impl. MIT [S] | **stable-audio-community** (gated, created 2026-05-17) [V] | yes | per-second length control, extend, inpaint [S] | Medium ~380 s; Small ~2 min [S] | Small runs on laptops [S] | Possible only if annual revenue < US$1M and you register (see license note) |
| MusicGen / AudioCraft | github.com/facebookresearch/audiocraft | 23,777 / 2026-03-03 | MIT | **cc-by-nc-4.0** [V] | yes | text + melody | ~30 s per window | 16 GB for large | **Avoid** (non-commercial) |
| InspireMusic | `FunAudioLLM/InspireMusic` → **redirects to `QwenAudio/FunMusic`** (23★, last push **2025-05-20**) [V] | — | Apache-2.0 | HF `FunAudioLLM/InspireMusic-1.5B-Long` now returns 401 (gated or removed) [V] | yes | text; 30 s windows, "Long" model several minutes [R] | — | — | **Avoid** (stale, weights access unclear) |
| Magenta RealTime 2 | github.com/magenta/magenta-realtime | 1,856 / 2026-10-02 | Apache-2.0 | **cc-by-4.0** (commercial OK with attribution) [V] | yes | style prompts, streamed live | streaming | real-time needs Apple Silicon; offline on NVIDIA [R] | Niche: jam/stream tool with no song-structure plan |

Other names checked and skipped: SongBloom (official repo not found; only demo/ComfyUI forks), FluxMusic, OpenMusic, Mustango (older research code), ThinkSound (see SFX).

### 1.2 ElevenLabs Music API details [V unless noted]

Sources: https://elevenlabs.io/docs/api-reference/music/compose, https://elevenlabs.io/docs/eleven-api/guides/how-to/music/composition-plans.md, https://elevenlabs.io/docs/eleven-api/guides/how-to/music/inpainting.md, https://elevenlabs.io/docs/overview/capabilities/music, https://elevenlabs.io/music-terms

- `POST /v1/music`. `model_id` is one of `music_v1` (API default for now), `music_v2`, `music_v2_5` (best).
- `prompt` **xor** `composition_plan`.
- `music_length_ms` accepts 3,000–600,000 and applies to prompt mode only. The overview page still says "max 5 minutes"; the API reference says 600,000 ms.
- `force_instrumental` (prompt mode only). For instrumental output from a plan, put "vocals" in `negative_styles` and leave chunk `text` free of lyrics. This is an inference: the docs give no instrumental flag for plans.
- **Composition plan (v2 / v2.5):** `chunks[]`, either GenerationChunk {`text`, `duration_ms` 3,000–120,000, `positive_styles`, `negative_styles`, `context_adherence`, `conditioning_ref` (≤30 s audio), `condition_strength` low/medium/high/xhigh} or AudioRefChunk {`song_id`, `range`}. Max 30 chunks; total up to 10 min. **For v2 models section durations are always enforced.** This is the key property for video: you dictate the section map and its lengths up front.
- `composition_plan.create(prompt, music_length_ms, model_id)` turns a prompt into an editable plan.
- BPM / key: **no hard parameter**. You put "120 BPM" or "C major" in styles. Treat the delivered BPM as a target and measure the real grid afterwards (beat_this).
- `seed` (not with prompt mode); `with_timestamps` gives word timestamps (lyrics only, not a beat map).
- **Inpainting / extension**: `store_for_inpainting=true` (or `music.upload`) returns a `song_id`. A new plan can then mix reference slices and new generation chunks to regenerate a section, add an intro or outro, loop a slice, or shorten. Minimum range is 50 ms.
- **Stem separation**: `POST /v1/music/stem-separation` (multipart) returns a ZIP of stems. The `stem_variation_id` values were not listed on the page.
- Output: MP3 44.1/48 kHz up to 192 kbps, or WAV/PCM (some formats are tier-gated: PCM 44.1 kHz needs Pro or higher).
- Audio Reference (up to ~30 s, copyright-screened) on paid plans; finetunes available.
- `sign_with_c2pa` option.

**Commercial terms by plan** (https://elevenlabs.io/music-terms, Exhibit A) [V]:

| Plan | Eligibility | Gen min/mo | DL min/mo | Streaming distribution | Media exclusions | API |
|---|---|---|---|---|---|---|
| Free | individual | 11 | **no downloads** | prohibited | standard | no |
| Starter | individual | 17 | 30 | **prohibited** | standard | yes |
| Creator | individual | 62 | 250 | permitted | standard | yes |
| Pro | individual | 304 | 500 | permitted | standard | yes (hi-quality DL) |
| Scale | org <10 employees | 1,100 | 1,500 | permitted | standard | yes |
| Business | org <50 employees | 4,800 | 4,000 | permitted | standard | yes |
| Enterprise Music Lite | — | custom | custom | permitted | standard | yes |
| Enterprise Music | — | custom | custom | permitted | **none** | yes |

- "Standard exclusions" means all online and offline commercial use is allowed **except film, TV, radio and Studio Games**. YouTube, social, ads and web video are covered. Broadcast TV ads or film need Enterprise Music.
- The user keeps rights in input and output (§2.2). Only Free requires attribution. Building a music library or reselling the model is prohibited outside Enterprise.
- Practical minimum for this pipeline: **Creator** (API + downloads + streaming distribution). Pick **Pro** for higher-quality downloads or more volume.

### 1.3 Notes per open model

- **ACE-Step 1.5** [R unless noted]: HF card says "You can strictly use the generated music for commercial purposes" and claims training on licensed, royalty-free and public-domain data. That is a self-claim; the training set was not audited. Speed: under 2 s per song on A100, under 10 s on RTX 3090. Windows portable package with CUDA/ROCm launch scripts. REST server: `uv run acestep-api` → `localhost:8001`. LoRA from ~8 songs in ~1 h on a 12 GB 3090. Lego/extract/complete are only on the `base` models. The response `metas` echoes `bpm`, `keyscale` and `timesignature` [V: API.md example]. Third-party UI `fspecii/ace-step-ui` (5,148★, **no license file** [V]) should not be vendored.
  - Why it fits: an exact `bpm` + `time_signature` + `audio_duration` gives an **analytic beat grid** (beat = 60/BPM, bar = beats × meter), which beat_this can confirm. Repaint (`repainting_start/end`) re-does one section without touching the rest.
  - Quality reputation: the README claims "between Suno v4.5 and Suno v5" [R]. Community consensus from secondary sources treats ACE-Step 1.5 as the strongest open local model of 2026. Expect weaker results than ElevenLabs v2.5 on polish and arrangement coherence (not measured here).
- **Stability AI Community License** [V: https://stability.ai/community-license-agreement]: free commercial use only while you and your affiliates earn < US$1M annual revenue. You must register for commercial use. The license terminates above the threshold. You own the outputs. This applies to Stable Audio Open 1.0, Stable Audio 3 open weights, the DiffRhythm v1 VAE, and the ThinkSound VAE.

---

## 2. Music analysis for sync

| Tool | Repo | ★ / last push [V] | License [V] | Outputs | Windows install | Verdict |
|---|---|---|---|---|---|---|
| **Beat This!** | github.com/CPJKU/beat_this | 455 / 2026-05-28 | **MIT code AND weights** (README: "The code and the published model weights are released under the MIT license") [V] | beats + downbeats (bars derivable). No tempo field; derive it from the median IBI | `pip install beat-this` (1.1.0, 2026-04-14 [V]) + torch; no madmom needed (`dbn=False`); CPU fallback | **Pick #1.** ISMIR 2024 SOTA without DBN [R]; already a HyperFrames provider |
| All-In-One (`allin1`) | github.com/mir-aidj/all-in-one | 872 / **2024-05-09** | MIT (code); weights license not stated | BPM, beats, downbeats, `beat_positions`, **labeled segments** (intro/verse/chorus/bridge/outro…), Harmonix-trained | **Painful**: needs NATTEN built from source on Windows ("experimental and not regularly tested" [V NATTEN docs]), madmom from git, and Demucs (runs separation first). PyPI last release 2023-10-10 [V]. Open issues #27/#30/#36/#39 about NATTEN incompatibility [V] | Only option for labeled sections. Run it in WSL2/Docker if needed; otherwise skip |
| SongFormer | github.com/ASLP-lab/SongFormer | 186 / 2026-05-14 | code **CC-BY-4.0** [R]; depends on **MuQ weights cc-by-nc-4.0** [V HF `OpenMuQ/MuQ-large-msd-iter`] and MusicFM (MIT) | labeled sections (intro, verse, chorus, bridge, pre-chorus, silence…) | Linux-oriented | Better structure labels than allin1 [R], but the NC dependency makes it **avoid** for commercial use |
| librosa | github.com/librosa/librosa | 8,724 / 2026-10-06 | ISC | onset strength, RMS, tempo, `beat_track` (**no downbeats**), segmentation primitives | pip wheels, easy | Utility only (energy curves, onsets) |
| madmom | github.com/CPJKU/madmom | 1,734 / 2026-03-20 | code BSD; **model/data files CC-BY-NC-SA 4.0** [V README] | beats, downbeats (DBN), tempo, onsets | PyPI 0.16.1 is from **2018** [V]; must install from git; Cython build | **Avoid** (NC models, stale releases) |
| BeatNet | github.com/mjhydri/BeatNet | 528 / 2026-04-13 | CC-BY-4.0 | beats, downbeats, tempo, meter; online + offline | pins `numba==0.54.1` and needs madmom, pyaudio [V PyPI requires_dist] | Avoid (dependency rot) |
| Essentia | github.com/MTG/essentia | 3,786 / 2026-10-22 | **AGPL-3.0** | rhythm, key, many descriptors; TF models mostly NC | **no Windows wheels** on PyPI (macOS/Linux only) [V] | Avoid (AGPL plus Windows) |
| msaf | github.com/urinieto/msaf | 561 / 2026-05-13 | MIT | unsupervised boundaries + clusters (no semantic labels) | pure Python | Optional fallback for boundaries |

Recommended approach (simplest that holds):
1. **The plan is the section map.** When music is generated from an ElevenLabs composition plan or ACE-Step structure tags, section names and durations are known before audio exists. Use them as the section map; don't re-infer them.
2. **Beat This! measures the real grid** (beats + downbeats). Snap each planned section boundary to the nearest downbeat and record the drift. Through HyperFrames: `HYPERFRAMES_BEAT_THIS_PYTHON=… npx hyperframes audio bgm.wav` or `npx hyperframes beats`.
3. **Energy / onsets** for accents (drops, hits): `hyperframes audio --only onsets` or librosa RMS.
4. Labeled-section inference (allin1) is needed only for **sourced** tracks with no plan. Run it in WSL2/Docker, or let a human mark sections in HyperFrames Studio during animatic approval.

---

## 3. Supporting tools

### 3.1 Fit music to video length

Ordered by preference:
1. **Generate to length** (best): ElevenLabs plan chunk durations sum exactly to the video length (v2 enforces durations [V]). ACE-Step uses `audio_duration` (10–600 s) [V].
2. **Trim on a downbeat + fade**: cut at the last downbeat before the target, with a short fade-in and longer fade-out. This is ffmpeg (`atrim`, `afade`), with no new dependency. HyperFrames' BGM doc gives the same advice (pick the strongest entrance, short fade-in, longer fade-out, no silent tail) [V].
3. **Regenerate the ending / extend**: ElevenLabs inpainting (reference chunks + new outro chunk) [V], or ACE-Step `repaint` / `complete` [V docs].
4. **Loop-extend a sourced track**: PyMusicLooper (github.com/arkrow/PyMusicLooper, 412★, last push 2025-11-01, MIT [V]) finds loop points and exports an extended version "to the desired length" [R]. Or use the HyperFrames native `<audio loop>`.
5. **Small tempo nudge (≤ ~4%)** to land a hit exactly on a key frame: Rubber Band CLI (github.com/breakfastquay/rubberband, 801★, pushed 2025-03-03, **GPL-2.0** [V]) used as an external binary, or ffmpeg's `rubberband` filter. The `pyrubberband` wrapper is ISC but stale (2024-09-30) [V]. `spotify/pedalboard` (6,391★, 2026-10-23, **GPL-3.0** [V]) also time-stretches; GPL only matters if you redistribute it linked into your code.
6. Infinite-Jukebox-style re-sequencing: Remixatron (github.com/drensin/Remixatron, 173★, 2026-10-21, Apache-2.0 [V]). The Python v1 is legacy; dev moved to a Rust app [R]. Interesting, but YAGNI.

### 3.2 Ducking under narration
- **HyperFrames voiceover carve** (`data-fx-carve`) [V]. Bed volume defaults: `BGM_BED_VOLUME` 0.12 (≈ -18 dB) under narration and 0.9 for a silent film [V bgm.md].
- Plain ffmpeg alternative: `sidechaincompress` (music sidechained by voice). Built in, no dependency.

### 3.3 Loudness normalization
- HyperFrames `normalize-audio` (default -16 LUFS) and `audio` LUFS report [V].
- Final master: ffmpeg `loudnorm` two-pass (YouTube plays back around -14 LUFS; -16 is fine for mobile/web). `pyloudnorm` (github.com/csteinmetz1/pyloudnorm, 786★, 2026-01-04, MIT [V]) if you need it in Python.

### 3.4 Stem separation (rarely needed when you generate instrumentals)
Use cases: removing vocals from a sourced track, or a drums-only stem for crisper onset accents.
- **Demucs**: `facebookresearch/demucs` is **archived** (10,402★, last push 2024-04-24) [V]. The official continuation is `adefossez/demucs` (3,469★, pushed 2026-10-26, MIT code [V]); PyPI `demucs` 4.1.0 released 2026-07-11 [V]. The maintainer writes that he is "not actively working on Demucs anymore" and that "the license of the weights is not clear" (MusDB research-only data; the 6-stem model is likely CC-NC) [V README]. Usable for internal analysis (drum onsets); be careful about shipping separated audio commercially.
- `nomadkaraoke/python-audio-separator` (1,457★, pushed 2026-10-29, MIT [V]) is an active wrapper over UVR/MDX/Demucs/RoFormer models. Model weight licenses vary per model.
- `ZFTurbo/Music-Source-Separation-Training` (1,612★, 2026-10-30, MIT [V]): training repo with SOTA RoFormer checkpoints. Weights vary.
- **ElevenLabs stem separation** endpoint [V]: the cleanest licensing for separating ElevenLabs-generated tracks.

### 3.5 Beat-synced editing repos
A GitHub search for "beat sync video", "auto music video editor beats" and "remotion music visualization" turned up no credible standalone project (top hits had 1–16★) [V]. HyperFrames' own `beats` / `audio` commands, beat registry components and `music-to-video` guide are the strongest existing implementation. Remotion (69,024★) has `useAudioData` / `visualizeAudio` for amplitude-reactive visuals (no beat tracking), and Remotion uses its own company license (NOASSERTION SPDX) [V]. Not needed, since the render engine is HyperFrames.

---

## 4. SFX generation

| Option | License [V] | Max length | Notes | Verdict |
|---|---|---|---|---|
| **ElevenLabs Sound Effects** `POST /v1/sound-generation` | proprietary; commercial on paid plans | 0.5–30 s [V] | `model_id` `eleven_text_to_sound_v2` / `v3`, `prompt_influence` 0–1, **`loop`** flag, tier-gated formats [V] | **Pick #1**. Free-plan commercial status conflicts across ElevenLabs pages (SFX page: attribution needed; help center: no commercial use) [S], so use a paid plan |
| HyperFrames bundled SFX + Openverse | per-asset (Openverse licenses vary; check CC0/CC-BY) | — | already integrated [V] | Pick #2 for stock whooshes/ticks; check each asset's license |
| Stable Audio Open 1.0 / Stable Audio 3 small-sfx | Stability Community (<$1M revenue + registration) | 47 s / ~2 min | SAO trained on Freesound CC0/CC-BY/Sampling+ and FMA CC [R]; "better at sound effects and field recordings than music" [R] | OK only under the revenue threshold |
| MMAudio (video→audio) | code MIT; **weights cc-by-nc-4.0** [V] | — | README: "We do not guarantee that the pre-trained models are suitable for commercial use" [V] | Avoid |
| AudioLDM2 | **cc-by-nc-sa-4.0** (HF `cvssp/audioldm2`) [V] | — | last push 2024-09-29 | Avoid |
| Tango / TangoFlux | **non-commercial, research-only** + Stability Community + WavCaps academic-only [V README] | — | — | Avoid |
| ThinkSound | Apache-2.0 code/models, **but README says "for research and educational purposes only"**, and the bundled SAO VAE requires Stability permission for commercial use [V] | — | — | Avoid |
| HunyuanVideo-Foley | Tencent Hunyuan Community License: "**DOES NOT APPLY IN THE EUROPEAN UNION, UNITED KINGDOM AND SOUTH KOREA**" [V LICENSE] | — | — | **Avoid** (no license at all in Korea) |
| EzAudio | code MIT (333★, 2025-12-17) [V]; weights not checked | — | — | Not evaluated |

---

## 5. Recommended BGM pipeline (maps onto the stage gates)

```
[Animatic stage]
 1. Section plan    : scene list → music sections (name, duration_ms, energy, style), sum = video length
 2. Generate        : ElevenLabs music_v2_5 composition_plan (instrumental via negative "vocals")
                      └ offline / bulk / iteration: ACE-Step 1.5 (bpm, key_scale, time_signature, audio_duration, [Section] tags)
                      generate 2–3 candidates → human picks one (preview video with temp cuts)
 3. Analyze         : beat_this (via `hyperframes audio` / `hyperframes beats`) → beats, downbeats
                      section map = the plan's boundaries snapped to nearest downbeat
                      onsets/energy → accent candidates (drops, hits)
                      → write music_map.json {bpm, beats[], downbeats[], bars[], sections[{name,start,end}], accents[]}
 4. Fit length      : (already exact) else trim on a downbeat + fades (ffmpeg) / ElevenLabs inpaint outro / ACE-Step repaint;
                      ≤4% tempo nudge with rubberband only if a hard hit must land on a fixed frame
[Motion stage]
 5. Drive timing    : GSAP labels = downbeats / section starts; cuts on bars/sections, key motions on accents
 6. SFX             : ElevenLabs SFX (whoosh/hit/tick, `loop` for beds) placed at accent times; `hyperframes audio --place-at` to align peak
[Mix stage]
 7. Mix             : HyperFrames voiceover carve (ducking) → normalize-audio / ffmpeg loudnorm (-14 to -16 LUFS) → true-peak ≤ -1 dBTP
```

Where ElevenLabs is the better choice:
- Final-quality BGM (v2.5 arrangement polish) and **enforced per-section durations**, the single most useful property for video sync.
- Section edits after approval (inpainting) without regenerating the whole track.
- SFX: no open model is both commercially clean and good. ElevenLabs SFX with `loop` covers it.
- Cleanest licensing chain for client work (outputs owned by the user; Creator+ allows streaming distribution), **except** film/TV/radio/studio-game use, which needs Enterprise Music.

Where ACE-Step 1.5 is the better choice:
- Exact BPM / key / meter control (ElevenLabs only takes style text).
- Unlimited local iteration at the animatic stage (fast on a consumer GPU, no per-minute quota). MIT weights.
- A fallback when the ElevenLabs quota is exhausted, and a **replacement for HyperFrames' MusicGen fallback** (non-commercial).

## Sources (all accessed 2026-10-30)
- GitHub API: repos listed above via `gh api repos/...`
- HF API: `https://huggingface.co/api/models/<id>` for every weights license cited
- ElevenLabs: /docs/api-reference/music/compose; /docs/eleven-api/guides/how-to/music/composition-plans.md; /docs/eleven-api/guides/how-to/music/inpainting.md; /docs/api-reference/music/separate-stems; /docs/api-reference/text-to-sound-effects/convert; /docs/overview/capabilities/music; /music-terms; /sound-effects/commercial
- ACE-Step 1.5: README, docs/en/API.md, docs/en/CLI.md, HF card ACE-Step/Ace-Step1.5
- YuE README (YuE2 section); DiffRhythm README; HeartMuLa heartlib README; Magenta RT README; FunMusic (InspireMusic) README
- Stability AI Community License: https://stability.ai/community-license-agreement; SAO card: https://huggingface.co/stabilityai/stable-audio-open-1.0
- Stable Audio 3 (secondary): https://www.gigazine.net/gsc_news/en/20260522-stable-audio-3 ; https://alternativeto.net/news/2026/5/stability-ai-launches-stable-audio-3-0-for-advanced-music-generation-up-to-six-minute-long/ ; https://goodfirstissue.org/vllm-project/vllm-omni/issues/3787
- SongGeneration (secondary): https://goodfirstissue.org/vllm-project/vllm-omni/issues/3390 ; https://huggingface.co/lglg666/SongGeneration-base/discussions/1 ; https://raw.githubusercontent.com/BazedFrog/SongGeneration-Studio/main/README.md
- Beat This! README; all-in-one README + issues; SongFormer README; madmom README; BeatNet PyPI; Essentia PyPI files; NATTEN docs/install.md
- Demucs (adefossez) README; PyMusicLooper README; Remixatron README; MMAudio, ThinkSound, TangoFlux READMEs; HunyuanVideo-Foley LICENSE
- HyperFrames: docs/packages/cli.mdx, docs/guides/music-to-video.mdx, docs/guides/voice-and-audio.mdx, docs/reference/audio-effects.mdx, skills/media-use/audio/references/bgm.md, skills/hyperframes-cli/references/beats.md, packages/cli/src/audio/analysis/providers/beatThis.ts
