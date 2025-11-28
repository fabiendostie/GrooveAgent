/**
 * Clip Operations
 * LiveAPI clip manipulation via LOM
 *
 * Full implementation in Story 2.5
 * @module grooveagent-node/clip/operations
 */

const VERSION = '1.0.0';
const placeholder = true;

/**
 * LiveNote structure per LOM specification
 * @typedef {Object} LiveNote
 * @property {number} pitch - MIDI pitch (0-127)
 * @property {number} start_time - Start time in beats
 * @property {number} duration - Duration in beats
 * @property {number} velocity - Velocity (0-127)
 * @property {boolean} mute - Mute state
 */

module.exports = {
  VERSION,
  placeholder
};
