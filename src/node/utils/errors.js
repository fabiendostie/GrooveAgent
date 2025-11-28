/**
 * Error Utilities Module
 * Standardized error codes, categorization, and suggestions
 *
 * @module grooveagent-node/utils/errors
 */

/**
 * Complete application error codes
 * @readonly
 * @enum {string}
 */
const ErrorCode = {
  // System errors
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

/**
 * Error suggestion mapping
 * Maps each ErrorCode to a user-friendly suggestion
 * @type {Object<string, string>}
 */
const SUGGESTIONS = {
  [ErrorCode.UNKNOWN_COMMAND]: 'Check command spelling. Available: ping',
  [ErrorCode.INVALID_PARAMS]: 'Verify request format and required fields',
  [ErrorCode.INTERNAL_ERROR]: 'Check console for details',
  [ErrorCode.LLM_UNAVAILABLE]: 'Configure an LLM provider in Settings',
  [ErrorCode.LLM_TIMEOUT]: 'Request timed out. Retry or check your connection',
  [ErrorCode.LLM_RATE_LIMITED]: 'Rate limited. Wait a moment or switch providers',
  [ErrorCode.CLIP_EMPTY]: 'Select a clip with MIDI notes',
  [ErrorCode.CLIP_TOO_LONG]: 'Shorten clip to 16 bars or less',
  [ErrorCode.NO_EMPTY_SLOTS]: 'Clear a clip slot for output variations',
  [ErrorCode.LOW_CONFIDENCE]: 'Limited sources found. Results may vary',
  [ErrorCode.INVALID_CONFIG]: 'Settings may be corrupted. Try resetting'
};

/**
 * Default suggestion for unknown error codes
 * @constant {string}
 */
const DEFAULT_SUGGESTION = 'An unexpected error occurred. Check console for details';

/**
 * Get user-friendly suggestion for an error code
 * @param {string} errorCode - Error code from ErrorCode enum
 * @returns {string} User-friendly suggestion string
 */
function getSuggestion(errorCode) {
  return SUGGESTIONS[errorCode] || DEFAULT_SUGGESTION;
}

/**
 * Categorize an error into an ErrorCode based on its properties
 * @param {Error} error - The caught error to categorize
 * @returns {string} Appropriate ErrorCode
 */
function categorizeError(error) {
  if (!error) {
    return ErrorCode.INTERNAL_ERROR;
  }

  const message = (error.message || '').toLowerCase();
  const code = error.code || '';

  // Network/Connection errors
  if (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'ECONNRESET' ||
    message.includes('network') ||
    message.includes('connection refused') ||
    message.includes('fetch failed')
  ) {
    return ErrorCode.LLM_UNAVAILABLE;
  }

  // Timeout errors
  if (
    code === 'ETIMEDOUT' ||
    code === 'ESOCKETTIMEDOUT' ||
    message.includes('timeout') ||
    message.includes('timed out')
  ) {
    return ErrorCode.LLM_TIMEOUT;
  }

  // Rate limiting
  if (
    message.includes('rate limit') ||
    message.includes('too many requests') ||
    error.status === 429
  ) {
    return ErrorCode.LLM_RATE_LIMITED;
  }

  // Validation errors
  if (message.includes('invalid') || message.includes('missing') || message.includes('required')) {
    return ErrorCode.INVALID_PARAMS;
  }

  // Config errors
  if (message.includes('config') || message.includes('settings') || message.includes('corrupted')) {
    return ErrorCode.INVALID_CONFIG;
  }

  // Default to internal error
  return ErrorCode.INTERNAL_ERROR;
}

/**
 * Create a standardized error detail object
 * @param {string} code - Error code from ErrorCode enum
 * @param {string} message - Human-readable error message
 * @param {string} [suggestion] - Optional custom suggestion (uses getSuggestion if not provided)
 * @returns {{code: string, message: string, suggestion: string}} Standardized error detail
 */
function createError(code, message, suggestion) {
  return {
    code,
    message,
    suggestion: suggestion || getSuggestion(code)
  };
}

// CommonJS exports
module.exports = {
  ErrorCode,
  getSuggestion,
  categorizeError,
  createError,
  DEFAULT_SUGGESTION
};
