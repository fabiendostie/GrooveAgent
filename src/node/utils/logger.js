/**
 * Logger Module
 * Structured logging with Max console integration
 *
 * @module grooveagent-node/utils/logger
 */

/**
 * Log prefix for GrooveAgent messages
 * @constant {string}
 */
const LOG_PREFIX = '[GrooveAgent]';

/**
 * Log levels enum
 * @readonly
 * @enum {string}
 */
const Level = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

/** @type {Function|null} */
let maxApiPost = null;

/** @type {boolean} */
let includeTimestamp = false;

/**
 * Set the max-api post function for logging to Max console
 * @param {Function} postFn - The maxApi.post function
 */
function setMaxApiPost(postFn) {
  maxApiPost = postFn;
}

/**
 * Enable or disable timestamp in log messages
 * @param {boolean} enabled - Whether to include timestamps
 */
function setTimestamp(enabled) {
  includeTimestamp = enabled;
}

/**
 * Get the appropriate console function for a log level
 * @param {string} level - Log level from Level enum
 * @returns {Function} Console method
 */
function getConsoleFn(level) {
  switch (level) {
    case Level.ERROR:
      return console.error;
    case Level.WARN:
      return console.warn;
    case Level.DEBUG:
      return console.debug;
    case Level.INFO:
    default:
      return console.log;
  }
}

/**
 * Log a message with level and context
 * @param {string} level - Log level from Level enum
 * @param {string} context - Context identifier (e.g., 'cmd:ping')
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object to include
 */
function log(level, context, message, data = null) {
  const timestamp = includeTimestamp ? `${new Date().toISOString()} ` : '';
  const formatted = `${timestamp}${LOG_PREFIX} [${level}] ${context}: ${message}`;

  // Get appropriate console method for level
  const consoleFn = getConsoleFn(level);

  // Log to console with or without data
  if (data !== null && data !== undefined) {
    consoleFn(formatted, data);
  } else {
    consoleFn(formatted);
  }

  // Also log to Max console if available
  if (maxApiPost) {
    if (data !== null && data !== undefined) {
      try {
        const dataStr = JSON.stringify(data);
        maxApiPost(`${formatted} ${dataStr}`);
      } catch {
        // If data can't be stringified, just send the message
        maxApiPost(formatted);
      }
    } else {
      maxApiPost(formatted);
    }
  }
}

/**
 * Log info level message
 * @param {string} context - Context identifier
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object
 */
function info(context, message, data = null) {
  log(Level.INFO, context, message, data);
}

/**
 * Log error level message
 * @param {string} context - Context identifier
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object
 */
function error(context, message, data = null) {
  log(Level.ERROR, context, message, data);
}

/**
 * Log debug level message
 * @param {string} context - Context identifier
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object
 */
function debug(context, message, data = null) {
  log(Level.DEBUG, context, message, data);
}

/**
 * Log warn level message
 * @param {string} context - Context identifier
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data object
 */
function warn(context, message, data = null) {
  log(Level.WARN, context, message, data);
}

// CommonJS exports
module.exports = {
  LOG_PREFIX,
  Level,
  setMaxApiPost,
  setTimestamp,
  log,
  info,
  error,
  debug,
  warn
};
