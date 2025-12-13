/**
 * Unit Tests: Workflow Command Dispatcher
 * Story 7.3.5: Epic 7 Foundation Testing Suite
 *
 * Tests workflow command parsing, routing, and parameter validation.
 * Target Coverage: 90%+ (critical routing component)
 */

import { describe, test, expect } from '@jest/globals';
import {
  handleWorkflowResearch,
  handleWorkflowDevelop,
  handleWorkflowDocument,
  handleSwarmStart
} from '../../src/node/commands/workflow-dispatcher.js';

import { ErrorCode } from '../../src/node/utils/errors.js';

describe('Workflow Dispatcher - Unit Tests', () => {
  // ========================================================================
  // workflow:research Handler Tests
  // ========================================================================

  describe('handleWorkflowResearch', () => {
    test('accepts valid artist_name and returns workflow_initiated status', async () => {
      const params = {
        artist_name: 'J Dilla'
      };

      const result = await handleWorkflowResearch(params);

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'groove-research');
      expect(result).toHaveProperty('workflow_path');
      expect(result.workflow_path).toContain('.bmad/custom/workflows/groove-research');
      expect(result.parameters).toEqual({
        artist_name: 'J Dilla',
        llm_provider: 'ollama',
        intensity: 100
      });
    });

    test('applies default llm_provider (ollama) when not specified', async () => {
      const params = {
        artist_name: 'Questlove'
      };

      const result = await handleWorkflowResearch(params);

      expect(result.parameters.llm_provider).toBe('ollama');
    });

    test('applies default intensity (100) when not specified', async () => {
      const params = {
        artist_name: 'Questlove'
      };

      const result = await handleWorkflowResearch(params);

      expect(result.parameters.intensity).toBe(100);
    });

    test('accepts custom llm_provider parameter', async () => {
      const params = {
        artist_name: 'Questlove',
        llm_provider: 'claude'
      };

      const result = await handleWorkflowResearch(params);

      expect(result.parameters.llm_provider).toBe('claude');
    });

    test('accepts custom intensity parameter', async () => {
      const params = {
        artist_name: 'Questlove',
        intensity: 150
      };

      const result = await handleWorkflowResearch(params);

      expect(result.parameters.intensity).toBe(150);
    });

    test('throws INVALID_PARAMS error when artist_name is missing', async () => {
      const params = {};

      await expect(handleWorkflowResearch(params)).rejects.toThrow(
        'Missing required parameter: artist_name'
      );

      try {
        await handleWorkflowResearch(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('throws INVALID_PARAMS error when artist_name is empty string', async () => {
      const params = {
        artist_name: ''
      };

      await expect(handleWorkflowResearch(params)).rejects.toThrow();

      try {
        await handleWorkflowResearch(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('handles artist names with special characters', async () => {
      const params = {
        artist_name: 'Danger Mouse & MF DOOM'
      };

      const result = await handleWorkflowResearch(params);

      expect(result.parameters.artist_name).toBe('Danger Mouse & MF DOOM');
    });
  });

  // ========================================================================
  // workflow:develop Handler Tests
  // ========================================================================

  describe('handleWorkflowDevelop', () => {
    test('accepts valid task_description and returns workflow_initiated status', async () => {
      const params = {
        task_description: 'Implement MIDI velocity transformation function'
      };

      const result = await handleWorkflowDevelop(params);

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'code-generation');
      expect(result).toHaveProperty('workflow_path');
      expect(result.workflow_path).toContain('.bmad/custom/workflows/code-generation');
      expect(result.parameters).toEqual({
        task_description: 'Implement MIDI velocity transformation function',
        target_modules: [],
        quality_threshold: 0.9
      });
    });

    test('applies default target_modules ([]) when not specified', async () => {
      const params = {
        task_description: 'Add new function'
      };

      const result = await handleWorkflowDevelop(params);

      expect(result.parameters.target_modules).toEqual([]);
    });

    test('applies default quality_threshold (0.90) when not specified', async () => {
      const params = {
        task_description: 'Add new function'
      };

      const result = await handleWorkflowDevelop(params);

      expect(result.parameters.quality_threshold).toBe(0.9);
    });

    test('accepts custom target_modules parameter', async () => {
      const params = {
        task_description: 'Update velocity transformation',
        target_modules: ['src/node/midi/velocity.js', 'src/node/midi/transformer.js']
      };

      const result = await handleWorkflowDevelop(params);

      expect(result.parameters.target_modules).toEqual([
        'src/node/midi/velocity.js',
        'src/node/midi/transformer.js'
      ]);
    });

    test('accepts custom quality_threshold parameter', async () => {
      const params = {
        task_description: 'Implement feature',
        quality_threshold: 0.85
      };

      const result = await handleWorkflowDevelop(params);

      expect(result.parameters.quality_threshold).toBe(0.85);
    });

    test('throws INVALID_PARAMS error when task_description is missing', async () => {
      const params = {};

      await expect(handleWorkflowDevelop(params)).rejects.toThrow(
        'Missing required parameter: task_description'
      );

      try {
        await handleWorkflowDevelop(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('throws INVALID_PARAMS error when task_description is empty string', async () => {
      const params = {
        task_description: ''
      };

      await expect(handleWorkflowDevelop(params)).rejects.toThrow();

      try {
        await handleWorkflowDevelop(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('handles multi-line task descriptions', async () => {
      const params = {
        task_description: 'Implement new feature:\n1. Add function\n2. Write tests\n3. Document'
      };

      const result = await handleWorkflowDevelop(params);

      expect(result.parameters.task_description).toContain('\n');
    });
  });

  // ========================================================================
  // workflow:document Handler Tests
  // ========================================================================

  describe('handleWorkflowDocument', () => {
    test('accepts valid target_files and returns workflow_initiated status', async () => {
      const params = {
        target_files: ['src/node/commands/workflow-dispatcher.js']
      };

      const result = await handleWorkflowDocument(params);

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'documentation');
      expect(result).toHaveProperty('workflow_path');
      expect(result.workflow_path).toContain('.bmad/custom/workflows/documentation');
      expect(result.parameters).toEqual({
        target_files: ['src/node/commands/workflow-dispatcher.js'],
        include_tests: true
      });
    });

    test('applies default include_tests (true) when not specified', async () => {
      const params = {
        target_files: ['src/node/utils/telis-loader.js']
      };

      const result = await handleWorkflowDocument(params);

      expect(result.parameters.include_tests).toBe(true);
    });

    test('accepts include_tests as false', async () => {
      const params = {
        target_files: ['src/node/utils/telis-loader.js'],
        include_tests: false
      };

      const result = await handleWorkflowDocument(params);

      expect(result.parameters.include_tests).toBe(false);
    });

    test('accepts multiple target files', async () => {
      const params = {
        target_files: [
          'src/node/midi/velocity.js',
          'src/node/midi/timing.js',
          'src/node/midi/articulation.js'
        ]
      };

      const result = await handleWorkflowDocument(params);

      expect(result.parameters.target_files).toHaveLength(3);
    });

    test('throws INVALID_PARAMS error when target_files is missing', async () => {
      const params = {};

      await expect(handleWorkflowDocument(params)).rejects.toThrow(
        'Missing required parameter: target_files'
      );

      try {
        await handleWorkflowDocument(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('throws INVALID_PARAMS error when target_files is empty array', async () => {
      const params = {
        target_files: []
      };

      await expect(handleWorkflowDocument(params)).rejects.toThrow();

      try {
        await handleWorkflowDocument(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('throws INVALID_PARAMS error when target_files is not an array', async () => {
      const params = {
        target_files: 'src/node/utils/telis-loader.js'
      };

      await expect(handleWorkflowDocument(params)).rejects.toThrow();

      try {
        await handleWorkflowDocument(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });
  });

  // ========================================================================
  // swarm:start Handler Tests
  // ========================================================================

  describe('handleSwarmStart', () => {
    test('accepts valid task_type and returns swarm_initiated status', async () => {
      const params = {
        task_type: 'research'
      };

      const result = await handleSwarmStart(params);

      expect(result).toHaveProperty('status', 'swarm_initiated');
      expect(result).toHaveProperty('task_type', 'research');
      expect(result).toHaveProperty('target_workflow');
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('orchestration_strategy');
    });

    test('applies default context ({}) when not specified', async () => {
      const params = {
        task_type: 'develop'
      };

      const result = await handleSwarmStart(params);

      expect(result.context).toEqual({});
    });

    test('accepts custom context parameter', async () => {
      const params = {
        task_type: 'custom',
        context: {
          epic: '7',
          story: '7.5',
          complexity: 'high'
        }
      };

      const result = await handleSwarmStart(params);

      expect(result.context).toEqual({
        epic: '7',
        story: '7.5',
        complexity: 'high'
      });
    });

    test('accepts all valid task_type values', async () => {
      const taskTypes = ['research', 'develop', 'document', 'custom'];

      for (const taskType of taskTypes) {
        const params = { task_type: taskType };
        const result = await handleSwarmStart(params);
        expect(result.task_type).toBe(taskType);
      }
    });

    test('throws INVALID_PARAMS error when task_type is missing', async () => {
      const params = {};

      await expect(handleSwarmStart(params)).rejects.toThrow(
        'Missing required parameter: task_type'
      );

      try {
        await handleSwarmStart(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });

    test('throws INVALID_PARAMS error when task_type is empty string', async () => {
      const params = {
        task_type: ''
      };

      await expect(handleSwarmStart(params)).rejects.toThrow();

      try {
        await handleSwarmStart(params);
      } catch (error) {
        expect(error.code).toBe(ErrorCode.INVALID_PARAMS);
      }
    });
  });

  // ========================================================================
  // Response Structure Validation
  // ========================================================================

  describe('Response Structure Validation', () => {
    test('workflow:research returns correct structure', async () => {
      const result = await handleWorkflowResearch({ artist_name: 'Test' });

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'groove-research');
      expect(result).toHaveProperty('workflow_path');
      expect(result).toHaveProperty('parameters');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('next_steps');
      expect(Array.isArray(result.next_steps)).toBe(true);
    });

    test('workflow:develop returns correct structure', async () => {
      const result = await handleWorkflowDevelop({ task_description: 'Test' });

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'code-generation');
      expect(result).toHaveProperty('workflow_path');
      expect(result).toHaveProperty('parameters');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('agents_to_orchestrate');
      expect(Array.isArray(result.agents_to_orchestrate)).toBe(true);
    });

    test('workflow:document returns correct structure', async () => {
      const result = await handleWorkflowDocument({ target_files: ['test.js'] });

      expect(result).toHaveProperty('status', 'workflow_initiated');
      expect(result).toHaveProperty('workflow', 'documentation');
      expect(result).toHaveProperty('workflow_path');
      expect(result).toHaveProperty('parameters');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('outputs_to_generate');
      expect(Array.isArray(result.outputs_to_generate)).toBe(true);
    });

    test('swarm:start returns correct structure', async () => {
      const result = await handleSwarmStart({ task_type: 'custom' });

      expect(result).toHaveProperty('status', 'swarm_initiated');
      expect(result).toHaveProperty('task_type');
      expect(result).toHaveProperty('target_workflow');
      expect(result).toHaveProperty('context');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('orchestration_strategy');
    });

    test('workflow handlers return correct status values', async () => {
      const researchResult = await handleWorkflowResearch({ artist_name: 'Test' });
      expect(researchResult.status).toBe('workflow_initiated');

      const swarmResult = await handleSwarmStart({ task_type: 'custom' });
      expect(swarmResult.status).toBe('swarm_initiated');
    });
  });

  // ========================================================================
  // Edge Cases
  // ========================================================================

  describe('Edge Cases', () => {
    test('throws TypeError when params is undefined', async () => {
      await expect(handleWorkflowResearch(undefined)).rejects.toThrow(TypeError);
      await expect(handleWorkflowDevelop(undefined)).rejects.toThrow(TypeError);
      await expect(handleWorkflowDocument(undefined)).rejects.toThrow(TypeError);
      await expect(handleSwarmStart(undefined)).rejects.toThrow(TypeError);
    });

    test('throws TypeError when params is null', async () => {
      await expect(handleWorkflowResearch(null)).rejects.toThrow(TypeError);
      await expect(handleWorkflowDevelop(null)).rejects.toThrow(TypeError);
      await expect(handleWorkflowDocument(null)).rejects.toThrow(TypeError);
      await expect(handleSwarmStart(null)).rejects.toThrow(TypeError);
    });

    test('handles extra unexpected parameters without error', async () => {
      const params = {
        artist_name: 'Test',
        unexpected_param: 'should be ignored'
      };

      const result = await handleWorkflowResearch(params);
      expect(result.parameters.artist_name).toBe('Test');
      // Extra params should be ignored, not cause errors
    });

    test('preserves parameter types (numbers, arrays, objects)', async () => {
      const params = {
        task_type: 'custom',
        context: {
          number: 42,
          array: [1, 2, 3],
          object: { nested: true }
        }
      };

      const result = await handleSwarmStart(params);
      expect(result.context.number).toBe(42);
      expect(Array.isArray(result.context.array)).toBe(true);
      expect(typeof result.context.object).toBe('object');
    });
  });
});
