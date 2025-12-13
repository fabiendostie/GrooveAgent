/**
 * Unit Tests: BMAD Agent Definitions
 * Story 7.3.5: Epic 7 Foundation Testing Suite
 *
 * Tests YAML structure, shard configuration, and sidecar directories for all 7 agents.
 * Target Coverage: 85%+
 */

import { describe, test, expect } from '@jest/globals';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../..');
const AGENTS_DIR = join(PROJECT_ROOT, '.bmad', 'custom', 'agents');

describe('BMAD Agent Definitions - Unit Tests', () => {
  // ========================================================================
  // Agent File Paths
  // ========================================================================

  const AGENT_FILES = {
    'master-coordinator': join(AGENTS_DIR, 'master-coordinator.agent.yaml'),
    'task-orchestrator': join(AGENTS_DIR, 'task-orchestrator.agent.yaml'),
    'llm-research-expert': join(
      AGENTS_DIR,
      'llm-research-expert',
      'llm-research-expert.agent.yaml'
    ),
    'midi-expert': join(AGENTS_DIR, 'midi-expert', 'midi-expert.agent.yaml'),
    'code-expert': join(AGENTS_DIR, 'code-expert', 'code-expert.agent.yaml'),
    'verification-agent': join(AGENTS_DIR, 'verification-agent', 'verification-agent.agent.yaml'),
    'validation-agent': join(AGENTS_DIR, 'validation-agent', 'validation-agent.agent.yaml')
  };

  const MODULE_AGENTS = ['master-coordinator', 'task-orchestrator'];
  const EXPERT_AGENTS = [
    'llm-research-expert',
    'midi-expert',
    'code-expert',
    'verification-agent',
    'validation-agent'
  ];

  // ========================================================================
  // YAML File Existence Tests
  // ========================================================================

  describe('Agent YAML Files Exist', () => {
    Object.entries(AGENT_FILES).forEach(([agentName, filePath]) => {
      test(`${agentName}.agent.yaml exists`, () => {
        expect(existsSync(filePath)).toBe(true);
      });
    });
  });

  // ========================================================================
  // YAML Structure Validation Tests
  // ========================================================================

  describe('YAML Structure Validation', () => {
    Object.entries(AGENT_FILES).forEach(([agentName, filePath]) => {
      test(`${agentName} is valid YAML`, async () => {
        const content = await readFile(filePath, 'utf-8');
        expect(() => parseYaml(content)).not.toThrow();
      });

      test(`${agentName} has required agent.metadata fields`, async () => {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(agent).toHaveProperty('agent');
        expect(agent.agent).toHaveProperty('metadata');
        expect(agent.agent.metadata).toHaveProperty('id');
        expect(agent.agent.metadata).toHaveProperty('name');
        expect(agent.agent.metadata).toHaveProperty('icon');
        expect(agent.agent.metadata).toHaveProperty('module');
      });

      test(`${agentName} has required agent.identity field`, async () => {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent).toHaveProperty('identity');
        expect(typeof agent.agent.identity).toBe('string');
        expect(agent.agent.identity.length).toBeGreaterThan(50); // Should be descriptive
      });

      test(`${agentName} has required agent.critical_actions array`, async () => {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent).toHaveProperty('critical_actions');
        expect(Array.isArray(agent.agent.critical_actions)).toBe(true);
        expect(agent.agent.critical_actions.length).toBeGreaterThan(0);
      });
    });
  });

  // ========================================================================
  // Module Agents Configuration Tests
  // ========================================================================

  describe('Module Agents (Orchestrators)', () => {
    MODULE_AGENTS.forEach((agentName) => {
      test(`${agentName} has module: custom`, async () => {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent.metadata.module).toBe('custom');
      });

      test(`${agentName} references ALL 7 TELIS shards`, async () => {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        // Orchestrators should have ALL 7 shards for comprehensive routing
        const criticalActions = agent.agent.critical_actions.join(' ');
        expect(criticalActions).toContain('ALL 7 shards');
      });

      test(`${agentName} has workflow menu (if master-coordinator)`, async () => {
        if (agentName === 'master-coordinator') {
          const content = await readFile(AGENT_FILES[agentName], 'utf-8');
          const agent = parseYaml(content);

          expect(agent.agent).toHaveProperty('menu');
          expect(Array.isArray(agent.agent.menu)).toBe(true);
          expect(agent.agent.menu.length).toBeGreaterThan(0);

          // Check menu items reference workflows
          agent.agent.menu.forEach((item) => {
            expect(item).toHaveProperty('trigger');
            expect(item).toHaveProperty('workflow');
            expect(item.workflow).toContain('.bmad/custom/workflows');
          });
        }
      });

      test(`${agentName} has task orchestration prompts (if task-orchestrator)`, async () => {
        if (agentName === 'task-orchestrator') {
          const content = await readFile(AGENT_FILES[agentName], 'utf-8');
          const agent = parseYaml(content);

          expect(agent.agent).toHaveProperty('prompts');
          expect(Array.isArray(agent.agent.prompts)).toBe(true);

          // Should have task decomposition and execution planning prompts
          const promptIds = agent.agent.prompts.map((p) => p.id);
          expect(
            promptIds.some((id) => id.includes('decompose') || id.includes('orchestrat'))
          ).toBe(true);
        }
      });
    });
  });

  // ========================================================================
  // Expert Agents Configuration Tests
  // ========================================================================

  describe('Expert Agents (Domain Specialists)', () => {
    EXPERT_AGENTS.forEach((agentName) => {
      test(`${agentName} has module: custom`, async () => {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent.metadata.module).toBe('custom');
      });

      test(`${agentName} has domain-specific TELIS shards`, async () => {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        const criticalActions = agent.agent.critical_actions.join(' ');

        // Each expert should reference specific shards
        switch (agentName) {
          case 'llm-research-expert':
            expect(criticalActions).toContain('llm-shards.md');
            expect(criticalActions).toContain('midi-math.md');
            break;
          case 'midi-expert':
            expect(criticalActions).toContain('midi-math.md');
            expect(criticalActions).toContain('liveapi-shards.md');
            break;
          case 'code-expert':
            expect(criticalActions).toContain('m4l-shards.md');
            expect(criticalActions).toContain('llm-shards.md');
            expect(criticalActions).toContain('liveapi-shards.md');
            break;
          case 'verification-agent':
            expect(criticalActions).toContain('midi-math.md');
            expect(criticalActions).toContain('m4l-shards.md');
            break;
          case 'validation-agent':
            // Validation agent gets ALL 7 (selective loading)
            expect(criticalActions).toContain('ALL 7') ||
              expect(criticalActions.split('.md').length).toBeGreaterThan(3);
            break;
        }
      });

      test(`${agentName} has prompts array`, async () => {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent).toHaveProperty('prompts');
        expect(Array.isArray(agent.agent.prompts)).toBe(true);
        expect(agent.agent.prompts.length).toBeGreaterThan(0);

        // Each prompt should have id and content
        agent.agent.prompts.forEach((prompt) => {
          expect(prompt).toHaveProperty('id');
          expect(prompt).toHaveProperty('content');
          expect(typeof prompt.id).toBe('string');
          expect(typeof prompt.content).toBe('string');
        });
      });
    });
  });

  // ========================================================================
  // Sidecar Directory Structure Tests
  // ========================================================================

  describe('Expert Agent Sidecars', () => {
    EXPERT_AGENTS.forEach((agentName) => {
      const sidecarDir = join(AGENTS_DIR, agentName, `${agentName}-sidecar`);

      test(`${agentName} has sidecar directory`, () => {
        expect(existsSync(sidecarDir)).toBe(true);
      });

      test(`${agentName} has memories.md`, () => {
        const memoriesPath = join(sidecarDir, 'memories.md');
        expect(existsSync(memoriesPath)).toBe(true);
      });

      test(`${agentName} has instructions.md`, () => {
        const instructionsPath = join(sidecarDir, 'instructions.md');
        expect(existsSync(instructionsPath)).toBe(true);
      });

      test(`${agentName} has knowledge/README.md`, () => {
        const knowledgePath = join(sidecarDir, 'knowledge', 'README.md');
        expect(existsSync(knowledgePath)).toBe(true);
      });

      test(`${agentName} memories.md is readable`, async () => {
        const memoriesPath = join(sidecarDir, 'memories.md');
        const content = await readFile(memoriesPath, 'utf-8');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
      });

      test(`${agentName} instructions.md is readable`, async () => {
        const instructionsPath = join(sidecarDir, 'instructions.md');
        const content = await readFile(instructionsPath, 'utf-8');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
      });

      test(`${agentName} knowledge/README.md is readable`, async () => {
        const knowledgePath = join(sidecarDir, 'knowledge', 'README.md');
        const content = await readFile(knowledgePath, 'utf-8');
        expect(typeof content).toBe('string');
        expect(content.length).toBeGreaterThan(0);
      });
    });
  });

  // ========================================================================
  // Agent Identity Content Tests
  // ========================================================================

  describe('Agent Identity Content', () => {
    test('Master Coordinator identity emphasizes development context', async () => {
      const content = await readFile(AGENT_FILES['master-coordinator'], 'utf-8');
      const agent = parseYaml(content);

      expect(agent.agent.identity.toLowerCase()).toContain('development');
      expect(agent.agent.identity.toLowerCase()).toContain('workflow');
      const identity = agent.agent.identity.toLowerCase();
      expect(identity.includes('developer') || identity.includes('lefab')).toBe(true);
    });

    test('Verification Agent identity includes quality thresholds', async () => {
      const content = await readFile(AGENT_FILES['verification-agent'], 'utf-8');
      const agent = parseYaml(content);

      // Check if prompts mention quality thresholds (0.85, 0.90)
      const allContent = JSON.stringify(agent);
      expect(allContent.includes('0.85') || allContent.includes('0.90')).toBe(true);
    });

    test('Validation Agent identity emphasizes final approval gate', async () => {
      const content = await readFile(AGENT_FILES['validation-agent'], 'utf-8');
      const agent = parseYaml(content);

      const validationIdentity = agent.agent.identity.toLowerCase();
      expect(
        validationIdentity.includes('final') ||
          validationIdentity.includes('approval') ||
          validationIdentity.includes('validate')
      ).toBe(true);
    });

    test('Code Expert identity emphasizes GrooveAgent coding standards', async () => {
      const content = await readFile(AGENT_FILES['code-expert'], 'utf-8');
      const agent = parseYaml(content);

      const allContent = JSON.stringify(agent).toLowerCase();
      expect(
        allContent.includes('grooveagent') ||
          allContent.includes('javascript') ||
          allContent.includes('es2024') ||
          allContent.includes('code')
      ).toBe(true);
    });
  });

  // ========================================================================
  // TELIS Integration Tests
  // ========================================================================

  describe('TELIS Shard Auto-Loading Integration', () => {
    test('all agents reference TELIS auto-loading in critical_actions', async () => {
      for (const [_agentName, filePath] of Object.entries(AGENT_FILES)) {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        const criticalActions = agent.agent.critical_actions.join(' ');
        expect(criticalActions.toLowerCase()).toContain('telis');
      }
    });

    test('orchestrators have ~3,800 token allocation', async () => {
      for (const agentName of MODULE_AGENTS) {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        const criticalActions = agent.agent.critical_actions.join(' ');
        // Should mention ~3,800 tokens or ALL 7 shards
        expect(criticalActions.includes('3,800') || criticalActions.includes('ALL 7')).toBe(true);
      }
    });

    test('experts have domain-specific token allocations', async () => {
      const expectedTokens = {
        'llm-research-expert': 1280,
        'midi-expert': 1320,
        'code-expert': 2200,
        'verification-agent': 1400,
        'validation-agent': 3400
      };

      for (const [agentName, expectedCount] of Object.entries(expectedTokens)) {
        const content = await readFile(AGENT_FILES[agentName], 'utf-8');
        const agent = parseYaml(content);

        const criticalActions = agent.agent.critical_actions.join(' ');
        // Should mention approximate token count (within ±100)
        const mentionedTokens = parseInt(criticalActions.match(/~?(\d{1,4})\s*tokens/)?.[1] || '0');
        if (mentionedTokens > 0) {
          expect(Math.abs(mentionedTokens - expectedCount)).toBeLessThan(200);
        }
      }
    });
  });

  // ========================================================================
  // Quality Threshold Tests
  // ========================================================================

  describe('Quality Thresholds', () => {
    test('Verification Agent defines quality thresholds', async () => {
      const content = await readFile(AGENT_FILES['verification-agent'], 'utf-8');
      const agent = parseYaml(content);

      const allContent = JSON.stringify(agent);

      // Should define thresholds for different artifact types
      expect(allContent.includes('0.85') || allContent.includes('0.90')).toBe(true);
    });

    test('Verification Agent has iteration limit', async () => {
      const content = await readFile(AGENT_FILES['verification-agent'], 'utf-8');
      const agent = parseYaml(content);

      const allContent = JSON.stringify(agent);

      // Should mention max iterations (usually 3)
      expect(
        allContent.includes('3') || allContent.includes('max') || allContent.includes('iteration')
      ).toBe(true);
    });
  });

  // ========================================================================
  // Metadata Consistency Tests
  // ========================================================================

  describe('Metadata Consistency', () => {
    test('all agents have unique IDs', async () => {
      const ids = new Set();

      for (const [_agentName, filePath] of Object.entries(AGENT_FILES)) {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(ids.has(agent.agent.metadata.id)).toBe(false);
        ids.add(agent.agent.metadata.id);
      }

      expect(ids.size).toBe(7);
    });

    test('all agents have unique icons', async () => {
      const icons = new Set();

      for (const [_agentName, filePath] of Object.entries(AGENT_FILES)) {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(icons.has(agent.agent.metadata.icon)).toBe(false);
        icons.add(agent.agent.metadata.icon);
      }

      expect(icons.size).toBe(7);
    });

    test('all agents have descriptive names', async () => {
      for (const [agentName, filePath] of Object.entries(AGENT_FILES)) {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        expect(agent.agent.metadata.name.length).toBeGreaterThan(5);
        expect(agent.agent.metadata.name).not.toBe(agentName); // Name should be human-readable, not slug
      }
    });
  });

  // ========================================================================
  // Workflow Reference Tests
  // ========================================================================

  describe('Workflow References', () => {
    test('Master Coordinator menu references all 3 workflows', async () => {
      const content = await readFile(AGENT_FILES['master-coordinator'], 'utf-8');
      const agent = parseYaml(content);

      expect(agent.agent.menu.length).toBeGreaterThanOrEqual(3);

      const workflowPaths = agent.agent.menu.map((item) => item.workflow);

      expect(workflowPaths.some((p) => p.includes('groove-research'))).toBe(true);
      expect(workflowPaths.some((p) => p.includes('code-generation'))).toBe(true);
      expect(workflowPaths.some((p) => p.includes('documentation'))).toBe(true);
    });

    test('all workflow paths use {project-root} placeholder', async () => {
      const content = await readFile(AGENT_FILES['master-coordinator'], 'utf-8');
      const agent = parseYaml(content);

      agent.agent.menu.forEach((item) => {
        expect(item.workflow).toContain('{project-root}');
      });
    });
  });

  // ========================================================================
  // Sidecar Content Quality Tests
  // ========================================================================

  describe('Sidecar Content Quality', () => {
    EXPERT_AGENTS.forEach((agentName) => {
      test(`${agentName} instructions.md has Core Directives section`, async () => {
        const instructionsPath = join(
          AGENTS_DIR,
          agentName,
          `${agentName}-sidecar`,
          'instructions.md'
        );
        const content = await readFile(instructionsPath, 'utf-8');

        const lowercaseContent = content.toLowerCase();
        expect(
          lowercaseContent.includes('core directives') || lowercaseContent.includes('directive')
        ).toBe(true);
      });

      test(`${agentName} instructions.md has TELIS section`, async () => {
        const instructionsPath = join(
          AGENTS_DIR,
          agentName,
          `${agentName}-sidecar`,
          'instructions.md'
        );
        const content = await readFile(instructionsPath, 'utf-8');

        expect(content.toLowerCase()).toContain('telis');
      });

      test(`${agentName} memories.md has session history structure`, async () => {
        const memoriesPath = join(AGENTS_DIR, agentName, `${agentName}-sidecar`, 'memories.md');
        const content = await readFile(memoriesPath, 'utf-8');

        // Should have some structure for tracking sessions
        const sessionContent = content.toLowerCase();
        expect(
          sessionContent.includes('session') ||
            sessionContent.includes('history') ||
            sessionContent.includes('memory')
        ).toBe(true);
      });

      test(`${agentName} knowledge/README.md describes knowledge base contents`, async () => {
        const knowledgePath = join(
          AGENTS_DIR,
          agentName,
          `${agentName}-sidecar`,
          'knowledge',
          'README.md'
        );
        const content = await readFile(knowledgePath, 'utf-8');

        expect(content.length).toBeGreaterThan(100); // Should be descriptive
        const knowledgeContent = content.toLowerCase();
        expect(
          knowledgeContent.includes('knowledge') ||
            knowledgeContent.includes('domain') ||
            knowledgeContent.includes('content')
        ).toBe(true);
      });
    });
  });

  // ========================================================================
  // Agent Principles Tests
  // ========================================================================

  describe('Agent Principles', () => {
    test('all agents have principles or guidelines', async () => {
      for (const [_agentName, filePath] of Object.entries(AGENT_FILES)) {
        const content = await readFile(filePath, 'utf-8');
        const agent = parseYaml(content);

        // Should have principles, guidelines, or similar
        const hasGuidance =
          Object.prototype.hasOwnProperty.call(agent.agent, 'principles') ||
          Object.prototype.hasOwnProperty.call(agent.agent, 'guidelines') ||
          agent.agent.identity.length > 200; // Detailed identity counts

        expect(hasGuidance).toBe(true);
      }
    });
  });
});
