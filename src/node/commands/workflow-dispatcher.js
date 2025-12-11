/**
 * Workflow Command Dispatcher
 * Routes commands to BMAD workflows for agentic orchestration
 *
 * Part of Epic 7: Sub-Agent Agentic Workflows
 * Story 7.1: Workflow Command Dispatcher
 *
 * @module workflow-dispatcher
 */

const { info } = require('../utils/logger.js');
const { ErrorCode } = require('../utils/errors.js');

// ============================================================================
// Type Definitions (JSDoc)
// ============================================================================

/**
 * Groove research workflow parameters
 * @typedef {Object} ResearchParams
 * @property {string} artist_name - Artist name for groove research
 * @property {string} [llm_provider='ollama'] - LLM provider to use
 * @property {number} [intensity=100] - Groove intensity (0-200)
 */

/**
 * Code development workflow parameters
 * @typedef {Object} DevelopParams
 * @property {string} task_description - Description of the code to generate
 * @property {string[]} [target_modules] - Target modules to modify/create
 * @property {number} [quality_threshold=0.90] - Quality threshold (0-1)
 */

/**
 * Documentation workflow parameters
 * @typedef {Object} DocumentParams
 * @property {string[]} target_files - Files to document
 * @property {boolean} [include_tests=true] - Whether to generate tests
 */

/**
 * Generic swarm orchestration parameters
 * @typedef {Object} SwarmParams
 * @property {string} task_type - Type of task (research, develop, document, custom)
 * @property {Object} context - Additional context for the swarm
 */

// ============================================================================
// Workflow Path Configuration
// ============================================================================

/**
 * Maps workflow commands to BMAD workflow paths
 * @type {Object<string, string>}
 */
const WORKFLOW_PATHS = {
  research: '.bmad/custom/workflows/groove-research/workflow.md',
  develop: '.bmad/custom/workflows/code-generation/workflow.md',
  document: '.bmad/custom/workflows/documentation/workflow.md',
  swarm: '.bmad/custom/workflows/agent-orchestration/workflow.md'
};

// ============================================================================
// Command Handlers
// ============================================================================

/**
 * Workflow Research Handler
 * Triggers the Groove Recipe research workflow with LLM orchestration
 *
 * @param {ResearchParams} params - Research parameters
 * @returns {Object} Workflow initiation result
 * @throws {Error} If artist_name is missing
 */
function handleWorkflowResearch(params) {
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

  // Stub response for Story 7.1
  return {
    status: 'workflow_initiated',
    workflow: 'groove-research',
    workflow_path: WORKFLOW_PATHS.research,
    parameters: {
      artist_name,
      llm_provider,
      intensity
    },
    message: 'Groove research workflow will be triggered in Story 7.4',
    next_steps: [
      'Story 7.2: Implement TELIS shard auto-loader',
      'Story 7.3: Create BMAD agent definitions',
      'Story 7.4: Implement groove-research workflow'
    ]
  };
}

/**
 * Workflow Develop Handler
 * Triggers the Code Generation workflow with Sub-Agent orchestration
 *
 * @param {DevelopParams} params - Development parameters
 * @returns {Object} Workflow initiation result
 * @throws {Error} If task_description is missing
 */
function handleWorkflowDevelop(params) {
  const { task_description, target_modules = [], quality_threshold = 0.9 } = params;

  // Validate required parameters
  if (!task_description) {
    const err = new Error('Missing required parameter: task_description');
    err.code = ErrorCode.INVALID_PARAMS;
    throw err;
  }

  info('workflow:develop', `Initiating code generation for: ${task_description}`);
  if (target_modules.length > 0) {
    info('workflow:develop', `Target modules: ${target_modules.join(', ')}`);
  }

  // TODO (Story 7.5): Trigger actual BMAD workflow
  // - Load .bmad/custom/workflows/code-generation/workflow.md
  // - Initialize Task Orchestrator Agent
  // - Decompose task into subtasks
  // - Assign Code/MIDI/LLM experts as needed
  // - Execute with verification loop (threshold: quality_threshold)

  // Stub response for Story 7.1
  return {
    status: 'workflow_initiated',
    workflow: 'code-generation',
    workflow_path: WORKFLOW_PATHS.develop,
    parameters: {
      task_description,
      target_modules,
      quality_threshold
    },
    message: 'Code generation workflow will be triggered in Story 7.5',
    agents_to_orchestrate: [
      'task-orchestrator (Module)',
      'code-expert (Expert)',
      'verification-agent (Expert)',
      'validation-agent (Expert)'
    ]
  };
}

/**
 * Workflow Document Handler
 * Triggers the Documentation/Testing workflow
 *
 * @param {DocumentParams} params - Documentation parameters
 * @returns {Object} Workflow initiation result
 * @throws {Error} If target_files is missing or empty
 */
function handleWorkflowDocument(params) {
  const { target_files, include_tests = true } = params;

  // Validate required parameters
  if (!target_files || target_files.length === 0) {
    const err = new Error('Missing required parameter: target_files (must be non-empty array)');
    err.code = ErrorCode.INVALID_PARAMS;
    throw err;
  }

  info('workflow:document', `Initiating documentation for ${target_files.length} file(s)`);
  info('workflow:document', `Files: ${target_files.join(', ')}`);
  info('workflow:document', `Include tests: ${include_tests}`);

  // TODO (Story 7.6): Trigger actual BMAD workflow
  // - Load .bmad/custom/workflows/documentation/workflow.md
  // - Analyze target files
  // - Generate JSDoc comments
  // - Generate unit tests (if include_tests=true)
  // - Verify documentation coverage

  // Stub response for Story 7.1
  return {
    status: 'workflow_initiated',
    workflow: 'documentation',
    workflow_path: WORKFLOW_PATHS.document,
    parameters: {
      target_files,
      include_tests
    },
    message: 'Documentation workflow will be triggered in Story 7.6',
    outputs_to_generate: [
      include_tests ? 'JSDoc comments + Unit tests' : 'JSDoc comments only',
      'Documentation artifacts in docs/sprint-artifacts/'
    ]
  };
}

/**
 * Swarm Start Handler
 * Triggers generic multi-agent orchestration for complex tasks
 *
 * @param {SwarmParams} params - Swarm orchestration parameters
 * @returns {Object} Swarm initiation result
 * @throws {Error} If task_type is missing
 */
function handleSwarmStart(params) {
  const { task_type, context = {} } = params;

  // Validate required parameters
  if (!task_type) {
    const err = new Error('Missing required parameter: task_type');
    err.code = ErrorCode.INVALID_PARAMS;
    throw err;
  }

  info('swarm:start', `Initiating swarm orchestration for task: ${task_type}`);
  info('swarm:start', `Context keys: ${Object.keys(context).join(', ')}`);

  // Determine which workflow to route to based on task_type
  let target_workflow = WORKFLOW_PATHS.swarm;
  if (task_type === 'research') target_workflow = WORKFLOW_PATHS.research;
  if (task_type === 'develop') target_workflow = WORKFLOW_PATHS.develop;
  if (task_type === 'document') target_workflow = WORKFLOW_PATHS.document;

  // TODO (Stories 7.4-7.6): Implement smart routing
  // - Analyze task_type
  // - Route to appropriate workflow
  // - Or use custom agent-orchestration workflow for complex tasks
  // - Master Meta-Agent coordinates Sub-Agents

  // Stub response for Story 7.1
  return {
    status: 'swarm_initiated',
    task_type,
    target_workflow,
    context,
    message: 'Swarm orchestration will route to appropriate workflow in Stories 7.4-7.6',
    orchestration_strategy:
      task_type === 'custom'
        ? 'Master Meta-Agent will coordinate custom agent swarm'
        : `Route to ${task_type} workflow with multi-agent orchestration`
  };
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  handleWorkflowResearch,
  handleWorkflowDevelop,
  handleWorkflowDocument,
  handleSwarmStart,
  WORKFLOW_PATHS
};
