# Story 1.4: Basic Max for Live Device Shell

**Status:** done

---

## Story

As a **developer**,  
I want **a minimal M4L device with node.script connected**,  
So that **I can test the message bridge in Ableton Live**.

---

## Acceptance Criteria

| # | Criterion | Given/When/Then |
|---|-----------|-----------------|
| AC1 | Device loads without error | **Given** Ableton Live 12+ with Max for Live, **When** I open `src/max/GrooveAgent.amxd`, **Then** the device loads without errors in Max console |
| AC2 | node.script auto-starts | **Given** the device is loaded, **When** Max initializes, **Then** "[GrooveAgent] Ready" appears in Max console automatically |
| AC3 | Ping test button works | **Given** node.script is running, **When** I click the test button, **Then** a successful ping response appears in Max console |
| AC4 | Device saves as .amxd | **Given** the device is complete, **When** I save the file, **Then** it saves as a Max for Live MIDI Effect (.amxd extension) |

---

## Tasks / Subtasks

### Task 1: Create M4L Device File (AC: 1, 4)

- [x] **1.1** Create new Max for Live MIDI Effect device in Max/MSP:
  - Open Max/MSP
  - File → New → Max for Live MIDI Effect
  - Save as `src/max/GrooveAgent.amxd`
- [x] **1.2** Configure device basic structure:
  - Add appropriate comments/documentation in Max patch
  - Set up basic inlet/outlet configuration for MIDI pass-through
  - Ensure device has proper MIDI Effect routing

### Task 2: Add and Configure node.script (AC: 1, 2)

- [x] **2.1** Add `node.script` object to Max patch:
  - Create node.script object
  - Set `@file` attribute to `../node/index.js` (relative path)
  - Set `@autostart 1` to auto-start Node.js on device load
- [x] **2.2** Configure node.script outlets:
  - First outlet for JSON responses
  - Set up routing for console messages
- [x] **2.3** Verify startup notification:
  - Confirm "[GrooveAgent] Ready" appears in Max console on load
  - Check Node.js version logged for debugging

### Task 3: Implement Ping Test Button (AC: 3)

- [x] **3.1** Add test button using `live.text`:
  - Create `live.text` object in button mode
  - Label: "Ping Test" or similar
  - Style appropriately for M4L device
- [x] **3.2** Configure message formatting:
  - Add `prepend cmd` object or equivalent to format JSON
  - Create message: `{"cmd": "ping", "id": "test-1"}`
  - Connect to node.script input
- [x] **3.3** Handle ping response:
  - Add `route` object to parse node.script output
  - Route `success` responses to Max console display
  - Display "pong received" or equivalent confirmation
- [x] **3.4** Add visual feedback:
  - Button should indicate click registered
  - Response should be visible in Max console

### Task 4: Test and Validation (AC: 1, 2, 3, 4)

- [x] **4.1** Test device loading:
  - Close and reopen device in Ableton Live
  - Verify no error messages in Max console
  - Confirm device appears in MIDI Effect rack
- [x] **4.2** Test auto-start functionality:
  - Load fresh instance of device
  - Confirm "[GrooveAgent] Ready" appears without manual intervention
  - Verify timing (should appear within 2 seconds)
- [x] **4.3** Test ping roundtrip:
  - Click ping test button
  - Verify response received
  - Confirm request ID matches in response
- [x] **4.4** Verify file format:
  - Save device
  - Confirm .amxd extension
  - Confirm device can be reloaded after save

---

## Dev Notes

### Architecture Patterns & Constraints

**M4L Device Setup (from architecture.md):**

1. Open Max/MSP
2. Create new Max for Live MIDI Effect
3. Save as `src/max/GrooveAgent.amxd`
4. Add `node.script @file ../node/index.js @autostart 1`
5. Connect UI objects to node.script

**node.script Configuration:**

```max
[node.script @file ../node/index.js @autostart 1]
```

**Ping Test Flow (from tech-spec-epic-1.md):**

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

**Message Protocol:**

All messages between Max and Node.js use JSON format:
```javascript
// Request
{ "cmd": "ping", "id": "test-1" }

// Response
{ "id": "test-1", "success": true, "data": { "pong": true } }
```

### Project Structure Notes

**File Locations:**
- Device: `src/max/GrooveAgent.amxd` (this story creates this file)
- Node.js entry: `src/node/index.js` (created in Story 1.1, enhanced in 1.3)
- Relative path from Max to Node: `../node/index.js`

**Directory Context:**
```
src/
├── node/
│   ├── index.js          ← Node.js entry point (already exists)
│   └── utils/
│       └── logger.js     ← Logging utility (already exists)
└── max/
    └── GrooveAgent.amxd  ← CREATE THIS FILE
```

### Learnings from Previous Story

**From Story 1-3-max-node-message-bridge (Status: done)**

- **Command Handler Ready**: `handleCommand()` in `src/node/index.js` is fully implemented and tested
- **Ping Command Works**: Returns `{pong: true}` with preserved request ID
- **Logger Available**: `src/node/utils/logger.js` exports `log()` with Level enum
- **Testing Patterns**: 65 tests passing including max-api mocks at `tests/__mocks__/max-api.js`
- **Startup Notification**: Node.js calls `maxApi.post('[GrooveAgent] Ready')` on module load

**Files from Previous Story:**
- `src/node/index.js` - Command router with ping, error handling
- `src/node/utils/logger.js` - Logging with `[GrooveAgent]` prefix
- `tests/index.test.js` - Unit tests for command handler
- `tests/__mocks__/max-api.js` - Mock for max-api

**Key Integration Point:**
The `handleCommand()` function expects messages in this format:
```javascript
{ cmd: string, id: string, params?: object }
```

And returns:
```javascript
{ id: string, success: boolean, data?: object, error?: object }
```

[Source: docs/sprint-artifacts/1-3-max-node-message-bridge.md#Dev-Agent-Record]

### Non-Functional Requirements

| Metric | Target | From Tech Spec |
|--------|--------|----------------|
| node.script Startup | < 2 seconds | Time from device load to "Ready" |
| Ping Response | < 50ms | Round-trip time |
| Device Load | No errors | Clean load in Max console |

### Testing Strategy

**Manual Testing in Max (Primary):**
- Device Load: Open `GrooveAgent.amxd` in Ableton, check for errors
- Ping Roundtrip: Click button, verify response in console
- Console Output: Verify logs appear with `[GrooveAgent]` prefix

**Integration Test Sequence:**
1. Load device in Ableton Live 12+
2. Wait for "[GrooveAgent] Ready" message
3. Click Ping Test button
4. Verify response in Max console
5. Save device, close, reopen, repeat

### Max Object Reference

| Object | Purpose | Configuration |
|--------|---------|---------------|
| `node.script` | Node.js runtime | `@file ../node/index.js @autostart 1` |
| `live.text` | UI button | Button mode for ping test |
| `prepend` | Message formatting | Create JSON message |
| `route` | Response parsing | Route success/error |
| `print` | Console output | Display results |

### References

- [Source: docs/epics.md#Story-1.4] — Full story definition and acceptance criteria
- [Source: docs/sprint-artifacts/tech-spec-epic-1.md#Story-1.4] — Technical specification with AC table
- [Source: docs/architecture.md#M4L-Device-Setup] — Device creation instructions
- [Source: docs/architecture.md#Pattern-2] — Max ↔ Node Message Protocol
- [Source: docs/context/m4l-shards.md#node-script-Object] — node.script configuration reference
- [Source: docs/sprint-artifacts/1-3-max-node-message-bridge.md] — Previous story context

---

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/1-4-basic-max-for-live-device-shell.context.xml`

### Agent Model Used

Claude Opus 4.5 (via Cursor IDE)

### Debug Log References

**2025-11-27 - Dev Agent Implementation Plan:**

**Nature of Task:** This story requires manual creation of a Max for Live device in Max/MSP's visual programming environment. The `.amxd` format cannot be generated programmatically - it must be created in Max/MSP and saved from there.

**Implementation Approach:**
1. Provide step-by-step instructions for creating the device in Max/MSP
2. Document exact object placement and connections
3. Specify all attribute settings for node.script and UI objects
4. User (Fab) will create the device following these instructions
5. Testing will be performed manually in Ableton Live

**Objects Required:**
- `node.script` - Node.js runtime (@file ../node/index.js @autostart 1)
- `live.text` - Ping test button (@mode 1)
- `prepend` - Message formatting for JSON
- `message` - JSON command structure
- `route` - Response routing (success/error)
- `print` - Console output for debugging
- MIDI routing objects for pass-through

### Completion Notes List

**2025-11-27 - Dev Agent Implementation:**

✅ **Created `src/max/GrooveAgent.maxpat`** - A valid Max patch file (JSON format) containing:
- `node.script` object configured with `@file ../node/index.js @autostart 1`
- `live.text` button labeled "Ping Test"
- `message` object with ping JSON command
- `prepend cmd` for message formatting
- `route success error` for response routing
- `print GrooveAgent` for console output
- `midiin` and `midiout` for MIDI pass-through
- Comments documenting the patch purpose

✅ **Created `docs/sprint-artifacts/1-4-max-patch-guide.md`** - Comprehensive guide with:
- Step-by-step instructions for device creation
- Visual layout reference diagram
- Verification checklist for all ACs
- Troubleshooting section

**⚠️ User Action Required:**
The `.maxpat` file is a Max patch (JSON format). To complete this story:
1. Open `src/max/GrooveAgent.maxpat` in Max/MSP
2. File → Save As → Save as `GrooveAgent.amxd` (Max for Live Device format)
3. Test in Ableton Live per AC verification checklist

### File List

**New Files:**
- `src/max/GrooveAgent.maxpat` - Max patch (JSON) with device structure
- `docs/sprint-artifacts/1-4-max-patch-guide.md` - Device creation guide

**Created:**
- `src/max/GrooveAgent.amxd` - Max for Live MIDI Effect device
- `src/max/package.json` - CommonJS config (fixes ESM conflict with root package.json)

**Existing Files (Unchanged):**
- `src/node/index.js` - Node.js entry point (Story 1-3)
- `src/node/utils/logger.js` - Logging utility (Story 1-3)

---

## Change Log

| Date | Author | Change |
|------|--------|--------|
| 2025-11-27 | Dev (Amelia) | Initial draft created from epics.md, architecture.md, tech-spec-epic-1.md |
| 2025-11-27 | Dev Agent | Created GrooveAgent.maxpat with node.script, ping button, MIDI routing |
| 2025-11-27 | Dev Agent | Created 1-4-max-patch-guide.md with step-by-step instructions |
| 2025-11-27 | Dev Agent + Fab | Fixed ESM/CommonJS issue - added package.json to src/max/ |
| 2025-11-27 | Dev Agent + Fab | All ACs verified - device loads, auto-starts, ping works, saves as .amxd |
| 2025-11-27 | Senior Dev Review | Review completed - APPROVED |

---

## Senior Developer Review (AI)

**Reviewer:** Fab  
**Date:** 2025-11-27  
**Outcome:** ✅ APPROVE  

### Summary

Story 1-4 successfully delivers a working Max for Live device with Node.js integration. All 4 acceptance criteria are met. The implementation required several adaptations from the original design due to Max/Node.js integration challenges, but these were necessary and well-documented.

### Acceptance Criteria Coverage

| AC# | Description | Status | Evidence |
|-----|-------------|--------|----------|
| AC1 | Device loads without error | ✅ IMPLEMENTED | `src/max/GrooveAgent.amxd` loads cleanly |
| AC2 | node.script auto-starts | ✅ IMPLEMENTED | `grooveagent.js:26` posts Ready message |
| AC3 | Ping test button works | ✅ IMPLEMENTED | `grooveagent.js:13-24` handles ping |
| AC4 | Device saves as .amxd | ✅ IMPLEMENTED | File exists at `src/max/GrooveAgent.amxd` |

**Summary: 4 of 4 acceptance criteria fully implemented**

### Task Completion Validation

| Task | Marked | Verified | Evidence |
|------|--------|----------|----------|
| 1.1 Create M4L device | [x] | ✅ | `GrooveAgent.amxd` exists |
| 1.2 Configure structure | [x] | ✅ | MIDI pass-through works |
| 2.1 Add node.script | [x] | ✅ | @autostart 1 configured |
| 2.2 Configure outlets | [x] | ✅ | max.outlet() used |
| 2.3 Startup notification | [x] | ✅ | Ready message appears |
| 3.1 Add live.text button | [x] | ✅ | Ping Test button works |
| 3.2 Message formatting | [x] | ⚠️ | Simplified (Max atoms) |
| 3.3 Handle response | [x] | ⚠️ | Simplified format |
| 3.4 Visual feedback | [x] | ✅ | Console output works |
| 4.1-4.4 Testing | [x] | ✅ | All tests passed |

**Summary: 14/14 tasks verified (2 with acceptable deviations)**

### Key Findings

**MEDIUM - Entry Point Location Changed:**
- Script moved to `src/max/grooveagent.js` (same folder as .amxd)
- Required due to Max path resolution behavior
- Acceptable deviation - functionality works correctly

**LOW - ESM/CommonJS Fix:**
- Added `src/max/package.json` with `"type": "commonjs"`
- Required because root package.json uses ESM
- Important lesson for future M4L development

### Action Items

**Advisory Notes (no code changes required):**
- Note: Document that node.script files should be in same folder as .amxd
- Note: Update CLAUDE.md with ESM/CommonJS requirement for M4L

### Recommendation

**✅ APPROVE** - All acceptance criteria met. Story is complete and ready to move to done.

