# Epic Technical Specification: Foundation & TELIS Setup

**Date:** 2025-11-26  
**Author:** Fab  
**Epic ID:** 1  
**Status:** Draft  

---

## Overview

Epic 1 establishes the foundational infrastructure for GrooveAgent development using the **TELIS (Token-Efficient Language Intelligence System)** methodology to achieve **<2% code error rate** during implementation. This epic creates the project structure, development patterns, and communication bridge between Max for Live and Node.js that all subsequent features depend on.

The TELIS methodology provides:
- **Knowledge Shards** — Pre-verified API signatures for Max/MSP, LiveAPI, and LLM providers
- **Progressive Context Negotiation** — Request specific info, don't guess
- **Anti-Hallucination Protocol** — Verify all Max objects, LiveAPI signatures, MIDI structures

This foundation epic contains no user-facing features but is **critical infrastructure** that enables Epic 2's "Magic Moment" and all subsequent development.

---

## Objectives and Scope

### In Scope ✅

| Objective | Description |
|-----------|-------------|
| **Project Structure** | Create directory layout per architecture spec (`src/node/`, `src/max/`, `docs/`) |
| **Node.js Setup** | Initialize `package.json` with `max-api` dependency |
| **TELIS Knowledge Shards** | Populate `docs/context/` with verified API signatures |
| **Message Protocol** | Implement JSON message bridge between Max and Node.js |
| **M4L Device Shell** | Create minimal `.amxd` file with node.script connected |
| **Error Handling** | Standardized logging and error patterns |
| **Development Tooling** | ESLint, Jest setup for testing |

### Out of Scope ❌

| Item | Reason |
|------|--------|
| LLM Integration | Deferred to Epic 2 (Story 2.3) |
| MIDI Transformation | Deferred to Epic 2 (Story 2.6) |
| Display Screen (jsui) | Deferred to Epic 2 (Story 2.2) |
| Settings Persistence | Deferred to Epic 4 |
| UI Controls | Deferred to Epic 2 (Story 2.1) |

---

## System Architecture Alignment

This epic implements the **foundation layer** of the GrooveAgent architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Max for Live Device                       │
│  ┌─────────────────────────────────────────────────────────┐│
│  │           Max/MSP UI Layer (bpatcher) [EPIC 2+]         ││
│  │                         │                                ││
│  │                         ▼ JSON messages                  ││
│  │  ┌─────────────────────────────────────────────────────┐││
│  │  │     node.script (Node.js 20) [THIS EPIC ⭐]         │││
│  │  │  ┌───────────────────────────────────────────────┐  │││
│  │  │  │  index.js - Command Router [Story 1.3]        │  │││
│  │  │  │  utils/logger.js - Logging [Story 1.5]        │  │││
│  │  │  │  Placeholder modules [Story 1.1]              │  │││
│  │  │  └───────────────────────────────────────────────┘  │││
│  │  └─────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   docs/context/        Knowledge Shards [Story 1.2]
   m4l-shards.md        liveapi-shards.md
   llm-shards.md        midi-math.md
```

### Architecture Components Addressed

| Component | Architecture Reference | Story |
|-----------|----------------------|-------|
| Project Structure | "Project Structure" section | 1.1 |
| Knowledge Shards | TELIS methodology | 1.2 |
| Message Protocol | "Pattern 2: Max ↔ Node Message Protocol" | 1.3 |
| M4L Device | "M4L Device Setup" | 1.4 |
| Error Handling | "Error Handling" section | 1.5 |

---

## Detailed Design

### Services and Modules

| Module | File | Responsibility | Created In |
|--------|------|---------------|------------|
| **Entry Point** | `src/node/index.js` | Command routing, message handling | Story 1.1, 1.3 |
| **Logger** | `src/node/utils/logger.js` | Standardized logging to console + Max | Story 1.5 |
| **LLM Placeholders** | `src/node/llm/*.js` | Empty modules for later implementation | Story 1.1 |
| **MIDI Placeholders** | `src/node/midi/*.js` | Empty modules for later implementation | Story 1.1 |
| **Clip Placeholders** | `src/node/clip/*.js` | Empty modules for later implementation | Story 1.1 |
| **M4L Device** | `src/max/GrooveAgent.amxd` | Max for Live container | Story 1.4 |
| **Knowledge Shards** | `docs/context/*.md` | Verified API signatures | Story 1.2 |

### Module Dependencies

```
index.js
  └── utils/logger.js
  └── llm/index.js (placeholder)
  └── midi/groove-recipe.js (placeholder)
  └── clip/operations.js (placeholder)
```

---

### Data Models and Contracts

#### Message Protocol (Story 1.3)

All communication between Max and Node.js uses JSON messages:

**Request Format:**
```javascript
{
  "cmd": "command-name",    // Command identifier (kebab-case)
  "id": "req-xxxxx",        // Unique request ID for response matching
  "params": {               // Command-specific parameters
    // ...
  }
}
```

**Response Format (Success):**
```javascript
{
  "id": "req-xxxxx",        // Matches request ID
  "success": true,
  "data": {                 // Command-specific response data
    // ...
  }
}
```

**Response Format (Error):**
```javascript
{
  "id": "req-xxxxx",
  "success": false,
  "error": {
    "code": "ERROR_CODE",   // SCREAMING_SNAKE_CASE
    "message": "Human-readable description",
    "suggestion": "What to do about it"
  }
}
```

#### Error Codes (Story 1.5)

| Code | Category | User Message |
|------|----------|--------------|
| `UNKNOWN_COMMAND` | System | "Unknown command received" |
| `INVALID_PARAMS` | System | "Invalid parameters for command" |
| `INTERNAL_ERROR` | System | "An unexpected error occurred" |

(LLM, Clip, and Recipe error codes defined in Epic 2)

---

### APIs and Interfaces

#### Node.js Entry Point API (Story 1.3)

```javascript
// src/node/index.js

const maxApi = require('max-api');

/**
 * Command handler interface
 * @param {Object} message - Incoming message
 * @param {string} message.cmd - Command name
 * @param {string} message.id - Request ID
 * @param {Object} message.params - Command parameters
 * @returns {Promise<Object>} Response object
 */
async function handleCommand(message) {
  const { cmd, id, params } = message;
  
  try {
    switch (cmd) {
      case 'ping':
        return { id, success: true, data: { pong: true } };
      
      // Future commands added here
      
      default:
        return {
          id,
          success: false,
          error: {
            code: 'UNKNOWN_COMMAND',
            message: `Unknown command: ${cmd}`,
            suggestion: 'Check command spelling'
          }
        };
    }
  } catch (error) {
    return {
      id,
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message,
        suggestion: 'Check console for details'
      }
    };
  }
}

// Register handler
maxApi.addHandler('cmd', async (message) => {
  const response = await handleCommand(message);
  maxApi.outlet(response);
});

// Startup notification
maxApi.post('[GrooveAgent] Ready');
```

#### Logger API (Story 1.5)

```javascript
// src/node/utils/logger.js

const maxApi = require('max-api');

const LOG_PREFIX = '[GrooveAgent]';

/**
 * Log levels
 * @readonly
 * @enum {string}
 */
const Level = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/**
 * Log a message to console and Max
 * @param {Level} level - Log level
 * @param {string} context - Component context (e.g., 'LLM', 'Clip')
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object
 */
function log(level, context, message, data = null) {
  const logMessage = `${LOG_PREFIX} [${level}] ${context}: ${message}`;
  
  // Console output
  const consoleFn = level === Level.ERROR ? console.error :
                    level === Level.WARN ? console.warn :
                    console.log;
  
  if (data) {
    consoleFn(logMessage, data);
  } else {
    consoleFn(logMessage);
  }
  
  // Max console output
  maxApi.post(logMessage);
}

module.exports = { log, Level };
```

---

### Workflows and Sequencing

#### Story Implementation Order

```
Story 1.1: Project Structure & Dependencies
    │
    ├── Creates directory structure
    ├── Creates package.json with max-api
    └── Creates placeholder files
         │
         ▼
Story 1.2: TELIS Knowledge Shards (parallel with 1.3)
    │
    └── Populates docs/context/ with verified signatures
         │
         ▼
Story 1.3: Max ↔ Node Message Bridge (parallel with 1.2)
    │
    ├── Implements command handler in index.js
    └── Defines message protocol
         │
         ▼
Story 1.4: Basic Max for Live Device Shell
    │
    ├── Creates GrooveAgent.amxd
    ├── Adds node.script with autostart
    └── Adds test button for ping
         │
         ▼
Story 1.5: Error Handling & Logging Foundation
    │
    ├── Creates logger.js utility
    └── Implements error categorization
```

#### Ping Test Flow (Story 1.4 Validation)

```
[Max live.text button]
        │ click
        ▼
[prepend cmd] → {"cmd": "ping", "id": "test-1"}
        │
        ▼
[node.script]
        │ maxApi receives message
        ▼
[handleCommand()] → { id: "test-1", success: true, data: { pong: true } }
        │
        ▼
[maxApi.outlet()]
        │
        ▼
[route success error] → [message in Max console: "pong received"]
```

---

## Non-Functional Requirements

### Performance

| Metric | Target | Measurement | Story |
|--------|--------|-------------|-------|
| **node.script Startup** | < 2 seconds | Time from device load to "Ready" | 1.4 |
| **Ping Response** | < 50ms | Round-trip time | 1.3 |
| **Shard Load Time** | N/A (manual reference) | Developer access | 1.2 |

### Security

| Requirement | Implementation | Story |
|-------------|---------------|-------|
| **No External Network** | Epic 1 has no network calls | All |
| **Input Validation** | Validate all message params | 1.3 |
| **No Secrets** | No API keys in Epic 1 | All |

### Reliability/Availability

| Requirement | Implementation | Story |
|-------------|---------------|-------|
| **Graceful Error Handling** | All errors return structured response | 1.5 |
| **No Crashes** | Try/catch around all async operations | 1.5 |
| **Startup Reliability** | node.script @autostart 1 | 1.4 |

### Observability

| Requirement | Implementation | Story |
|-------------|---------------|-------|
| **Console Logging** | `console.log` with prefix `[GrooveAgent]` | 1.5 |
| **Max Console** | `maxApi.post()` for visibility in Max | 1.5 |
| **Log Levels** | DEBUG, INFO, WARN, ERROR | 1.5 |
| **Context Tags** | Log includes component context | 1.5 |

---

## Dependencies and Integrations

### npm Dependencies

| Package | Version | Purpose | Story |
|---------|---------|---------|-------|
| `max-api` | ^1.0.0 | Node.js ↔ Max communication | 1.1 |

**package.json:**
```json
{
  "name": "grooveagent-node",
  "version": "1.0.0",
  "description": "GrooveAgent Node.js module for Max for Live",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "test": "jest",
    "lint": "eslint ."
  },
  "dependencies": {
    "max-api": "^1.0.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
  },
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### External Dependencies

| Dependency | Type | Required | Story |
|------------|------|----------|-------|
| **Ableton Live 12+** | Runtime | Yes | 1.4 |
| **Max for Live 8.6+** | Runtime | Yes | 1.4 |
| **Node.js 20** | Bundled with Max | Yes | 1.1 |

### Knowledge Shard Structure (Story 1.2)

| Shard | Content | Token Budget |
|-------|---------|--------------|
| `m4l-shards.md` | Max for Live objects, live.* UI, node.script patterns | ~500 |
| `liveapi-shards.md` | LiveAPI methods, LOM paths, note structure | ~500 |
| `llm-shards.md` | Ollama, Claude, OpenAI, Groq API signatures | ~500 |
| `midi-math.md` | Swing calculation, velocity curves, timing formulas | ~500 |

---

## Acceptance Criteria (Authoritative)

### Story 1.1: Project Structure & Dependencies

| # | Criterion | Testable Statement |
|---|-----------|-------------------|
| 1.1.1 | Directory structure exists | `src/node/`, `src/max/`, `docs/context/` directories present |
| 1.1.2 | package.json created | File exists with `max-api` in dependencies |
| 1.1.3 | Placeholder files created | All module files listed in architecture exist (can be empty) |
| 1.1.4 | npm install succeeds | Running `npm install` in `src/node/` completes without error |

### Story 1.2: TELIS Knowledge Shards

| # | Criterion | Testable Statement |
|---|-----------|-------------------|
| 1.2.1 | All 4 shard files exist | `m4l-shards.md`, `liveapi-shards.md`, `llm-shards.md`, `midi-math.md` in `docs/context/` |
| 1.2.2 | Shards contain verified content | Each shard has actual API signatures, not placeholders |
| 1.2.3 | Gotchas sections present | Each shard includes "Gotchas" section with common pitfalls |
| 1.2.4 | Token budget respected | Each shard is ≤500 tokens (tier_2_micro per TELIS) |

### Story 1.3: Max ↔ Node Message Bridge

| # | Criterion | Testable Statement |
|---|-----------|-------------------|
| 1.3.1 | Ping command works | Sending `{"cmd":"ping","id":"test"}` returns `{"id":"test","success":true}` |
| 1.3.2 | Unknown command returns error | Sending unknown command returns structured error response |
| 1.3.3 | Request ID preserved | Response `id` matches request `id` |
| 1.3.4 | Messages logged | All commands logged to console with `[GrooveAgent]` prefix |

### Story 1.4: Basic Max for Live Device Shell

| # | Criterion | Testable Statement |
|---|-----------|-------------------|
| 1.4.1 | Device loads without error | Opening `GrooveAgent.amxd` in Max shows no errors |
| 1.4.2 | node.script auto-starts | "GrooveAgent ready" appears in Max console on load |
| 1.4.3 | Ping test button works | Clicking test button shows successful ping response |
| 1.4.4 | Device saves as .amxd | File saved as Max for Live MIDI Effect |

### Story 1.5: Error Handling & Logging Foundation

| # | Criterion | Testable Statement |
|---|-----------|-------------------|
| 1.5.1 | Logger module exists | `src/node/utils/logger.js` exports `log` function |
| 1.5.2 | Log levels work | DEBUG, INFO, WARN, ERROR levels produce different output |
| 1.5.3 | Logs appear in Max | `maxApi.post()` called for all log messages |
| 1.5.4 | Error format consistent | All errors have `code`, `message`, `suggestion` fields |

---

## Traceability Mapping

| AC | Spec Section | Component | Test Approach |
|----|--------------|-----------|---------------|
| 1.1.1 | Project Structure | src/node/, src/max/, docs/ | File existence check |
| 1.1.2 | Dependencies | package.json | npm install |
| 1.1.3 | Project Structure | Placeholder files | File existence check |
| 1.1.4 | Dependencies | npm | npm install exit code |
| 1.2.1 | Knowledge Shards | docs/context/*.md | File existence check |
| 1.2.2 | Knowledge Shards | Shard content | Manual review |
| 1.2.3 | Knowledge Shards | Gotchas sections | Content search |
| 1.2.4 | Knowledge Shards | Token count | Word count estimate |
| 1.3.1 | Message Protocol | index.js | Unit test |
| 1.3.2 | Message Protocol | handleCommand() | Unit test |
| 1.3.3 | Message Protocol | Response format | Unit test |
| 1.3.4 | Observability | Logger integration | Max console check |
| 1.4.1 | M4L Device | GrooveAgent.amxd | Load in Max |
| 1.4.2 | M4L Device | node.script @autostart | Max console check |
| 1.4.3 | M4L Device | live.text button | Manual test |
| 1.4.4 | M4L Device | File format | File extension check |
| 1.5.1 | Logger API | logger.js | Import test |
| 1.5.2 | Logger API | Level enum | Unit test |
| 1.5.3 | Observability | maxApi.post | Max console check |
| 1.5.4 | Error Handling | Error format | Unit test |

---

## Risks, Assumptions, Open Questions

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **R1:** node.script behaves differently than expected | High | Low | Test early with minimal code; reference m4l-shards.md |
| **R2:** max-api version incompatibility | Medium | Low | Pin to ^1.0.0; test with Max 8.6+ |
| **R3:** Knowledge shards become stale | Medium | Medium | Version shards; periodic review |

### Assumptions

| ID | Assumption | Validation |
|----|------------|------------|
| **A1:** Max 8.6+ bundled Node.js 20 is fully ES2024 compatible | Test ES2024 features in first story |
| **A2:** maxApi.outlet() is synchronous for response ordering | Verify in ping test |
| **A3:** Developers have Ableton Live 12+ for testing | Prerequisite in README |

### Open Questions

| ID | Question | Answer/Status |
|----|----------|---------------|
| **Q1:** Should we use ESM or CommonJS in node.script? | **Answer:** ESM (`"type": "module"`) for modern syntax |
| **Q2:** Where should the test button be positioned in M4L device? | Deferred — temporary for Story 1.4, removed after |
| **Q3:** Should logging include timestamps? | **Answer:** Yes, ISO 8601 format |

---

## Test Strategy Summary

### Unit Tests (Jest)

| Module | Test File | Coverage |
|--------|-----------|----------|
| `index.js` | `tests/index.test.js` | Command routing, error handling |
| `logger.js` | `tests/utils/logger.test.js` | All log levels, format |

**Jest Configuration:**
```javascript
// jest.config.js
export default {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: ['src/node/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
```

### Integration Tests

| Test | Description | Method |
|------|-------------|--------|
| **Device Load** | GrooveAgent.amxd loads without error | Manual in Max |
| **Ping Roundtrip** | Button → node.script → response | Manual in Max |
| **Console Output** | Logs appear in Max console | Manual observation |

### TELIS Validation

| Shard | Validation Method |
|-------|-------------------|
| `m4l-shards.md` | Cross-reference with Cycling '74 docs |
| `liveapi-shards.md` | Cross-reference with LOM documentation |
| `llm-shards.md` | Cross-reference with provider API docs |
| `midi-math.md` | Verify formulas with music theory sources |

---

## TELIS Integration Notes

Epic 1 implements the **foundation for TELIS methodology**:

### Knowledge Shard Protocol

When implementing subsequent epics, developers should:

1. **Request specific signatures:** "I need the signature for `LiveAPI.call('get_notes_extended')`"
2. **Reference shards:** `@docs/context/liveapi-shards.md`
3. **Never guess APIs:** If not in shards, research and add

### Anti-Hallucination Checklist (for all subsequent stories)

- [ ] All Max/MSP objects verified in `m4l-shards.md`
- [ ] All LiveAPI methods verified in `liveapi-shards.md`
- [ ] All LLM API calls verified in `llm-shards.md`
- [ ] All MIDI math verified in `midi-math.md`
- [ ] No invented npm packages
- [ ] No guessed function signatures

### Symbolic Compression (from TELIS)

```yaml
@js.spawn: "child_process.spawn(cmd, args, {stdio})"
@m4l.api.clip: "new LiveAPI('live_set tracks N clip_slots M clip')"
@m4l.get.notes: "clip.call('get_notes_extended', start, count, pitch_start, pitch_count)"
```

---

_Generated by BMAD Epic Tech Context Workflow v6_  
_Date: 2025-11-26_  
_Epic: Foundation & TELIS Setup_


