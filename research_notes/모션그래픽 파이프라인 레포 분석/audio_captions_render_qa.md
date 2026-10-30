# Audio, Voice, Captions, Post-Processing & Render/QA Infrastructure for a Code-Rendered Motion Graphics Pipeline

All GitHub numbers were pulled with `gh api` on **2026-10-30**. Hugging Face numbers come from the HF models API on the same date: "downloads" is HF's rolling ~30-day count. GitHub "pushed" is the last push date.

## Q1. Voice / TTS (open-source and API), with Korean quality

### Takeaway
For self-hosted Korean narration with clean commercial terms, the two main candidates are **Qwen3-TTS** (Apache-2.0, Korean listed, 3-second voice cloning, preset Korean voice "Sohee") and **Fun-CosyVoice3** (Apache-2.0, Korean among its 9 languages). **MeloTTS-Korean** (MIT) is a lightweight CPU fallback. Several popular models are NOT commercially safe: **F5-TTS** weights (CC-BY-NC-4.0), **XTTS-v2** (Coqui Public Model License, non-commercial, and the licensor is defunct), **Fish-Speech** (revenue-threshold community license), and **IndexTTS-2** (bilibili license with size caps). **Kokoro has no Korean voices.** **Supertone/Supertonic is archived and the company reportedly dissolved**, so do not build on the Supertone API.

### Cited Findings

**Open-weight models: license, Korean support, activity (observed 2026-10-30)**

| Model | Repo / weights | Code license | Weights license | Korean? | GH stars / last push | Notes |
|---|---|---|---|---|---|---|
| Qwen3-TTS | github.com/QwenLM/Qwen3-TTS; HF Qwen/Qwen3-TTS-12Hz-1.7B-Base | Apache-2.0 | apache-2.0 (HF tag) | **Yes**, 1 of 10 languages | 14,100 / 2026-03-17 | HF 1.7B-Base: ~3.38M downloads |
| Fun-CosyVoice3 (CosyVoice 3) | github.com/FunAudioLLM/CosyVoice (now resolves to QwenAudio/CosyVoice); HF FunAudioLLM/Fun-CosyVoice3-0.5B-2512 | Apache-2.0 | apache-2.0 (HF tag) | **Yes**, 1 of 9 languages + 18 Chinese dialects | 24,193 / 2026-05-25 | Released 2025/12 |
| MeloTTS | github.com/myshell-ai/MeloTTS; HF myshell-ai/MeloTTS-Korean | MIT | mit | **Yes** (dedicated KR checkpoint) | 7,687 / **2024-12-24** (stale) | Real-time on CPU |
| Supertonic 3 | github.com/supertone-oss-archive/supertonic (**archived**) | MIT | **OpenRAIL** (use-restricted) | Yes, 1 of 31 languages | 13,761 / archived | 99M params, ONNX |
| Kokoro-82M | github.com/hexgrad/kokoro; HF hexgrad/Kokoro-82M | Apache-2.0 | apache-2.0 | **No** | 9,782 / 2025-08-06 | HF ~11.0M downloads |
| F5-TTS | github.com/SWivid/F5-TTS | MIT | **cc-by-nc-4.0** (non-commercial) | Not in official checkpoint (unverified) | 15,486 / 2026-10-23 | |
| XTTS-v2 (Coqui) | HF coqui/XTTS-v2; maintained fork github.com/idiap/coqui-ai-TTS | MPL-2.0 (fork) | **CPML** (non-commercial) | 17 languages; Korean status unverified here | fork 2,345 / 2026-10-24 | |
| Fish-Speech / OpenAudio | github.com/fishaudio/fish-speech | Fish Audio Community License | same | not verified | 33,488 / 2026-10-29 | |
| IndexTTS-2 | github.com/index-tts/index-tts | bilibili Model Use License | same | not verified | 24,823 / 2026-09-29 | |
| Chatterbox | github.com/resemble-ai/chatterbox | MIT | MIT | not verified | 27,418 / 2026-07-21 | |

Per-model sources:

- **Qwen3-TTS** covers "10 major languages (Chinese, English, Japanese, Korean, German, French, Russian, Portuguese, Spanish, and Italian)". The 1.7B/0.6B "Base" models do "3-second rapid voice clone". The 1.7B-VoiceDesign model builds voices from text descriptions, and CustomVoice ships 9 premium timbres. — [Qwen3-TTS README](https://github.com/QwenLM/Qwen3-TTS)
- The Qwen3-TTS technical report says tokenizers and models are released under Apache 2.0. — [arXiv 2601.15621](https://arxiv.org/html/2601.15621)
- The Qwen3-TTS model card describes the Korean preset voice "Sohee" as a warm Korean female voice with rich emotion, per a secondary summary. — [Qwen3-TTS model card summary via search](https://docs.clore.ai/guides/audio-and-voice/qwen3-tts)
- **CosyVoice**: Korean is among the 9 supported languages. Latest is Fun-CosyVoice3-0.5B-2512 (2025/12). Self-reported results: test-zh CER 1.21% (RL variant 0.81%), test-en WER 2.24% (RL 1.68%), against CosyVoice2 at 1.45% / 2.57%. Bi-streaming latency is claimed as low as 150 ms. No Korean-specific metrics are published. — [CosyVoice GitHub](https://github.com/FunAudioLLM/CosyVoice)
- **Kokoro**: VOICES.md lists only American English, British English, Japanese, Mandarin Chinese, Spanish, French, Hindi, Italian, and Brazilian Portuguese. No Korean. — [Kokoro-82M VOICES.md](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md)
- **Supertonic**: the README says "This repository is archived. Development and support have ended." Weights moved to the `supertone-oss-archive` HF namespace. — [supertonic README](https://github.com/supertone-oss-archive/supertonic)
- A Supertonic HF mirror states that Supertone Inc. resolved to dissolve on 2026-07-15. It also says Supertone Play, the Supertone API and Voice Builder were discontinued on 2026-08-31. This is a secondhand claim, but it is consistent with the archived repo. — [supertonic-3 mirror](https://huggingface.co/lnkiai/supertonic-3-mirror)
- **Conflict:** Supertone's Korean API page still showed a $2.99/month Starter plan (~30 min audio) in search results. This is likely stale given the shutdown. — [supertone.ai/ko/api](https://www.supertone.ai/ko/api)
- A Supertone-affiliated person claimed Supertone beat ElevenLabs on Korean in a May 2025 external evaluation. This is self-reported. — [LinkedIn](https://kr.linkedin.com/in/juheonn)
- **XTTS-v2**: the weights use the Coqui Public Model License (non-commercial), and Coqui has shut down, so no commercial license can be bought. The library code (MPL-2.0) is commercially usable. — [localaimaster XTTS license post](https://localaimaster.com/blog/xtts-coqui-commercial-license); [XTTS-v1 LICENSE](https://huggingface.co/coqui/XTTS-v1/raw/main/LICENSE)
- **F5-TTS**: HF license tag is `cc-by-nc-4.0` (HF API, 2026-10-30). There is a community discussion on licensing. — [HF F5-TTS discussion #7](https://huggingface.co/SWivid/F5-TTS/discussions/7)
- **Fish Audio Community License** (v1.0, "Last Updated: October 13, 2026") allows free research and non-commercial use. Commercial use is limited to licensees under an annual "Revenue Threshold". Anything above that, and any "Hosted Service", requires a separate written license. — [fish-speech LICENSE](https://github.com/fishaudio/fish-speech/blob/main/LICENSE)
- **IndexTTS-2 (bilibili license)**: royalty-free, but you need a separate license if you have >100M MAU or >RMB 1 billion annual revenue. Clause 3.4(c) bars using the model or its outputs to improve other AI models except non-commercial ones. — [index-tts LICENSE](https://github.com/index-tts/index-tts/blob/main/LICENSE)
- Chatterbox (MIT) and Kokoro (Apache-2.0) are both cited as commercial-safe without a separate agreement. — [localaimaster Kokoro vs XTTS vs Chatterbox](https://localaimaster.com/blog/kokoro-vs-xtts-vs-chatterbox)
- A 2026 SiliconFlow (Korean-language) guide picks Fish Speech V1.5, CosyVoice2-0.5B and IndexTTS-2 as its top open TTS models. It does not evaluate Korean specifically. — [SiliconFlow KO guide](https://www.siliconflow.com/ko/articles/best-open-source-text-to-speech-models)
- A Korean community post (damoang, 2026-06) says Korean TTS lags English significantly, though some indie Korean TTS sounds more natural than Google TTS. This is opinion. — [damoang](https://damoang.net/free/6580076)
- A Korean voice-AI overview says open-source has nearly caught commercial in STT but still trails it in TTS. — [youngju.dev 2026-05-15](https://www.youngju.dev/blog/culture/2026-05-15-voice-ai-2026-elevenlabs-cartesia-sesame-whisper-deepgram-parakeet-deep-dive)

**APIs**
- **Korean TTS Arena**: channelcorp (Channel Talk) runs a Korean TTS Arena HF Space. Its code calls Typecast's `ssfm-v30` model for Korean voices. The leaderboard contents could not be scraped. — [Ko-TTS-Arena tts.py](https://huggingface.co/spaces/channelcorp/Ko-TTS-Arena/blob/refs%2Fpr%2F1/tts.py); [Space](https://huggingface.co/spaces/channelcorp/Ko-TTS-Arena)
- **ElevenLabs pricing** estimates conflict. One source cites $50/1M chars for Flash/Turbo and $100/1M for Multilingual v2/v3 (July 2026 review). — [Techsy](https://techsy.io/ar/mudawwana/afdal-wajihat-tahwil-nass-ila-kalam-lil-mutatawirin)
  - Another estimate is $100–200/1M chars. — [stork.ai KO](https://www.stork.ai/blog/ko/elevenlabs-pricing-2026)
  - None of these is an official rate card.
- A 2026 comparison says Korean and Japanese quality in some alternative providers lags ElevenLabs. — [youngju.dev 2026-05-16](https://www.youngju.dev/blog/culture/2026-05-16-voice-ai-tts-2026-elevenlabs-cartesia-openai-voice-play-ht-hume-sesame-fish-deepgram-aura-deep-dive.en)

### Inferences
- **Default pick: Qwen3-TTS.** For a Korean, commercially used, self-hosted pipeline, Qwen3-TTS-1.7B is the best default. It has Apache-2.0 weights, explicit Korean support, voice design and voice cloning, and very high HF adoption. Fun-CosyVoice3 is a strong alternative or A/B candidate. MeloTTS-Korean suits fast CPU drafts, but the repo has had no push since 2024-12.
- **Fully managed option.** Typecast (Korean company, used in the Korean TTS Arena) and ElevenLabs are the realistic Korean API choices now that Supertone's API is reportedly gone. Pin the TTS provider behind one interface so it can be swapped.
- **Non-commercial or restricted licenses (flags):**
  - F5-TTS weights: CC-BY-NC.
  - XTTS-v2: CPML, non-commercial.
  - MusicGen weights: CC-BY-NC (see Q3).
- **Revenue-capped licenses:** Fish-Speech (usable by small entities under its threshold) and IndexTTS-2 (very large companies only need a separate license).
- **Use-restricted but commercial-OK:** Supertonic (OpenRAIL). It is also unmaintained.
- **Korean text normalization.** Even good Korean TTS will mispronounce numbers, English acronyms and units. Plan a Korean text-normalization step (number-to-Hangul reading) before TTS. This is an inference; no source was gathered on it.

### Gaps
- No reliable head-to-head Korean MOS/CER benchmark for Qwen3-TTS vs CosyVoice3 vs Typecast vs ElevenLabs was found. The Ko-TTS-Arena leaderboard could not be read.
- Typecast official API pricing was not found.
- The ElevenLabs official per-character price was not verified on its own pricing page.
- The Fish Audio "Revenue Threshold" dollar figure was not extracted from the license text.
- Whether F5-TTS, Chatterbox (multilingual), Fish-Speech or IndexTTS-2 support Korean was not verified.
- Naver CLOVA Voice and Google/Azure Korean neural voices were not researched in this pass.

## Q2. Timing / sync: word-level timestamps, beat detection, audio visualization

### Takeaway
**WhisperX** (BSD-2) gives word-level timestamps and has a default **Korean** alignment model (`kresnik/wav2vec2-large-xlsr-korean`, Apache-2.0), so it is the strongest choice for aligning Korean narration. Inside Remotion, **@remotion/install-whisper-cpp** with `toCaptions()` plus **@remotion/captions** (MIT) is the native path. For beats, **librosa (ISC)** is the permissive choice. **essentia (AGPL-3.0)** and **aubio (GPL-3.0)** carry copyleft obligations.

### Cited Findings

**Repo status (2026-10-30)**

| Repo | Stars | License | Last push | Status |
|---|---|---|---|---|
| m-bain/whisperX | 24,940 | BSD-2-Clause | 2026-10-22 | active |
| SYSTRAN/faster-whisper | 26,319 | MIT | 2026-10-25 | active |
| ggml-org/whisper.cpp | 54,793 | MIT | 2026-10-30 | active |
| linto-ai/whisper-timestamped | 2,856 | **AGPL-3.0** | 2026-09-28 | active |
| jianfch/stable-ts | 2,281 | MIT | — | **archived** |
| librosa/librosa | 8,724 | ISC | 2026-10-06 | active |
| MTG/essentia | 3,786 | **AGPL-3.0** | 2026-10-22 | active |
| aubio/aubio | 3,776 | **GPL-3.0** | 2026-04-10 | active |

Source for all rows: GitHub API, 2026-10-30.

- WhisperX `alignment.py` maps `"ko": "kresnik/wav2vec2-large-xlsr-korean"` in its default align models. `ja` and `zh` are treated as languages without spaces. — [whisperX alignment.py](https://github.com/m-bain/whisperX/blob/main/whisperx/alignment.py)
  - The kresnik model is Apache-2.0 with ~1.13M HF downloads (HF API, 2026-10-30). — [HF kresnik/wav2vec2-large-xlsr-korean](https://huggingface.co/kresnik/wav2vec2-large-xlsr-korean)
- WhisperX pipeline: faster-whisper transcription followed by wav2vec2 forced alignment for word timestamps.
  - Known limitation: tokens with characters missing from the alignment dictionary (e.g., "2014.", "£13.60") get no timing. — [WhisperX overview/transcript](https://gotranscript.com/public/whisperx-fast-whisper-transcription-with-word-timestamps)
  - Further pipeline notes. — [whisperX fork README](https://github.com/kaihe-stori/whisperX)
- **@remotion/captions** (MIT, available from v4.0.216) defines a standard `Caption` shape. Each transcription source has a converter that outputs it:
  - `@remotion/install-whisper-cpp` → `toCaptions()`
  - `@remotion/whisper-webgpu` → `toCaptions()`
  - `@remotion/openai-whisper` → `openAiWhisperApiToCaptions()`
  - `@remotion/elevenlabs` → `elevenLabsTranscriptToCaptions()`
  - Source: [Remotion captions API](https://www.remotion.dev/docs/captions/api)
- Latest Remotion release is **v4.0.539, published 2026-10-26** (GitHub releases API).

### Inferences
- **Recommended sync flow.** Generate TTS, then force-align the *known script* rather than transcribing blind. Two ways:
  - Run WhisperX with the Korean wav2vec2 model.
  - Use TTS-native timestamps if the provider returns them (ElevenLabs does; see the `@remotion/elevenlabs` converter).
  - Then convert to Remotion `Caption[]`. Aligning the known script avoids ASR spelling errors in Korean captions.
- **Pre-normalize text.** Digits and Latin characters may drop timing in WhisperX Korean alignment. Convert numbers to Hangul readings before alignment, then map back for display.
- **Beat detection.** librosa `beat_track`/`onset_detect` run offline in a Python pre-step and write a JSON beat grid that Remotion reads. Avoid AGPL essentia if the pipeline is ever offered as a hosted service.
- whisper-timestamped is AGPL, and stable-ts and fluent-ffmpeg are archived. Avoid all three as new dependencies.

### Gaps
- `@remotion/media-utils` (`visualizeAudio`, `getAudioData`, waveform helpers) docs were not fetched this pass. Verify the API names on remotion.dev before citing.
- `createTikTokStyleCaptions`, `parseSrt`, and `serializeSrt` did not render on the fetched API page and need confirmation.
- No benchmark of WhisperX Korean word-timing accuracy (ms error) was found.

## Q3. Music / SFX: royalty-free libraries and generative music with commercial-safe licenses

### Takeaway
For stock audio:
- Pixabay (no attribution, no standalone resale), Mixkit, and Freesound filtered to **CC0** are commercially safe.
- YouTube Audio Library is safe only for YouTube and needs per-track checks.
- BBC Sound Effects and any CC-BY-NC asset are not safe.

For generative music:
- **ACE-Step 1.5 (MIT)** and **ACE-Step v1 (Apache-2.0)** are the permissive options.
- **MusicGen weights are CC-BY-NC-4.0 (non-commercial).**
- **Stable Audio Open** uses a custom "other" license; check its revenue terms.

### Cited Findings
- Pixabay music and SFX fall under the Pixabay Content License with no attribution required (pre-2019 uploads are CC0). Use inside a video or game is fine, but reselling standalone files is not. — [cinevva guide 2026](https://app.cinevva.com/guides/free-sound-effects-music)
- Freesound licenses are set per sound (CC0, CC-BY, or CC-BY-NC). Filter to CC0 for commercial safety. — [cinevva guide 2026](https://app.cinevva.com/guides/free-sound-effects-music); [Soundly FAQ](https://getsoundly.com/faq/how-can-i-use-the-freesound-library)
- BBC Sound Effects (RemArc) and CC-BY-NC content are restricted from commercial use. — [cinevva guide 2026](https://app.cinevva.com/guides/free-sound-effects-music)
- YouTube Audio Library tracks are licensed for YouTube videos, and some require attribution. — [cinevva guide 2026](https://app.cinevva.com/guides/free-sound-effects-music)
- Mixkit uses its own free license with no attribution required. — [cinevva guide 2026](https://app.cinevva.com/guides/free-sound-effects-music)

**Generative models (HF API and GitHub API, 2026-10-30)**

| Model | License | Downloads (HF) | Repo status |
|---|---|---|---|
| ACE-Step/Ace-Step1.5 | **MIT** | ~90.6K | github.com/ace-step/ACE-Step-1.5: 14,194 stars, MIT, pushed 2026-10-11 |
| ACE-Step/ACE-Step-v1-3.5B | **Apache-2.0** | — | github.com/ace-step/ACE-Step: 5,001 stars, pushed 2026-02-15 |
| facebook/musicgen-large | **cc-by-nc-4.0** (non-commercial) | — | audiocraft code is MIT (23,777 stars) |
| stabilityai/stable-audio-open-1.0 and -small | `license:other` (Stability community license) | — | stable-audio-tools code is MIT (3,895 stars, pushed 2026-10-24) |

- Related: ace-step has a `ACE-Step-DAW` repo under AGPL-3.0 and an `acestep.cpp` port under MIT (GitHub API).

### Inferences
- **Generated background music.** ACE-Step 1.5 (MIT) is the safest open-weight choice. Keep a per-track provenance record (model, seed, prompt, license) in the render manifest.
- **Stock assets.** Keep a license field per asset and fail the build if any asset is NC or lacks a recorded license. This is cheap to implement as a manifest check.
- **Avoid as defaults:** MusicGen (NC), and Stable Audio Open unless revenue eligibility is confirmed.

### Gaps
- Exact Stable Audio Open commercial terms (revenue cap) were not fetched.
- Content ID false-claim risk for Pixabay and YouTube-library tracks on YouTube was not researched.
- Korean royalty-free libraries (e.g., 공유마당 by the Korea Copyright Commission) were not researched.
- Licensing of AI-generated SFX (ElevenLabs SFX API) was not researched.

## Q4. Post / encode: FFmpeg wrappers, loudness, delivery specs, color

### Takeaway
Use FFmpeg directly or through **ffmpeg-normalize** (two-pass EBU R128 loudnorm). Targets:
- **YouTube/streaming:** about **−14 LUFS, −1 dBTP**.
- **Korean broadcast:** **−24 LKFS ±2 dB**, under the 2014 MSIP notice.
- **EBU R128 (Europe):** −23 LUFS.

Node FFmpeg wrappers are decaying: **fluent-ffmpeg is archived**, and ffmpeg-python had no push since 2024-08. Calling the ffmpeg CLI directly is the durable option.

### Cited Findings

**Wrappers and tools (GitHub API, 2026-10-30)**

| Repo | Stars | License | Last push | Status |
|---|---|---|---|---|
| fluent-ffmpeg/node-fluent-ffmpeg | 8,229 | MIT | — | **archived** |
| kkroening/ffmpeg-python | 11,011 | Apache-2.0 | 2024-08-04 | stale |
| slhck/ffmpeg-normalize | 1,539 | GitHub reports "Other" | 2026-10-14 | active |
| Netflix/vmaf | 5,578 | GitHub reports "Other" | 2026-10-26 | active |

**Loudness targets and method**
- ffmpeg `loudnorm` defaults to I=−24 (broadcast). For streaming use e.g. `loudnorm=I=-14:TP=-1.5:LRA=11`.
- Two-pass is recommended: measure with `print_format=json`, then apply with the `measured_*` values and `linear=true`. Use `-c:v copy` to avoid video re-encode. — [dev.to loudnorm guide](https://dev.to/javidjamae/ffmpeg-loudnorm-filter-ebu-r128-loudness-normalization-guide-15d4)
- YouTube targets −14 LUFS and turns louder content down. ATSC A/85 (US) uses −24 LKFS ±2, and EBU R128 uses −23 LUFS. — [editingtools.io loudness](https://editingtools.io/loudness/)
- Netflix is reported to require −27 LKFS dialog-gated with a −2 dBTP peak. Sources conflict, so verify against the platform spec. — [editingtools.io loudness](https://editingtools.io/loudness/)
- A browser-use `video-use` project normalizes to −14 LUFS, −1 dBTP, LRA 11. — [instagit video-use](https://instagit.com/browser-use/video-use/loudness-normalization-targets-video-use/)
- **Korea:** the 「디지털 텔레비전 방송프로그램 음량 등에 관한 기준」 (MSIP notice 2014-87, 2014-11-29) sets average program loudness at **−24 LKFS with ±2 dB operating tolerance**. Live specialist classical and gugak music programs are exempt. Measurement follows ITU-R BS.1770. — [law.go.kr notice file](https://www.law.go.kr/LSW/flDownload.do?flSeq=165037919); [KoreaScience paper](https://koreascience.kr/article/JAKO201545555994399.pdf)
- US sources describe −24 LKFS as a recommended value rather than a mandate. — [tvtechnology](https://www.tvtechnology.com/opinions/getting-calmer-bit-by-bit)

### Inferences
- **Delivery presets.** Define two presets: `web` (−14 LUFS / −1 dBTP, H.264 High, yuv420p, BT.709, AAC 48 kHz) and `kr-broadcast` (−24 LKFS ±2 / −2 dBTP).
  - Run ffmpeg-normalize, or two-pass loudnorm, as the final audio step after Remotion renders.
  - Check that the renderer tags color as BT.709 (Remotion renders sRGB from Chromium).
  - The color-tag and codec settings are standard practice, not sourced in this pass.
- **Duck the music under the voice.** Use sidechain compression or ffmpeg `sidechaincompress`, or set explicit volume curves in Remotion `<Audio volume={f=>...}>`. This is an inference; not researched here.

### Gaps
- Whether the 2014 Korean loudness notice is still in force unchanged in 2026 was not verified.
- Korean OTT delivery specs (e.g., Coupang Play, TVING, Wavve) were not found.
- The exact ffmpeg-normalize and VMAF license texts were not fetched. GitHub reports "Other" for both. VMAF is widely understood to be BSD-2-Clause-Patent, but that was unverified here.
- No sources were gathered on color management (OCIO, BT.709 vs sRGB gamma shift in browser-rendered video).

## Q5. Automated QA for rendered video

### Takeaway
Use deterministic checks first and a vision LLM second:
- **Deterministic:** frame extraction with ffmpeg; text-bounding-box and safe-area checks computed from the layout engine (DOM measurement in Remotion); loudness measurement; VMAF/SSIM for encode regressions.
- **Vision LLM:** a secondary reviewer on sampled keyframes.

Research shows VLMs are inconsistent on temporal and aesthetic judgments, miss transient glitches, and can be hijacked by on-screen text.

### Cited Findings
- **MoVer** (arXiv 2502.13372) verifies LLM-generated motion graphics against spatiotemporal properties expressed in a DSL. It enables iterative LLM self-correction "without user intervention". — [MoVer paper](https://arxiv.org/pdf/2502.13372)
- A HeyGen technical report (Code2Video benchmark) notes general VLMs are inconsistent at judging temporal flow, composition balance, and aesthetic polish in generated motion design. — [HeyGen research](https://www.heygen.com/research/introducing-code2video-benchmark)
- **VideoGameQA-Bench**: the best model reached 53.0% on visual and 40.0% on UI glitch detection. VLMs treat video as frame sequences, and transient glitches that last a few frames are hard to catch. — [VideoGameQA-Bench](https://ar5iv.labs.arxiv.org/html/2505.15952)
- **Triage pattern:** VLM triage reduces millions of raw frames to a few thousand candidate frames for human review (2026 gameplay-QA study). — [arXiv 2603.22706](https://arxiv.org/html/2603.22706v1)
- **Text-overlay hijacking:** VLMs can report what on-screen text claims instead of what the visuals show (2026). This is relevant when asking a VLM to judge frames full of captions. — [alphaxiv 2604.17375](https://www.alphaxiv.org/abs/2604.17375)
- Braintrust publishes a cookbook for evaluating video QA with LLM judges. — [Braintrust VideoQA](https://braintrust.dev/docs/cookbook/recipes/VideoQA)
- VMAF (Netflix) is actively maintained: 5,578 stars, pushed 2026-10-26 (GitHub API).

### Inferences
Suggested QA gate order (cheapest and most deterministic first):
1. Measure text overflow and safe areas in the browser at render time. In Remotion, `measureText` or DOM `getBoundingClientRect` against a 90%/80% title-safe box. Fail on any overflow. This catches Korean line-break issues; set `word-break: keep-all` for Korean.
2. Check contrast with WCAG ratio computed from layout colors.
3. Run ffprobe/ffmpeg checks: duration, fps, codec, color tags, black or frozen frames (`blackdetect`, `freezedetect`), and loudness with `ebur128`.
4. Use VMAF or SSIM only when changing encoders or presets.
5. Send a Claude or other vision LLM a contact sheet of keyframes (scene boundaries plus caption changes) with a rubric. Keep this advisory unless it flags a high-confidence issue.

This mirrors MoVer's "verify then self-correct" loop. The specific tool names (blackdetect, freezedetect, ebur128) are standard FFmpeg filters but were not sourced in this pass.

### Gaps
- No open-source repo was found that packages "text overflow / safe-area check for Remotion" as a tool.
- No visual-regression library comparison (e.g., Playwright screenshot diff, pixelmatch, reg-suit for Remotion stills) was researched.
- No Korean-specific caption QA guidance was found, such as character-per-second limits for Korean subtitles from broadcaster style guides.

## Q6. Render scaling: Remotion Lambda / Cloud Run, distributed rendering, local GPU encoding

### Takeaway
- **Remotion Lambda** is the recommended, mature scaling path: distributed chunks, pay-per-render, 1,000 concurrent functions per region by default.
- **Cloud Run** is cheaper per render but renders on a single machine and is marked **Alpha**.
- **Local GPU encoding:** NVENC on Windows/Linux has been supported since v4.0.484, and VideoToolbox on macOS. Set it with `hardwareAcceleration: "if-possible"`. This only speeds up encoding; frame rendering is still Chromium.
- **Licensing:** Remotion is free for individuals and companies with ≤3 employees. Larger for-profits need a company license, and cloud rendering is billed in Cloud Rendering Units or seats.

### Cited Findings
- Remotion's comparison page recommends Lambda for most users (speed, setup, maturity, cost, scalability).
  - Cloud Run is cheaper because it has "no distributed rendering and no overhead", but it renders on one machine.
  - Cloud Run is described as "in Alpha".
  - Source: [Remotion compare-ssr](https://www.remotion.dev/docs/compare-ssr)
- Lambda concurrency and billing:
  - Default limit is 1,000 concurrent Lambdas per region (can be raised), with a burst limit as low as 500 in some regions.
  - Many renders need gradual ramp-up.
  - You pay only while rendering. Cost depends on region, memory, video type and parallelism.
  - Source: [Remotion Lambda docs](https://www.remotion.dev/docs/lambda)
- Companies that need a license must license cloud rendering via Cloud Rendering Units. One page states 1 cloud rendering seat per 2,000 renders/month. — [Remotion Lambda docs](https://www.remotion.dev/docs/lambda); [cloudrun.remotion.dev mirror](https://cloudrun.remotion.dev/docs/lambda)
- **Remotion license:**
  - Free License covers individuals, for-profits with up to 3 employees, non-profits, and evaluation. Commercial video creation is allowed under it.
  - Larger orgs need the Company License.
  - Reselling or relicensing derivatives of Remotion is forbidden.
  - The license will "slightly change" in Remotion 5.0 (PR #3750).
  - Source: [Remotion LICENSE.md](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)
- remotion-dev/remotion: 69,019 stars; latest release v4.0.539 (2026-10-26) (GitHub API, 2026-10-30).
- **Hardware-accelerated encoding:**
  - Supported from v4.0.228. macOS uses VideoToolbox; Linux and Windows use NVENC (NVIDIA) from v4.0.484.
  - ProRes from v4.0.228; H.264/H.265 from v4.0.236.
  - The default is `"disabled"`. Options are `"if-possible"` and `"required"`.
  - Source: [Remotion hardware acceleration docs](https://www.remotion.dev/docs/hardware-acceleration)

### Inferences
- **Recommended setup.** A single creator or small team (≤3 people) on a Windows PC with an NVIDIA GPU should start with local `renderMedia()` using `hardwareAcceleration: "if-possible"` and `concurrency` tuned to CPU cores. Move to Lambda only when batch volume demands it. Cloud Run's Alpha status makes it a poor production bet.
- **License check.** If the user's org exceeds 3 employees, a Remotion Company License is required before commercial use. Flag this in the final report.

### Gaps
- Current Lambda cost per minute of 1080p video was not found with a date.
- The Remotion 5.0 license change details and release date were not checked.
- Non-Remotion distributed rendering (e.g., Revideo, Motion Canvas, or ffmpeg-based farms) and their scaling stories were not researched in this pass.
- Actual NVENC speedups on Windows for Remotion were not benchmarked in any source found.
