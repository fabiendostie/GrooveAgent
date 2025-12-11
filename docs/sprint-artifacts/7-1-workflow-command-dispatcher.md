# Story 7.1: Workflow Command Dispatcher

**Epic:** 7 - Sub-Agent Agentic Workflows
**Status:** Completed
**Completion Date:** 2025-12-11

## Story Summary

Implemented command dispatcher system that routes workflow commands to BMAD workflows for agentic orchestration. Created four new commands (`workflow:research`, `workflow:develop`, `workflow:document`, `swarm:start`) that will trigger multi-agent workflows when the underlying BMAD workflows are implemented in Stories 7.4-7.6.

## Acceptance Criteria Met

- [x] Command routing to BMAD workflow paths implemented
- [x] Four workflow commands supported (research, develop, document, swarm)
- [x] Commands registered in `src/node/index.js`
- [x] Parameter validation for all commands
- [x] Proper error handling with ErrorCode system
- [x] JSDoc documentation for all handlers
- [x] Stub responses indicate future implementation steps

## Implementation Approach

### Architecture Decision

Created a separate command module (`workflow-dispatcher.js`) rather than adding handlers directly to `index.js` to:
1. Maintain separation of concerns
2. Keep workflow-related code isolated
3. Make it easier to add/modify workflows in the future
4. Follow the modular pattern established in the codebase

### Command Registration Pattern

Followed the existing `registerCommand()` pattern from `src/node/index.js`:
- Handlers are async functions that receive params object
- Handlers throw errors with `.code` property for categorization
- Handlers return structured data objects
- All logging uses the existing logger utility

### Stub Implementation Strategy

Since Stories 7.2-7.6 haven't been implemented yet, each handler:
1. Validates required parameters
2. Logs the workflow initiation
3. Returns a structured response indicating:
   - Workflow status (workflow_initiated/swarm_initiated)
   - Workflow path that will be triggered
   - Parameters received
   - Next steps in Epic 7 that will enable full functionality

This allows the command system to be tested now while providing clear visibility into what's coming next.

## Code Changes

### Files Created

- **`src/node/commands/workflow-dispatcher.js`** (289 lines)
  - Four command handlers: `handleWorkflowResearch`, `handleWorkflowDevelop`, `handleWorkflowDocument`, `handleSwarmStart`
  - WORKFLOW_PATHS configuration mapping commands to BMAD workflow files
  - JSDoc type definitions for all parameter structures
  - Parameter validation for required fields
  - TODO comments indicating implementation in Stories 7.4-7.6

### Files Modified

- **`src/node/index.js`** (lines 124-141)
  - Added import of workflow dispatcher handlers
  - Registered 4 new workflow commands using `registerCommand()`
  - Added comments linking to Epic 7 - Story 7.1

## Code Snippets

### Command Handler Example (workflow:research)

```javascript
async function handleWorkflowResearch(params) {
  const { artist_name, llm_provider = 'ollama', intensity = 100 } = params;

  // Validate required parameters
  if (!artist_name) {
    const err = new Error('Missing required parameter: artist_name');
    err.code = ErrorCode.INVALID_PARAMS;
    throw err;
  }

  info('workflow:research', `Initiating groove research for: ${artist_name}`);
  info('workflow:research', `Provider: ${llm_provider}, Intensity: ${intensity}%`);

  // TODO (Story 7.4): Trigger actual BMAD workflow
  // - Load .bmad/custom/workflows/groove-research/workflow.md
  // - Initialize Master Meta-Agent
  // - Pass parameters via context object
  // - Begin step-01-init.md execution

  return {
    status: 'workflow_initiated',
    workflow: 'groove-research',
    workflow_path: WORKFLOW_PATHS.research,
    parameters: { artist_name, llm_provider, intensity },
    message: `Groove research workflow will be triggered in Story 7.4`,
    next_steps: [
      'Story 7.2: Implement TELIS shard auto-loader',
      'Story 7.3: Create BMAD agent definitions',
      'Story 7.4: Implement groove-research workflow'
    ]
  };
}
```

### Command Registration

```javascript
// Import workflow dispatcher (Epic 7 - Story 7.1)
const {
  handleWorkflowResearch,
  handleWorkflowDevelop,
  handleWorkflowDocument,
  handleSwarmStart
} = require('./commands/workflow-dispatcher.js');

// Register workflow commands (Epic 7 - Story 7.1)
registerCommand('workflow:research', handleWorkflowResearch);
registerCommand('workflow:develop', handleWorkflowDevelop);
registerCommand('workflow:document', handleWorkflowDocument);
registerCommand('swarm:start', handleSwarmStart);
```

## Command Reference

### 1. `workflow:research`

**Purpose:** Initiate groove recipe research workflow with LLM orchestration

**Parameters:**
- `artist_name` (string, required) - Artist name for groove research
- `llm_provider` (string, optional, default: 'ollama') - LLM provider to use
- `intensity` (number, optional, default: 100) - Groove intensity (0-200)

**Example:**
```json
{
  "cmd": "workflow:research",
  "id": "req-001",
  "params": {
    "artist_name": "J Dilla",
    "llm_provider": "ollama",
    "intensity": 150
  }
}
```

**Response:**
```json
{
  "id": "req-001",
  "success": true,
  "data": {
    "status": "workflow_initiated",
    "workflow": "groove-research",
    "workflow_path": ".bmad/custom/workflows/groove-research/workflow.md",
    "parameters": {...},
    "message": "Groove research workflow will be triggered in Story 7.4",
    "next_steps": [...]
  }
}
```

### 2. `workflow:develop`

**Purpose:** Initiate code generation workflow with Sub-Agent orchestration

**Parameters:**
- `task_description` (string, required) - Description of code to generate
- `target_modules` (string[], optional, default: []) - Target modules to modify/create
- `quality_threshold` (number, optional, default: 0.90) - Quality threshold (0-1)

**Example:**
```json
{
  "cmd": "workflow:develop",
  "id": "req-002",
  "params": {
    "task_description": "Implement MIDI velocity transformation function",
    "target_modules": ["src/node/midi/velocity.js"],
    "quality_threshold": 0.90
  }
}
```

### 3. `workflow:document`

**Purpose:** Initiate documentation/testing workflow

**Parameters:**
- `target_files` (string[], required) - Files to document (must be non-empty)
- `include_tests` (boolean, optional, default: true) - Whether to generate unit tests

**Example:**
```json
{
  "cmd": "workflow:document",
  "id": "req-003",
  "params": {
    "target_files": ["src/node/commands/workflow-dispatcher.js"],
    "include_tests": true
  }
}
```

### 4. `swarm:start`

**Purpose:** Initiate generic multi-agent orchestration for complex tasks

**Parameters:**
- `task_type` (string, required) - Type of task (research, develop, document, custom)
- `context` (object, optional, default: {}) - Additional context for the swarm

**Example:**
```json
{
  "cmd": "swarm:start",
  "id": "req-004",
  "params": {
    "task_type": "custom",
    "context": {
      "epic": "7",
      "story": "7.5",
      "complexity": "high"
    }
  }
}
```

## Testing

### Manual Testing Performed

1. **Command Registration Verification**
   - Verified `src/node/index.js` syntax is valid
   - Confirmed no module import errors
   - Checked that all 4 handlers are exported from workflow-dispatcher.js

2. **Parameter Validation Testing**
   - Confirmed error thrown for missing `artist_name` in workflow:research
   - Confirmed error thrown for missing `task_description` in workflow:develop
   - Confirmed error thrown for missing `target_files` in workflow:document
   - Confirmed error thrown for missing `task_type` in swarm:start

3. **Error Code Integration**
   - Verified errors use `ErrorCode.INVALID_PARAMS`
   - Confirmed error handling matches existing pattern in `index.js`

### Unit Tests (To Be Created)

Future unit tests should cover:
- **`workflow-dispatcher.test.js`**
  - Parameter validation for all 4 handlers
  - Default value application
  - Error throwing for missing required params
  - Response structure validation
  - WORKFLOW_PATHS constant correctness

## TELIS Shards Used

None for Story 7.1 (command dispatcher only).

TELIS integration will be implemented in **Story 7.2** (TELIS Shard Auto-Loader), which will provide automatic shard loading based on agent roles.

## Integration Points

### Depends On
- **Story 1.5: Error Handling & Logging Foundation** ✅
  - Uses `logger.js` for structured logging
  - Uses `errors.js` for ErrorCode constants

### Enables
- **Story 7.2: TELIS Shard Auto-Loader** (next)
  - Command dispatcher will call TELIS loader to pre-load shards for agents

- **Story 7.4: Groove Research Workflow**
  - `workflow:research` command will trigger this workflow

- **Story 7.5: Code Generation Workflow**
  - `workflow:develop` command will trigger this workflow

- **Story 7.6: Documentation Workflow**
  - `workflow:document` command will trigger this workflow

### Modifies
- **`src/node/index.js`**: Added 4 new command registrations

## Workflow Path Configuration

The WORKFLOW_PATHS constant maps commands to BMAD workflow files:

```javascript
const WORKFLOW_PATHS = {
  research: '.bmad/custom/workflows/groove-research/workflow.md',
  develop: '.bmad/custom/workflows/code-generation/workflow.md',
  document: '.bmad/custom/workflows/documentation/workflow.md',
  swarm: '.bmad/custom/workflows/agent-orchestration/workflow.md'
};
```

These paths will be used in Stories 7.4-7.6 to actually load and execute the BMAD workflows.

## Lessons Learned

### What Worked Well

1. **Modular Command Structure**
   - Separating workflow commands into their own module keeps code organized
   - Easy to add new workflow commands in the future
   - Clear separation between core system commands (ping, apply-groove) and workflow orchestration commands

2. **Stub-First Approach**
   - Implementing command handlers as stubs allows:
     - Early integration with existing command system
     - Clear documentation of what's coming next
     - Testable command registration without full workflow implementation

3. **JSDoc Type Definitions**
   - Defining parameter types upfront provides:
     - Clear API contract for future workflow implementations
     - Better IDE autocomplete/intellisense
     - Documentation at code level

### What Could Be Improved

1. **Testing Coverage**
   - Should create unit tests for parameter validation
   - Should add integration tests for command routing
   - Will add in future story or separate testing task

2. **Error Messages**
   - Could provide more detailed error messages with examples
   - Could suggest correct parameter formats in error responses
   - Will enhance based on user feedback

## Next Steps

### Immediate (Story 7.2)
Implement **TELIS Shard Auto-Loader** (`src/node/utils/telis-loader.js`):
- Create `loadShardsForAgent(agentRole)` function
- Implement SHARD_MAP with role→shard mappings
- Add token counting for budget management
- Integrate with workflow dispatcher to pre-load shards before agent invocation

### Future (Stories 7.3-7.6)
1. **Story 7.3**: Create BMAD agent definitions
2. **Story 7.4**: Implement groove-research workflow (7 step files)
3. **Story 7.5**: Implement code-generation workflow (8 step files)
4. **Story 7.6**: Implement documentation workflow (6 step files)

### Technical Debt
- Add comprehensive unit tests for workflow-dispatcher.js
- Add integration tests for end-to-end command→workflow flow
- Consider adding command validation schema (JSON Schema or similar)

---

**Implementation Time:** ~1 hour
**Lines of Code:** +289 new, +18 modified
**Files Created:** 1
**Files Modified:** 1
