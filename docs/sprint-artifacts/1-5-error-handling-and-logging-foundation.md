# Story 1.5: Error Handling & Logging Foundation

**Status:** review

---

## Story

As a **developer**,  
I want **standardized error handling and logging**,  
So that **debugging is efficient and errors are user-friendly**.

---

## Acceptance Criteria

| # | Criterion | Given/When/Then |
|---|-----------|-----------------|
| AC1 | Logger module enhanced | **Given** the existing logger from Story 1-3, **When** logging with data objects, **Then** the optional `data` parameter is supported and displayed |
| AC2 | Log levels work correctly | **Given** a log message, **When** using DEBUG/INFO/WARN/ERROR levels, **Then** each uses appropriate console method (`console.error` for ERROR, etc.) |
| AC3 | Logs appear in Max console | **Given** any log call, **When** `maxApi` is configured, **Then** `maxApi.post()` is called with formatted message |
| AC4 | Error codes defined | **Given** the error utilities module, **When** an error occurs, **Then** appropriate code from the full ErrorCode enum is returned |
| AC5 | Error suggestions provided | **Given** any error code, **When** `getSuggestion()` is called, **Then** a helpful user-facing suggestion string is returned |
| AC6 | Error categorization works | **Given** a caught exception, **When** `categorizeError()` is called, **Then** the appropriate ErrorCode is returned based on error properties |

---

## Tasks / Subtasks

### Task 1: Create Error Utilities Module (AC: 4, 5, 6)

- [x] **1.1** Create `src/node/utils/errors.js` module:
  - Define complete `ErrorCode` enum with all application error codes
  - Export ErrorCode for use across codebase
- [x] **1.2** Implement `getSuggestion(errorCode)` function:
  - Map each ErrorCode to a user-friendly suggestion string
  - Suggestions should guide users toward resolution
  - Return generic suggestion for unknown codes
- [x] **1.3** Implement `categorizeError(error)` function:
  - Analyze error type, message, and code properties
  - Return appropriate ErrorCode based on error characteristics
  - Handle common error patterns (network, timeout, validation)
- [x] **1.4** Implement `createError(code, message, suggestion?)` helper:
  - Create standardized error detail objects
  - Auto-populate suggestion if not provided
  - Follow architecture error format

### Task 2: Enhance Logger Module (AC: 1, 2, 3)

- [x] **2.1** Add optional `data` parameter to `log()` function:
  - Accept object as fourth parameter
  - Include data in console output when provided
  - Format data appropriately for Max console (stringify if needed)
- [x] **2.2** Use appropriate console methods per level:
  - DEBUG → `console.debug`
  - INFO → `console.log`
  - WARN → `console.warn`
  - ERROR → `console.error`
- [x] **2.3** Add timestamp support (optional enhancement):
  - Include ISO 8601 timestamp in log messages
  - Make timestamp inclusion configurable
- [x] **2.4** Update convenience functions (info, error, debug, warn):
  - Pass through optional data parameter
  - Maintain backward compatibility

### Task 3: Integrate with index.js (AC: 4, 5, 6)

- [x] **3.1** Import error utilities into `src/node/index.js`:
  - Import ErrorCode, getSuggestion, categorizeError
  - Replace local ErrorCode enum with imported version
- [x] **3.2** Update `createErrorResponse()` to use new utilities:
  - Use `getSuggestion()` when suggestion not explicitly provided
  - Ensure consistent error format across codebase
- [x] **3.3** Refactor error handling in `handleCommand()`:
  - Use `categorizeError()` for caught exceptions
  - Maintain existing behavior while using new utilities

### Task 4: Unit Testing (AC: 1, 2, 3, 4, 5, 6)

- [x] **4.1** Create `tests/utils/errors.test.js`:
  - Test all ErrorCodes have corresponding suggestions
  - Test categorizeError for common error patterns
  - Test createError produces valid format
- [x] **4.2** Create/Update `tests/utils/logger.test.js`:
  - Test data parameter handling
  - Test each log level uses correct console method
  - Test Max console integration
- [x] **4.3** Update `tests/index.test.js` if needed:
  - Verify error responses use new utilities
  - Test backward compatibility

---

## Dev Notes

### Architecture Patterns & Constraints

**Standard Error Pattern (from architecture.md):**

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

**Complete Error Code Enum:**

```javascript
const ErrorCode = {
  // System errors (from Story 1-3)
  UNKNOWN_COMMAND: 'UNKNOWN_COMMAND',
  INVALID_PARAMS: 'INVALID_PARAMS',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  
  // LLM errors (Epic 2-3)
  LLM_UNAVAILABLE: 'LLM_UNAVAILABLE',
  LLM_TIMEOUT: 'LLM_TIMEOUT',
  LLM_RATE_LIMITED: 'LLM_RATE_LIMITED',
  
  // Clip errors (Epic 2)
  CLIP_EMPTY: 'CLIP_EMPTY',
  CLIP_TOO_LONG: 'CLIP_TOO_LONG',
  NO_EMPTY_SLOTS: 'NO_EMPTY_SLOTS',
  
  // Recipe errors (Epic 2)
  LOW_CONFIDENCE: 'LOW_CONFIDENCE',
  
  // Config errors (Epic 4-5)
  INVALID_CONFIG: 'INVALID_CONFIG'
};
```

**Error Suggestions Map:**

| Code | Suggestion |
|------|------------|
| UNKNOWN_COMMAND | "Check command spelling. Available: ping" |
| INVALID_PARAMS | "Verify request format and required fields" |
| INTERNAL_ERROR | "Check console for details" |
| LLM_UNAVAILABLE | "Configure an LLM provider in Settings" |
| LLM_TIMEOUT | "Request timed out. Retry or check your connection" |
| LLM_RATE_LIMITED | "Rate limited. Wait a moment or switch providers" |
| CLIP_EMPTY | "Select a clip with MIDI notes" |
| CLIP_TOO_LONG | "Shorten clip to 16 bars or less" |
| NO_EMPTY_SLOTS | "Clear a clip slot for output variations" |
| LOW_CONFIDENCE | "Limited sources found. Results may vary" |
| INVALID_CONFIG | "Settings may be corrupted. Try resetting" |

**Logging Format (from architecture.md):**

```javascript
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
```

### Project Structure Notes

**File Locations:**
- Error utilities: `src/node/utils/errors.js` (NEW)
- Logger enhancement: `src/node/utils/logger.js` (MODIFY)
- Integration: `src/node/index.js` (MODIFY)
- Tests: `tests/utils/errors.test.js` (NEW), `tests/utils/logger.test.js` (NEW/MODIFY)

**Module Pattern:**
- Use CommonJS (`require`/`module.exports`) for Max compatibility
- Export all utilities for testing and cross-module use

### Learnings from Previous Stories

**From Story 1-3-max-node-message-bridge (Status: done)**

- **Logger Exists**: `src/node/utils/logger.js` already has basic implementation
- **ErrorCode Partial**: `src/node/index.js` has UNKNOWN_COMMAND, INVALID_PARAMS, INTERNAL_ERROR
- **Advisory Notes**:
  - Logger needs optional `data` parameter (not yet implemented)
  - Consider using `console.error` for ERROR level
  - createErrorResponse already takes suggestion parameter

**Key Point:** Story 1-3 "pulled forward" a minimal logger. This story ENHANCES rather than creates from scratch.

[Source: docs/sprint-artifacts/1-3-max-node-message-bridge.md#Senior-Developer-Review]

**From Story 1-4-basic-max-for-live-device-shell (Status: done)**

- **ESM/CommonJS Issue**: M4L node.script requires CommonJS format
- **File Location**: `src/max/` has `package.json` with `"type": "commonjs"`
- **Implication**: utils modules must use CommonJS exports

[Source: docs/sprint-artifacts/1-4-basic-max-for-live-device-shell.md#Dev-Agent-Record]

### Non-Functional Requirements

| Metric | Target | From Tech Spec |
|--------|--------|----------------|
| All error codes have suggestions | 100% coverage | Every ErrorCode maps to a suggestion |
| Logger handles missing maxApi | Graceful | Should not throw if maxApi not configured |
| Tests pass | All | Unit tests for all new functionality |

### Testing Strategy

**Unit Tests Required:**

```javascript
// tests/utils/errors.test.js
describe('ErrorCode', () => {
  it('should define all application error codes');
  it('should use SCREAMING_SNAKE_CASE format');
});

describe('getSuggestion', () => {
  it('should return suggestion for each error code');
  it('should return generic suggestion for unknown codes');
});

describe('categorizeError', () => {
  it('should identify timeout errors');
  it('should identify network errors');
  it('should identify validation errors');
  it('should default to INTERNAL_ERROR');
});
```

```javascript
// tests/utils/logger.test.js
describe('log with data', () => {
  it('should include data in console output');
  it('should handle null/undefined data gracefully');
});

describe('log levels', () => {
  it('should use console.error for ERROR level');
  it('should use console.warn for WARN level');
  it('should use console.log for INFO level');
  it('should use console.debug for DEBUG level');
});
```

### References

- [Source: docs/epics.md#Story-1.5] — Full story definition
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.5] — Acceptance criteria table
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Logger-API] — Logger interface specification
- [Source: docs/architecture.md#Error-Handling] — Error pattern and categories
- [Source: docs/architecture.md#Logging-Strategy] — Logging format specification
- [Source: docs/sprint-artifacts/1-3-max-node-message-bridge.md] — Previous story learnings
- [Source: docs/context/m4l-shards.md#Error-Response-Protocol] — Max error response patterns
- [Source: docs/context/llm-shards.md#Error-Handling-Pattern] — LLM error codes
- [Source: docs/context/liveapi-shards.md#Clip-Error-Codes] — Clip validation error codes

---

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-5-error-handling-and-logging-foundation.context.xml`

### Agent Model Used

Claude Opus 4.5 (Amelia - Developer Agent)

### Debug Log References

- Implementation plan: Create errors.js with ErrorCode enum, getSuggestion(), categorizeError(), createError()
- Enhanced logger.js with data parameter, level-appropriate console methods, timestamp support
- Integrated error utilities into index.js, replacing local ErrorCode
- Fixed ESM/CommonJS compatibility by adding "type": "commonjs" to src/node/package.json
- All 96 Story 1.5 related tests pass

### Completion Notes List

- ✅ Created `src/node/utils/errors.js` with complete ErrorCode enum (11 codes), getSuggestion(), categorizeError(), createError()
- ✅ Enhanced `src/node/utils/logger.js` with optional data parameter, level-appropriate console methods (ERROR→console.error, etc.), configurable timestamp
- ✅ Updated `src/node/index.js` to import and use error utilities, auto-populate suggestions via getSuggestion()
- ✅ Created comprehensive test suites: 42 tests in errors.test.js, 27 tests in logger.test.js, 27 tests in index.test.js
- ✅ Fixed CommonJS compatibility issue by adding "type": "commonjs" to src/node/package.json
- ✅ All tests converted to ESM imports for Jest experimental VM modules compatibility
- Note: Pre-existing tests in package-json.test.js and placeholder-files.test.js have unrelated failures (Story 1-1 ESM expectations vs CommonJS requirement)

### File List

**New Files:**
- `src/node/utils/errors.js` - Error utilities module with ErrorCode, getSuggestion, categorizeError, createError
- `tests/utils/errors.test.js` - 42 unit tests for error utilities
- `tests/utils/logger.test.js` - 27 unit tests for enhanced logger

**Modified Files:**
- `src/node/utils/logger.js` - Enhanced with data parameter, level-appropriate console methods, timestamp support
- `src/node/index.js` - Import error utilities, use getSuggestion/categorizeError
- `src/node/package.json` - Added "type": "commonjs" for M4L compatibility
- `tests/index.test.js` - Updated to ESM, added error utilities integration tests
- `tests/__mocks__/max-api.js` - Updated to ESM imports

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-28 | SM (Sam) | Initial draft created from epics.md, architecture.md, tech-spec-epic-1.md |
| 2025-11-28 | Dev (Amelia) | Implementation complete - all tasks done, 96 tests pass |

---

## Senior Developer Review (AI)

_(To be completed after implementation)_
