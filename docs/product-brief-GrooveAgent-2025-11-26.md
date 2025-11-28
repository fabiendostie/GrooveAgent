# Product Brief: GrooveAgent

**Date:** 2025-11-26  
**Author:** Fab  
**Context:** Solo Developer / Personal Product

---

## Executive Summary

GrooveAgent is a Max for Live MIDI effect plugin that transforms mechanically-programmed drums into human-feeling grooves by researching and applying the rhythmic DNA of any artist or producer. It solves the universal producer pain point: programmed drums sound robotic, and existing humanization tools add randomness rather than intentional musicality.

The plugin uses AI as a **research engine** — not a MIDI processor — to analyze an artist's documented style (swing patterns, ghost note habits, velocity curves, micro-timing tendencies) and generate a "Groove Recipe" that's applied locally to the user's MIDI clips. This approach ensures privacy, deterministic results, and the ability to run completely free using local LLMs (Ollama).

**Target:** Music producers (especially bedroom/home studio) using Ableton Live who struggle to make programmed drums feel alive.

**Pricing:** Pay-What-You-Want with $2.99 minimum (suggested $19) via Gumroad.

**Success Metric:** 1,000+ downloads within 3 months of launch.

---

## The Origin Story

Programming drums is tedious work, and achieving great results is genuinely hard. When you *play* drums — even on a pad controller or drum machine — your body naturally injects micro-variations: slightly late snares, unplanned ghost notes, velocity swells as energy builds. 

But when you *draw* MIDI on a grid? Perfection becomes the enemy. The more meticulous you are, the more mechanical it sounds.

Current solutions fail because they add *randomness* (Ableton's Humanize, generic groove templates) rather than *intentionality*. GrooveAgent changes this by researching how specific artists actually groove and applying that informed knowledge to your programmed patterns.

---

## Core Vision

**One-sentence pitch:** "Transfer the rhythmic DNA of any artist to your MIDI drums — from J Dilla's pocket to Questlove's swing — in one click."

**Core insight:** The LLM is a research engine, not a MIDI processor. It gathers verified information about an artist's groove characteristics and outputs a mathematical "Groove Recipe" that local code applies to MIDI. This means:

- ✅ MIDI data never leaves your computer (privacy)
- ✅ No token explosion from sending note data to APIs
- ✅ Deterministic, reproducible transformations
- ✅ Works completely FREE with Ollama (local LLM)
- ✅ Commercial API fallbacks for those without Ollama

**The magic moment:** User enters "J Dilla" → waits 30-60 seconds → hears their stiff programmed beat suddenly *breathe* with that unmistakable behind-the-beat pocket.

---

## Problem Statement

### The Core Problem

Programmed drums sound mechanical and robotic. When producers draw MIDI notes on a grid, they lose the natural human variations that make drums feel alive:

| What's Missing | Why It Matters |
|----------------|----------------|
| **Micro-timing variations** | Real drummers push/pull against the beat |
| **Velocity dynamics** | Every hit isn't the same volume |
| **Ghost notes** | Subtle fills that real drummers add unconsciously |
| **Swing/shuffle** | The groove that makes you nod your head |
| **Dynamic arcs** | Building and releasing tension over time |

### Why Existing Solutions Fail

| Solution | The Problem |
|----------|-------------|
| **Ableton's Groove Pool** | Generic grooves, not artist-specific |
| **Humanize function** | Random offset ≠ intentional feel ("makes it drunk, not groovy") |
| **Drum loops** | Locked to tempo/key, not editable |
| **Manual adjustment** | Time-consuming, requires expertise most don't have |
| **Session drummer** | Expensive, not always available |

### The Knowledge Gap

Many producers **don't know what they don't know**:
- They hear something is wrong but can't diagnose it
- They don't understand swing ratios, ghost notes, or micro-timing
- They can articulate "I want it to sound like J Dilla" but not *how* to achieve it

### Problem Impact

- Hours wasted manually tweaking MIDI notes
- Frustration leading to "good enough" compromises
- Productions that sound amateur despite good arrangement
- Inability to compete with producers who have real drummers or deep groove knowledge

---

## Proposed Solution

### How GrooveAgent Works

```
1. User programs drum pattern (in Ableton)
2. User adds GrooveAgent to MIDI track
3. User selects parameters + enters artist/style name
4. LLM researches the style → outputs "Groove Recipe" JSON
5. Plugin LOCALLY duplicates original clip N times
6. Plugin LOCALLY applies style transformations (JS math)
7. Each duplicate gets a different variation
8. User picks preferred variation(s)
```

### The Groove Recipe

The LLM outputs a structured JSON containing:

| Parameter | Description | Example |
|-----------|-------------|---------|
| **swing_ratio** | Percentage swing (0.5 = straight, 0.67 = triplet) | 0.62 |
| **push_pull_ms** | Per-beat timing offsets | [-5, +3, -2, +1] |
| **micro_timing_variance** | Random timing range (ms) | 8 |
| **velocity_curve** | Dynamic shape | "exponential" |
| **ghost_threshold** | Below this = ghost note | 45 |
| **accent_boost** | Multiplier for accented hits | 1.2 |
| **note_length_factor** | Articulation tightness | 0.85 |

### Key Differentiators

1. **Research-based, not random** — Grooves come from verified sources about real artists, not arbitrary humanization
2. **Artist-specific** — "J Dilla" gives you J Dilla's pocket, not generic swing
3. **Transparency** — Sources displayed so users know where the groove data comes from
4. **Intensity control (0-200%)** — From subtle to "more Dilla than Dilla" exaggeration mode
5. **100% FREE option** — Works offline with Ollama, no subscription needed
6. **Privacy-first** — MIDI data never leaves your computer; only style queries go to LLM
7. **Educational** — Users learn what makes grooves work through source citations

---

## Target Users

### Primary: The Bedroom Producer

| Attribute | Description |
|-----------|-------------|
| **Profile** | Alex, age 22-35, 2-5 years producing |
| **DAW** | Ableton Live Suite |
| **Genre** | Lo-fi hip-hop, neo-soul, electronic |
| **Budget** | $20-$50/month for plugins |

**Their Situation:**
- Makes beats that sound "almost there" but lack professional polish
- Knows what good drums sound like but can't replicate the feel
- Has tried groove templates and humanize — doesn't work
- Can't afford session drummers

**Jobs to Be Done:**
- **Functional:** Transform quantized drums to groovy drums quickly
- **Emotional:** Feel proud of productions, reduce frustration
- **Social:** Have tracks that stand out, get recognition

**What Makes Them Say Yes:**
> "If I could just say 'make this sound like Questlove' and it worked, I'd pay good money for that."

### Secondary: The Professional Producer

| Attribute | Description |
|-----------|-------------|
| **Profile** | Jordan, age 30-45, 10+ years experience |
| **DAW** | Ableton Live Suite (also Pro Tools, Logic) |
| **Genre** | Commercial pop, R&B, film scoring |
| **Budget** | $100-$500/month for plugins |

**Their Situation:**
- Clients ask for "that [artist] feel" but can't articulate it technically
- Session time is expensive — needs fast, reliable tools
- Values transparency and control over black-box effects
- Will judge entirely on output quality

**Jobs to Be Done:**
- **Functional:** Deliver client vision quickly and accurately
- **Emotional:** Maintain reputation, reduce stress
- **Social:** Be seen as innovative, ahead of trends

### Tertiary: The Curious Experimenter

| Attribute | Description |
|-----------|-------------|
| **Profile** | Sam, age 18-25, < 2 years experience |
| **Budget** | < $10/month (prefers free) |

**Their Situation:**
- Doesn't know why drums sound bad
- Wants to learn by doing
- Needs education, not just tools
- Will use the FREE Ollama option

---

## Success Metrics

### Business Objectives

| Metric | Target (3 months) | Measurement |
|--------|-------------------|-------------|
| **Downloads** | 1,000+ | Gumroad analytics |
| **Revenue** | $5,000+ | Gumroad |
| **Average price paid** | $15+ | Gumroad |
| **Reddit mentions** | 50+ | Search monitoring |
| **YouTube reviews** | 5+ | Search monitoring |

### User Success Metrics

| Behavior | Indicates |
|----------|-----------|
| User applies GrooveAgent to 3+ clips in first session | Product delivers value |
| User tries multiple artists/styles | Discovery is engaging |
| User shares with friends/community | Word-of-mouth potential |
| User pays above minimum | Perceived value is high |

### Key Performance Indicators

1. **First-use success rate** — % of users who successfully apply a groove on first try
2. **Return usage** — % of users who use GrooveAgent in subsequent sessions
3. **Conversion rate** — % of downloads that pay above minimum ($2.99)
4. **Support tickets** — Low volume indicates smooth UX

---

## MVP Scope

### Core Features (Must-Have for v1.0)

| Feature | Why Essential |
|---------|---------------|
| **Artist name input** | Core interaction — "make it sound like X" |
| **Intensity slider (0-200%)** | Control over effect strength + exaggeration mode |
| **Source display** | Trust and transparency — shows where groove data comes from |
| **One-click apply** | Simple workflow — can't be more complex than current process |
| **Ollama support** | FREE option is key differentiator |
| **Commercial API fallback** | For users without Ollama (Claude, GPT, Groq) |
| **8-16 bar limit** | Prevents token explosion and processing delays |
| **Multiple variations output** | User picks from N options |
| **Animated feedback** | Visual feedback during LLM research phase |
| **Error handling with guidance** | Educational messages, not cryptic errors |

### Out of Scope for MVP

| Feature | Why Deferred |
|---------|--------------|
| **Audio input/analysis** | Would require Python (librosa/essentia) — breaks KISS |
| **Community recipe sharing** | Feature creep — keep focused on core value |
| **Custom recipe saving** | Nice-to-have, not essential for proving concept |
| **Genre presets** | Can be added post-launch based on popular requests |
| **Preset caching** | Optimization — validate concept first |
| **Educational "explain" mode** | v1.1 feature |

### MVP Success Criteria

1. User can install plugin in < 2 minutes
2. User can apply first groove in < 3 minutes (including LLM wait)
3. Audible, positive difference in drum feel
4. No crashes or data loss
5. Clear path to recovery from errors (Ollama not installed, etc.)

### Future Vision (v2.0+)

- **Cached popular artists** — Instant results for J Dilla, Questlove, etc.
- **Genre quick-presets** — "Neo-Soul", "Trap", "Boom Bap" one-click styles
- **Educational mode** — Explain what changed and why
- **Audio-to-style** — Reference an audio file to extract groove (requires Python)
- **Custom recipe creation** — Save and share personal groove recipes

---

## Technical Preferences

### Architecture (Validated in Research)

```
Max for Live UI (bpatcher)
         ↓
node.script (Node.js runtime)
         ├── LLM API calls (Ollama / Commercial)
         ├── Style research prompts
         └── JS MIDI math (apply Groove Recipe)
         ↓
Live Object Model (clip manipulation via LiveAPI)
```

### Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **Pure JavaScript** | No Python for MVP — simpler install, KISS compliance |
| **node.script** | Production-ready in M4L, full npm ecosystem |
| **Multi-provider LLM** | User choice: Ollama (free), Groq (fast), Claude (quality) |
| **LLM as research engine** | Privacy, no token explosion, deterministic transforms |
| **JSON Groove Recipe** | Structured output, easy to validate and apply |
| **LiveAPI for clips** | Direct MIDI manipulation, no file I/O needed |

### LLM Provider Priority

1. **Ollama** (primary) — FREE, local, privacy-preserving
2. **Claude Opus 4.5** (quality fallback) — Best reasoning
3.  **OpenAI / xAI** (alternatives) — Widely supported
4.  **Groq** (speed fallback) — Ultra-fast, affordable 

### Platform Requirements

- Ableton Live 12+ with Max for Live (Suite or M4L add-on)
- Node.js 20 (bundled with Max 8.6+)
- Optional: Ollama installed locally for free operation

---

## Risks and Assumptions

### Critical Assumptions

| Assumption | How to Validate |
|------------|-----------------|
| LLMs have sufficient knowledge about artist grooves | Test with popular + obscure artists |
| JS can handle all MIDI math | Prototype core transformations |
| Users will install Ollama for free option | Track Ollama vs. commercial API usage |
| 30-60 second wait is acceptable | User testing + animation design |
| 4+ sources provide adequate anti-hallucination | Compare outputs with/without source requirement |

### Key Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Output quality disappoints** | Medium | Critical | PoC validated; 100-term music dictionary; source hierarchy (MIDI files > papers) |
| **Ollama too complex to install** | Medium | High | Clear docs; commercial API fallback; YouTube tutorial |
| **Obscure artists produce poor results** | Medium | Medium | Graceful warning; allow proceed with "lower confidence" |
| **LLM API goes down/changes** | Low | High | Abstraction layer; multiple provider support |
| **Competitor copies concept** | Medium | Medium | First-mover advantage; build community |

### Mitigated Risks (From Brainstorming)

| Risk | Mitigation Applied |
|------|---------------------|
| LLM hallucination | 4 sources required; source display for transparency |
| Too many notes | 8-16 bar limit enforced |
| No empty clip slots | Ask user to clear slots; clear error message |
| Rate limiting | Display message in screen window |

---

## Go-To-Market Strategy

### Pricing Model

| Component | Value |
|-----------|-------|
| **Model** | Pay-What-You-Want |
| **Minimum** | $2.99 |
| **Suggested** | $19 |
| **Platform** | Gumroad |

### Launch Channels

| Channel | Priority | Approach |
|---------|----------|----------|
| **Reddit** (r/ableton, r/edmproduction, r/makinghiphop) | High | Soft launch, gather feedback |
| **YouTube** | High | Demo video, tutorial content |
| **MaxForLive.com** | High | Official listing |
| **Gumroad** | High | Primary sales platform |
| **Discord** | Medium | Community building |
| **Twitter/X** | Medium | Announcements, engagement |

### Key Messages

1. "Sound like [J Dilla / Questlove / anyone] in one click"
2. "AI researches the style — you keep the control"
3. "Free with Ollama, works offline"
4. "See exactly where the groove data comes from"

---

## Supporting Materials

### Documents Incorporated

| Document | Key Contributions |
|----------|-------------------|
| **Brainstorming Session** (2025-11-26) | Architecture decisions, 200% exaggeration mode, pure JS validation |
| **Technical Research** (2025-11-26) | LLM provider comparison, node.script validation, MIDI library assessment |
| **User Research** (2025-11-26) | Persona definitions, pricing strategy, competitive landscape |

### Key Insights From Research

1. **AI music market growing 53% CAGR** — Timing is right
2. **97% can't distinguish AI from human music** — Quality bar is achievable
3. **No direct competitor** — Unique positioning gap exists
4. **Proof of concept works** — Fab validated NL → Python → MIDI in experiments

---

## Next Steps

1. **PRD Phase** — Transform this brief into detailed product requirements with FRs/NFRs
2. **UX Design** — Create interface mockups and interaction flows
3. **Architecture** — Formalize system design and Groove Recipe schema
4. **Implementation** — Sprint planning and development

---

_This Product Brief captures the vision and requirements for GrooveAgent._

_It was created through collaborative discovery and reflects the unique needs of this solo developer project._

_Next: PRD workflow will transform this brief into detailed planning artifacts._
