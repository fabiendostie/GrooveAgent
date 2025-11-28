/**
 * Velocity Module
 * Velocity curve and ghost note transformations
 *
 * Full implementation in Story 2.6
 * @module grooveagent-node/midi/velocity
 */

const VERSION = '1.0.0';
const placeholder = true;

/**
 * Default ghost note threshold
 * @constant {number}
 */
const DEFAULT_GHOST_THRESHOLD = 40;

module.exports = {
  VERSION,
  placeholder,
  DEFAULT_GHOST_THRESHOLD
};
