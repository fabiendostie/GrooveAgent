# Story 1.3: Max ↔ Node Message Bridge

**Status:** done

---

## Story

As a **developer**,  
I want **bidirectional JSON messaging between Max and Node.js**,  
So that **UI events trigger Node operations and Node results update UI**.

---

## Acceptance Criteria

| # | Criterion | Given/When/Then |
|---|-----------|-----------------|
| AC1 | Ping command works | **Given** node.script is running, **When** Max sends `{"cmd":"ping","id":"test"}`, **Then** Node returns `{"id":"test","success":true,"data":{"pong":true}}` |
| AC2 | Unknown command returns error | **Given** node.script is running, **When** Max sends unknown command, **Then** Node returns structured error with `code`, `message`, and `suggestion` fields |
| AC3 | Request ID preserved | **Given** any command is sent, **When** response is returned, **Then** response `id` exactly matches request `id` |
| AC4 | Messages logged | **Given** any command is received, **When** processing occurs, **Then** log entries appear in console with `[GrooveAgent]` prefix |

---

## Tasks / Subtasks

### Task 1: Implement Command Handler (AC: 1, 2, 3)

- [x] **1.1** Create `src/node/index.js` entry point with ESM module syntax:
  - Import `max-api` package
  - Initialize max-api handler registration
  - Export startup confirmation message
- [x] **1.2** Implement `handleCommand(message)` async function:
  - Parse incoming message object (`cmd`, `id`, `params`)
  - Route to appropriate handler based on `cmd` field
  - Return standardized response object
- [x] **1.3** Implement `ping` command handler:
  - Return `{ id, success: true, data: { pong: true } }`
  - No parameters required
- [x] **1.4** Implement unknown command error response:
  - Return structured error with `code: 'UNKNOWN_COMMAND'`
  - Include `message` and `suggestion` fields
- [x] **1.5** Implement catch-all error handler:
  - Wrap all command handling in try/catch
  - Return `code: 'INTERNAL_ERROR'` on unexpected errors
  - Include original error message

### Task 2: Register max-api Handler (AC: 1, 3)

- [x] **2.1** Register primary command handler using `maxApi.addHandler('cmd', handler)`:
  - Handler receives JSON object from Max
  - Async function returns response via `maxApi.outlet()`
- [x] **2.2** Implement request ID validation:
  - Verify `id` field exists in request
  - Return `INVALID_PARAMS` error if missing
  - Ensure response always includes original `id`
- [x] **2.3** Add startup notification:
  - Call `maxApi.post('[GrooveAgent] Ready')` on module load
  - Log Node.js version for debugging

### Task 3: Message Protocol Validation (AC: 1, 2, 3)

- [x] **3.1** Define and export message format types (JSDoc):
  ```javascript
  /**
   * @typedef {Object} CommandRequest
   * @property {string} cmd - Command identifier
   * @property {string} id - Unique request ID
   * @property {Object} [params] - Command parameters
   */
  ```
- [x] **3.2** Define and export response format types (JSDoc):
  ```javascript
  /**
   * @typedef {Object} CommandResponse
   * @property {string} id - Matches request ID
   * @property {boolean} success - Operation result
   * @property {Object} [data] - Success payload
   * @property {Object} [error] - Error details
   */
  ```
- [x] **3.3** Define error object structure (JSDoc):
  ```javascript
  /**
   * @typedef {Object} ErrorDetail
   * @property {string} code - Error code (SCREAMING_SNAKE_CASE)
   * @property {string} message - Human-readable description
   * @property {string} [suggestion] - Remediation hint
   */
  ```

### Task 4: Logging Integration (AC: 4)

- [x] **4.1** Import logger module from `./utils/logger.js`:
  - Use `log(Level.INFO, ...)` for normal operations
  - Use `log(Level.ERROR, ...)` for failures
- [x] **4.2** Add command logging:
  - Log incoming command with `cmd` and `id` values
  - Log response status (success/error)
- [x] **4.3** Ensure logs visible in Max console:
  - Verify `maxApi.post()` is called for all logs
  - Include `[GrooveAgent]` prefix in all output

### Task 5: Unit Testing (AC: 1, 2, 3, 4)

- [x] **5.1** Create `tests/index.test.js` unit test file:
  - Mock `max-api` module for testing
  - Test file follows ESM syntax
- [x] **5.2** Test ping command:
  - Verify returns `success: true`
  - Verify includes `data.pong: true`
  - Verify request ID preserved
- [x] **5.3** Test unknown command:
  - Verify returns `success: false`
  - Verify error has correct structure
  - Verify error code is `UNKNOWN_COMMAND`
- [x] **5.4** Test missing request ID:
  - Verify returns appropriate error
  - Verify error code is `INVALID_PARAMS`
- [x] **5.5** Test internal error handling:
  - Simulate thrown exception
  - Verify graceful error response
  - Verify error code is `INTERNAL_ERROR`

---

## Dev Notes

### Architecture Patterns & Constraints

**Message Protocol (from Architecture):**

All Max ↔ Node communication uses JSON messages following this pattern:

```javascript
// Request Format
{
  "cmd": "command-name",    // kebab-case command identifier
  "id": "req-xxxxx",        // Unique request ID for response matching
  "params": { ... }         // Command-specific parameters (optional)
}

// Success Response
{
  "id": "req-xxxxx",        // Must match request ID
  "success": true,
  "data": { ... }           // Command-specific result
}

// Error Response
{
  "id": "req-xxxxx",
  "success": false,
  "error": {
    "code": "ERROR_CODE",   // SCREAMING_SNAKE_CASE
    "message": "Description",
    "suggestion": "What to do"
  }
}
```

**Error Codes for this Story:**

| Code | Meaning | Suggestion |
|------|---------|------------|
| `UNKNOWN_COMMAND` | Command not recognized | Check command spelling |
| `INVALID_PARAMS` | Missing or invalid parameters | Verify request format |
| `INTERNAL_ERROR` | Unexpected exception | Check console for details |

**max-api Communication Pattern (from m4l-shards.md):**

```javascript
const max = require('max-api');

// Receive from Max
max.addHandler('cmd', async (message) => {
  // process and return
});

// Send to Max
max.outlet(responseObject);

// Log to Max console
max.post('[GrooveAgent] message');
```

**Naming Conventions:**
- Command names: kebab-case (`apply-groove`, `check-ollama`)
- Error codes: SCREAMING_SNAKE_CASE (`LLM_TIMEOUT`, `CLIP_EMPTY`)
- JS functions: camelCase (`handleCommand`, `generateRequestId`)

### Project Structure Notes

**File Locations:**
- Entry point: `src/node/index.js` (already exists as placeholder from Story 1.1)
- Logger: `src/node/utils/logger.js` (created in Story 1.5, but may need to create stub if developing 1.3 first)
- Tests: `tests/index.test.js`

**Module Pattern:**
- Use ESM (`"type": "module"` in package.json)
- Use `import`/`export` syntax
- Keep index.js focused on command routing

### Learnings from Previous Story

**From Story 1-2-telis-knowledge-shards (Status: done)**

- **Patterns Established**: TELIS shard structure for reference documentation
- **Files Available**: All 4 knowledge shards in `docs/context/` with verified API signatures
- **Reference**: Use `@m4l.node.script` patterns from `docs/context/m4l-shards.md`
- **Note**: max-api communication pattern documented in m4l-shards.md lines 35-60

[Source: docs/sprint-artifacts/1-2-telis-knowledge-shards.md#Dev-Agent-Record]

### Implementation Strategy

**Dependency Consideration:**
This story references `utils/logger.js` which is specified in Story 1.5. Two approaches:

1. **Stub Logger**: Create minimal logger stub for this story, replace in 1.5
2. **Inline Logging**: Use direct `console.log` + `maxApi.post()` temporarily

Recommended: Create complete logger in this story (pull forward from 1.5 scope).

### Testing Strategy

**Mocking max-api:**

```javascript
// tests/__mocks__/max-api.js
export const outlet = jest.fn();
export const post = jest.fn();
export const addHandler = jest.fn();
```

**Test Structure:**
- Unit tests can run without Max/Live
- Integration tests require M4L device (Story 1.4)

### References

- [Source: docs/epics.md#Story-1.3] — Full story definition and acceptance criteria
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Message-Protocol] — Request/Response format specification
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#APIs-and-Interfaces] — handleCommand interface definition
- [Source: docs/architecture.md#Pattern-2] — Max ↔ Node Message Protocol pattern
- [Source: docs/context/m4l-shards.md#node-script-Object] — max-api communication patterns
- [Source: docs/context/m4l-shards.md#Communication-Pattern] — Handler registration syntax

---

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-3-max-node-message-bridge.context.xml`

### Agent Model Used

Claude Opus 4.5 (Amelia - Dev Agent)

### Debug Log References

**Plan:**
- Task 1: Implement index.js with handleCommand, ping handler, error handlers
- Task 2: Register max-api handler, ID validation, startup notification
- Task 3: JSDoc types inline with Task 1
- Task 4: Minimal logger stub (pulled forward from 1.5)
- Task 5: Unit tests with mocked max-api

**Execution:**
- All tasks implemented in single session
- Logger module created with Level enum, log/info/error/debug/warn functions
- max-api integration uses dynamic import for node.script context detection
- 23 new tests created covering all ACs
- Fixed placeholder-files.test.js regression (now checks handleCommand export)

### Completion Notes List

- ✅ Implemented bidirectional JSON messaging protocol
- ✅ Ping command returns `{pong: true}` with preserved request ID
- ✅ Unknown command returns structured error (UNKNOWN_COMMAND)
- ✅ Missing ID returns INVALID_PARAMS error
- ✅ Internal errors caught and returned as INTERNAL_ERROR
- ✅ All logs prefixed with `[GrooveAgent]`
- ✅ Logger pulled forward from Story 1.5 scope (minimal implementation)
- ✅ 65 tests pass (23 new + 42 existing)

### File List

| Action | Path |
|--------|------|
| Modified | `src/node/index.js` |
| Modified | `src/node/utils/logger.js` |
| Created | `tests/index.test.js` |
| Created | `tests/__mocks__/max-api.js` |
| Modified | `tests/structure/placeholder-files.test.js` |
| Modified | `docs/sprint-artifacts/sprint-status.yaml` |

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-27 | SM (Bob) | Initial draft created from epics.md, architecture.md, tech-spec-epic-1.md |
| 2025-11-27 | Dev (Amelia) | Implemented all tasks: command handler, max-api integration, logging, unit tests. 65 tests passing. |
| 2025-11-27 | Dev (Amelia) | Senior Developer Review: APPROVED |

---

## Senior Developer Review (AI)

### Reviewer
Fab (via Dev Agent - Amelia)

### Date
2025-11-27

### Outcome
**✅ APPROVE**

All acceptance criteria implemented, all tasks verified, no significant issues found.

### Summary

Story 1.3 establishes the bidirectional JSON messaging protocol between Max and Node.js. Implementation follows architecture patterns exactly, with clean ESM module structure, proper error handling, and comprehensive test coverage.

### Key Findings

**No HIGH or MEDIUM severity issues found.**

**LOW Severity (Advisory):**
- Note: Logger uses `console.log` for all levels instead of `console.error` for ERROR level - cosmetic, not a bug
- Note: Logger doesn't support optional `data` parameter shown in tech-spec - minor scope difference, can be added in Story 1.5

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Ping command works | ✅ IMPLEMENTED | `src/node/index.js:82-84,177` |
| AC2 | Unknown command returns error | ✅ IMPLEMENTED | `src/node/index.js:164-171` |
| AC3 | Request ID preserved | ✅ IMPLEMENTED | `src/node/index.js:133,177,139-144,150-155,166-171,181-186` |
| AC4 | Messages logged with [GrooveAgent] prefix | ✅ IMPLEMENTED | `src/node/utils/logger.js:12,44,50-51` |

**Summary:** 4 of 4 acceptance criteria fully implemented

### Task Completion Validation

| Task | Marked | Verified | Evidence |
|------|--------|----------|----------|
| 1.1 Create index.js entry point | [x] | ✅ | `src/node/index.js:10` |
| 1.2 Implement handleCommand | [x] | ✅ | `src/node/index.js:132-188` |
| 1.3 Implement ping handler | [x] | ✅ | `src/node/index.js:82-84,87` |
| 1.4 Unknown cmd error | [x] | ✅ | `src/node/index.js:164-171` |
| 1.5 Catch-all error handler | [x] | ✅ | `src/node/index.js:179-187` |
| 2.1 Register maxApi.addHandler | [x] | ✅ | `src/node/index.js:211-214` |
| 2.2 Request ID validation | [x] | ✅ | `src/node/index.js:136-145` |
| 2.3 Startup notification | [x] | ✅ | `src/node/index.js:217` |
| 3.1 CommandRequest JSDoc | [x] | ✅ | `src/node/index.js:18-24` |
| 3.2 CommandResponse JSDoc | [x] | ✅ | `src/node/index.js:26-33` |
| 3.3 ErrorDetail JSDoc | [x] | ✅ | `src/node/index.js:35-41` |
| 4.1 Import logger | [x] | ✅ | `src/node/index.js:10` |
| 4.2 Add command logging | [x] | ✅ | `src/node/index.js:158,165,176,180` |
| 4.3 Logs visible in Max | [x] | ✅ | `src/node/index.js:208`, `logger.js:50-51` |
| 5.1 Create tests/index.test.js | [x] | ✅ | File exists with mock `:16-25` |
| 5.2 Test ping command | [x] | ✅ | `tests/index.test.js:47-69` |
| 5.3 Test unknown command | [x] | ✅ | `tests/index.test.js:74-105` |
| 5.4 Test missing ID | [x] | ✅ | `tests/index.test.js:138-152` |
| 5.5 Test internal error | [x] | ✅ | `tests/index.test.js:169-205` |

**Summary:** 19 of 19 completed tasks verified, 0 questionable, 0 false completions

### Test Coverage and Gaps

- ✅ AC1: 3 tests (`tests/index.test.js:47-69`)
- ✅ AC2: 4 tests (`tests/index.test.js:74-105`)
- ✅ AC3: 5 tests (`tests/index.test.js:110-152`)
- ✅ AC4: 1 test (`tests/index.test.js:159-163`)
- ✅ Additional: 10 tests for error handling, format validation, exports

**Total:** 23 new tests, 65 tests passing (including structure tests)

### Architectural Alignment

- ✅ ESM modules (`"type": "module"`)
- ✅ Message protocol matches `docs/architecture.md#Pattern-2`
- ✅ Error codes in SCREAMING_SNAKE_CASE
- ✅ Log prefix `[GrooveAgent]`
- ✅ handleCommand async function per tech-spec
- ✅ max-api integration with addHandler/outlet/post

### Security Notes

- No network calls in this story
- No secrets/API keys
- Input validation present for message format

### Best-Practices and References

- [Cycling '74 max-api documentation](https://docs.cycling74.com/max8/vignettes/node_for_max_api)
- ESM modules in Node.js 20 (bundled with Max 8.6)
- Jest ESM support with `--experimental-vm-modules`

### Action Items

**Code Changes Required:**
(None - story approved)

**Advisory Notes:**
- Note: Consider adding `data` parameter to logger for Story 1.5 to match tech-spec
- Note: Consider using console.error for ERROR level in logger (cosmetic improvement)


