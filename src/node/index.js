/**
 * GrooveAgent Node.js Entry Point
 * Primary entry for node.script in Max for Live
 *
 * Handles bidirectional JSON messaging between Max and Node.js
 *
 * @module grooveagent-node
 */

const { info, error, setMaxApiPost, LOG_PREFIX } = require('./utils/logger.js');
const { ErrorCode, getSuggestion, categorizeError } = require('./utils/errors.js');

const VERSION = '1.0.0';

// ============================================================================
// Type Definitions (JSDoc)
// ============================================================================

/**
 * Command request from Max
 * @typedef {Object} CommandRequest
 * @property {string} cmd - Command identifier (kebab-case)
 * @property {string} id - Unique request ID for response matching
 * @property {Object} [params] - Command-specific parameters
 */

/**
 * Command response to Max
 * @typedef {Object} CommandResponse
 * @property {string} id - Matches request ID
 * @property {boolean} success - Operation result
 * @property {Object} [data] - Success payload
 * @property {ErrorDetail} [error] - Error details (when success=false)
 */

/**
 * Error detail object
 * @typedef {Object} ErrorDetail
 * @property {string} code - Error code (SCREAMING_SNAKE_CASE)
 * @property {string} message - Human-readable description
 * @property {string} [suggestion] - Remediation hint
 */

// ============================================================================
// Command Handlers
// ============================================================================

/**
 * Command handler registry
 * @type {Map<string, function(Object): Promise<Object>>}
 */
const commandHandlers = new Map();

/**
 * Register a command handler
 * @param {string} cmd - Command name (kebab-case)
 * @param {function(Object): Promise<Object>} handler - Handler function
 */
function registerCommand(cmd, handler) {
  commandHandlers.set(cmd, handler);
}

/**
 * Ping command handler
 * Returns pong response for connection verification
 * @returns {{pong: boolean}}
 */
function handlePing() {
  return { pong: true };
}

/**
 * Apply Groove command handler (Story 2.1 - stub implementation)
 * Receives artist, provider, and groove parameters from UI
 *
 * @param {Object} params - Command parameters
 * @param {string} params.artist - Artist name
 * @param {string} params.provider - LLM provider (ollama, claude, openai, groq)
 * @param {number} params.bars - Number of bars (1, 2, 4, 8, 16)
 * @param {number} params.variations - Number of variations to generate (1-6)
 * @param {number} params.intensity - Groove intensity percentage (0-200)
 * @returns {{status: string, message: string}}
 */
function handleApplyGroove(params) {
  const { artist, provider, bars, variations, intensity } = params;

  info(
    'apply-groove',
    `Artist: ${artist}, Provider: ${provider}, Bars: ${bars}, Variations: ${variations}, Intensity: ${intensity}%`
  );

  // TODO (Story 2.3-2.8): Implement full groove application flow
  // - Story 2.3: Call LLM provider to generate groove recipe
  // - Story 2.4: Parse and validate groove recipe JSON
  // - Story 2.5: Read clip data via LiveAPI
  // - Story 2.6: Apply MIDI transformations
  // - Story 2.7: Generate variations
  // - Story 2.8: Write transformed clips back to Ableton

  // Stub response for Story 2.1
  return {
    status: 'received',
    message: `Apply Groove request received for ${artist} using ${provider}`,
    params: {
      artist,
      provider,
      bars,
      variations,
      intensity
    }
  };
}

/**
 * Settings command handler (stub for Epic 4)
 * @returns {{message: string}}
 */
function handleSettings() {
  info('settings', 'Settings requested (not yet implemented)');

  // TODO (Epic 4): Implement settings panel
  return {
    message: 'Settings panel will be implemented in Epic 4'
  };
}

// Import workflow dispatcher (Epic 7 - Story 7.1)
const {
  handleWorkflowResearch,
  handleWorkflowDevelop,
  handleWorkflowDocument,
  handleSwarmStart
} = require('./commands/workflow-dispatcher.js');

// Register built-in commands
registerCommand('ping', handlePing);
registerCommand('apply-groove', handleApplyGroove);
registerCommand('settings', handleSettings);

// Register workflow commands (Epic 7 - Story 7.1)
registerCommand('workflow:research', handleWorkflowResearch);
registerCommand('workflow:develop', handleWorkflowDevelop);
registerCommand('workflow:document', handleWorkflowDocument);
registerCommand('swarm:start', handleSwarmStart);

// ============================================================================
// Core Message Handling
// ============================================================================

/**
 * Creates a success response
 * @param {string} id - Request ID
 * @param {Object} data - Response data
 * @returns {CommandResponse}
 */
function createSuccessResponse(id, data) {
  return {
    id,
    success: true,
    data
  };
}

/**
 * Creates an error response
 * @param {string} id - Request ID
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {string} [suggestion] - Remediation hint (auto-populated from getSuggestion if not provided)
 * @returns {CommandResponse}
 */
function createErrorResponse(id, code, message, suggestion) {
  return {
    id,
    success: false,
    error: {
      code,
      message,
      suggestion: suggestion || getSuggestion(code)
    }
  };
}

/**
 * Handle incoming command from Max
 * @param {CommandRequest} message - Command request object
 * @returns {Promise<CommandResponse>} Response object
 */
async function handleCommand(message) {
  const id = message?.id ?? '';
  const cmd = message?.cmd;

  // Validate request ID
  if (!id) {
    error('handleCommand', 'Missing request ID');
    return createErrorResponse(
      '',
      ErrorCode.INVALID_PARAMS,
      'Missing required "id" field in request'
    );
  }

  // Validate command field
  if (!cmd) {
    error('handleCommand', `[${id}] Missing command`);
    return createErrorResponse(
      id,
      ErrorCode.INVALID_PARAMS,
      'Missing required "cmd" field in request',
      'Include a "cmd" field specifying the command to execute'
    );
  }

  info('handleCommand', `[${id}] Processing: ${cmd}`);

  try {
    // Look up handler
    const handler = commandHandlers.get(cmd);

    if (!handler) {
      error('handleCommand', `[${id}] Unknown command: ${cmd}`);
      return createErrorResponse(id, ErrorCode.UNKNOWN_COMMAND, `Command "${cmd}" not recognized`);
    }

    // Execute handler
    const data = await handler(message.params || {});
    info('handleCommand', `[${id}] Success: ${cmd}`);
    return createSuccessResponse(id, data);
  } catch (err) {
    const errorCode = categorizeError(err);
    error('handleCommand', `[${id}] ${errorCode}: ${err.message}`);
    return createErrorResponse(id, errorCode, err.message || 'An unexpected error occurred');
  }
}

// ============================================================================
// Max API Integration
// ============================================================================

/** @type {Object|null} */
let maxApi = null;

/**
 * Initialize max-api integration
 * Called automatically when running in node.script context
 */
function initMaxApi() {
  try {
    // Require max-api (only available in node.script context)
    maxApi = require('max-api');

    // Set up logger to use max-api
    setMaxApiPost((msg) => maxApi.post(msg));

    // Register command handler
    maxApi.addHandler('cmd', async (message) => {
      const response = await handleCommand(message);
      maxApi.outlet(response);
    });

    // Startup notification
    maxApi.post(`${LOG_PREFIX} Ready (Node ${process.version})`);
    info('init', 'Handler registered, ready to receive commands');
  } catch (err) {
    // Not running in node.script context (e.g., testing)
    // This is expected during unit tests
    console.log(`${LOG_PREFIX} Running outside Max context (${err.message})`);
  }
}

// Auto-initialize when module loads
initMaxApi();

// Exports for testing
module.exports = {
  VERSION,
  ErrorCode,
  handleCommand,
  registerCommand,
  createErrorResponse,
  createSuccessResponse
};
