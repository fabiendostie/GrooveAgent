# GrooveAgent - Epic Breakdown

**Author:** Fab  
**Date:** 2025-11-26  
**Project Level:** MVP  
**Target Scale:** 1,000+ downloads in 3 months

---

## Overview

This document provides the complete epic and story breakdown for GrooveAgent, decomposing the requirements from the [PRD](./prd.md) into implementable stories.

**Development Methodology:** [TELIS (Token-Efficient Language Intelligence System)](./Token-Efficient_Language_Intelligence_System_TELIS.md)

All development follows TELIS principles for <2% code error rate:
- **Knowledge Shards** in `docs/context/` provide precise API references
- **Progressive Context Negotiation** - request specific info, don't guess
- **Anti-Hallucination Protocol** - verify all Max/MSP objects, LiveAPI signatures, MIDI structures

**Epic Summary:**

| Epic | Title | User Value | Stories |
|------|-------|------------|---------|
| 1 | Foundation & TELIS Setup | Enables all development with <2% error rate | 5 |
| 2 | Core Groove Magic | 🎯 THE MAGIC MOMENT — Enter artist, hear transformed groove | 8 |
| 3 | Multi-Provider LLM Support | Choose preferred LLM (Claude, OpenAI, Groq) | 4 |
| 4 | Settings & Persistence | Preferences remembered between sessions | 3 |
| 5 | First-Run Onboarding | New users get guided setup | 3 |
| 6 | Display Screen Polish | Captivating psychedelic piano roll animation | 4 |

**Total Stories:** 27

---

## Functional Requirements Inventory

| FR | Description | Category |
|----|-------------|----------|
| FR1 | User can enter any artist or producer name | Core |
| FR2 | User can adjust groove intensity 0-200% | Core |
| FR3 | User can select variation count (1-6) | Core |
| FR4 | System researches artist via LLM | Core |
| FR5 | System generates Groove Recipe | Core |
| FR6 | System applies Groove Recipe locally | Core |
| FR7 | System duplicates clip N times | Core |
| FR8 | Each variation gets randomized parameters | Core |
| FR9 | User sees progress during research | Core |
| FR10 | System displays 4+ source citations | Core |
| FR11 | User can configure Ollama | LLM Config |
| FR11a | System auto-starts Ollama if needed | LLM Config |
| FR11b | System waits 3s for Ollama startup | LLM Config |
| FR12 | User can configure Claude API | LLM Config |
| FR13 | User can configure OpenAI API | LLM Config |
| FR14 | User can configure Groq API | LLM Config |
| FR15 | System stores LLM config persistently | LLM Config |
| FR16 | System validates API keys | LLM Config |
| FR17 | System detects first-time use | Onboarding |
| FR18 | Onboarding explains Ollama option | Onboarding |
| FR19 | Onboarding explains commercial APIs | Onboarding |
| FR20 | User can skip onboarding | Onboarding |
| FR21 | User can re-access settings anytime | Onboarding |
| FR22 | System reads MIDI from clip | Clip Ops |
| FR23 | System writes MIDI to new slots | Clip Ops |
| FR24 | System respects time signature/tempo | Clip Ops |
| FR25 | System enforces 8-16 bar limit | Clip Ops |
| FR26 | System warns on clip length exceeded | Clip Ops |
| FR27 | Groove Recipe: swing_ratio | Recipe |
| FR28 | Groove Recipe: push/pull offsets | Recipe |
| FR29 | Groove Recipe: micro-timing variance | Recipe |
| FR30 | Groove Recipe: velocity curve | Recipe |
| FR31 | Groove Recipe: ghost threshold | Recipe |
| FR32 | Groove Recipe: accent boost | Recipe |
| FR33 | Groove Recipe: note length factor | Recipe |
| FR34 | Intensity scales all parameters | Recipe |
| FR35 | Error: no LLM configured | Errors |
| FR36 | Error: Ollama not running | Errors |
| FR37 | Error: invalid API key | Errors |
| FR38 | Warning: low confidence (<4 sources) | Errors |
| FR39 | User can proceed with low confidence | Errors |
| FR40 | Error: empty clip | Errors |
| FR41 | Error: no empty slots | Errors |
| FR42 | Graceful LLM timeout recovery | Errors |
| FR43 | User accesses settings panel | Settings |
| FR44 | User changes LLM provider | Settings |
| FR45 | System remembers intensity | Settings |
| FR46 | System remembers variations count | Settings |
| FR47 | System remembers LLM selection | Settings |
| FR48 | System remembers bar count | Settings |
| FR49 | LLM provider dropdown | UI |
| FR50 | Bar count dropdown | UI |
| FR51 | Variations dial/dropdown | UI |
| FR52 | Display: idle greeting | UI |
| FR53 | Display: animated research feedback | UI |
| FR54 | Display: source citations | UI |
| FR55 | Display: educational errors | UI |
| FR56 | Display: citation pagination | UI |
| FR57 | Display: confidence score | UI |
| FR58 | Display: theme adaptation | UI |

---

## FR Coverage Map

| Epic | FRs Covered |
|------|-------------|
| Epic 1: Foundation | Infrastructure for all FRs |
| Epic 2: Core Groove Magic | FR1-10, FR11/11a/11b, FR22-26, FR27-34, FR40-42, FR49-52 |
| Epic 3: Multi-Provider LLM | FR12-16, FR35-37, FR49 |
| Epic 4: Settings & Persistence | FR43-48 |
| Epic 5: First-Run Onboarding | FR17-21 |
| Epic 6: Display Screen Polish | FR53-58 |

---

## Epic 1: Foundation & TELIS Setup

**Goal:** Establish project infrastructure with TELIS methodology for <2% code error rate during development.

**User Value:** Enables all future development with verified API accuracy and zero hallucination.

### Story 1.1: Project Structure & Dependencies

As a **developer**,  
I want **the project structure created per architecture spec**,  
So that **all code has a consistent home and dependencies are available**.

**Acceptance Criteria:**

**Given** an empty project directory  
**When** I run the setup commands  
**Then** the following structure exists:
```
src/
├── node/
│   ├── index.js
│   ├── llm/
│   ├── midi/
│   ├── clip/
│   └── utils/
└── max/
    ├── GrooveAgent.amxd
    └── display.js
```

**And** `package.json` exists with `max-api` dependency  
**And** `.cursorrules` reflects GrooveAgent-specific rules  
**And** `CLAUDE.md` provides AI context overview

**Prerequisites:** None (first story)

**Technical Notes:**
- Follow architecture.md project structure exactly
- Use `npm init -y` then add max-api
- Create placeholder files for all modules
- Reference: Architecture section "Project Structure"

---

### Story 1.2: TELIS Knowledge Shards

As a **developer using Claude Code CLI**,  
I want **knowledge shards populated with verified API signatures**,  
So that **LLM code generation achieves <2% error rate**.

**Acceptance Criteria:**

**Given** the `docs/context/` directory exists  
**When** I request API information during development  
**Then** the following shards contain accurate, verified content:

| Shard | Content |
|-------|---------|
| `m4l-shards.md` | Max for Live objects, live.* UI components, node.script patterns |
| `liveapi-shards.md` | LiveAPI methods, LOM paths, note structure, clip operations |
| `llm-shards.md` | Ollama API, Claude API, OpenAI API, Groq API signatures |
| `midi-math.md` | Swing calculation, velocity curves, timing offset formulas |

**And** each shard follows TELIS tier_2_micro format (~500 tokens max)  
**And** shards include "Gotchas" sections for common pitfalls  
**And** symbolic compression references are defined (e.g., `@m4l.api.clip`)

**Prerequisites:** Story 1.1

**Technical Notes:**
- Verify ALL signatures against official documentation
- Include version numbers (Max 8.6+, Node 20, etc.)
- Mark any M4L-specific globals (`max`, `outlet`, `post`, `LiveAPI`)
- Reference: TELIS.md sections 3.2, 7.1

---

### Story 1.3: Max ↔ Node Message Bridge

As a **developer**,  
I want **bidirectional JSON messaging between Max and Node.js**,  
So that **UI events trigger Node operations and Node results update UI**.

**Acceptance Criteria:**

**Given** `node.script` is configured in Max patch  
**When** Max sends a JSON message to node.script  
**Then** Node.js receives and parses the message correctly

**And** when Node.js calls `maxApi.outlet()` with JSON  
**Then** Max receives the message via the node.script outlet

**Given** the message protocol from architecture.md  
**When** any command is sent  
**Then** it follows this format:
```javascript
// Request
{ "cmd": "command-name", "id": "req-xxxxx", "params": {...} }
// Response
{ "id": "req-xxxxx", "success": true|false, "data": {...} | "error": {...} }
```

**Prerequisites:** Story 1.1

**Technical Notes:**
- Use `max-api` npm package
- Implement `maxApi.addHandler()` for incoming messages
- Generate unique request IDs for response matching
- Log all messages for debugging (`[GrooveAgent]` prefix)
- Reference: Architecture section "Pattern 2: Max ↔ Node Message Protocol"

---

### Story 1.4: Basic Max for Live Device Shell

As a **developer**,  
I want **a minimal M4L device with node.script connected**,  
So that **I can test the message bridge in Ableton Live**.

**Acceptance Criteria:**

**Given** Ableton Live 12+ with Max for Live  
**When** I open `src/max/GrooveAgent.amxd`  
**Then** the device loads without errors

**And** node.script starts automatically (`@autostart 1`)  
**And** I see "GrooveAgent ready" in Max console  
**And** a test button sends `{"cmd": "ping"}` and receives `{"success": true}`

**Prerequisites:** Story 1.3

**Technical Notes:**
- Create minimal bpatcher with node.script
- Add single `live.text` button for ping test
- Add `route` object to parse node.script output
- Save as `.amxd` (Max for Live MIDI Effect)
- Reference: Architecture section "M4L Device Setup"

---

### Story 1.5: Error Handling & Logging Foundation

As a **developer**,  
I want **standardized error handling and logging**,  
So that **debugging is efficient and errors are user-friendly**.

**Acceptance Criteria:**

**Given** any operation in Node.js  
**When** an error occurs  
**Then** it follows this pattern:
```javascript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  log('ERROR', context, error.message);
  return { success: false, error: { code, message, suggestion } };
}
```

**And** logs use format `[GrooveAgent] [LEVEL] context: message`  
**And** logs are visible in both Node console and Max console  
**And** error codes follow architecture naming (e.g., `LLM_TIMEOUT`, `CLIP_EMPTY`)

**Prerequisites:** Story 1.3

**Technical Notes:**
- Create `src/node/utils/logger.js`
- Use `maxApi.post()` to send logs to Max console
- Implement error categorization function
- Include suggestion text for each error code
- Reference: Architecture section "Error Handling"

---

## Epic 2: Core Groove Magic

**Goal:** Deliver the complete "Apply Groove" flow — the magic moment where a user enters an artist name and hears their MIDI transformed.

**User Value:** 🎯 THE MAGIC MOMENT — User enters "J Dilla", clicks Apply, hears their stiff drums suddenly breathe with that unmistakable pocket.

### Story 2.1: Artist Input & UI Controls

As a **music producer**,  
I want **to enter an artist name and adjust groove parameters**,  
So that **I can specify whose rhythmic DNA to apply**.

**Acceptance Criteria:**

**Given** the GrooveAgent device is loaded  
**When** I look at the UI  
**Then** I see:
- Artist text input (`live.text` mode=1) with placeholder "Enter artist name..."
- LLM Model dropdown (`live.menu`) with options: Ollama, Claude, OpenAI, Groq
- Number of Bars dropdown (`live.menu`) with options: 1, 2, 4, 8, 16
- Variations selector (`live.dial`) range 1-6, default 4
- Intensity dial (`live.dial`) range 0-200%, default 100%
- Apply Groove button (`live.text` button mode)
- Settings button (`live.text` button mode)

**And** all controls are theme-adaptive (work in light/dark Ableton themes)  
**And** all `live.*` controls are MIDI-mappable and automatable

**Prerequisites:** Story 1.4

**Technical Notes:**
- Use only `live.*` objects for theme compatibility
- Connect all UI to node.script via message formatting
- Apply button sends full parameter bundle as JSON
- Reference: PRD section "UI Components", UX Design section 8

---

### Story 2.2: Basic Display Screen (jsui)

As a **music producer**,  
I want **a display screen showing status and feedback**,  
So that **I know what GrooveAgent is doing**.

**Acceptance Criteria:**

**Given** the device is idle  
**When** I look at the display screen  
**Then** I see "Ready to groove!" message on OLED-style black background

**And** the display uses:
- Background: #000000 (deep black)
- Primary text: #FFFFFF (white)
- Accent color: #00D4FF (cyan)
- Font: System sans-serif, 12-14px

**Given** an error occurs  
**When** the error message is displayed  
**Then** the accent color changes to #FF4757 (coral red)  
**And** the message includes a suggested fix

**Prerequisites:** Story 2.1

**Technical Notes:**
- Create `src/max/display.js` for jsui
- Use mgraphics for vector drawing
- Implement state machine: idle → researching → complete → error
- Query theme colors via `live.colors` for adaptation
- Reference: UX Design section 3, Architecture "jsui Display Screen"

---

### Story 2.3: Ollama Provider Integration

As a **music producer with Ollama installed**,  
I want **GrooveAgent to use my local Ollama for FREE groove research**,  
So that **I pay nothing and my data stays private**.

**Acceptance Criteria:**

**Given** Ollama is installed and running  
**When** I select "Ollama" as LLM provider and click Apply Groove  
**Then** GrooveAgent sends a research prompt to localhost:11434

**Given** Ollama is installed but NOT running  
**When** I click Apply Groove  
**Then** GrooveAgent attempts to spawn `ollama serve`  
**And** waits up to 3 seconds for startup  
**And** retries the request if successful

**Given** Ollama fails to start  
**When** the timeout expires  
**Then** display shows "Ollama not running. Start Ollama or use API key."

**Prerequisites:** Story 1.3, Story 2.2

**Technical Notes:**
- Create `src/node/llm/ollama.js`
- Use native `fetch()` for HTTP calls (Node 20+)
- Implement auto-start via `child_process.spawn('ollama', ['serve'])`
- Default model: `llama3.2` (configurable)
- Reference: Architecture "LLM Provider Abstraction", `@llm-shards.md`

---

### Story 2.4: Groove Recipe Generation

As a **music producer**,  
I want **the LLM to research an artist's groove style and return structured parameters**,  
So that **the transformation is based on real documented techniques**.

**Acceptance Criteria:**

**Given** a valid artist name (e.g., "J Dilla")  
**When** the LLM completes research  
**Then** it returns a Groove Recipe with:
```javascript
{
  artist: "J Dilla",
  sources: ["url1", "url2", "url3", "url4"], // minimum 4
  confidence: 0.85, // 0-1
  timing: {
    swingRatio: 0.62,      // 0.5-0.75
    pushPullMs: [-12, 5, -8, 3],
    microTimingVariance: 8
  },
  velocity: {
    curve: "exponential",
    ghostThreshold: 45,
    accentBoost: 1.3
  },
  articulation: {
    noteLengthFactor: 0.85,
    overlapToleranceMs: 10
  }
}
```

**And** all values are clamped to valid ranges  
**And** confidence < 0.6 triggers low-confidence warning (FR38)

**Prerequisites:** Story 2.3

**Technical Notes:**
- Create `src/node/midi/groove-recipe.js`
- LLM prompt template in architecture section "LLM Prompt Template"
- Parse JSON response, validate all fields present
- Clamp values to safe ranges before use
- Reference: Architecture "Pattern 1: Groove Recipe", `@midi-math.md`

---

### Story 2.5: LiveAPI Clip Operations

As a **music producer**,  
I want **GrooveAgent to read my selected MIDI clip and write to new slots**,  
So that **transformations happen on copies, preserving my original**.

**Acceptance Criteria:**

**Given** a MIDI clip is selected in Ableton  
**When** I click Apply Groove  
**Then** GrooveAgent reads all notes from the clip via LiveAPI

**And** each note has structure:
```javascript
{ pitch: 36, startTime: 0.0, duration: 0.25, velocity: 100, mute: false }
```

**Given** I request 4 variations  
**When** transformation completes  
**Then** 4 new clips are created in the next available slots  
**And** original clip is never modified

**Given** clip exceeds 16 bars  
**When** I click Apply Groove  
**Then** display shows "Clip too long (max 16 bars). Shorten clip."

**Prerequisites:** Story 1.3, Story 2.2

**Technical Notes:**
- Create `src/node/clip/operations.js`
- Use `LiveAPI` via max-api for clip access
- LOM path: `live_set tracks N clip_slots M clip`
- Methods: `get_notes_extended`, `set_notes_extended`
- Reference: `@liveapi-shards.md`, Architecture "Pattern 4: LiveAPI Clip Operations"

---

### Story 2.6: MIDI Transformation Engine

As a **music producer**,  
I want **the Groove Recipe applied to my MIDI notes**,  
So that **my stiff drums get that human feel**.

**Acceptance Criteria:**

**Given** a Groove Recipe with swingRatio: 0.62  
**When** applied to straight 16th notes  
**Then** odd-numbered 16ths are delayed proportionally (triplet-ish feel)

**Given** a Groove Recipe with pushPullMs: [-12, 5, -8, 3]  
**When** applied to notes  
**Then** each beat's notes shift by the corresponding ms offset

**Given** a Groove Recipe with velocity curve "exponential" and ghostThreshold 45  
**When** applied to notes  
**Then** notes below threshold become ghost notes (quieter)  
**And** accented notes boost by accentBoost multiplier

**Given** intensity at 150%  
**When** transformation runs  
**Then** all Recipe parameters scale by 1.5x  
**And** values remain clamped to valid ranges

**Prerequisites:** Story 2.4, Story 2.5

**Technical Notes:**
- Create `src/node/midi/transformer.js`
- Create `src/node/midi/timing.js` - swing, push/pull, micro-timing
- Create `src/node/midi/velocity.js` - curves, ghosts, accents
- Create `src/node/midi/articulation.js` - note length
- All functions are pure (input → output, no side effects)
- Reference: `@midi-math.md`, PRD "Groove Recipe Parameters"

---

### Story 2.7: Variation Generation

As a **music producer**,  
I want **multiple variations of the transformed groove**,  
So that **I can pick my favorite or layer them**.

**Acceptance Criteria:**

**Given** I set Variations to 4  
**When** transformation completes  
**Then** 4 clips are created, each with slightly different timing

**And** variation differences are within bounds:
- Micro-timing: ±50% of microTimingVariance
- Velocity: ±5 from base
- All variations sound "the same style" but not identical

**Given** no empty clip slots available  
**When** I click Apply Groove  
**Then** display shows "No empty slots. Clear a clip slot for output."

**Prerequisites:** Story 2.5, Story 2.6

**Technical Notes:**
- Randomize within Groove Recipe bounds using seeded random
- Each variation gets unique seed based on clip + artist + index
- Check for empty slots before processing
- Reference: FR7, FR8, FR41

---

### Story 2.8: Apply Groove Complete Flow

As a **music producer**,  
I want **the entire Apply Groove flow to work end-to-end**,  
So that **I can transform my drums in one click**.

**Acceptance Criteria:**

**Given** all previous stories complete  
**When** I enter "J Dilla", set 4 variations, 100% intensity, click Apply  
**Then** the following sequence occurs:

1. Display shows "Researching J Dilla's groove style..."
2. LLM query executes (15-30 seconds)
3. Display shows "Generating groove recipe..."
4. Recipe is created and validated
5. Display shows "Applying to 4 variations..."
6. MIDI transformation runs
7. 4 new clips appear in Ableton
8. Display shows "✓ 4 variations created" with source citations

**And** total time is under 35 seconds  
**And** I can hear the difference when I play the new clips

**Prerequisites:** Stories 2.1-2.7

**Technical Notes:**
- Wire all components together in `src/node/index.js`
- Implement progress state machine with % complete
- Handle all error cases with educational messages
- This is THE magic moment — test extensively!
- Reference: UX Design "User Journeys", Architecture "UI State Machine"

---

## Epic 3: Multi-Provider LLM Support

**Goal:** Enable users to choose their preferred LLM provider beyond Ollama.

**User Value:** Users without Ollama can still use GrooveAgent with Claude, OpenAI, or Groq.

### Story 3.1: LLM Provider Abstraction Layer

As a **developer**,  
I want **a unified interface for all LLM providers**,  
So that **adding new providers is easy and the core code doesn't change**.

**Acceptance Criteria:**

**Given** the provider abstraction  
**When** any provider is used  
**Then** it implements this interface:
```javascript
class LLMProvider {
  async generateGrooveRecipe(artistName, options) → GrooveRecipe
  async isAvailable() → boolean
  get name() → string
}
```

**And** provider selection logic follows fallback chain: Ollama → Claude → OpenAI → Groq

**Prerequisites:** Story 2.3

**Technical Notes:**
- Create `src/node/llm/index.js` as factory/router
- Each provider in separate file for maintainability
- Lazy-load provider SDKs (don't import all at startup)
- Reference: Architecture "Pattern 3: LLM Provider Abstraction"

---

### Story 3.2: Claude Provider Integration

As a **music producer with Anthropic API key**,  
I want **to use Claude for groove research**,  
So that **I get high-quality results from a commercial LLM**.

**Acceptance Criteria:**

**Given** I have a valid Claude API key  
**When** I select "Claude" and click Apply Groove  
**Then** GrooveAgent queries Claude API and returns a Groove Recipe

**Given** an invalid API key  
**When** I click Apply Groove  
**Then** display shows "Claude API key invalid. Check Settings."

**And** rate limit errors show "Rate limited. Try again in a moment."

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create `src/node/llm/claude.js`
- Use `@anthropic-ai/sdk` npm package
- Model: `claude-3-haiku-20240307` (fast, cheap) or configurable
- Reference: `@llm-shards.md`

---

### Story 3.3: OpenAI Provider Integration

As a **music producer with OpenAI API key**,  
I want **to use GPT for groove research**,  
So that **I can use my existing OpenAI subscription**.

**Acceptance Criteria:**

**Given** I have a valid OpenAI API key  
**When** I select "OpenAI" and click Apply Groove  
**Then** GrooveAgent queries OpenAI API and returns a Groove Recipe

**Given** an invalid API key  
**When** I click Apply Groove  
**Then** display shows "OpenAI API key invalid. Check Settings."

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create `src/node/llm/openai.js`
- Use `openai` npm package
- Model: `gpt-4o-mini` (fast, cheap) or configurable
- Reference: `@llm-shards.md`

---

### Story 3.4: Groq Provider Integration

As a **music producer wanting fast results**,  
I want **to use Groq for ultra-fast groove research**,  
So that **I get results in seconds instead of 20-30s**.

**Acceptance Criteria:**

**Given** I have a valid Groq API key  
**When** I select "Groq" and click Apply Groove  
**Then** GrooveAgent queries Groq API and returns a Groove Recipe  
**And** response time is typically under 5 seconds

**Given** an invalid API key  
**When** I click Apply Groove  
**Then** display shows "Groq API key invalid. Check Settings."

**Prerequisites:** Story 3.1

**Technical Notes:**
- Create `src/node/llm/groq.js`
- Use `groq-sdk` npm package
- Model: `llama-3.2-70b-versatile` or similar
- Reference: `@llm-shards.md`

---

## Epic 4: Settings & Persistence

**Goal:** Remember user preferences between sessions.

**User Value:** Users don't have to reconfigure settings every time they open the project.

### Story 4.1: Settings Storage System

As a **music producer**,  
I want **my settings saved automatically**,  
So that **GrooveAgent remembers my preferences**.

**Acceptance Criteria:**

**Given** I change any setting (intensity, variations, provider, bars)  
**When** I close and reopen the project  
**Then** my settings are restored to last-used values

**And** settings are stored in:
```javascript
{
  provider: "ollama",
  ollamaModel: "llama3.2",
  apiKeys: { claude: "sk-...", openai: "sk-...", groq: "gsk_..." },
  defaults: { intensity: 100, variations: 4, bars: 8 },
  firstRunComplete: true
}
```

**Prerequisites:** Story 2.1

**Technical Notes:**
- Create `src/node/utils/config.js`
- Use Max's `pattr` system for persistence in Live project
- Also save to JSON file as backup in Max preferences folder
- API keys stored locally only, never transmitted except to APIs
- Reference: Architecture "Settings Schema"

---

### Story 4.2: Settings Panel UI

As a **music producer**,  
I want **a settings panel to configure LLM providers and API keys**,  
So that **I can switch providers or update keys easily**.

**Acceptance Criteria:**

**Given** I click the Settings button  
**When** the settings panel appears  
**Then** I see:
- LLM Provider selector (current selection highlighted)
- Ollama Model field (text input, default "llama3.2")
- Claude API Key field (password input, masked)
- OpenAI API Key field (password input, masked)
- Groq API Key field (password input, masked)
- "Test Connection" button for each provider
- "Save & Close" button

**Given** I enter an API key and click "Test Connection"  
**When** the key is valid  
**Then** I see "✓ Connected" next to that provider

**Prerequisites:** Story 4.1

**Technical Notes:**
- Create `src/max/settings-panel.maxpat` as bpatcher
- Use `live.text` with mode=1 for text input
- Mask API key display (show last 4 chars only)
- Settings panel can be modal or slide-in
- Reference: PRD FR43-44, FR21

---

### Story 4.3: Preference Memory

As a **music producer**,  
I want **GrooveAgent to remember my last-used values**,  
So that **I don't reset everything each session**.

**Acceptance Criteria:**

**Given** I set intensity to 150%, variations to 3, bars to 4  
**When** I close the project and reopen  
**Then** those exact values are restored in the UI

**Given** I switch between multiple Ableton projects  
**When** each project loads  
**Then** each project has its own saved settings (via pattr)

**Prerequisites:** Story 4.1, Story 4.2

**Technical Notes:**
- Use `pattr` attributes on each UI control
- `autopattr` object for automatic binding
- Settings save on change (debounced 500ms)
- Reference: FR45-48

---

## Epic 5: First-Run Onboarding

**Goal:** Guide new users through initial setup.

**User Value:** New users aren't confused about Ollama vs API keys — they get clear guidance.

### Story 5.1: First-Run Detection

As a **new user**,  
I want **GrooveAgent to detect my first use**,  
So that **I get guided setup instead of confusion**.

**Acceptance Criteria:**

**Given** GrooveAgent has never been used before  
**When** I load the device for the first time  
**Then** it displays onboarding guidance instead of "Ready to groove!"

**Given** I've completed onboarding previously  
**When** I load the device  
**Then** it shows "Ready to groove!" immediately (no onboarding)

**Prerequisites:** Story 4.1

**Technical Notes:**
- Check `firstRunComplete` flag in settings
- First-run check happens in Node.js on startup
- Send state to display via message protocol
- Reference: FR17

---

### Story 5.2: Onboarding Flow

As a **new user**,  
I want **clear explanation of my LLM options**,  
So that **I can make an informed choice**.

**Acceptance Criteria:**

**Given** first-run is detected  
**When** onboarding displays  
**Then** I see:

**Screen 1: Welcome**
"Welcome to GrooveAgent! Let's set up your AI."

**Screen 2: Choose Your Path**
"OPTION A: Ollama (FREE, Local)
 - Works offline, no API costs
 - Requires Ollama installed
 [Set Up Ollama]

 OPTION B: API Key (Cloud)
 - Works immediately if you have a key
 - Supports Claude, OpenAI, Groq
 [Enter API Key]

 [Skip for Now]"

**Given** I click "Set Up Ollama"  
**Then** I see guidance on installing Ollama with link

**Given** I click "Enter API Key"  
**Then** I see the settings panel focused on API key entry

**Given** I click "Skip for Now"  
**Then** onboarding closes and "Ready to groove!" appears

**Prerequisites:** Story 5.1

**Technical Notes:**
- Onboarding screens in display.js (jsui states)
- Use cyan accent for interactive elements
- Ollama install link: https://ollama.ai
- Reference: FR18-20, UX Design section 5.1

---

### Story 5.3: Re-Access Onboarding

As a **user who skipped onboarding**,  
I want **to access setup guidance later**,  
So that **I can configure when I'm ready**.

**Acceptance Criteria:**

**Given** I click the Settings button  
**When** I'm in the settings panel  
**Then** I see "Need help? [Run Setup Guide]" link

**Given** I click "Run Setup Guide"  
**Then** the onboarding flow starts from Screen 2 (skip welcome)

**Prerequisites:** Story 5.2

**Technical Notes:**
- Add "Run Setup Guide" option in settings panel
- Re-use onboarding flow from Story 5.2
- Reference: FR21

---

## Epic 6: Display Screen Polish

**Goal:** Create the captivating psychedelic piano roll animation that makes waiting enjoyable.

**User Value:** The 20-30 second wait becomes a visual experience that demonstrates the product.

### Story 6.1: Piano Roll Animation

As a **music producer waiting for research**,  
I want **a captivating animation**,  
So that **the wait is entertaining, not frustrating**.

**Acceptance Criteria:**

**Given** research is in progress  
**When** I watch the display  
**Then** I see the psychedelic piano roll animation:

| Element | Behavior |
|---------|----------|
| Playhead | Cyan line sweeps left→right every 4 seconds with glow |
| Grid | Subtle background grid lines |
| Notes | Appear at random positions, gradient cyan→teal |
| Humanized Timing | Notes are off-grid (swing + micro-timing) |
| Ghost Notes | 30% chance, dimmer and smaller |
| Waves | Two translucent color waves sweep opposite directions |
| Particles | Small glowing dots rise from bottom |

**And** the animation runs at 30+ fps  
**And** animation demonstrates what GrooveAgent does (humanized notes)

**Prerequisites:** Story 2.2

**Technical Notes:**
- Implement in `src/max/display.js` using mgraphics
- Use `mgraphics.redraw()` with `metro` or `qmetro` for animation
- Pre-calculate note positions for performance
- Reference: UX Design section 4.2 "Animation Specification"

---

### Story 6.2: Progress Bar & Status

As a **music producer**,  
I want **clear progress indication**,  
So that **I know how much longer to wait**.

**Acceptance Criteria:**

**Given** research is in progress  
**When** I watch the display  
**Then** I see:
- Progress bar (gradient animated cyan→teal→cyan)
- Percentage complete (25%, 50%, 75%, etc.)
- Status text: "Researching [artist]...", "Generating recipe...", "Applying variations..."

**And** progress updates smoothly (not jumpy)  
**And** artist name has subtle cyan text-shadow (pulsing)

**Prerequisites:** Story 6.1

**Technical Notes:**
- Progress messages from Node.js via message protocol
- Smooth progress bar animation even if updates are discrete
- Reference: Architecture "Progress Format"

---

### Story 6.3: Citation Display & Pagination

As a **music producer who values transparency**,  
I want **to see where groove data came from**,  
So that **I trust the results aren't hallucinated**.

**Acceptance Criteria:**

**Given** transformation completes successfully  
**When** I view the display  
**Then** I see:
- "✓ 4 variations created"
- Confidence score (e.g., "85% confidence")
- Source citations (4+ URLs/references)

**Given** there are more than 4 citations  
**When** I interact with the display  
**Then** I can scroll/paginate to see all sources

**And** citations use monospace font at 9-10px  
**And** truncate long URLs with "..."

**Prerequisites:** Story 6.2

**Technical Notes:**
- Implement scroll/pagination in jsui
- Track mouse/touch for interaction
- Store citations array in display state
- Reference: FR54-57

---

### Story 6.4: Theme Adaptation

As a **music producer using Ableton's light theme**,  
I want **the display to remain readable**,  
So that **it works in any Ableton setup**.

**Acceptance Criteria:**

**Given** Ableton is using the light theme  
**When** I view the display  
**Then** the OLED black background remains (it's the signature look)  
**And** text colors remain high-contrast (white/cyan on black)

**Given** Ableton is using the dark theme  
**When** I view the display  
**Then** the appearance is the same (dark theme = natural fit)

**And** all `live.*` controls automatically adapt to theme

**Prerequisites:** Story 6.1

**Technical Notes:**
- Display screen intentionally stays OLED black regardless of theme
- Only `live.*` objects need theme adaptation (automatic)
- Verify contrast ratio meets accessibility standards
- Reference: FR58, UX Design section 8.2

---

## FR Coverage Matrix

| FR | Epic | Story |
|----|------|-------|
| FR1 | Epic 2 | Story 2.1 |
| FR2 | Epic 2 | Story 2.1 |
| FR3 | Epic 2 | Story 2.1 |
| FR4 | Epic 2 | Story 2.3, 2.4 |
| FR5 | Epic 2 | Story 2.4 |
| FR6 | Epic 2 | Story 2.6 |
| FR7 | Epic 2 | Story 2.5, 2.7 |
| FR8 | Epic 2 | Story 2.7 |
| FR9 | Epic 2, 6 | Story 2.2, 6.1, 6.2 |
| FR10 | Epic 2, 6 | Story 2.4, 6.3 |
| FR11 | Epic 2 | Story 2.3 |
| FR11a | Epic 2 | Story 2.3 |
| FR11b | Epic 2 | Story 2.3 |
| FR12 | Epic 3 | Story 3.2 |
| FR13 | Epic 3 | Story 3.3 |
| FR14 | Epic 3 | Story 3.4 |
| FR15 | Epic 4 | Story 4.1 |
| FR16 | Epic 3 | Story 3.2, 3.3, 3.4 |
| FR17 | Epic 5 | Story 5.1 |
| FR18 | Epic 5 | Story 5.2 |
| FR19 | Epic 5 | Story 5.2 |
| FR20 | Epic 5 | Story 5.2 |
| FR21 | Epic 5 | Story 5.3 |
| FR22 | Epic 2 | Story 2.5 |
| FR23 | Epic 2 | Story 2.5 |
| FR24 | Epic 2 | Story 2.5 |
| FR25 | Epic 2 | Story 2.5 |
| FR26 | Epic 2 | Story 2.5 |
| FR27 | Epic 2 | Story 2.4, 2.6 |
| FR28 | Epic 2 | Story 2.4, 2.6 |
| FR29 | Epic 2 | Story 2.4, 2.6 |
| FR30 | Epic 2 | Story 2.4, 2.6 |
| FR31 | Epic 2 | Story 2.4, 2.6 |
| FR32 | Epic 2 | Story 2.4, 2.6 |
| FR33 | Epic 2 | Story 2.4, 2.6 |
| FR34 | Epic 2 | Story 2.6 |
| FR35 | Epic 3 | Story 3.1 |
| FR36 | Epic 2 | Story 2.3 |
| FR37 | Epic 3 | Story 3.2, 3.3, 3.4 |
| FR38 | Epic 2 | Story 2.4 |
| FR39 | Epic 2 | Story 2.4 |
| FR40 | Epic 2 | Story 2.5 |
| FR41 | Epic 2 | Story 2.7 |
| FR42 | Epic 2 | Story 2.8 |
| FR43 | Epic 4 | Story 4.2 |
| FR44 | Epic 4 | Story 4.2 |
| FR45 | Epic 4 | Story 4.3 |
| FR46 | Epic 4 | Story 4.3 |
| FR47 | Epic 4 | Story 4.3 |
| FR48 | Epic 4 | Story 4.3 |
| FR49 | Epic 2 | Story 2.1 |
| FR50 | Epic 2 | Story 2.1 |
| FR51 | Epic 2 | Story 2.1 |
| FR52 | Epic 2 | Story 2.2 |
| FR53 | Epic 6 | Story 6.1, 6.2 |
| FR54 | Epic 6 | Story 6.3 |
| FR55 | Epic 2 | Story 2.2 |
| FR56 | Epic 6 | Story 6.3 |
| FR57 | Epic 6 | Story 6.3 |
| FR58 | Epic 6 | Story 6.4 |

---

## Epic 7: Sub-Agent Agentic Workflows

**Goal:** Enable agentic multi-agent workflows for development, documentation, and recipe research using BMAD + TELIS integration.

**User Value:** Developers can orchestrate specialized AI agents to handle complex tasks (code generation, testing, documentation, recipe research) with built-in quality assurance loops, dramatically accelerating development while maintaining high quality.

**Strategic Importance:** 🚀 **META-EPIC** - This epic provides the agentic workflow system that will be USED to complete the remaining stories in Epics 2-6. Implementing Epic 7 first transforms the development process itself.

### Story 7.1: Workflow Command Dispatcher

As a **developer**,
I want **commands to trigger BMAD workflows**,
So that **I can launch agentic workflows from the GrooveAgent command system**.

**Acceptance Criteria:**

**Given** the workflow dispatcher is implemented
**When** I send `{cmd: 'workflow:research', id: 'req-001', params: {artist_name: 'J Dilla'}}`
**Then** the command is routed to `.bmad/custom/workflows/groove-research/workflow.md`

**And** the following commands are supported:
- `workflow:research` → Groove Recipe research workflow
- `workflow:develop` → Code generation workflow
- `workflow:document` → Documentation/testing workflow
- `swarm:start` → Generic multi-agent orchestration

**Prerequisites:** Story 1.5 (Error Handling & Logging Foundation)

**Technical Notes:**
- Create `src/node/commands/workflow-dispatcher.js`
- Register commands in `src/node/index.js`
- Pass parameters to workflows via context object
- Document in `docs/sprint-artifacts/7-1-workflow-command-dispatcher.md`

---

### Story 7.2: TELIS Shard Auto-Loader

As a **developer**,
I want **TELIS shards automatically loaded based on agent roles**,
So that **agents have the right context without manual intervention**.

**Acceptance Criteria:**

**Given** an agent with role 'llm-research-expert'
**When** the agent is invoked
**Then** `llm-shards.md` and `midi-math.md` are automatically loaded into context

**And** the shard loader provides:
- Token counting for budget management
- Shard rotation (unload previous, load next)
- Symbolic compression support
- Role-to-shard mapping

**Prerequisites:** Story 1.2 (TELIS Knowledge Shards)

**Technical Notes:**
- Create `src/node/utils/telis-loader.js`
- Implement `loadShardsForAgent(agentRole)` function
- Create SHARD_MAP constant with role→shard mapping
- Document in `docs/sprint-artifacts/7-2-telis-shard-auto-loader.md`

---

### Story 7.3: BMAD Agent Definitions

As a **developer**,
I want **BMAD agents created for Sub-Agent roles**,
So that **I can execute specialized tasks with domain expertise**.

**Acceptance Criteria:**

**Given** `.bmad/custom/agents/` directory
**When** agents are created
**Then** the following agents exist:

| Agent File | Type | Role | TELIS Shards |
|------------|------|------|--------------|
| `master-coordinator.md` | Module | Orchestration | None (delegates) |
| `task-orchestrator.md` | Module | Planning | None (delegates) |
| `llm-research-expert.md` | Expert | LLM research | llm-shards.md, midi-math.md |
| `midi-expert.md` | Expert | MIDI transformation | midi-math.md, liveapi-shards.md |
| `code-expert.md` | Expert | Code generation | m4l-shards.md, liveapi-shards.md |
| `verification-agent.md` | Expert | Quality assurance | midi-math.md, m4l-shards.md |
| `validation-agent.md` | Expert | Final review | All shards (selective) |

**And** each Expert agent has a sidecar directory with:
- `sidecar/memories.md` for persistent memory
- `sidecar/knowledge/` for domain-specific knowledge

**Prerequisites:** Story 7.2

**Technical Notes:**
- Follow BMAD agent YAML format from `.bmad/bmb/docs/agents/`
- Use Expert agents for specialists (need memories + knowledge)
- Use Module agents for coordinators (trigger workflows)
- Document in `docs/sprint-artifacts/7-3-bmad-agent-definitions.md`

---

### Story 7.4: Groove Research Workflow
### Story 7.5: Code Generation Workflow
### Story 7.6: Documentation Workflow
### Story 7.7: Sprint Artifact Auto-Update
### Story 7.8: Progress Dashboard

_(Full story details in sprint artifacts as stories are implemented)_

---

## Summary

**✅ Epic Breakdown Complete**

| Metric | Value |
|--------|-------|
| Total Epics | 7 |
| Total Stories | 35 (27 original + 8 Epic 7) |
| FRs Covered | 58/58 (100%) |
| Development Methodology | TELIS (<2% error rate) + Sub-Agent workflows |

**REVISED Epic Sequence:**
1. **Foundation & TELIS Setup** ✅ — Enables development with verified APIs (COMPLETE)
2. **🚀 Sub-Agent Agentic Workflows** ← **IMPLEMENT NEXT** — Provides workflow system for remaining epics
3. **Core Groove Magic** — Complete remaining 2/8 stories USING Epic 7 workflows
4. **Multi-Provider LLM** — Implement USING Epic 7 workflows
5. **Settings & Persistence** — Implement USING Epic 7 workflows
6. **First-Run Onboarding** — Implement USING Epic 7 workflows
7. **Display Screen Polish** — Implement USING Epic 7 workflows

**Context Incorporated:**
- ✅ PRD requirements (58 FRs)
- ✅ UX interaction patterns (psychedelic piano roll)
- ✅ Architecture technical decisions (message protocol, LOM patterns)
- ✅ TELIS methodology (knowledge shards, anti-hallucination)

**Ready for Phase 4: Sprint Planning!**

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_Created through BMAD Method: PM Agent (John) with Fab_

_Date: 2025-11-26_









