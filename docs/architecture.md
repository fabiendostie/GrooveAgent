# GrooveAgent Architecture

## Executive Summary

GrooveAgent is a Max for Live MIDI effect plugin that applies AI-driven "style transfer" to MIDI clips. The architecture is fundamentally a **message-passing system** between two isolated runtimes: Max/MSP (UI and Ableton integration) and Node.js (LLM communication and MIDI math).

**Key Architectural Characteristics:**
- **Privacy-first**: MIDI data never leaves the device; only text queries go to LLM
- **Message-passing**: All communication via JSON through max-api
- **Multi-provider LLM**: Unified abstraction supporting Ollama, Claude, OpenAI, Groq
- **Local processing**: All MIDI transformations happen in JavaScript locally

**Core Architecture Pattern:**
```
┌─────────────────────────────────────────────────────────────┐
│                    Max for Live Device                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Max/MSP UI Layer (bpatcher)                   ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ ││
│  │  │live.text │ │live.menu │ │live.dial │ │   jsui     │ ││
│  │  │(artist)  │ │(provider)│ │(intensity)│ │ (display)  │ ││
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘ ││
│  │       └────────────┴────────────┴─────────────┘         ││
│  │                         │ JSON messages                  ││
│  │                         ▼                                ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │              node.script (Node.js 20)               │││
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │││
│  │  │  │ LLM Provider│  │Groove Recipe│  │ Clip Ops    │ │││
│  │  │  │ Abstraction │  │  Generator  │  │ (LiveAPI)   │ │││
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │││
│  │  │         │                │                │        │││
│  │  │         ▼                ▼                ▼        │││
│  │  │  ┌─────────────────────────────────────────────┐   │││
│  │  │  │           MIDI Math Transformations         │   │││
│  │  │  │  (swing, velocity, timing, articulation)    │   │││
│  │  │  └─────────────────────────────────────────────┘   │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
│                              │                               │
│                              ▼ LiveAPI                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Ableton Live Session                   ││
│  │              (Clips, Notes, Tracks via LOM)              ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │   Ollama    │     │   Claude    │     │   OpenAI    │
   │  (local)    │     │   (cloud)   │     │   (cloud)   │
   └─────────────┘     └─────────────┘     └─────────────┘
```

## Project Initialization

**First implementation story should create the project structure:**

```bash
# Create directory structure
mkdir -p src/node/llm src/node/midi src/node/utils src/max docs

# Initialize Node.js project
cd src/node
npm init -y
npm install max-api

# Create entry point
touch index.js
```

**M4L Device Setup:**
1. Open Max/MSP
2. Create new Max for Live MIDI Effect
3. Save as `src/max/GrooveAgent.amxd`
4. Add `node.script @file ../node/index.js @autostart 1`
5. Connect UI objects to node.script

## Decision Summary

| Category | Decision | Version | Affects FRs | Rationale |
|----------|----------|---------|-------------|-----------|
| **Runtime** | node.script (Node.js) | 20.x | All | Required for HTTP/LLM; bundled with Max 8.6+ |
| **Platform** | Ableton Live + Max for Live | 12+ / 8.6+ | All | Node.js 20 for security (EOL Node 16 in Live 11) |
| **Language** | Pure JavaScript (ES2024) | ES2024 | All | node.script compatibility; no transpilation needed |
| **LLM Primary** | Ollama | Latest | FR4, FR11 | FREE, local, privacy-preserving |
| **LLM Fallback** | Claude, OpenAI, Groq | Current APIs | FR12-14 | Commercial alternatives |
| **npm Package** | max-api | ^1.0.0 | All | Official Cycling '74 Max ↔ Node bridge |
| **Data Persistence** | pattr + JSON file | N/A | FR15, FR43-48 | M4L standard for device settings |
| **UI Graphics** | jsui (mgraphics) | N/A | FR52-58 | Custom display screen with animations |
| **Testing** | Jest | ^29.x | N/A | Standard Node.js testing |

## Project Structure

```
GrooveAgent/
├── src/
│   ├── node/                          # Node.js code (node.script)
│   │   ├── index.js                   # Entry point - command router
│   │   ├── llm/
│   │   │   ├── index.js               # LLM provider abstraction
│   │   │   ├── ollama.js              # Ollama provider
│   │   │   ├── claude.js              # Anthropic Claude provider
│   │   │   ├── openai.js              # OpenAI provider
│   │   │   └── groq.js                # Groq provider
│   │   ├── midi/
│   │   │   ├── groove-recipe.js       # Groove Recipe generation
│   │   │   ├── transformer.js         # MIDI transformation engine
│   │   │   ├── timing.js              # Swing, push/pull, micro-timing
│   │   │   ├── velocity.js            # Velocity curves, ghosts, accents
│   │   │   └── articulation.js        # Note length, overlap
│   │   ├── clip/
│   │   │   └── operations.js          # LiveAPI clip read/write abstraction
│   │   ├── utils/
│   │   │   ├── config.js              # Settings persistence
│   │   │   ├── logger.js              # Logging utilities
│   │   │   └── validators.js          # Input validation
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   └── max/
│       ├── GrooveAgent.amxd           # Main Max for Live device
│       ├── display.js                 # jsui display screen code
│       └── settings-panel.maxpat      # Settings bpatcher (optional)
│
├── docs/
│   ├── architecture.md                # This document
│   ├── prd.md                         # Product Requirements
│   ├── ux-design-specification.md     # UX Design
│   └── ...                            # Other documentation
│
├── tests/
│   ├── llm/                           # LLM provider tests
│   ├── midi/                          # MIDI math tests
│   └── integration/                   # Integration tests
│
├── .cursorrules                       # IDE rules
├── CLAUDE.md                          # AI context document
├── package.json                       # Root package (scripts only)
└── README.md                          # User documentation
```

## FR Category to Architecture Mapping

| FR Category | FRs | Architecture Component | Location |
|-------------|-----|------------------------|----------|
| **Core Groove Transformation** | FR1-FR10 | Groove Recipe Generator, MIDI Transformer | `src/node/midi/` |
| **LLM Provider Configuration** | FR11-FR16 | LLM Abstraction Layer | `src/node/llm/` |
| **First-Run Onboarding** | FR17-FR21 | Max UI + Config Module | `src/max/`, `src/node/utils/config.js` |
| **Clip Interaction (LiveAPI)** | FR22-FR26 | Clip Operations Module | `src/node/clip/operations.js` |
| **Groove Recipe Parameters** | FR27-FR34 | Groove Recipe Schema, Transformer | `src/node/midi/` |
| **Error Handling** | FR35-FR42 | Error Protocol, Logger | `src/node/utils/`, `src/node/index.js` |
| **Settings & Persistence** | FR43-FR48 | Config Module, pattr | `src/node/utils/config.js`, Max patch |
| **UI Components** | FR49-FR58 | Max UI Layer, jsui | `src/max/` |

## Technology Stack Details

### Core Technologies

| Technology | Purpose | Version | Notes |
|------------|---------|---------|-------|
| **Max for Live** | Plugin container, UI, Ableton integration | 8.6+ | Bundled with Live 12+ |
| **node.script** | Node.js runtime in Max | Node.js 20.x | Bundled with Max 8.6 |
| **max-api** | Node.js ↔ Max communication | ^1.0.0 | Official Cycling '74 package |
| **jsui** | Custom display graphics | N/A | Uses mgraphics for vector drawing |
| **LiveAPI** | Ableton clip manipulation | N/A | Access via max-api |

### LLM Providers

| Provider | Package | Use Case | Cost |
|----------|---------|----------|------|
| **Ollama** | `ollama` | Primary - FREE local | Free |
| **Claude** | `@anthropic-ai/sdk` | Quality fallback | Pay per token |
| **OpenAI** | `openai` | Alternative | Pay per token |
| **Groq** | `groq-sdk` | Speed fallback | Pay per token |

### Integration Points

| Integration | Protocol | Data Format | Module |
|-------------|----------|-------------|--------|
| **Max ↔ Node** | max-api messages | JSON | `index.js` |
| **Node ↔ LLM** | HTTP/REST | JSON | `llm/*.js` |
| **Node ↔ Ableton** | LiveAPI via max-api | LOM objects | `clip/operations.js` |
| **Max ↔ jsui** | Max messages | Primitives/lists | `display.js` |

## Novel Pattern Designs

### Pattern 1: Groove Recipe

**Purpose:** Structured representation of an artist's rhythmic characteristics, derived from LLM research.

**Components:**
- `artist`: Source artist name
- `sources`: Array of citations (minimum 4)
- `confidence`: 0-1 score based on source quality
- `timing`: Swing, push/pull, micro-timing parameters
- `velocity`: Curve type, ghost threshold, accent boost
- `articulation`: Note length, overlap tolerance

**Data Structure:**

```javascript
/**
 * @typedef {Object} GrooveRecipe
 * @property {string} artist - Source artist name
 * @property {string[]} sources - Minimum 4 citations/URLs
 * @property {number} confidence - 0-1 (low if < 4 sources)
 * @property {TimingParams} timing
 * @property {VelocityParams} velocity
 * @property {ArticulationParams} articulation
 */

/**
 * @typedef {Object} TimingParams
 * @property {number} swingRatio - 0.5 (straight) to 0.75 (heavy swing)
 * @property {number[]} pushPullMs - Per-beat timing offsets in ms
 * @property {number} microTimingVariance - Random variance in ms
 */

/**
 * @typedef {Object} VelocityParams
 * @property {'linear'|'exponential'|'logarithmic'} curve
 * @property {number} ghostThreshold - 0-127; below = ghost note
 * @property {number} accentBoost - Multiplier for accented hits
 */

/**
 * @typedef {Object} ArticulationParams
 * @property {number} noteLengthFactor - 0.5-1.5
 * @property {number} overlapToleranceMs - Allowed note overlap
 */
```

**Implementation Guide:**
1. LLM receives artist name and returns JSON matching schema
2. Validate all required fields present
3. Clamp values to safe ranges
4. Apply intensity scaling (0-200%) before transformation

### Pattern 2: Max ↔ Node Message Protocol

**Purpose:** Standardized JSON message format for all communication between Max UI and Node.js.

**Request Format:**
```javascript
{
  "cmd": "apply-groove",    // Command identifier
  "id": "req-12345",        // Unique request ID for response matching
  "params": {               // Command-specific parameters
    "artist": "J Dilla",
    "intensity": 100,
    "variations": 4,
    "bars": 8
  }
}
```

**Response Format (Success):**
```javascript
{
  "id": "req-12345",        // Matches request ID
  "success": true,
  "data": {                 // Command-specific response data
    "variationsCreated": 4,
    "sources": ["url1", "url2", "url3", "url4"],
    "confidence": 0.85
  }
}
```

**Response Format (Error):**
```javascript
{
  "id": "req-12345",
  "success": false,
  "error": {
    "code": "LLM_TIMEOUT",
    "message": "Request timed out after 30 seconds",
    "suggestion": "Check your internet connection or try Ollama"
  }
}
```

**Progress Format (for long operations):**
```javascript
{
  "id": "req-12345",
  "type": "progress",
  "state": "researching",   // idle|researching|generating|applying|complete|error
  "message": "Gathering sources for J Dilla...",
  "percent": 25
}
```

**Command Catalog:**

| Command | Params | Response | Description |
|---------|--------|----------|-------------|
| `apply-groove` | artist, intensity, variations, bars | variationsCreated, sources, confidence | Main action |
| `check-ollama` | none | available: boolean | Check if Ollama is running |
| `start-ollama` | none | started: boolean | Attempt to start Ollama |
| `validate-key` | provider, key | valid: boolean | Validate API key |
| `get-config` | none | config object | Get saved settings |
| `set-config` | config object | saved: boolean | Save settings |
| `get-clip-info` | none | notes, length, tempo | Get selected clip info |

### Pattern 3: LLM Provider Abstraction

**Purpose:** Unified interface for multiple LLM providers, enabling seamless switching.

**Interface:**
```javascript
/**
 * @interface LLMProvider
 */
class LLMProvider {
  /**
   * @param {string} prompt - The research prompt
   * @param {Object} options - Provider-specific options
   * @returns {Promise<GrooveRecipe>}
   */
  async generateGrooveRecipe(prompt, options) {}
  
  /**
   * @returns {Promise<boolean>}
   */
  async isAvailable() {}
  
  /**
   * @returns {string}
   */
  get name() {}
}
```

**Provider Selection Logic:**
```javascript
async function getProvider(preferredProvider) {
  const providers = {
    ollama: new OllamaProvider(),
    claude: new ClaudeProvider(),
    openai: new OpenAIProvider(),
    groq: new GroqProvider()
  };
  
  // Try preferred provider first
  if (await providers[preferredProvider]?.isAvailable()) {
    return providers[preferredProvider];
  }
  
  // Fallback chain: Ollama → Claude → OpenAI → Groq
  for (const provider of Object.values(providers)) {
    if (await provider.isAvailable()) {
      return provider;
    }
  }
  
  throw new Error('No LLM provider available');
}
```

### Pattern 4: LiveAPI Clip Operations

**Purpose:** Abstraction layer for reading/writing MIDI clips via LiveAPI.

**Implementation:**
```javascript
const maxApi = require('max-api');

/**
 * Read notes from the currently selected clip
 * @returns {Promise<LiveNote[]>}
 */
async function readClipNotes() {
  return new Promise((resolve, reject) => {
    maxApi.outlet('liveapi', 'get', 'selected_notes');
    // Response handled via maxApi.addHandler
  });
}

/**
 * Write notes to a clip slot
 * @param {number} slotIndex - Target clip slot
 * @param {LiveNote[]} notes - Notes to write
 * @returns {Promise<boolean>}
 */
async function writeClipNotes(slotIndex, notes) {
  // Implementation using LiveAPI
}

/**
 * Duplicate clip to next available slot
 * @returns {Promise<number>} New slot index
 */
async function duplicateClip() {
  // Implementation using LiveAPI
}
```

## Implementation Patterns

### Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| **JS Files** | kebab-case | `groove-recipe.js` |
| **JS Functions** | camelCase | `applySwingTiming()` |
| **JS Classes** | PascalCase | `OllamaProvider` |
| **JS Constants** | SCREAMING_SNAKE | `DEFAULT_SWING_RATIO` |
| **Max Objects** | lowercase with dots | `live.text`, `node.script` |
| **Max Sends** | #camelCase | `#displayState` |
| **Message Commands** | kebab-case | `apply-groove` |
| **Error Codes** | SCREAMING_SNAKE | `LLM_TIMEOUT` |

### Code Organization

| Module Type | Structure | Example |
|-------------|-----------|---------|
| **Provider** | Class with async methods | `class OllamaProvider {}` |
| **Transformer** | Pure functions | `function applySwing(notes, ratio) {}` |
| **Utility** | Named exports | `export { validateConfig, loadConfig }` |
| **Entry Point** | Command router | `maxApi.addHandler('cmd', handleCommand)` |

### Error Handling

**Standard Error Pattern:**
```javascript
try {
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error(`[GrooveAgent] ${context}: ${error.message}`);
  return {
    success: false,
    error: {
      code: categorizeError(error),
      message: error.message,
      suggestion: getSuggestion(error)
    }
  };
}
```

**Error Categories:**
| Code | Meaning | User Action |
|------|---------|-------------|
| `LLM_UNAVAILABLE` | No provider configured | Configure in settings |
| `LLM_TIMEOUT` | Request exceeded 30s | Retry or check connection |
| `LLM_RATE_LIMITED` | API rate limit hit | Wait or switch provider |
| `CLIP_EMPTY` | Selected clip has no notes | Add notes to clip |
| `CLIP_TOO_LONG` | Clip exceeds 16 bars | Shorten clip |
| `NO_EMPTY_SLOTS` | No space for variations | Clear clip slots |
| `LOW_CONFIDENCE` | < 4 sources found | Proceed with warning |
| `INVALID_CONFIG` | Settings corrupted | Reset settings |

### Logging Strategy

```javascript
// Logging format
const LOG_PREFIX = '[GrooveAgent]';

function log(level, context, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `${LOG_PREFIX} [${level}] ${context}: ${message}`;
  
  if (data) {
    console[level.toLowerCase()](logMessage, data);
  } else {
    console[level.toLowerCase()](logMessage);
  }
  
  // Also send to Max console
  maxApi.post(logMessage);
}

// Usage
log('INFO', 'LLM', 'Researching artist', { artist: 'J Dilla' });
log('ERROR', 'Clip', 'Failed to read notes', { error: err.message });
```

## Consistency Rules

### Date/Time Handling

- All timestamps: ISO 8601 format (`2025-11-26T14:30:00.000Z`)
- Musical timing: Beats (float), not milliseconds
- LLM response timing: Milliseconds for durations

### API Response Format

All Node.js → Max responses follow:
```javascript
{
  id: string,           // Request ID
  success: boolean,     // Operation result
  data?: object,        // On success
  error?: {             // On failure
    code: string,
    message: string,
    suggestion?: string
  }
}
```

### UI State Machine

```
┌─────────┐  enter artist  ┌─────────────┐
│  IDLE   │───────────────►│   READY     │
└─────────┘                └──────┬──────┘
     ▲                           │ click Apply
     │                           ▼
     │                    ┌─────────────┐
     │                    │ RESEARCHING │ (20-30s)
     │                    └──────┬──────┘
     │                           │
     │                           ▼
     │                    ┌─────────────┐
     │                    │ GENERATING  │ (1-2s)
     │                    └──────┬──────┘
     │                           │
     │    ┌──────────────────────┼──────────────────────┐
     │    ▼                      ▼                      ▼
┌─────────────┐          ┌─────────────┐         ┌─────────────┐
│  COMPLETE   │          │   ERROR     │         │   WARNING   │
└─────────────┘          └─────────────┘         └─────────────┘
```

## Data Architecture

### Groove Recipe Schema (Full)

```javascript
const GrooveRecipeSchema = {
  artist: 'string',           // Required
  sources: ['string'],        // Min 4 items
  confidence: 'number',       // 0.0 - 1.0
  timing: {
    swingRatio: 'number',     // 0.5 - 0.75
    pushPullMs: ['number'],   // Array of ms offsets
    microTimingVariance: 'number'  // ms
  },
  velocity: {
    curve: 'string',          // linear|exponential|logarithmic
    ghostThreshold: 'number', // 0 - 127
    accentBoost: 'number'     // 1.0 - 2.0
  },
  articulation: {
    noteLengthFactor: 'number',    // 0.5 - 1.5
    overlapToleranceMs: 'number'   // ms
  }
};
```

### LOM Note Structure

```javascript
const LiveNoteSchema = {
  pitch: 'number',      // 0-127
  startTime: 'number',  // Beats
  duration: 'number',   // Beats
  velocity: 'number',   // 0-127
  mute: 'boolean'
};
```

### Settings Schema

```javascript
const SettingsSchema = {
  provider: 'string',          // ollama|claude|openai|groq
  ollamaModel: 'string',       // e.g., 'llama3.2'
  apiKeys: {
    claude: 'string',
    openai: 'string',
    groq: 'string'
  },
  defaults: {
    intensity: 'number',       // 0-200
    variations: 'number',      // 1-6
    bars: 'number'             // 1|2|4|8|16
  },
  firstRunComplete: 'boolean'
};
```

## API Contracts

### LLM Prompt Template

```
You are a music research assistant analyzing the drumming style of {artist}.

Research and return a GrooveRecipe JSON object with these EXACT fields:
- artist: "{artist}"
- sources: [array of 4+ URLs or citations where you found this information]
- confidence: 0.0-1.0 based on source reliability
- timing: {
    swingRatio: 0.5-0.75 (0.5 = straight, 0.67 = triplet feel),
    pushPullMs: [per-beat offsets, e.g., [-5, 3, -2, 4]],
    microTimingVariance: random variance in ms
  }
- velocity: {
    curve: "linear" | "exponential" | "logarithmic",
    ghostThreshold: 0-127 (notes below = ghost),
    accentBoost: 1.0-2.0 multiplier
  }
- articulation: {
    noteLengthFactor: 0.5-1.5 (1.0 = original length),
    overlapToleranceMs: allowed overlap
  }

Base your analysis on documented sources about {artist}'s drumming style,
including interviews, music theory analyses, and production techniques.

Return ONLY valid JSON, no markdown or explanation.
```

## Security Architecture

| Concern | Implementation |
|---------|----------------|
| **API Key Storage** | Local JSON file in user's Max preferences folder |
| **Key Transmission** | Only to respective LLM API endpoints over HTTPS |
| **MIDI Privacy** | Never transmitted; all processing local |
| **No Telemetry** | Zero tracking or analytics |
| **Validation** | Sanitize all user input before processing |

## Performance Considerations

| Metric | Target | Implementation |
|--------|--------|----------------|
| **LLM Response** | < 30 seconds | Progress animation during wait |
| **MIDI Transform** | < 500ms | Pure JS math, no I/O |
| **UI Response** | Immediate | Async operations, non-blocking |
| **Memory** | < 100MB | Efficient data structures |
| **Startup** | < 2 seconds | Lazy-load LLM providers |

## Deployment Architecture

**Distribution:**
- File: `GrooveAgent.amxd` (Max for Live device)
- Includes: Frozen Max patch + embedded Node.js code
- Platform: Gumroad (PWYW, $2.99 minimum, $19 suggested)

**Installation:**
1. User downloads `.amxd` file
2. Drag into Ableton Live User Library
3. Add to MIDI track
4. First-run: Configure LLM provider

**Dependencies:**
- **Required**: Ableton Live 12+, Max for Live 8.6+
- **Optional**: Ollama (for free local operation)
- **Bundled**: Node.js modules (frozen in device)

## Development Environment

### Prerequisites

- macOS 10.15+ or Windows 10+
- Ableton Live 12+ with Max for Live
- Node.js 20+ (for local development)
- Git

### Setup Commands

```bash
# Clone repository
git clone <repo-url>
cd GrooveAgent

# Install Node.js dependencies (for development)
cd src/node
npm install

# Run tests
npm test

# Development: Open Max patch
# 1. Open Ableton Live
# 2. Open src/max/GrooveAgent.amxd in Max
# 3. Edit with live reload (node.script watches for changes)
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "nodemon --watch src/node",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/node",
    "build": "echo 'Freeze in Max/MSP'"
  }
}
```

## Architecture Decision Records (ADRs)

### ADR-001: Target Ableton Live 12+ Only

**Status:** Accepted

**Context:** Max 8.5 (Live 11) bundles Node.js 16.6 which is EOL. Max 8.6 (Live 12) bundles Node.js 20.

**Decision:** Require Ableton Live 12+ as minimum version.

**Rationale:**
- Node.js 16.6 has known security vulnerabilities
- npm packages increasingly drop Node 16 support
- Live 12 is current; serious producers upgrade
- Simpler support matrix

**Consequences:**
- Excludes Live 11 users
- Smaller potential audience
- Secure, maintainable codebase

---

### ADR-002: Pure JavaScript (No TypeScript)

**Status:** Accepted

**Context:** node.script in Max runs JavaScript directly. TypeScript would require transpilation.

**Decision:** Use ES2024 JavaScript with JSDoc for type hints.

**Rationale:**
- No build step required
- Direct debugging in Max
- JSDoc provides IDE type support
- KISS principle

**Consequences:**
- No compile-time type checking
- Must rely on runtime validation
- Simpler toolchain

---

### ADR-003: Multi-Provider LLM Architecture

**Status:** Accepted

**Context:** Users have different preferences: some want free/local, others prioritize speed or quality.

**Decision:** Support multiple LLM providers with unified abstraction.

**Rationale:**
- Ollama = FREE option (key differentiator)
- Commercial fallbacks for those without Ollama
- No vendor lock-in
- Future-proof

**Consequences:**
- More complex implementation
- Must test with all providers
- Must maintain abstraction layer

---

### ADR-004: Message-Passing Architecture

**Status:** Accepted

**Context:** node.script runs in separate process from Max; cannot share memory.

**Decision:** All communication via JSON messages through max-api.

**Rationale:**
- Required by node.script architecture
- Clear contract between layers
- Enables async operations
- Good for debugging (messages are inspectable)

**Consequences:**
- Must serialize all data
- Async complexity
- Must handle message routing

---

### ADR-005: LLM as Research Engine (Not MIDI Processor)

**Status:** Accepted

**Context:** Could send MIDI to LLM for transformation, or use LLM just for research.

**Decision:** LLM researches artist style; local JS applies transformations.

**Rationale:**
- MIDI never leaves device (privacy)
- No token explosion from MIDI data
- Deterministic, reproducible results
- Commercial APIs viable (small prompts)

**Consequences:**
- Must implement MIDI math in JS
- LLM output is structured data (Groove Recipe)
- Two-phase operation (research → transform)

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: 2025-11-26_
_For: Fab_
