/**
 * Groove Recipe
 * Parsed style parameters from LLM research
 *
 * Full implementation in Story 2.4
 * @module grooveagent-node/midi/groove-recipe
 */

const VERSION = '1.0.0';
const placeholder = true;

/**
 * Groove Recipe schema definition
 * @typedef {Object} GrooveRecipe
 * @property {string} artist - Artist name
 * @property {string[]} sources - Minimum 4 URLs
 * @property {number} confidence - 0-1 confidence score
 * @property {Object} timing - Timing parameters
 * @property {Object} velocity - Velocity parameters
 * @property {Object} articulation - Articulation parameters
 */

module.exports = {
  VERSION,
  placeholder
};
