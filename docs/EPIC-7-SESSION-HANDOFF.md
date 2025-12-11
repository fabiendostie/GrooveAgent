# Epic 7 - Session Handoff Document

> **Quick-start context for continuing Epic 7 implementation**
> Copy/paste this into new Claude Code sessions to resume work efficiently

---

## Current Status

**Epic:** 7 - Sub-Agent Agentic Workflows (META-EPIC)
**Current Story:** 7.2 - TELIS Shard Auto-Loader
**Last Commit:** `e0e6f74` - Story 7.1 complete

### Progress Tracker

```
Epic 7: Sub-Agent Agentic Workflows
├─ Story 7.1: Workflow Command Dispatcher ✅ DONE
├─ Story 7.2: TELIS Shard Auto-Loader    🚧 NEXT
├─ Story 7.3: BMAD Agent Definitions     ⏳
├─ Story 7.4: Groove Research Workflow   ⏳
├─ Story 7.5: Code Generation Workflow   ⏳
├─ Story 7.6: Documentation Workflow     ⏳
├─ Story 7.7: Sprint Artifact Auto-Update ⏳
└─ Story 7.8: Progress Dashboard         ⏳
```

---

## What to Tell the Agent

### Option A: Minimal Context (Recommended)

Paste this at the start of your session:

```
Continue implementing Epic 7 (Sub-Agent Agentic Workflows).

Story 7.1 is complete and committed (e0e6f74).
Next task: Story 7.2 - TELIS Shard Auto-Loader

Implementation plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
Sprint status: docs/sprint-artifacts/sprint-status.yaml

Please implement Story 7.2 following the plan.
```

### Option B: Detailed Context

If you want the agent to understand the full context:

```
# Epic 7 Implementation - Session Context

## Current State
- Epic: 7 - Sub-Agent Agentic Workflows (META-EPIC)
- Last completed: Story 7.1 - Workflow Command Dispatcher (commit e0e6f74)
- Next task: Story 7.2 - TELIS Shard Auto-Loader

## What Was Done (Story 7.1)
- Created: src/node/commands/workflow-dispatcher.js (4 command handlers)
- Modified: src/node/index.js (registered workflow commands)
- Created: docs/sprint-artifacts/7-1-workflow-command-dispatcher.md
- Updated: docs/sprint-artifacts/sprint-status.yaml (marked 7-1 as done)

## What to Do Next (Story 7.2)

Create src/node/utils/telis-loader.js with:
- loadShardsForAgent(agentRole) function
- SHARD_MAP constant (role → shard mappings)
- Token counting for budget management
- Shard rotation (unload old, load new)

Follow the plan at: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md

## Key Resources
- Implementation plan: .claude/plans/cozy-mixing-lerdorf.md
- User guide: docs/USER-GUIDE-AGENTIC-WORKFLOWS.md
- TELIS shards: docs/context/*-shards.md
- Sprint status: docs/sprint-artifacts/sprint-status.yaml
- Epics: docs/epics.md
```

---

## Essential Files for Context

When starting a new session, the agent should read these files (in order):

### 1. Sprint Status (100 tokens)
**File:** `docs/sprint-artifacts/sprint-status.yaml`
**Why:** Shows current state of all stories

### 2. Implementation Plan (9,400 tokens)
**File:** `C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md`
**Why:** Contains Story 7.2 spec and acceptance criteria

### 3. Story 7.1 Artifact (3,800 tokens)
**File:** `docs/sprint-artifacts/7-1-workflow-command-dispatcher.md`
**Why:** Context on what was just completed

### 4. TELIS Shards Overview (600 tokens)
**File:** `docs/Token-Efficient_Language_Intelligence_System_TELIS.md`
**Why:** Understanding TELIS methodology

### 5. Existing Code Patterns (2,700 tokens)
**Files:**
- `src/node/index.js` (understand command registration)
- `src/node/utils/logger.js` (logging pattern)
- `src/node/utils/errors.js` (error handling)

**Total Context Load:** ~16,600 tokens (8.3% of budget)

---

## Quick Commands for Starting Agent

### Read Essential Context

```javascript
// Agent should run these in parallel:
Read("docs/sprint-artifacts/sprint-status.yaml")
Read("C:\\Users\\lefab\\.claude\\plans\\cozy-mixing-lerdorf.md")
Read("docs/sprint-artifacts/7-1-workflow-command-dispatcher.md")
```

### Or Use Task Tool

```javascript
// Launch an agent that automatically loads context:
Task({
  subagent_type: "general-purpose",
  prompt: "Read the Epic 7 plan at C:\\Users\\lefab\\.claude\\plans\\cozy-mixing-lerdorf.md and implement Story 7.2: TELIS Shard Auto-Loader following the acceptance criteria"
})
```

---

## Story 7.2 Quick Reference

### Acceptance Criteria

**Given** an agent with role 'llm-research-expert'
**When** the agent is invoked
**Then** `llm-shards.md` and `midi-math.md` are automatically loaded

**And** the shard loader provides:
- Token counting for budget management
- Shard rotation (unload previous, load next)
- Symbolic compression support
- Role-to-shard mapping

### Files to Create

1. **src/node/utils/telis-loader.js** (~200 lines)
   - `loadShardsForAgent(agentRole)` function
   - `SHARD_MAP` constant
   - Token counting utilities
   - Shard rotation logic

2. **docs/sprint-artifacts/7-2-telis-shard-auto-loader.md** (~400 lines)
   - Story documentation
   - Implementation approach
   - Code examples
   - Testing notes

### Files to Modify

1. **docs/sprint-artifacts/sprint-status.yaml**
   - Mark 7-2 as "in-progress" then "done"

### SHARD_MAP Structure

```javascript
const SHARD_MAP = {
  'llm-research-expert': ['llm-shards.md', 'midi-math.md'],
  'midi-expert': ['midi-math.md', 'liveapi-shards.md'],
  'code-expert': ['m4l-shards.md', 'llm-shards.md', 'liveapi-shards.md'],
  'verification-agent': ['midi-math.md', 'm4l-shards.md'],
  'validation-agent': ['*']  // All shards (selective)
};
```

### Shard Locations

```
docs/context/
├── m4l-shards.md          (~800 tokens)
├── liveapi-shards.md      (~720 tokens)
├── llm-shards.md          (~680 tokens)
├── midi-math.md           (~600 tokens)
├── jsui-shards.md         (~400 tokens)
├── live-ui-shards.md      (~380 tokens)
└── max-objects-shards.md  (~220 tokens)
```

---

## Common Session Starters

### Scenario 1: Continue from Story 7.2

```
I'm continuing Epic 7 implementation. Story 7.1 is complete (commit e0e6f74).

Next: Implement Story 7.2 - TELIS Shard Auto-Loader

Please:
1. Read the plan at C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
2. Read docs/sprint-artifacts/sprint-status.yaml
3. Create src/node/utils/telis-loader.js following the acceptance criteria
4. Document in docs/sprint-artifacts/7-2-telis-shard-auto-loader.md
5. Update sprint-status.yaml
6. Commit when done
```

### Scenario 2: Resume After Interruption

```
Resuming Epic 7 Story 7.2 implementation.

Context:
- Plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
- Status: docs/sprint-artifacts/sprint-status.yaml

Check sprint-status.yaml to see if 7.2 is in-progress or done.
If in-progress, read what's been created and continue.
If done, proceed to Story 7.3.
```

### Scenario 3: Debug/Fix Story 7.2

```
Story 7.2 has issues that need fixing.

Problem: [describe the issue]

Files involved:
- src/node/utils/telis-loader.js
- docs/sprint-artifacts/7-2-telis-shard-auto-loader.md

Please debug and fix following the plan at C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
```

---

## Token Budget Strategy

For efficient sessions, use this loading strategy:

### First Message (16,600 tokens)
```
Read in parallel:
- sprint-status.yaml         (100 tokens)
- plan file                  (9,400 tokens)
- story 7.1 artifact         (3,800 tokens)
- TELIS methodology          (600 tokens)
- existing utils files       (2,700 tokens)
```

### As Needed (~5,000 tokens)
```
Read when implementing:
- Individual TELIS shards    (220-800 tokens each)
- Code examples from story 7.1
- Error handling patterns
```

### Total Context: ~21,600 tokens (10.8% of 200K budget)

**Remaining Budget:** ~178,400 tokens for implementation

---

## Files You Don't Need to Mention

The agent can discover these automatically:

❌ Don't reference:
- `CLAUDE.md` (automatically loaded)
- `.cursorrules` (automatically loaded)
- `README.md` (not needed for implementation)
- `package.json` (can be discovered)
- User guide (reference only, not for implementation)

✅ Do reference:
- Plan file (cozy-mixing-lerdorf.md)
- Sprint status (sprint-status.yaml)
- Story artifacts (7-X-*.md)

---

## Example: Perfect Session Start

**YOU:** (Paste this)

```
Continue Epic 7 implementation.

Story 7.1 ✅ Done (commit e0e6f74)
Story 7.2 🚧 Next

Task: Implement TELIS Shard Auto-Loader

Plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
Status: docs/sprint-artifacts/sprint-status.yaml

Follow the Story 7.2 acceptance criteria in the plan.
```

**AGENT:** (Will respond with)

```
I'll implement Story 7.2: TELIS Shard Auto-Loader.

Let me start by reading the context:
[Reads plan file, sprint status, story 7.1 artifact]

Creating todo list for Story 7.2:
1. Create src/node/utils/telis-loader.js
2. Implement loadShardsForAgent() function
3. Create SHARD_MAP constant
4. Add token counting
5. Implement shard rotation
6. Create story artifact documentation
7. Update sprint-status.yaml
8. Commit changes

[Begins implementation...]
```

---

## Advanced: Using Task Tool with Resume

If you want to resume the exact planning session:

```
I want to resume the Epic 7 planning session.

Please use the Task tool with:
- subagent_type: "Plan"
- resume: "cozy-mixing-lerdorf"
- prompt: "Show me the current plan status and next steps"
```

**Note:** This loads the plan in "plan mode" which is different from normal implementation mode.

---

## Troubleshooting

### Issue: Agent doesn't know where to start

**Solution:** Be explicit about the current story:
```
Implement Story 7.2 (TELIS Shard Auto-Loader).
Story 7.1 is complete.
Plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
```

### Issue: Agent asks too many questions

**Solution:** Point to the plan:
```
All specs are in the plan file. Follow Story 7.2 acceptance criteria exactly.
Plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
```

### Issue: Agent loads too much context

**Solution:** Be specific about what to read:
```
Only read:
1. C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md (Story 7.2 section)
2. docs/sprint-artifacts/sprint-status.yaml

Then implement Story 7.2.
```

### Issue: Agent doesn't follow the plan

**Solution:** Emphasize the plan:
```
IMPORTANT: Follow the implementation plan EXACTLY.
Plan location: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
Story: 7.2 - TELIS Shard Auto-Loader
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-11 | Initial handoff document for Story 7.2 |

---

## Quick Reference Card

**Copy/Paste This:**

```
Epic 7 Story 7.2 - TELIS Shard Auto-Loader

Status: Story 7.1 ✅ | Story 7.2 🚧 NEXT

Files:
- Plan: C:\Users\lefab\.claude\plans\cozy-mixing-lerdorf.md
- Status: docs/sprint-artifacts/sprint-status.yaml

Task: Create src/node/utils/telis-loader.js
Follow Story 7.2 acceptance criteria in plan.
```

---

**Last Updated:** 2025-12-11
**Next Update:** After Story 7.2 completion
