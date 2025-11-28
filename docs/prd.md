# GrooveAgent - Product Requirements Document

**Author:** Fab  
**Date:** 2025-11-26  
**Version:** 1.1 (UI Components Update)

---

## Executive Summary

GrooveAgent is a Max for Live MIDI effect plugin that transforms mechanically-programmed drums into human-feeling grooves by researching and applying the rhythmic DNA of any artist or producer. 

The plugin addresses a universal producer pain point: programmed drums sound robotic, and existing humanization tools (Ableton's Humanize, generic groove templates) add *randomness* rather than *intentional musicality*. GrooveAgent changes this by using AI as a **research engine** — not a MIDI processor — to analyze an artist's documented style and generate a mathematical "Groove Recipe" that transforms MIDI locally.

**Core Value Proposition:** "Transfer the rhythmic DNA of any artist — from J Dilla's pocket to Questlove's swing — in one click."

**Key Differentiators:**
- **Research-based, not random** — Grooves derived from verified artist documentation
- **100% FREE option** — Works offline with Ollama, no subscription required
- **Privacy-first** — MIDI data never leaves the computer; only style queries go to LLM
- **Transparency** — Sources displayed so users know where groove data originates
- **Intensity control (0-200%)** — From subtle to exaggerated "more Dilla than Dilla" mode

### What Makes This Special

The magic moment: User enters "J Dilla" → waits 20-30 seconds → hears their stiff programmed beat suddenly *breathe* with that unmistakable behind-the-beat pocket. No other tool does artist-specific groove transfer with source transparency and a free local option.

---

## Project Classification

**Technical Type:** Desktop App (Max for Live Plugin)  
**Domain:** General (Music Production Software)  
**Complexity:** Low

GrooveAgent is a greenfield Max for Live MIDI effect plugin embedded within Ableton Live. It requires Max for Live (bundled with Live Suite or available as add-on) and optionally Ollama for free local LLM operation. The technical stack is pure JavaScript running via `node.script`, eliminating external runtime dependencies.

**Architecture Pattern:**
```
Max for Live UI (bpatcher)
         ↓
node.script (Node.js runtime)
         ├── LLM API calls (Ollama / Commercial)
         ├── Style research + Groove Recipe generation
         └── MIDI math (apply transformations)
         ↓
Live Object Model (clip manipulation via LiveAPI)
```

---

## Success Criteria

### Business Success (3-Month Targets)

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Downloads** | 1,000+ | Gumroad analytics |
| **Revenue** | $5,000+ | Gumroad |
| **Average Price Paid** | $15+ | Gumroad (PWYW min $2.99, suggested $19) |
| **Community Mentions** | 50+ Reddit mentions | Search monitoring |
| **Content Coverage** | 5+ YouTube reviews | Search monitoring |

### User Success Indicators

| Behavior | Indicates |
|----------|-----------|
| User applies GrooveAgent to 3+ clips in first session | Product delivers immediate value |
| User tries multiple artists/styles | Discovery is engaging |
| User pays above minimum ($2.99) | Perceived value exceeds expectations |
| Low support ticket volume | Smooth UX, clear error handling |

### MVP Success Criteria

1. User can install plugin in < 2 minutes
2. User can apply first groove in < 3 minutes (including LLM wait)
3. Audible, positive difference in drum feel
4. No crashes or data loss
5. Clear guidance when Ollama not installed or API keys missing

---

## Product Scope

### MVP - Minimum Viable Product (v1.0)

| Feature | Description | Why Essential |
|---------|-------------|---------------|
| **Artist name input** | Text field to enter any artist/producer name | Core interaction — "make it sound like X" |
| **Intensity slider (0-200%)** | Controls effect strength; >100% exaggerates all groove parameters | User control + creative exaggeration mode |
| **Variations selector** | User selects N (number of output clips to generate) | Multiple options let user pick preferred result |
| **Source display** | Shows 4+ sources where groove data originated | Trust, transparency, anti-hallucination |
| **One-click apply** | Single button to trigger research and transformation | Simplicity — can't be harder than current workflow |
| **Ollama support** | Primary LLM provider — FREE, local, offline | Key differentiator — zero cost option |
| **Commercial API fallback** | Claude, GPT, Groq support with user-provided API keys | For users without Ollama |
| **First-run setup popup** | Interactive onboarding explaining Ollama vs. API key options | Reduces confusion, guides setup |
| **8-16 bar limit** | Enforces clip length constraints | Prevents token explosion and slow processing |
| **Animated feedback** | Visual indicator during LLM research phase | Manages expectations during 20-30s wait |
| **Clear error messages** | Educational guidance, not cryptic errors | Reduces support burden |

### Growth Features (v1.x - Post-MVP)

| Feature | Why Deferred |
|---------|--------------|
| **Preset caching for popular artists** | Optimization — validate concept first |
| **Genre quick-presets** | Can add based on popular requests ("Neo-Soul", "Trap", "Boom Bap") |
| **Custom recipe saving** | Nice-to-have, not essential for proving value |
| **Educational "explain" mode** | Shows what changed and why — educational layer |

### Vision Features (v2.0+)

| Feature | Why Future |
|---------|-----------|
| **Cached popular artists** | Instant results for J Dilla, Questlove, etc. — requires usage data |
| **Audio-to-style** | Reference audio file to extract groove — requires Python (librosa/essentia) |
| **Community recipe sharing** | Feature creep — keep v1 focused on core value |
| **Real-time preview** | Play transformed groove before committing — complex UX |

---

## User Experience Principles

### Visual Personality

**Aesthetic:** Modern, minimal, professional — fits Ableton's dark UI aesthetic  
**Vibe:** Tool for serious producers, not toy-like or gimmicky  
**Inspiration:** Native Instruments, Arturia, Ableton's own devices, classic hardware synths/samplers

### UI Components (MVP)

| Component | Description | M4L Implementation |
|-----------|-------------|-------------------|
| **Artist Input** | Text field for artist/producer name | `live.text` (mode=1) |
| **LLM Model Selector** | Dropdown to select LLM provider (Ollama, Claude, GPT, Groq) | `live.menu` |
| **Number of Bars** | Dropdown for output clip length (1, 2, 4, 8, 16 bars) | `live.menu` |
| **Variations Selector** | Number of clips to generate (1-6) | `live.dial` or `live.menu` |
| **Intensity Slider** | Effect strength 0-200% (>100% = exaggeration mode) | `live.dial` or `live.slider` |
| **Apply Button** | Primary action to trigger groove research + transformation | `live.text` (button mode) |
| **Settings Button** | Access configuration/onboarding panel | `live.text` (button mode) |
| **Display Screen** | Central feedback area (greetings, errors, animations, citations) | `jsui` (custom JavaScript graphics) |

### The Display Screen — Signature UI Element

The display screen is the communication hub of GrooveAgent, inspired by classic hardware:

| Inspiration | Features to Borrow |
|-------------|-------------------|
| **Game Boy** | Monochrome/limited color palette, pixel aesthetic |
| **Synth LCD** | Status text, parameter readouts |
| **MPC/Sampler** | Grid layouts, progress bars |
| **VFD Displays** | Glowing text, high contrast |

**Screen States:**

| State | Display Content |
|-------|----------------|
| **Idle** | Greeting message ("Ready to groove!") + last artist used |
| **Researching** | Animated "searching" indicator + status text |
| **Generating** | Recipe parameters appearing + progress |
| **Complete** | Source citations (scrollable/paginated), confidence score |
| **Error** | Educational error message + suggested fix |
| **Low Confidence** | Warning about < 4 sources + proceed/cancel option |

### Key Interactions

1. **Artist Input** — Text field with clear placeholder ("Enter artist name, e.g., J Dilla")
2. **LLM Model Selector** — Dropdown showing configured providers; warns if none configured
3. **Number of Bars** — Dropdown with discrete values (1, 2, 4, 8, 16 bars)
4. **Variations Selector** — Dial or dropdown for clip count (1-6 variations)
5. **Intensity Control** — Dial or slider with 0%, 100%, 200% markers; default at 100%
6. **Apply Button** — Large, obvious primary action; disabled during processing
7. **Display Screen** — Animated feedback, status text, source citations, errors
8. **Settings Button** — Access LLM configuration, API keys, first-run onboarding
9. **First-Run Onboarding** — Interactive popup explaining Ollama install vs. API key entry

### UX Constraints

- Must fit within standard M4L device width (bpatcher)
- Cannot block Ableton's main UI during processing
- Must handle edge cases gracefully (empty clip, no slots available)
- Display screen must be readable in both light and dark Ableton themes

---

## UI Implementation Notes (M4L)

### Recommended Max Objects

| UI Element | Max Object | Rationale |
|------------|------------|-----------|
| Dropdowns | `live.menu` | Native Ableton look, theme-compatible, MIDI mappable |
| Dials/Sliders | `live.dial` / `live.slider` | Automatable, familiar to Ableton users |
| Buttons | `live.text` | Supports text labels, click states |
| Text Input | `live.text` (mode=1) | Text entry capability |
| Display Screen | `jsui` | Custom JavaScript graphics, full animation control |
| Backgrounds | `panel` or `fpic` | Visual organization, custom images |

### jsui Display Screen Capabilities

The `jsui` object uses JavaScript with `mgraphics` for vector drawing:

- **Custom fonts and colors** — Retro aesthetic possible
- **Frame-based animation** — Progress indicators, search animations
- **Text rendering** — Status messages, citations, errors
- **Mouse interaction** — Clickable areas for pagination/scrolling
- **Theme adaptation** — Can query Ableton's theme colors

### Theme Compatibility

All `live.*` objects automatically adapt to Ableton's themes. For `jsui`:
- Query theme colors via Max's `live.colors` object
- Use dynamic colors, not hardcoded values
- Test in both light and dark themes

---

## Functional Requirements

Functional requirements define WHAT capabilities the product must have. They are the complete inventory of user-facing and system capabilities that deliver the product vision.

### Core Groove Transformation

- **FR1:** User can enter any artist or producer name to specify desired groove style
- **FR2:** User can adjust groove intensity from 0% (no effect) to 200% (exaggerated)
- **FR3:** User can select how many variation clips to generate (N clips)
- **FR4:** System researches artist groove characteristics using configured LLM provider
- **FR5:** System generates a Groove Recipe containing timing, velocity, and articulation parameters
- **FR6:** System applies Groove Recipe to selected MIDI clip(s) using local JavaScript math
- **FR7:** System duplicates original clip N times before applying variations
- **FR8:** Each variation receives slightly different parameter randomization within the Groove Recipe bounds
- **FR9:** User can see progress status during LLM research phase (visual feedback)
- **FR10:** System displays sources used for groove research (minimum 4 citations)

### LLM Provider Configuration

- **FR11:** User can configure Ollama as the LLM provider (free, local option)
- **FR11a:** System attempts to auto-start Ollama if not running (spawn 'ollama serve')
- **FR11b:** System waits up to 3 seconds for Ollama to start before showing error
- **FR12:** User can configure Claude API as an LLM provider with their API key
- **FR13:** User can configure OpenAI API as an LLM provider with their API key
- **FR14:** User can configure Groq API as an LLM provider with their API key
- **FR15:** System stores LLM provider configuration persistently between sessions
- **FR16:** System validates API keys on entry and reports clear success/failure status

### First-Run Onboarding

- **FR17:** System detects first-time use and displays onboarding popup
- **FR18:** Onboarding explains Ollama option (free, local) with install guidance
- **FR19:** Onboarding explains commercial API option with key entry fields
- **FR20:** User can skip onboarding and configure later via settings
- **FR21:** User can re-access onboarding/settings at any time from the UI

### Clip Interaction (via LiveAPI)

- **FR22:** System reads MIDI note data from selected Ableton Live clip
- **FR23:** System writes transformed MIDI note data to new clip slots
- **FR24:** System respects original clip's time signature and tempo context
- **FR25:** System enforces 8-16 bar maximum clip length limit
- **FR26:** System warns user if clip exceeds length limit before processing

### Groove Recipe Parameters

- **FR27:** Groove Recipe includes swing_ratio (0.5 = straight, up to 0.75)
- **FR28:** Groove Recipe includes per-beat timing offsets (push/pull in milliseconds)
- **FR29:** Groove Recipe includes micro-timing variance range
- **FR30:** Groove Recipe includes velocity curve type (linear, exponential, logarithmic)
- **FR31:** Groove Recipe includes ghost note threshold (velocity below which = ghost)
- **FR32:** Groove Recipe includes accent boost multiplier
- **FR33:** Groove Recipe includes note length factor (articulation tightness)
- **FR34:** Intensity slider scales all Groove Recipe parameters proportionally

### Error Handling & Edge Cases

- **FR35:** System displays clear error when no LLM provider is configured
- **FR36:** System displays clear error when Ollama is selected but not running
- **FR37:** System displays clear error when API key is invalid or rate-limited
- **FR38:** System warns when artist has low source confidence (< 4 sources found)
- **FR39:** User can proceed with low-confidence artists after acknowledging warning
- **FR40:** System displays clear error when selected clip is empty
- **FR41:** System displays clear error when no empty clip slots available for output
- **FR42:** System recovers gracefully from LLM timeout without crashing

### Settings & Persistence

- **FR43:** User can access settings panel from main UI
- **FR44:** User can change LLM provider without reinstalling plugin
- **FR45:** System remembers last-used intensity value between sessions
- **FR46:** System remembers last-used variations count between sessions
- **FR47:** System remembers last-used LLM model selection between sessions
- **FR48:** System remembers last-used number of bars selection between sessions

### UI Components

- **FR49:** User can select LLM provider from dropdown menu (Ollama, Claude, OpenAI, Groq)
- **FR50:** User can select number of bars for output clips (1, 2, 4, 8, 16) via dropdown
- **FR51:** User can select number of variations to generate (1-6) via dial or dropdown
- **FR52:** Display screen shows greeting message when idle ("Ready to groove!")
- **FR53:** Display screen shows animated feedback during LLM research phase
- **FR54:** Display screen shows source citations after successful groove generation
- **FR55:** Display screen shows educational error messages with suggested fixes
- **FR56:** Display screen supports pagination/scrolling for long citation lists
- **FR57:** Display screen shows confidence score for artist groove data
- **FR58:** Display screen adapts to Ableton Live's light/dark theme

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **LLM Response Time** | < 30 seconds | User expectation set by brief; animated feedback during wait |
| **MIDI Transformation** | < 500ms for 16 bars | Local JS math should be near-instant |
| **UI Responsiveness** | No blocking during LLM call | Async operation; user can interact with Ableton |
| **Memory Footprint** | < 100MB | node.script should not bloat Ableton's memory |

### Security

| Requirement | Rationale |
|-------------|-----------|
| **API keys stored locally only** | Never transmitted except to respective API endpoints |
| **MIDI data never leaves device** | Privacy-first architecture; only text queries sent to LLM |
| **No telemetry or tracking** | Solo dev product; keep it simple and trustworthy |

### Compatibility

| Requirement | Target |
|-------------|--------|
| **Ableton Live** | 12+ (Max 8.6+ required for Node.js 20) |
| **Operating Systems** | macOS 10.15+, Windows 10+ |
| **Max for Live** | Bundled with Suite or M4L add-on |
| **Ollama** | Current stable release (optional for free operation) |

### Reliability

| Requirement | Target |
|-------------|-----------|
| **Crash-free operation** | No crashes during normal use |
| **Data integrity** | Original clip never modified; only copies transformed |
| **Graceful degradation** | Clear errors, no silent failures |

---

## Appendix: Groove Recipe Schema

```typescript
interface GrooveRecipe {
  artist: string;
  sources: string[];        // Minimum 4 URLs/citations
  confidence: number;       // 0-1 (low if < 4 sources)
  timing: {
    swing_ratio: number;           // 0.5-0.75 (0.5 = straight)
    push_pull_ms: number[];        // Per-beat timing offsets
    micro_timing_variance: number; // Random variance in ms
  };
  velocity: {
    curve: 'linear' | 'exponential' | 'logarithmic';
    ghost_threshold: number;  // 0-127; below = ghost note
    accent_boost: number;     // Multiplier for accented hits
  };
  articulation: {
    note_length_factor: number;    // 0.5-1.5
    overlap_tolerance_ms: number;  // Allowed note overlap
  };
}
```

## Appendix: LOM Note Structure

```typescript
interface LiveNote {
  pitch: number;       // 0-127 (MIDI note number)
  start_time: number;  // In beats
  duration: number;    // In beats
  velocity: number;    // 0-127
  mute: boolean;
}
```

---

## Summary

GrooveAgent v1.0 captures **58 functional requirements** across 8 capability areas and **4 non-functional requirement categories**. The PRD prioritizes:

1. **Simplicity** — Single artist input, one-click apply, clear feedback
2. **Flexibility** — Free (Ollama) or commercial LLM options
3. **Transparency** — Source citations, confidence indicators
4. **Privacy** — All MIDI processing local; only text queries to LLM
5. **User Control** — Intensity slider, variations count, proceed-with-warning for edge cases

---

_This PRD captures the essential requirements for GrooveAgent v1.0._

_Created through collaborative discovery between Fab and AI facilitator._

_Next: UX Design workflow to define interface mockups, then Architecture workflow for technical design._

