/**
 * Configuration Module
 * Settings storage and retrieval
 *
 * Full implementation in Epic 4
 * @module grooveagent-node/utils/config
 */

const VERSION = '1.0.0';
const placeholder = true;

/**
 * Default configuration values
 * @constant {Object}
 */
const DEFAULT_CONFIG = {
  provider: 'ollama',
  intensity: 100,
  variationCount: 4
};

module.exports = {
  VERSION,
  placeholder,
  DEFAULT_CONFIG
};
