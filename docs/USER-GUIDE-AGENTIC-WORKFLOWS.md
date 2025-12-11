# GrooveAgent Agentic Workflow System - User Guide

> **🚀 Sub-Agent + BMAD + TELIS Integration**
> Multi-Agent Orchestration for Development, Documentation, and Research

**Version:** 1.0
**Last Updated:** 2025-12-11
**Epic:** 7 - Sub-Agent Agentic Workflows (META-EPIC)

---

## Table of Contents

1. [What Is This?](#what-is-this)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [Workflow Commands](#workflow-commands)
5. [Practical Examples](#practical-examples)
6. [How It Works](#how-it-works)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Usage](#advanced-usage)
9. [FAQs](#faqs)

---

## What Is This?

The GrooveAgent Agentic Workflow System is an **AI-powered development acceleration toolkit** that orchestrates specialized AI agents to handle complex tasks like:

- 🔬 **Groove Recipe Research** - LLM-powered drumming style analysis with 4-source validation
- 💻 **Code Generation** - Multi-agent development with quality assurance loops
- 📚 **Documentation** - Auto-generate JSDoc comments, README sections, and unit tests

### The Three Pillars

```
┌─────────────────────────────────────────────────────────────────┐
│                  GrooveAgent Agentic System                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣  SUB-AGENT ARCHITECTURE     Multi-agent orchestration      │
│     • Master Meta-Agent          (coordination)                │
│     • Task Orchestrator          (planning)                    │
│     • Specialized Experts        (execution)                   │
│     • Verification Loop          (quality assurance)           │
│     • Main Validation            (final approval)              │
│                                                                 │
│  2️⃣  BMAD WORKFLOWS             Step-by-step execution        │
│     • Sequential step files      (clear progression)           │
│     • Frontmatter state          (progress tracking)           │
│     • Menu-driven collaboration  (user control)                │
│     • JIT loading                (memory efficient)            │
│                                                                 │
│  3️⃣  TELIS KNOWLEDGE SHARDS     Token-efficient context       │
│     • Domain-specific shards     (7 knowledge files)           │
│     • Auto-loading by role       (smart context)               │
│     • Symbolic compression       (@midi.swing)                 │
│     • 95%+ token reduction       (500 vs 50,000 tokens)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Why Use This?

**Before Epic 7:**
- Manual LLM research with inconsistent results
- No quality assurance for generated code
- Token bloat from loading full codebase
- No systematic documentation workflow

**After Epic 7:**
- 🎯 **4-source validation** ensures accurate groove recipes
- ✅ **Verification loops** guarantee quality (0.85-0.90 thresholds)
- ⚡ **95% token reduction** via TELIS shards
- 🤖 **Parallel agent execution** accelerates development
- 📖 **Auto-documentation** keeps docs synchronized

---

## Quick Start

### Prerequisites

1. ✅ Epic 1 Complete (Foundation & TELIS Setup)
2. ✅ Story 7.1 Complete (Workflow Command Dispatcher)
3. ⏳ Story 7.2+ (In Progress - TELIS Loader, Agents, Workflows)

### Your First Workflow (5 Minutes)

Once Epic 7 is fully implemented, you'll be able to:

```javascript
// 1. Research a drumming style (workflow:research)
{
  "cmd": "workflow:research",
  "id": "req-001",
  "params": {
    "artist_name": "J Dilla",
    "llm_provider": "ollama",
    "intensity": 100
  }
}

// 2. Generate code (workflow:develop)
{
  "cmd": "workflow:develop",
  "id": "req-002",
  "params": {
    "task_description": "Add swing transformation to MIDI notes",
    "target_modules": ["src/node/midi/timing.js"],
    "quality_threshold": 0.90
  }
}

// 3. Create documentation (workflow:document)
{
  "cmd": "workflow:document",
  "id": "req-003",
  "params": {
    "target_files": ["src/node/midi/timing.js"],
    "include_tests": true
  }
}
```

---

## Core Concepts

### 1. Sub-Agent Architecture

The system orchestrates **6 types of agents** working together:

| Agent Type | Role | Responsibilities |
|------------|------|------------------|
| **User** | Initiator | Sends commands, reviews outputs |
| **Master Meta-Agent** | Coordinator | Routes tasks to workflows |
| **Orchestrator** | Planner | Decomposes tasks, assigns sub-agents |
| **Specialized Sub-Agents** | Executors | Domain experts (LLM, MIDI, Code) |
| **Verification Loop** | QA | Iterative quality checks (max 3 loops) |
| **Main Validation** | Approver | Final quality gate before delivery |

**Flow Example:**

```
User → Master Meta-Agent → Task Orchestrator
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              LLM Expert            MIDI Expert
                    ↓                   ↓
              Verification Loop ←───────┘
                    ↓
              Main Validation
                    ↓
                  OUTPUT
```

### 2. BMAD Workflows

**BMAD** = **B**lueprint for **M**ulti-**A**gent **D**evelopment

Each workflow consists of:

- **Step Files** - Individual markdown files (`step-01-init.md`, `step-02-assign.md`, etc.)
- **Frontmatter State** - YAML metadata tracking progress
- **Sequential Execution** - Steps run in order, never skipped
- **Menu-Driven** - User approves before proceeding (`[C]ontinue`, `[E]dit`, `[A]bort`)

**Example Workflow Structure:**

```
.bmad/custom/workflows/groove-research/
├── workflow.md              # Workflow metadata
├── step-01-init.md          # Initialize context
├── step-02-assign.md        # Assign LLM Research Expert
├── step-03-llm-query.md     # Execute research
├── step-04-verification.md  # Quality check
├── step-05-recipe.md        # Generate JSON recipe
├── step-06-validation.md    # Final approval
└── step-07-deliver.md       # Return to Master
```

**Frontmatter Example:**

```yaml
---
workflow: groove-research
status: in_progress
currentStep: step-04-verification
stepsCompleted: ['step-01-init', 'step-02-assign', 'step-03-llm-query']

agents:
  llm_research_expert:
    status: completed
    confidence: 0.87
    sources_found: 4
  verification_agent:
    status: in_progress
    iteration: 1
    quality_score: 0.82

artist_name: "J Dilla"
llm_provider: "ollama"
---
```

### 3. TELIS Knowledge Shards

**TELIS** = **T**oken-**E**fficient **L**anguage **I**ntelligence **S**ystem

Instead of loading the entire codebase (50,000+ tokens), TELIS loads **only relevant knowledge shards**:

| Shard File | Size | Content | When Used |
|------------|------|---------|-----------|
| `m4l-shards.md` | ~800 tokens | node.script, js, Max patterns | Code generation |
| `liveapi-shards.md` | ~720 tokens | Live Object Model, clip ops | MIDI operations |
| `llm-shards.md` | ~680 tokens | LLM provider APIs | Recipe research |
| `midi-math.md` | ~600 tokens | Transformation formulas | Groove application |
| `jsui-shards.md` | ~400 tokens | mgraphics, display rendering | UI development |
| `live-ui-shards.md` | ~380 tokens | live.text, live.menu, live.dial | UI controls |
| `max-objects-shards.md` | ~220 tokens | route, pack, sel routing | Max patching |

**Auto-Loading by Role:**

```javascript
// When LLM Research Expert is invoked:
// → Auto-loads: llm-shards.md + midi-math.md (~1,280 tokens)

// When MIDI Expert is invoked:
// → Auto-loads: midi-math.md + liveapi-shards.md (~1,320 tokens)

// When Code Expert is invoked:
// → Auto-loads: m4l-shards.md + llm-shards.md + liveapi-shards.md (~2,200 tokens)
```

**Symbolic Compression:**

Instead of repeating full code blocks, use shorthand:

```javascript
// Before (100+ tokens):
const maxApi = require('max-api');
maxApi.addHandler('cmd', (message) => { ... });
maxApi.outlet(response);

// After (5 tokens):
@m4l.node-script.handler
```

---

## Workflow Commands

### Command 1: `workflow:research`

**Purpose:** Research a drumming style and generate a validated Groove Recipe

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `artist_name` | string | ✅ Yes | - | Artist/producer to research |
| `llm_provider` | string | ❌ No | `'ollama'` | LLM to use (ollama, claude, openai, groq) |
| `intensity` | number | ❌ No | `100` | Groove intensity (0-200%) |

**Example:**

```json
{
  "cmd": "workflow:research",
  "id": "req-groove-001",
  "params": {
    "artist_name": "Questlove",
    "llm_provider": "ollama",
    "intensity": 120
  }
}
```

**Response:**

```json
{
  "id": "req-groove-001",
  "success": true,
  "data": {
    "status": "workflow_completed",
    "workflow": "groove-research",
    "recipe": {
      "artist": "Questlove",
      "sources": [
        "https://drummerworld.com/questlove.html",
        "https://musicradar.com/questlove-interview",
        "https://academic.source/questlove-drumming-analysis.pdf",
        "https://youtube.com/questlove-masterclass"
      ],
      "confidence": 0.89,
      "timing": {
        "swing_ratio": 0.58,
        "push_pull_ms": [-8, 3, -12, 5],
        "micro_timing_variance": 10
      },
      "velocity": {
        "curve": "linear",
        "ghost_threshold": 35,
        "accent_boost": 1.4
      },
      "articulation": {
        "note_length_factor": 0.92,
        "overlap_tolerance_ms": 8
      }
    },
    "verification_iterations": 1,
    "quality_score": 0.89
  }
}
```

**What Happens:**

1. Master Meta-Agent receives command
2. Groove Research Workflow loads (7 steps)
3. LLM Research Expert queries LLM with 4-source requirement
4. Verification Loop checks quality (threshold: 0.85)
5. If quality < 0.85, iterate (max 3 times) or ask user
6. Main Validation Agent final approval
7. Validated Groove Recipe JSON returned

---

### Command 2: `workflow:develop`

**Purpose:** Generate code with multi-agent orchestration and quality assurance

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_description` | string | ✅ Yes | - | What to build |
| `target_modules` | string[] | ❌ No | `[]` | Files to create/modify |
| `quality_threshold` | number | ❌ No | `0.90` | Quality gate (0-1) |

**Example:**

```json
{
  "cmd": "workflow:develop",
  "id": "req-dev-001",
  "params": {
    "task_description": "Implement micro-timing transformation with push/pull adjustments",
    "target_modules": ["src/node/midi/timing.js"],
    "quality_threshold": 0.90
  }
}
```

**Response:**

```json
{
  "id": "req-dev-001",
  "success": true,
  "data": {
    "status": "workflow_completed",
    "workflow": "code-generation",
    "files_modified": ["src/node/midi/timing.js"],
    "files_created": ["tests/midi/timing.test.js"],
    "code_quality_score": 0.93,
    "tests_passing": true,
    "verification_iterations": 2,
    "agents_used": [
      "task-orchestrator",
      "code-expert",
      "midi-expert",
      "verification-agent",
      "validation-agent"
    ]
  }
}
```

**What Happens:**

1. Task Orchestrator decomposes task into subtasks
2. Assigns Code Expert + MIDI Expert (parallel execution)
3. TELIS auto-loads relevant shards for each expert
4. Experts generate code
5. Verification Loop checks quality (threshold: 0.90)
6. If quality < 0.90, iterate with feedback (max 3 times)
7. Main Validation Agent approves
8. Code written to actual files

---

### Command 3: `workflow:document`

**Purpose:** Auto-generate JSDoc comments, README sections, and unit tests

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `target_files` | string[] | ✅ Yes | - | Files to document |
| `include_tests` | boolean | ❌ No | `true` | Generate unit tests |

**Example:**

```json
{
  "cmd": "workflow:document",
  "id": "req-doc-001",
  "params": {
    "target_files": [
      "src/node/midi/timing.js",
      "src/node/midi/velocity.js"
    ],
    "include_tests": true
  }
}
```

**Response:**

```json
{
  "id": "req-doc-001",
  "success": true,
  "data": {
    "status": "workflow_completed",
    "workflow": "documentation",
    "documentation_added": [
      "src/node/midi/timing.js (15 JSDoc comments)",
      "src/node/midi/velocity.js (12 JSDoc comments)"
    ],
    "tests_created": [
      "tests/midi/timing.test.js (8 test cases)",
      "tests/midi/velocity.test.js (6 test cases)"
    ],
    "coverage": "94%",
    "quality_score": 0.91
  }
}
```

**What Happens:**

1. Documentation Workflow analyzes target files
2. Code Expert reads existing code structure
3. Generates JSDoc comments for all public APIs
4. Testing Expert creates unit tests (if `include_tests: true`)
5. Verification Loop checks documentation coverage (threshold: 0.85)
6. Main Validation Agent approves
7. JSDoc + tests written to files

---

### Command 4: `swarm:start`

**Purpose:** Generic multi-agent orchestration for complex/custom tasks

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `task_type` | string | ✅ Yes | - | Type: research, develop, document, custom |
| `context` | object | ❌ No | `{}` | Additional context for agents |

**Example:**

```json
{
  "cmd": "swarm:start",
  "id": "req-swarm-001",
  "params": {
    "task_type": "custom",
    "context": {
      "goal": "Refactor entire MIDI module for performance",
      "files": ["src/node/midi/*.js"],
      "constraints": ["Maintain API compatibility", "No new dependencies"],
      "quality_threshold": 0.95
    }
  }
}
```

**Response:**

```json
{
  "id": "req-swarm-001",
  "success": true,
  "data": {
    "status": "swarm_orchestrated",
    "strategy": "Master Meta-Agent coordinating custom agent swarm",
    "agents_deployed": 5,
    "estimated_steps": 12,
    "current_step": "task-decomposition"
  }
}
```

**What Happens:**

1. Master Meta-Agent analyzes `task_type` and `context`
2. If `task_type` matches a workflow (research, develop, document), routes there
3. If `task_type: "custom"`, coordinates custom agent swarm:
   - Assigns multiple specialized agents
   - Defines custom workflow steps
   - Coordinates parallel execution
   - Applies verification loops
4. Final validation before delivery

---

## Practical Examples

### Example 1: Research → Apply Workflow

**Scenario:** You want to apply J Dilla's groove to your drum pattern

```javascript
// Step 1: Research J Dilla's style
{
  "cmd": "workflow:research",
  "id": "dilla-research",
  "params": {
    "artist_name": "J Dilla",
    "llm_provider": "ollama",
    "intensity": 150  // Exaggerated style
  }
}

// Response includes validated recipe with 4+ sources
// confidence: 0.87, sources: [MIDI files, academic papers, interviews, tutorials]

// Step 2: Apply the recipe (using existing apply-groove command)
{
  "cmd": "apply-groove",
  "id": "dilla-apply",
  "params": {
    "artist": "J Dilla",
    "provider": "ollama",
    "bars": 4,
    "variations": 6,
    "intensity": 150
  }
}

// Recipe is loaded and MIDI transformations applied locally
// Result: 6 variations of your drum pattern with Dilla's timing/velocity/articulation
```

---

### Example 2: Feature Development Workflow

**Scenario:** Implement a new "Humanize" feature for MIDI velocities

```javascript
// Step 1: Generate the code
{
  "cmd": "workflow:develop",
  "id": "humanize-dev",
  "params": {
    "task_description": "Add humanize() function that applies random velocity variance with configurable amount",
    "target_modules": ["src/node/midi/velocity.js"],
    "quality_threshold": 0.90
  }
}

// Agents create:
// - humanize() function in velocity.js
// - Parameter validation
// - JSDoc comments
// - Unit tests (via verification loop)

// Step 2: Document the new feature
{
  "cmd": "workflow:document",
  "id": "humanize-doc",
  "params": {
    "target_files": ["src/node/midi/velocity.js"],
    "include_tests": true
  }
}

// Agents add:
// - Comprehensive JSDoc for humanize()
// - README examples showing usage
// - Additional test cases for edge cases
```

---

### Example 3: Debugging with Agent Swarm

**Scenario:** Complex bug requiring investigation across multiple modules

```javascript
{
  "cmd": "swarm:start",
  "id": "debug-timing",
  "params": {
    "task_type": "custom",
    "context": {
      "issue": "Swing transformation produces incorrect timing for triplets",
      "affected_files": [
        "src/node/midi/timing.js",
        "src/node/midi/transformer.js",
        "src/node/midi/groove-recipe.js"
      ],
      "expected_behavior": "Triplets should maintain 1:1:1 ratio with swing applied",
      "actual_behavior": "Third triplet note is delayed too much",
      "quality_threshold": 0.95
    }
  }
}

// Master Meta-Agent coordinates:
// 1. Code Expert analyzes timing.js for swing logic
// 2. MIDI Expert reviews transformer.js for triplet handling
// 3. LLM Expert checks groove-recipe.js for timing calculations
// 4. Verification Loop tests fix against expected behavior
// 5. Main Validation ensures no regression in other timing features
// 6. Delivers fix with explanation and test cases
```

---

## How It Works

### Full Workflow Example: Groove Research

Let's trace a complete `workflow:research` execution:

**1. User Sends Command (Max UI → Node.js)**

```json
{
  "cmd": "workflow:research",
  "id": "req-001",
  "params": {"artist_name": "Questlove"}
}
```

**2. Command Dispatcher Routes to Workflow**

```javascript
// src/node/commands/workflow-dispatcher.js
function handleWorkflowResearch(params) {
  // Validates params
  // Loads workflow: .bmad/custom/workflows/groove-research/workflow.md
  // Returns to Master Meta-Agent
}
```

**3. BMAD Workflow Executes (7 Sequential Steps)**

```
Step 01: step-01-init.md
├─ Initialize workflow state
├─ Set artist_name: "Questlove"
├─ Set llm_provider: "ollama"
└─ Update frontmatter: currentStep = step-02

Step 02: step-02-assign-research-agent.md
├─ Assign LLM Research Expert
├─ TELIS Auto-Loader kicks in:
│  └─ Load llm-shards.md + midi-math.md (~1,280 tokens)
└─ Update frontmatter: agent = llm_research_expert

Step 03: step-03-llm-query.md
├─ LLM Research Expert queries Ollama:
│  "Research Questlove's drumming style. Find 4+ verifiable sources."
├─ LLM returns research with 5 sources
└─ Update frontmatter: sources_found = 5

Step 04: step-04-verification.md
├─ Verification Loop Agent checks:
│  ✅ 4+ sources? YES (5 sources)
│  ✅ Confidence ≥ 0.85? Calculating...
│  └─ Quality score: 0.89
├─ Quality ≥ threshold → Pass
└─ Update frontmatter: quality_score = 0.89, iteration = 1

Step 05: step-05-recipe-generation.md
├─ Parse research into Groove Recipe JSON
├─ Extract timing, velocity, articulation parameters
└─ Generate recipe object

Step 06: step-06-validation.md
├─ Main Validation Agent final check:
│  ✅ Valid JSON?
│  ✅ All required fields?
│  ✅ Values in valid ranges?
└─ Approved → Proceed

Step 07: step-07-deliver.md
├─ Return recipe to Master Meta-Agent
├─ Update frontmatter: status = completed
└─ Deliver to User
```

**4. Response Sent to Max UI**

```json
{
  "id": "req-001",
  "success": true,
  "data": {
    "status": "workflow_completed",
    "recipe": { /* Groove Recipe JSON */ },
    "quality_score": 0.89,
    "sources_count": 5
  }
}
```

### TELIS Auto-Loading in Action

**Scenario:** Code Expert needs to generate MIDI transformation code

```
1. Code Expert is invoked by Task Orchestrator
   ↓
2. TELIS Loader checks agent role: "code-expert"
   ↓
3. SHARD_MAP lookup:
   code-expert → [m4l-shards.md, llm-shards.md, liveapi-shards.md]
   ↓
4. Load shards into context (~2,200 tokens)
   ↓
5. Code Expert now has access to:
   • node.script patterns (@m4l.node-script)
   • LiveAPI clip operations (@liveapi.clip.read_notes)
   • LLM provider APIs (@llm.ollama.complete)
   ↓
6. Generates code using symbolic compression:
   "Use @liveapi.clip.read_notes to get MIDI data"
   ↓
7. TELIS expands symbols to full code blocks
   ↓
8. Code written to src/node/midi/transformer.js
```

### Verification Loop Mechanics

**Quality Threshold Example (Code Generation):**

```
Iteration 1:
├─ Code Expert generates timing.js
├─ Verification Agent checks:
│  • Syntax valid? ✅
│  • Tests pass? ❌ (2 failures)
│  • Follows style guide? ✅
│  • Quality score: 0.78 < 0.90 threshold
└─ Feedback to Code Expert: "Fix test failures in applySwing()"

Iteration 2:
├─ Code Expert fixes applySwing()
├─ Verification Agent checks:
│  • Syntax valid? ✅
│  • Tests pass? ✅ (all passing)
│  • Follows style guide? ✅
│  • Quality score: 0.92 ≥ 0.90 threshold
└─ Pass → Proceed to Main Validation

Main Validation:
├─ Final comprehensive check
├─ All criteria met
└─ Approved → Deliver to User
```

**Max Iterations:**

- If quality < threshold after 3 iterations:
  ```
  Menu Prompt:
  [A] Accept current output anyway
  [R] Restart workflow from scratch
  [E] Edit parameters and retry
  ```

---

## Troubleshooting

### Common Issues

#### 1. Workflow Command Not Found

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNKNOWN_COMMAND",
    "message": "Command 'workflow:research' not recognized"
  }
}
```

**Solution:**
- Check that Story 7.1 is complete and committed
- Verify `src/node/index.js` registers workflow commands
- Restart node.script: `script npm start`

---

#### 2. Low Quality Score After Max Iterations

**Scenario:** Verification Loop fails 3 times, quality still below threshold

**What Happens:**
```
Verification Loop - Iteration 3/3:
Quality score: 0.83 < 0.90 threshold

[A] Accept current output anyway (quality may be lower than desired)
[R] Restart workflow from beginning
[E] Edit parameters (adjust quality_threshold or task description)
```

**Options:**

- **Option A:** Accept the output if it's "good enough" for your needs
  - Risk: May have minor quality issues
  - Use case: Prototyping, non-critical features

- **Option R:** Restart from scratch
  - Risk: Takes longer
  - Use case: Production code, critical features

- **Option E:** Adjust parameters
  - Lower `quality_threshold` to 0.80
  - Make `task_description` more specific
  - Add constraints in `context`

---

#### 3. Agent Can't Find Relevant Context

**Error:**
```
LLM Research Expert: Insufficient information to complete task.
Context loaded: 450 tokens
Needed: MIDI timing formulas (not in current shards)
```

**Solution:**
- **Automatic:** TELIS loader should have loaded `midi-math.md` shard
- **Manual Override:** Add to agent's `critical_actions`:
  ```yaml
  critical_actions:
    - load_shard: midi-math.md
  ```
- **Escalation:** Agent requests additional context via menu:
  ```
  [L] Load additional shard (midi-math.md)
  [S] Skip and proceed with available context
  [A] Abort workflow
  ```

---

#### 4. Token Budget Exceeded

**Warning:**
```
TELIS Loader: Token budget exceeded (3,800 / 3,500 tokens)
Rotating shards: Unloading llm-shards.md (680 tokens)
Loading: midi-math.md (600 tokens)
New total: 3,720 tokens
```

**Solution:**
- TELIS automatically rotates shards (unloads least-recently-used)
- If critical shard is unloaded, workflow will request to reload it
- Increase budget in TELIS config (advanced users):
  ```yaml
  telis:
    token_budget: 5000  # Default: 3500
  ```

---

#### 5. BMAD Workflow Step Stuck

**Scenario:** Workflow stops at `step-04-verification.md`, no progress

**Check Frontmatter State:**

```yaml
---
currentStep: step-04-verification
status: waiting_for_user
menu_prompt: |
  Verification failed. Quality score: 0.72
  [C] Continue anyway
  [R] Retry with agent feedback
  [A] Abort workflow
---
```

**Solution:**
- Workflow is waiting for your input via menu
- Choose an option: C, R, or A
- If no menu appears, check Max console for errors

---

## Advanced Usage

### Custom Quality Thresholds

Adjust quality gates for specific use cases:

```javascript
// Prototyping: Lower threshold for faster iteration
{
  "cmd": "workflow:develop",
  "params": {
    "task_description": "Quick prototype of velocity curve",
    "quality_threshold": 0.75  // Default: 0.90
  }
}

// Production: Higher threshold for critical code
{
  "cmd": "workflow:develop",
  "params": {
    "task_description": "Fix security vulnerability in API handler",
    "quality_threshold": 0.95  // Higher than default
  }
}
```

---

### Parallel Agent Execution

Some workflows support parallel execution (Story 7.5+):

```javascript
{
  "cmd": "workflow:develop",
  "params": {
    "task_description": "Implement timing, velocity, and articulation modules",
    "target_modules": [
      "src/node/midi/timing.js",      // Code Expert 1
      "src/node/midi/velocity.js",    // Code Expert 2
      "src/node/midi/articulation.js" // Code Expert 3
    ],
    "parallel": true  // Enable parallel execution
  }
}
```

**Benefits:**
- 3x faster development (if modules are independent)
- Each expert loads only relevant TELIS shards

**Limitations:**
- Modules must be independent (no shared dependencies)
- Quality threshold applies to combined output

---

### Agent Memory Persistence

Expert agents have **sidecar memories** that persist across sessions:

```
.bmad/custom/agents/llm-research-expert/
└── sidecar/
    ├── memories.md
    │   ├── "2025-12-10: Researched J Dilla, found 5 sources"
    │   ├── "2025-12-10: User prefers academic papers over blog posts"
    │   └── "2025-12-11: Questlove research, confidence: 0.89"
    └── knowledge/
        ├── drumming-styles.md
        ├── llm-research-best-practices.md
        └── source-validation-criteria.md
```

**How It Works:**
- After each task, agent writes key learnings to `memories.md`
- On next invocation, memories are auto-loaded
- Agent learns preferences and improves over time

**Example:**

```
First Time Researching:
└─ LLM Research Expert uses generic approach
   └─ Confidence: 0.82 (takes 3 iterations)

Second Time Researching:
└─ LLM Research Expert reads memories.md:
   "User prefers academic papers, avoid blog posts"
   └─ Prioritizes high-quality sources
   └─ Confidence: 0.91 (takes 1 iteration)
```

---

### Custom BMAD Workflows

Advanced users can create custom workflows:

**1. Create Workflow Directory:**

```bash
mkdir -p .bmad/custom/workflows/my-custom-workflow
```

**2. Create `workflow.md`:**

```yaml
---
name: my-custom-workflow
version: 1.0
agents_required:
  - code-expert
  - verification-agent
quality_threshold: 0.88
---

# My Custom Workflow

This workflow does X, Y, and Z.
```

**3. Create Step Files:**

```
step-01-init.md
step-02-execute.md
step-03-verify.md
step-04-deliver.md
```

**4. Trigger via `swarm:start`:**

```javascript
{
  "cmd": "swarm:start",
  "params": {
    "task_type": "custom",
    "context": {
      "workflow": ".bmad/custom/workflows/my-custom-workflow"
    }
  }
}
```

---

## FAQs

### General Questions

**Q: When will this be fully functional?**
A: Epic 7 is currently in progress:
- ✅ Story 7.1: Workflow Command Dispatcher (COMPLETE)
- 🚧 Story 7.2: TELIS Shard Auto-Loader (NEXT)
- ⏳ Story 7.3-7.8: Agents, Workflows, Dashboard (UPCOMING)

Expected completion: After all 8 stories in Epic 7 are done.

---

**Q: Can I use this outside of GrooveAgent?**
A: The Sub-Agent + BMAD + TELIS pattern is **project-agnostic**. You can:
1. Copy `.bmad/` directory to another project
2. Adapt workflows to your domain
3. Create custom agents for your use case
4. Reuse TELIS shards or create new ones

---

**Q: Does this work offline?**
A: Partially:
- ✅ BMAD workflows: Fully offline (local state files)
- ✅ TELIS shards: Fully offline (local markdown files)
- ❌ Sub-Agents: Require LLM access (Ollama can run locally)

For **fully offline** operation, use Ollama as your LLM provider.

---

### Technical Questions

**Q: How does TELIS achieve 95% token reduction?**
A: Through:
1. **Lazy Loading** - Load only what's needed, when needed
2. **Symbolic Compression** - `@midi.swing` instead of 50-line code block
3. **Agent Specialization** - Each agent loads only relevant shards
4. **Shard Rotation** - Unload old shards to free memory

---

**Q: What happens if an agent fails mid-workflow?**
A: BMAD workflows have built-in failure handling:
1. **State is saved** in frontmatter (step-by-step progress)
2. **User is prompted** with recovery options:
   - Retry current step
   - Skip to next step
   - Abort and rollback
3. **Logs are preserved** for debugging

---

**Q: Can I see what the agents are doing in real-time?**
A: Yes (Story 7.8 adds Progress Dashboard):
```bash
npm run dashboard

# Output:
Workflow: groove-research (in_progress)
├─ Step 1/7: init ✅
├─ Step 2/7: assign ✅
├─ Step 3/7: llm-query 🚧 (in progress)
│  └─ LLM Research Expert: Querying Ollama... (35% complete)
├─ Step 4/7: verification ⏳
├─ Step 5/7: recipe ⏳
├─ Step 6/7: validation ⏳
└─ Step 7/7: deliver ⏳
```

---

**Q: How do verification loops prevent infinite iterations?**
A: Hard limit of **3 iterations** per verification loop:
- Iteration 1: First attempt
- Iteration 2: Retry with feedback
- Iteration 3: Final attempt
- After 3: User chooses to Accept/Retry/Abort

---

### Workflow-Specific Questions

**Q: How accurate are the Groove Recipes?**
A: Accuracy depends on:
- **4-source validation**: Requires 4+ verifiable sources (MIDI files, academic papers, expert interviews)
- **Confidence threshold**: Must meet 0.85 minimum (85% confidence)
- **LLM provider**: Claude/GPT-4 typically more accurate than smaller models
- **Artist popularity**: More famous artists = more source material

Typical confidence scores:
- J Dilla, Questlove: 0.85-0.95 (very high)
- Obscure artists: 0.65-0.80 (may fail 4-source requirement)

---

**Q: Can I override verification failures?**
A: Yes, you always have final control:
```
Verification Loop - Iteration 3/3:
Quality score: 0.79 < 0.85 threshold

[A] Accept current output anyway ← YOU CHOOSE
[R] Restart workflow
[E] Edit parameters
```

Choose `[A]` to accept lower-quality output if you're okay with it.

---

**Q: What if the LLM hallucinates?**
A: Multi-layer protection:
1. **4-Source Validation** - Requires verifiable references (not just LLM claims)
2. **Verification Loop** - Checks for contradictions/inconsistencies
3. **Confidence Scoring** - Rejects low-confidence results
4. **Main Validation** - Final sanity check before delivery

If hallucination slips through, the confidence score will be low (<0.70), triggering rejection.

---

## Next Steps

### For Users

1. **Wait for Epic 7 Completion** - All 8 stories must finish
2. **Review Examples** - Familiarize yourself with command syntax
3. **Prepare Use Cases** - Identify workflows you want to automate
4. **Test with Prototypes** - Start with low-stakes tasks (quality_threshold: 0.75)

### For Developers

1. **Complete Story 7.2** - TELIS Shard Auto-Loader
2. **Complete Story 7.3** - BMAD Agent Definitions (7 agents)
3. **Complete Stories 7.4-7.6** - Workflows (21 step files)
4. **Complete Story 7.7** - Sprint Artifact Auto-Update
5. **Complete Story 7.8** - Progress Dashboard

### Resources

- **Plan:** `.claude/plans/cozy-mixing-lerdorf.md` - Full Epic 7 implementation plan
- **Epics:** `docs/epics.md` - Epic 7 story breakdown
- **Sprint Status:** `docs/sprint-artifacts/sprint-status.yaml` - Track progress
- **TELIS Shards:** `docs/context/*-shards.md` - Knowledge base files
- **BMAD Docs:** `.bmad/bmb/docs/` - BMAD methodology reference

---

## Glossary

| Term | Definition |
|------|------------|
| **BMAD** | Blueprint for Multi-Agent Development - Step-file workflow system |
| **Frontmatter** | YAML metadata at top of step files tracking workflow state |
| **Groove Recipe** | JSON object describing drumming style (timing, velocity, articulation) |
| **Quality Threshold** | Minimum acceptable quality score (0-1) for output |
| **TELIS** | Token-Efficient Language Intelligence System - Knowledge shard framework |
| **Shard** | Small domain-specific knowledge file (~200-800 tokens) |
| **Symbolic Compression** | Shorthand notation (`@midi.swing`) that expands to full code |
| **Verification Loop** | Iterative quality check with max 3 attempts |
| **Sub-Agent** | Specialized AI agent (LLM Expert, MIDI Expert, Code Expert, etc.) |
| **Sidecar** | Agent's persistent memory and knowledge base directory |
| **JIT Loading** | Just-In-Time loading - Load resources only when needed |

---

**Document Version:** 1.0
**Author:** GrooveAgent Development Team
**License:** Same as GrooveAgent project
**Feedback:** Report issues at github.com/your-repo/GrooveAgent/issues
