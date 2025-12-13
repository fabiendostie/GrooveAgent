# GrooveAgent - Antigravity Agent Rules
# Following TELIS Methodology for Token-Efficient Development
# See: docs/Token-Efficient_Language_Intelligence_System_TELIS.md

## Project Context

**Project**: GrooveAgent - Max for Live MIDI Style Transfer Plugin
**Stack**: Node.js (node.script) + Pure JavaScript + Multi-Provider LLM
**Architecture**: See CLAUDE.md for complete overview
**Current Epic**: Epic 7 - Sub-Agent Agentic Workflows (4/8 stories complete)

## Agent Role & Permissions

You are an AI development agent assisting with GrooveAgent development using the BMAD (Blueprint for Multi-Agent Development) framework integrated with TELIS (Token-Efficient Language Intelligence System).

### Permitted Actions
✅ Read all project files
✅ Suggest code changes with full context
✅ Generate test files with 85%+ coverage
✅ Create documentation (JSDoc, README updates)
✅ Propose architectural improvements
✅ Execute BMAD workflows when triggered

### Restricted Actions
❌ Never modify .git/ directory
❌ Never commit without explicit user approval
❌ Never push to remote without explicit user approval
❌ Never install dependencies without user confirmation

## Code Generation Rules

### JavaScript/Node.js
- Use **ES2024 syntax** with ESM modules (`"type": "module"`)
- **Async/await** for all async operations (never raw Promises)
- **JSDoc comments** for all public functions
- **Descriptive names**: `calculateSwingOffset` not `calcSwng`
- **Max 300 lines per file** (prefer under 200)
- **No abbreviations** in variable names
- **Error handling pattern**:
  ```javascript
  try {
    const result = await operation();
    return { success: true, data: result };
  } catch (error) {
    console.error(`[GrooveAgent] ${context}: ${error.message}`);
    return { success: false, error: error.message };
  }
  ```

### Max for Live Specific
- Use **node.script** for all Node.js code
- Use **max-api** npm package for Max/Node communication
- Use **LiveAPI** for Ableton integration
- **JSON only** for all data exchange
- Never use Python (v1.0 is pure JavaScript)

### Testing Requirements (Story 7.3.5: 93.3% Coverage!)
- **Minimum coverage**: 85% across all metrics
- **Critical modules**: 90% (workflow commands, core operations)
- **Test organization**:
  - Unit tests: `tests/utils/`, `tests/agents/`
  - Integration tests: `tests/integration/`
  - Structure tests: `tests/structure/`
- **All new code** must have corresponding tests
- Run tests before committing: `npm test`

## TELIS Knowledge Shard Protocol

### Shard Files (Token-Efficient Context)
Located in `docs/context/`:
- `m4l-shards.md` - Max for Live patterns (node.script, js)
- `liveapi-shards.md` - Live Object Model (clip operations)
- `llm-shards.md` - LLM integration patterns
- `midi-math.md` - MIDI transformation formulas
- `jsui-shards.md` - Graphics API (mgraphics)
- `live-ui-shards.md` - UI components (live.*)
- `max-objects-shards.md` - Routing objects (route, pack)

### When to Load Shards
- **Max/Node integration**: Load `m4l-shards.md`
- **Clip operations**: Load `liveapi-shards.md`
- **LLM work**: Load `llm-shards.md`
- **MIDI transforms**: Load `midi-math.md`
- **UI development**: Load relevant UI shards

**Usage**: Reference shards via TELIS symbolic compression:
- `@m4l.node-script` - Expands to node.script template
- `@midi.swing` - Expands to swing formula
- `@llm.ollama.complete` - Expands to Ollama completion pattern

## Epic 7: BMAD Agent System

### Available Agents (`.bmad/custom/agents/`)
1. **Master Coordinator** - Routes developer commands to workflows
2. **Task Orchestrator** - Decomposes tasks, assigns agents
3. **LLM Research Expert** - Groove recipe research
4. **MIDI Expert** - MIDI transformations
5. **Code Expert** - JavaScript/Max code generation
6. **Verification Agent** - Quality loops (max 3 iterations, threshold: 0.85/0.90)
7. **Validation Agent** - Final approval gate

### Workflow Commands
When user requests these operations, trigger the corresponding workflow:
- `workflow:research <artist>` → Groove recipe research workflow
- `workflow:develop <task>` → Code generation with Sub-Agents
- `workflow:document <files>` → JSDoc + tests generation
- `swarm:start <type>` → Generic multi-agent orchestration

### Autonomous Operation
- **Parallel execution**: Task Orchestrator assigns independent subtasks to multiple agents simultaneously
- **Quality loops**: Verification Agent iterates max 3x before escalation
- **Final approval**: Validation Agent provides approve/reject decision
- **Human intervention**: Only required for critical issues or 3x failed quality checks

## File Naming Conventions

- **Files**: kebab-case (`groove-recipe.js`)
- **Classes**: PascalCase (`GrooveRecipe`)
- **Functions**: camelCase (`applySwing`)
- **Constants**: SCREAMING_SNAKE_CASE (`DEFAULT_SWING_RATIO`)
- **Tests**: `*.test.js` (same name as file being tested)

## Documentation Standards

### JSDoc Format (Mandatory for all public functions)
```javascript
/**
 * Applies swing timing to note array
 * @param {LiveNote[]} notes - Array of MIDI notes
 * @param {number} swingRatio - Swing ratio (0.5 = straight, 0.67 = triplet feel)
 * @returns {LiveNote[]} Notes with adjusted timing
 * @example
 * const swungNotes = applySwing(notes, 0.62); // J Dilla feel
 */
function applySwing(notes, swingRatio) { ... }
```

### Commit Message Format (Conventional Commits)
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore
**Scopes**: epic-7, midi, llm, ui, clip, workflow
**Examples**:
- `test(epic-7): add comprehensive foundation testing suite`
- `feat(workflow): implement TELIS shard auto-loader`
- `docs(readme): update coverage badges to 93.3%`

## Performance Considerations

- Batch note operations (don't process one at a time)
- Cache Groove Recipes for popular artists
- Stream LLM responses when possible
- Lazy-load provider SDKs
- Use TELIS shards to reduce token usage (95%+ reduction)

## Development Workflow

1. **Before coding**: Load relevant TELIS shards for context
2. **While coding**: Follow code generation rules above
3. **After coding**: Write tests (85%+ coverage required)
4. **Before committing**: Run `npm test` to verify all tests pass
5. **Commit**: Use conventional commit format
6. **Push**: Only after user approval

## Anti-Hallucination Rules

❌ **NEVER invent** Max/MSP objects - verify they exist in shards
❌ **NEVER guess** LiveAPI method signatures - check `liveapi-shards.md`
❌ **NEVER assume** MIDI data format - use LOM structure
❌ **NEVER hardcode** LLM responses - always handle errors
✅ **ALWAYS use** typed interfaces for Groove Recipe
✅ **ALWAYS validate** external data
✅ **ALWAYS reference** TELIS shards for patterns

## Quick Reference

### Common Commands
```bash
npm test                              # Run all 426 tests (93.3% coverage)
npm test -- --coverage                # Generate coverage report
open tests/coverage/index.html        # View detailed HTML coverage
npm test -- tests/utils/telis-loader.test.js  # Run specific test suite
npm run lint                          # ESLint check
cd src/node && npm install            # Install Node dependencies
```

### File Locations
- **Source**: `src/node/` (Node.js ESM modules)
- **Max device**: `src/max/GrooveAgent.amxd`
- **Tests**: `tests/` (Jest test suites)
- **Docs**: `docs/` (TELIS shards, sprint artifacts)
- **Agents**: `.bmad/custom/agents/` (BMAD agent definitions)
- **Workflows**: `.bmad/custom/workflows/` (BMAD workflow step files)

---

**Agent Instructions**: Follow TELIS methodology for token-efficient development. Load relevant shards before code generation. Maintain 85%+ test coverage. Use BMAD agents for complex tasks. Always seek user approval before git operations.

**Last Updated**: 2025-12-13 (Story 7.3.5 Complete - 93.3% Coverage Achieved!)
