/**
 * TELIS Shard Auto-Loader
 *
 * Automatically loads TELIS knowledge shards based on agent roles for
 * token-efficient context management (95%+ token reduction vs full codebase).
 *
 * Part of Epic 7: Sub-Agent Agentic Workflows
 * Story 7.2: TELIS Shard Auto-Loader
 *
 * @module telis-loader
 */

import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Project root directory (3 levels up from this file)
 */
const PROJECT_ROOT = resolve(__dirname, '../../..');

/**
 * Path to TELIS shards directory
 */
const SHARDS_DIR = join(PROJECT_ROOT, 'docs', 'context');

/**
 * Role-to-Shard Mapping
 *
 * Maps agent roles to their required TELIS knowledge shards.
 * Token estimates are approximate based on typical shard sizes.
 *
 * @constant {Object.<string, Array<{shard: string, tokens: number}>>}
 */
export const SHARD_MAP = {
  'llm-research-expert': [
    { shard: 'llm-shards.md', tokens: 650 },
    { shard: 'midi-math.md', tokens: 350 }
  ],
  'midi-expert': [
    { shard: 'midi-math.md', tokens: 350 },
    { shard: 'liveapi-shards.md', tokens: 900 }
  ],
  'code-expert': [
    { shard: 'm4l-shards.md', tokens: 800 },
    { shard: 'llm-shards.md', tokens: 650 },
    { shard: 'liveapi-shards.md', tokens: 900 }
  ],
  'verification-agent': [
    { shard: 'midi-math.md', tokens: 350 },
    { shard: 'm4l-shards.md', tokens: 800 }
  ],
  'validation-agent': [
    { shard: 'midi-math.md', tokens: 350 },
    { shard: 'm4l-shards.md', tokens: 800 },
    { shard: 'liveapi-shards.md', tokens: 900 },
    { shard: 'llm-shards.md', tokens: 650 }
  ]
};

/**
 * All available TELIS shards with token estimates
 *
 * @constant {Object.<string, number>}
 */
export const ALL_SHARDS = {
  'midi-math.md': 350,
  'liveapi-shards.md': 900,
  'llm-shards.md': 650,
  'm4l-shards.md': 800,
  'jsui-shards.md': 450,
  'live-ui-shards.md': 400,
  'max-objects-shards.md': 350
};

/**
 * Default token budget for shard loading (per agent)
 * Can be overridden per-agent or per-invocation
 *
 * @constant {number}
 */
export const DEFAULT_TOKEN_BUDGET = 2000;

/**
 * Tracks currently loaded shards for rotation
 * @type {Set<string>}
 */
const loadedShards = new Set();

/**
 * Load TELIS knowledge shards for a specific agent role
 *
 * Automatically loads the appropriate knowledge shards based on the agent's role.
 * Includes token counting, budget management, and optional shard rotation.
 *
 * @param {string} agentRole - The agent role (e.g., 'llm-research-expert')
 * @param {Object} options - Loading options
 * @param {number} [options.tokenBudget=2000] - Maximum tokens to load
 * @param {boolean} [options.rotate=false] - Whether to unload previously loaded shards
 * @param {boolean} [options.compress=false] - Whether to apply symbolic compression
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 *
 * @example
 * const result = await loadShardsForAgent('llm-research-expert');
 * if (result.success) {
 *   console.log(`Loaded ${result.data.shardsLoaded} shards (${result.data.totalTokens} tokens)`);
 *   console.log(result.data.content);
 * }
 */
export async function loadShardsForAgent(agentRole, options = {}) {
  const { tokenBudget = DEFAULT_TOKEN_BUDGET, rotate = false, compress = false } = options;

  try {
    // Validate agent role
    if (!SHARD_MAP[agentRole]) {
      return {
        success: false,
        error: `Unknown agent role: ${agentRole}. Available roles: ${Object.keys(SHARD_MAP).join(', ')}`
      };
    }

    // Get shard configuration for this role
    const shardConfig = SHARD_MAP[agentRole];

    // Rotate shards if requested (unload previous)
    if (rotate && loadedShards.size > 0) {
      const unloadedShards = Array.from(loadedShards);
      loadedShards.clear();
      console.log(
        `[TELIS] Rotated out ${unloadedShards.length} shards: ${unloadedShards.join(', ')}`
      );
    }

    // Load shards with token budget enforcement
    const loadedContent = [];
    let totalTokens = 0;
    let shardsLoaded = 0;
    const skippedShards = [];

    for (const { shard, tokens } of shardConfig) {
      // Check if adding this shard would exceed budget
      if (totalTokens + tokens > tokenBudget) {
        skippedShards.push({ shard, tokens, reason: 'budget_exceeded' });
        continue;
      }

      try {
        const shardPath = join(SHARDS_DIR, shard);
        let content = await readFile(shardPath, 'utf-8');

        // Apply symbolic compression if requested
        if (compress) {
          content = applySymbolicCompression(content, shard);
        }

        loadedContent.push({
          shard,
          content,
          tokens
        });

        totalTokens += tokens;
        shardsLoaded++;
        loadedShards.add(shard);
      } catch (readError) {
        skippedShards.push({
          shard,
          tokens,
          reason: 'file_not_found',
          error: readError.message
        });
      }
    }

    // Build response
    const response = {
      success: true,
      data: {
        agentRole,
        shardsLoaded,
        totalTokens,
        tokenBudget,
        budgetRemaining: tokenBudget - totalTokens,
        shards: loadedContent,
        skipped: skippedShards,
        currentlyLoaded: Array.from(loadedShards),
        compressed: compress
      }
    };

    // Log summary
    console.log(
      `[TELIS] Loaded ${shardsLoaded} shards for ${agentRole} (${totalTokens}/${tokenBudget} tokens)`
    );
    if (skippedShards.length > 0) {
      console.log(
        `[TELIS] Skipped ${skippedShards.length} shards: ${skippedShards.map((s) => s.shard).join(', ')}`
      );
    }

    return response;
  } catch (error) {
    return {
      success: false,
      error: `Failed to load shards for ${agentRole}: ${error.message}`
    };
  }
}

/**
 * Load specific shards by filename
 *
 * Allows loading arbitrary shards not tied to an agent role.
 * Useful for custom workflows or manual context loading.
 *
 * @param {string[]} shardNames - Array of shard filenames (e.g., ['llm-shards.md'])
 * @param {Object} options - Loading options
 * @param {number} [options.tokenBudget=2000] - Maximum tokens to load
 * @param {boolean} [options.compress=false] - Whether to apply symbolic compression
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 *
 * @example
 * const result = await loadShards(['llm-shards.md', 'midi-math.md']);
 */
export async function loadShards(shardNames, options = {}) {
  const { tokenBudget = DEFAULT_TOKEN_BUDGET, compress = false } = options;

  try {
    const loadedContent = [];
    let totalTokens = 0;
    const skippedShards = [];

    for (const shardName of shardNames) {
      // Get estimated token count
      const tokens = ALL_SHARDS[shardName] || 500; // Default estimate if unknown

      // Check budget
      if (totalTokens + tokens > tokenBudget) {
        skippedShards.push({ shard: shardName, tokens, reason: 'budget_exceeded' });
        continue;
      }

      try {
        const shardPath = join(SHARDS_DIR, shardName);
        let content = await readFile(shardPath, 'utf-8');

        if (compress) {
          content = applySymbolicCompression(content, shardName);
        }

        loadedContent.push({
          shard: shardName,
          content,
          tokens
        });

        totalTokens += tokens;
        loadedShards.add(shardName);
      } catch (readError) {
        skippedShards.push({
          shard: shardName,
          tokens,
          reason: 'file_not_found',
          error: readError.message
        });
      }
    }

    return {
      success: true,
      data: {
        shardsLoaded: loadedContent.length,
        totalTokens,
        tokenBudget,
        budgetRemaining: tokenBudget - totalTokens,
        shards: loadedContent,
        skipped: skippedShards,
        compressed: compress
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to load shards: ${error.message}`
    };
  }
}

/**
 * Apply symbolic compression to shard content
 *
 * Reduces token usage by replacing common patterns with symbols.
 * Examples: @llm.ollama, @midi.swing, @api.clip
 *
 * @param {string} content - Shard content
 * @param {string} shardName - Name of the shard (for context-aware compression)
 * @returns {string} Compressed content
 */
function applySymbolicCompression(content, shardName) {
  let compressed = content;

  // LLM shard compressions
  if (shardName === 'llm-shards.md') {
    compressed = compressed.replace(/Ollama provider/g, '@llm.ollama');
    compressed = compressed.replace(/Claude provider/g, '@llm.claude');
    compressed = compressed.replace(/OpenAI provider/g, '@llm.openai');
    compressed = compressed.replace(/Groq provider/g, '@llm.groq');
  }

  // MIDI shard compressions
  if (shardName === 'midi-math.md') {
    compressed = compressed.replace(/swing_ratio/g, '@midi.swing');
    compressed = compressed.replace(/push_pull_ms/g, '@midi.push');
    compressed = compressed.replace(/micro_timing_variance/g, '@midi.variance');
    compressed = compressed.replace(/velocity curve/g, '@midi.vel');
    compressed = compressed.replace(/note_length_factor/g, '@midi.length');
  }

  // LiveAPI shard compressions
  if (shardName === 'liveapi-shards.md') {
    compressed = compressed.replace(/live_set tracks/g, '@api.tracks');
    compressed = compressed.replace(/clip_slots/g, '@api.slots');
    compressed = compressed.replace(/get_notes_extended/g, '@api.notes');
  }

  return compressed;
}

/**
 * Get information about available shards for a role
 *
 * Returns metadata without loading the actual content.
 * Useful for displaying agent capabilities or planning token budgets.
 *
 * @param {string} agentRole - The agent role
 * @returns {{success: boolean, data?: Object, error?: string}}
 *
 * @example
 * const info = getShardInfo('llm-research-expert');
 * console.log(`Agent uses ${info.data.totalTokens} tokens across ${info.data.shards.length} shards`);
 */
export function getShardInfo(agentRole) {
  if (!SHARD_MAP[agentRole]) {
    return {
      success: false,
      error: `Unknown agent role: ${agentRole}`
    };
  }

  const shardConfig = SHARD_MAP[agentRole];
  const totalTokens = shardConfig.reduce((sum, { tokens }) => sum + tokens, 0);

  return {
    success: true,
    data: {
      agentRole,
      shards: shardConfig,
      totalTokens,
      shardCount: shardConfig.length
    }
  };
}

/**
 * Clear currently loaded shards
 *
 * Clears the internal tracking of loaded shards.
 * Call this between workflow steps to enable shard rotation.
 *
 * @returns {{success: boolean, data: {unloaded: string[]}}}
 */
export function clearLoadedShards() {
  const unloaded = Array.from(loadedShards);
  loadedShards.clear();

  console.log(`[TELIS] Cleared ${unloaded.length} loaded shards`);

  return {
    success: true,
    data: {
      unloaded
    }
  };
}

/**
 * Get list of currently loaded shards
 *
 * @returns {string[]}
 */
export function getCurrentlyLoadedShards() {
  return Array.from(loadedShards);
}

/**
 * Calculate token count for shard content
 *
 * Rough estimation: 1 token ≈ 4 characters (OpenAI standard)
 * For more accurate counting, integrate with tiktoken or similar.
 *
 * @param {string} content - Shard content
 * @returns {number} Estimated token count
 */
export function estimateTokens(content) {
  return Math.ceil(content.length / 4);
}
