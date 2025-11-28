# System-Level Test Design: GrooveAgent

**Date:** 2025-11-26  
**Author:** Murat (TEA) / Fab  
**Status:** Draft  
**Mode:** System-Level (Phase 3 - Testability Review)

---

## Executive Summary

GrooveAgent is a Max for Live MIDI effect plugin with a **message-passing architecture** between two isolated runtimes: Max/MSP (UI and Ableton integration) and Node.js (LLM communication and MIDI math). This testability assessment evaluates the architecture's suitability for automated testing before the implementation readiness gate.

**Architecture Summary:**
- **Platform:** Max for Live (M4L) embedded in Ableton Live 12+
- **Runtime:** node.script running Node.js 20
- **Communication:** JSON message-passing via max-api
- **LLM Providers:** Ollama (primary/free), Claude, OpenAI, Groq (fallbacks)
- **Processing:** All MIDI transformations local (JavaScript math)

**Gate Recommendation:** ✅ **PASS with RECOMMENDATIONS**

---

## Testability Assessment

### Controllability: ⚠️ CONCERNS

**Evaluation:**
Controllability refers to the ability to control system state for testing.

| Aspect | Status | Details |
|--------|--------|---------|
| **API Seeding** | ⚠️ Limited | No database; settings stored in pattr/JSON files. Can seed via file manipulation. |
| **External Dependencies** | ✅ Good | LLM providers are abstracted via interface pattern (mockable). |
| **Error Injection** | ✅ Good | Message-passing architecture allows injecting error responses. |
| **State Reset** | ⚠️ Limited | M4L device state tied to Ableton session; requires device reload for clean state. |

**Concerns:**
1. **M4L Context Required** — Cannot run full integration tests without Ableton Live running
2. **LiveAPI Dependency** — Clip operations require actual MIDI clips in Ableton
3. **No Headless Mode** — jsui (display screen) cannot be tested headlessly

**Mitigations:**
- Extract all Node.js business logic into pure functions (testable with Jest)
- Mock max-api at module level for Node.js unit/integration tests
- Use API-driven test data setup where possible

### Observability: ✅ PASS

**Evaluation:**
Observability refers to the ability to inspect system state.

| Aspect | Status | Details |
|--------|--------|---------|
| **Logging** | ✅ Good | Standard logging pattern with `[GrooveAgent]` prefix to both Node.js and Max console |
| **Response Format** | ✅ Good | All responses follow structured JSON format with success/error/data fields |
| **Progress Tracking** | ✅ Good | Progress messages with state, percent complete, and descriptive text |
| **Error Categorization** | ✅ Good | Error codes (LLM_TIMEOUT, CLIP_EMPTY, etc.) enable automated categorization |

**Strengths:**
- Message protocol enables transparent debugging (JSON inspectable)
- Error responses include code, message, and suggested fix
- All operations are async with clear completion signals

### Reliability: ✅ PASS

**Evaluation:**
Reliability refers to test isolation and reproducibility.

| Aspect | Status | Details |
|--------|--------|---------|
| **Test Isolation** | ✅ Good | Message-passing architecture naturally isolates Max from Node.js tests |
| **Deterministic Results** | ⚠️ Partial | MIDI math is deterministic; LLM responses are not (requires mocking) |
| **Parallel Safety** | ✅ Good | Node.js tests can run in parallel; M4L device tests serial (one device per session) |
| **Component Coupling** | ✅ Good | Loose coupling via message protocol; providers mockable |

**Concerns:**
1. **LLM Response Variability** — Same prompt may produce different Groove Recipes
2. **Micro-timing Variance** — Variation generation includes intentional randomness

**Mitigations:**
- Mock LLM responses with fixture data for deterministic tests
- Seed random number generator for variation tests

---

## Architecturally Significant Requirements (ASRs)

Risk-scored quality requirements that drive architecture decisions:

| ID | Requirement | Category | Probability | Impact | Score | Mitigation |
|----|-------------|----------|-------------|--------|-------|------------|
| ASR-001 | LLM response must complete in <30 seconds | PERF | 2 | 2 | 4 | Progress animation, timeout handling |
| ASR-002 | MIDI data never leaves device (privacy) | SEC | 1 | 3 | 3 | Verify no MIDI in network requests |
| ASR-003 | API keys stored securely (local only) | SEC | 2 | 3 | 6 | Test key transmission to APIs only |
| ASR-004 | Original clip never modified | DATA | 2 | 3 | 6 | Test clip duplication before transform |
| ASR-005 | Graceful degradation when LLM unavailable | TECH | 3 | 2 | 6 | Error messages, provider fallback |
| ASR-006 | Support 10,000+ notes in clip | PERF | 1 | 2 | 2 | Load testing with large clips |
| ASR-007 | Memory footprint <100MB | PERF | 1 | 1 | 1 | Memory profiling in Node.js |
| ASR-008 | Works offline with Ollama | OPS | 2 | 2 | 4 | Offline testing with local Ollama |

**High-Priority (Score ≥6):**
- **ASR-003**: API key security — Must verify keys only transmitted to respective API endpoints
- **ASR-004**: Data integrity — Must verify original MIDI clip preserved after transformation
- **ASR-005**: Graceful degradation — Must verify clear error messages when no LLM available

---

## Test Levels Strategy

Based on the M4L architecture (desktop plugin with Node.js backend):

### Recommended Split: 60% Unit / 30% Integration / 10% E2E

| Level | Percentage | Rationale | Target Components |
|-------|------------|-----------|-------------------|
| **Unit** | 60% | Core MIDI math is pure functions; fast, deterministic | `midi/timing.js`, `midi/velocity.js`, `midi/articulation.js`, `midi/groove-recipe.js`, `utils/validators.js` |
| **Integration** | 30% | LLM providers, message protocol, config persistence | `llm/*.js`, `index.js` (command router), `utils/config.js`, `clip/operations.js` |
| **E2E** | 10% | Critical user journeys require Ableton Live | Apply Groove flow, First-run onboarding, Settings persistence |

### Technology Recommendations

| Level | Tool | Notes |
|-------|------|-------|
| **Unit** | Jest | Standard Node.js testing; fast, familiar |
| **Integration** | Jest + Mock max-api | Mock the max-api module to test message handling |
| **E2E (Manual)** | Ableton Live + Manual Testing | No headless M4L support; use scripted test checklist |
| **Performance** | Custom Node.js scripts | Benchmark MIDI math with large note arrays |

### Special Testing Considerations

**M4L-Specific Challenges:**
1. **No Playwright/Cypress** — jsui is not a web view; cannot use browser automation
2. **LiveAPI Mocking** — Must mock LiveAPI calls in Node.js tests
3. **Device State** — M4L device state persists; use fresh projects for E2E

**Recommended Approach:**
1. Maximize Node.js test coverage (unit + integration with mocked max-api)
2. Create manual E2E test checklist for Ableton Live testing
3. Automate what can be automated; document what cannot

---

## NFR Testing Approach

### Security (SEC)

| NFR | Approach | Tools |
|-----|----------|-------|
| API keys stored locally only | Integration test: verify no API keys in network traffic | Jest mock + request inspection |
| Keys transmitted to correct endpoints | Integration test: verify HTTPS, correct host | Jest mock assertions |
| MIDI never transmitted | Integration test: verify no MIDI data in LLM prompts | Jest mock + prompt inspection |
| No telemetry | Code review + integration test: no analytics calls | grep/static analysis + Jest |

**Test Examples:**
```javascript
// Test: MIDI data never sent to LLM
test('LLM prompt contains only artist name, not MIDI data', async () => {
  const notes = generateMockNotes(100);
  const mockFetch = jest.fn().mockResolvedValue({ json: () => mockRecipe });
  
  await generateGrooveRecipe('J Dilla', notes);
  
  const prompt = mockFetch.mock.calls[0][1].body;
  expect(prompt).toContain('J Dilla');
  expect(prompt).not.toMatch(/pitch|velocity|duration/i);
});

// Test: API key sent only to correct provider
test('Claude API key sent only to Anthropic endpoint', async () => {
  const mockFetch = jest.fn();
  process.env.CLAUDE_API_KEY = 'test-key';
  
  await claudeProvider.generateGrooveRecipe('J Dilla');
  
  const url = mockFetch.mock.calls[0][0];
  expect(url).toMatch(/api\.anthropic\.com/);
  expect(mockFetch.mock.calls.length).toBe(1);
});
```

### Performance (PERF)

| NFR | Target | Approach | Tools |
|-----|--------|----------|-------|
| LLM response time | <30 seconds | Timeout handling + progress feedback | Jest timers + manual verification |
| MIDI transformation | <500ms for 16 bars | Benchmark with large note arrays | Custom Node.js benchmark script |
| Memory footprint | <100MB | Memory profiling during transformation | Node.js `process.memoryUsage()` |
| UI responsiveness | Non-blocking | Async operations | Manual E2E verification |

**Benchmark Script Example:**
```javascript
// benchmark/midi-transform.js
const { applyGrooveRecipe } = require('../src/node/midi/transformer');

const notes = generateNotes(10000); // 10K notes
const recipe = loadMockRecipe('j-dilla');

console.time('transform-10k-notes');
const result = applyGrooveRecipe(notes, recipe, 100);
console.timeEnd('transform-10k-notes');
// Target: <500ms
```

### Reliability (REL)

| NFR | Approach | Tools |
|-----|----------|-------|
| Graceful LLM timeout | Integration test: mock timeout → verify error message | Jest timers |
| Provider fallback | Integration test: primary fails → fallback succeeds | Jest mocks |
| Original clip preserved | Integration test: verify input array unchanged | Jest deepEqual |
| No crashes on edge cases | Unit tests: empty clips, 10K+ notes, no sources | Jest |

**Test Examples:**
```javascript
// Test: LLM timeout handled gracefully
test('shows timeout error when LLM exceeds 30s', async () => {
  jest.useFakeTimers();
  const slowProvider = {
    generateGrooveRecipe: () => new Promise(() => {}) // Never resolves
  };
  
  const resultPromise = applyGroove('J Dilla', slowProvider);
  jest.advanceTimersByTime(30001);
  
  const result = await resultPromise;
  expect(result.success).toBe(false);
  expect(result.error.code).toBe('LLM_TIMEOUT');
  expect(result.error.suggestion).toContain('Check your connection');
});

// Test: Original clip unchanged
test('transformation does not mutate original notes', () => {
  const original = [
    { pitch: 36, startTime: 0, duration: 0.25, velocity: 100, mute: false }
  ];
  const copy = JSON.parse(JSON.stringify(original));
  
  applyGrooveRecipe(original, mockRecipe, 100);
  
  expect(original).toEqual(copy); // Unchanged
});
```

### Maintainability (MAINT)

| NFR | Target | Approach | Tools |
|-----|--------|----------|-------|
| Test coverage | ≥80% for Node.js code | Coverage report | Jest --coverage |
| Code duplication | <5% | CI check | jscpd |
| Max file length | <300 lines | Linting | ESLint |
| JSDoc documentation | All public functions | Documentation check | TypeDoc or manual review |

---

## Test Environment Requirements

### Local Development

| Component | Requirement |
|-----------|-------------|
| Node.js | v20+ (matches Max 8.6 bundled version) |
| Jest | v29+ |
| Ableton Live | v12+ with Max for Live (for E2E only) |
| Ollama | Local installation (for integration tests with real LLM) |

### CI/CD Pipeline

| Stage | Tests | Environment |
|-------|-------|-------------|
| Commit | Unit tests | Node.js (GitHub Actions) |
| PR | Unit + Integration tests | Node.js + Mock max-api |
| Nightly | Integration + Benchmarks | Node.js + Optional Ollama |
| Release | Full test suite + Manual E2E | Full environment with Ableton |

**Note:** Full E2E testing requires manual verification in Ableton Live. Consider a release checklist for E2E validation.

---

## Testability Concerns (Blockers)

### Concern 1: M4L Device Testing Requires Ableton Live

**Impact:** Cannot fully automate E2E tests without Ableton Live running  
**Risk Level:** MEDIUM  
**Mitigation:**
1. Maximize Node.js coverage (mocked max-api)
2. Create detailed manual E2E test checklist
3. Consider Max-only tests using `maxtest` (limited capability)

### Concern 2: jsui (Display Screen) Not Automatable

**Impact:** Cannot automatically verify display animations, themes, citations  
**Risk Level:** LOW  
**Mitigation:**
1. Unit test display state machine logic
2. Manual visual verification during release
3. Document expected visual states in test checklist

### Concern 3: LiveAPI Clip Operations Not Mockable Without Max

**Impact:** Clip read/write operations require actual Ableton clips  
**Risk Level:** MEDIUM  
**Mitigation:**
1. Mock LiveAPI module in Node.js tests
2. Define clear interface for clip operations
3. Manual E2E verification of clip operations

---

## Recommendations for Sprint 0

### Framework Setup (`*framework` workflow)

1. **Jest Configuration**
   - Configure Jest for Node.js testing
   - Set up module mocking for `max-api`
   - Configure coverage thresholds (80% minimum)

2. **Test Directory Structure**
   ```
   tests/
   ├── unit/
   │   ├── midi/
   │   │   ├── timing.test.js
   │   │   ├── velocity.test.js
   │   │   ├── articulation.test.js
   │   │   └── groove-recipe.test.js
   │   ├── llm/
   │   │   └── provider-abstraction.test.js
   │   └── utils/
   │       └── validators.test.js
   ├── integration/
   │   ├── command-router.test.js
   │   ├── llm-providers.test.js
   │   └── config-persistence.test.js
   ├── fixtures/
   │   ├── mock-notes.js
   │   ├── mock-recipes.js
   │   └── mock-llm-responses.js
   └── e2e/
       └── MANUAL_TEST_CHECKLIST.md
   ```

3. **Mock max-api Module**
   ```javascript
   // tests/__mocks__/max-api.js
   module.exports = {
     addHandler: jest.fn(),
     outlet: jest.fn(),
     post: jest.fn(),
   };
   ```

### CI Pipeline Setup (`*ci` workflow)

1. **GitHub Actions Workflow**
   ```yaml
   name: GrooveAgent Tests
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: '20'
         - run: cd src/node && npm ci
         - run: cd src/node && npm test -- --coverage
         - run: cd src/node && npm run lint
   ```

2. **Coverage Reporting**
   - Enforce 80% coverage for Node.js code
   - Report coverage to PR comments

3. **Linting**
   - ESLint with max file length rule (300 lines)
   - JSDoc validation for public functions

---

## Manual E2E Test Checklist (Release Verification)

Since full E2E automation is not possible, use this checklist for release validation:

### Core Flow Tests

- [ ] **Apply Groove Happy Path**
  1. Load GrooveAgent on MIDI track
  2. Create 8-bar MIDI clip with drum pattern
  3. Enter "J Dilla" as artist
  4. Set 4 variations, 100% intensity
  5. Click Apply Groove
  6. ✓ Progress animation appears
  7. ✓ 4 new clips created in next slots
  8. ✓ Original clip unchanged
  9. ✓ Citations displayed (4+ sources)

- [ ] **Ollama Not Running**
  1. Ensure Ollama is stopped
  2. Select Ollama as provider
  3. Click Apply Groove
  4. ✓ Error: "Ollama not running. Start Ollama or use API key."

- [ ] **Empty Clip**
  1. Select empty MIDI clip
  2. Click Apply Groove
  3. ✓ Error: "Selected clip is empty. Add notes first."

- [ ] **Clip Too Long**
  1. Create 32-bar MIDI clip
  2. Click Apply Groove
  3. ✓ Warning: "Clip too long (max 16 bars)."

### Settings Tests

- [ ] **Settings Persistence**
  1. Set intensity to 150%, variations to 3
  2. Save and close Ableton project
  3. Reopen project
  4. ✓ Settings restored (150%, 3 variations)

- [ ] **API Key Validation**
  1. Enter invalid Claude API key
  2. Click "Test Connection"
  3. ✓ Error: "Invalid API key"

### Display Screen Tests

- [ ] **Theme Adaptation**
  1. Switch Ableton to light theme
  2. ✓ Display screen readable (white text on black)
  3. Switch Ableton to dark theme
  4. ✓ Display screen readable (white text on black)

- [ ] **Animation Quality**
  1. During research phase
  2. ✓ Psychedelic piano roll animation runs smoothly
  3. ✓ Progress bar updates smoothly
  4. ✓ Artist name with pulsing glow visible

---

## Summary

### Testability Assessment

| Category | Status | Notes |
|----------|--------|-------|
| **Controllability** | ⚠️ CONCERNS | M4L context required; mitigate with mocks |
| **Observability** | ✅ PASS | Strong logging, structured responses |
| **Reliability** | ✅ PASS | Loose coupling, mockable providers |

### Gate Recommendation

**Decision:** ✅ **PASS with RECOMMENDATIONS**

**Rationale:**
- Core Node.js logic is highly testable (pure functions, mockable dependencies)
- Message-passing architecture enables isolated testing
- M4L-specific concerns are documented with mitigations
- Security requirements (SEC) are testable via mocking
- Performance requirements (PERF) are measurable via benchmarks

**Conditions for Implementation:**
1. Implement mock max-api module before Story 1.3
2. Create Jest test infrastructure in Story 1.1
3. Document manual E2E test checklist before Sprint 1 completion
4. Ensure all LLM providers are abstracted via interface (testability requirement)

---

## Next Steps

1. ✅ System-level testability reviewed — **Proceed to implementation readiness gate**
2. During Sprint 0: Run `*framework` workflow to scaffold test infrastructure
3. During Sprint 0: Run `*ci` workflow to configure CI/CD pipeline
4. After Epic 2 completion: Run `*atdd` workflow to generate failing tests
5. Before release: Complete manual E2E test checklist

---

**Generated by:** TEA Agent (Murat) - Test Architect Module  
**Workflow:** `.bmad/bmm/workflows/testarch/test-design`  
**Version:** 4.0 (BMad v6)

