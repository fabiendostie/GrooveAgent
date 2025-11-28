/**
 * Validators Module
 * Input validation and sanitization
 *
 * Full implementation in Story 1.5
 * @module grooveagent-node/utils/validators
 */

const VERSION = '1.0.0';
const placeholder = true;

/**
 * Valid MIDI velocity range
 * @constant {Object}
 */
const VELOCITY_RANGE = {
  min: 0,
  max: 127
};

module.exports = {
  VERSION,
  placeholder,
  VELOCITY_RANGE
};
