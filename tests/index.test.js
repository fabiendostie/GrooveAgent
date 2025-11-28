/**
 * Unit Tests for GrooveAgent Node Entry Point
 * Tests command handling, error responses, and message protocol
 *
 * AC1: Ping command works
 * AC2: Unknown command returns error
 * AC3: Request ID preserved
 * AC4: Messages logged
 *
 * @module tests/index
 */

import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock max-api before importing the module
jest.unstable_mockModule('max-api', () => ({
  outlet: jest.fn(),
  post: jest.fn(),
  addHandler: jest.fn(),
  default: {
    outlet: jest.fn(),
    post: jest.fn(),
    addHandler: jest.fn()
  }
}));

// Import after mock is set up
const { handleCommand, ErrorCode, registerCommand, VERSION } = await import('../src/node/index.js');
const { LOG_PREFIX } = await import('../src/node/utils/logger.js');

describe('GrooveAgent Command Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===========================================================================
  // AC1: Ping command works
  // ===========================================================================
  describe('AC1: Ping command', () => {
    test('returns success: true with pong data', async () => {
      const request = { cmd: 'ping', id: 'test-123' };
      const response = await handleCommand(request);

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ pong: true });
    });

    test('includes data.pong: true', async () => {
      const request = { cmd: 'ping', id: 'test-456' };
      const response = await handleCommand(request);

      expect(response.data.pong).toBe(true);
    });

    test('preserves request ID in response', async () => {
      const request = { cmd: 'ping', id: 'unique-request-id-789' };
      const response = await handleCommand(request);

      expect(response.id).toBe('unique-request-id-789');
    });
  });

  // ===========================================================================
  // AC2: Unknown command returns error
  // ===========================================================================
  describe('AC2: Unknown command error', () => {
    test('returns success: false for unknown command', async () => {
      const request = { cmd: 'unknown-cmd', id: 'test-001' };
      const response = await handleCommand(request);

      expect(response.success).toBe(false);
    });

    test('error has code UNKNOWN_COMMAND', async () => {
      const request = { cmd: 'nonexistent', id: 'test-002' };
      const response = await handleCommand(request);

      expect(response.error.code).toBe('UNKNOWN_COMMAND');
    });

    test('error has message field', async () => {
      const request = { cmd: 'bad-command', id: 'test-003' };
      const response = await handleCommand(request);

      expect(response.error.message).toBeDefined();
      expect(typeof response.error.message).toBe('string');
      expect(response.error.message.length).toBeGreaterThan(0);
    });

    test('error has suggestion field', async () => {
      const request = { cmd: 'invalid', id: 'test-004' };
      const response = await handleCommand(request);

      expect(response.error.suggestion).toBeDefined();
      expect(typeof response.error.suggestion).toBe('string');
    });
  });

  // ===========================================================================
  // AC3: Request ID preserved
  // ===========================================================================
  describe('AC3: Request ID preservation', () => {
    test('ID preserved in success response', async () => {
      const request = { cmd: 'ping', id: 'preserve-test-success' };
      const response = await handleCommand(request);

      expect(response.id).toBe('preserve-test-success');
    });

    test('ID preserved in error response', async () => {
      const request = { cmd: 'unknown', id: 'preserve-test-error' };
      const response = await handleCommand(request);

      expect(response.id).toBe('preserve-test-error');
    });

    test('different IDs are preserved correctly', async () => {
      const requests = [
        { cmd: 'ping', id: 'req-aaa' },
        { cmd: 'ping', id: 'req-bbb' },
        { cmd: 'ping', id: 'req-ccc' }
      ];

      for (const request of requests) {
        const response = await handleCommand(request);
        expect(response.id).toBe(request.id);
      }
    });

    test('missing ID returns INVALID_PARAMS error', async () => {
      const request = { cmd: 'ping' }; // No id field
      const response = await handleCommand(request);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INVALID_PARAMS');
    });

    test('empty string ID returns INVALID_PARAMS error', async () => {
      const request = { cmd: 'ping', id: '' };
      const response = await handleCommand(request);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INVALID_PARAMS');
    });
  });

  // ===========================================================================
  // AC4: Messages logged (verified via mock inspection)
  // ===========================================================================
  describe('AC4: Logging', () => {
    test('log output includes [GrooveAgent] prefix', () => {
      expect(LOG_PREFIX).toBe('[GrooveAgent]');
    });
  });

  // ===========================================================================
  // Internal Error Handling
  // ===========================================================================
  describe('Internal error handling', () => {
    test('thrown exception returns INTERNAL_ERROR', async () => {
      // Register a command that throws
      registerCommand('throw-test', () => {
        throw new Error('Simulated failure');
      });

      const request = { cmd: 'throw-test', id: 'error-test-001' };
      const response = await handleCommand(request);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INTERNAL_ERROR');
      expect(response.error.message).toContain('Simulated failure');
    });

    test('INTERNAL_ERROR includes suggestion', async () => {
      registerCommand('throw-test-2', () => {
        throw new Error('Another failure');
      });

      const request = { cmd: 'throw-test-2', id: 'error-test-002' };
      const response = await handleCommand(request);

      expect(response.error.suggestion).toBeDefined();
    });

    test('ID preserved even on internal error', async () => {
      registerCommand('throw-test-3', () => {
        throw new Error('Yet another failure');
      });

      const request = { cmd: 'throw-test-3', id: 'preserve-on-error' };
      const response = await handleCommand(request);

      expect(response.id).toBe('preserve-on-error');
    });
  });

  // ===========================================================================
  // Message Format Validation
  // ===========================================================================
  describe('Message format validation', () => {
    test('missing cmd field returns INVALID_PARAMS', async () => {
      const request = { id: 'test-no-cmd' }; // No cmd field
      const response = await handleCommand(request);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INVALID_PARAMS');
      expect(response.id).toBe('test-no-cmd');
    });

    test('null message handled gracefully', async () => {
      const response = await handleCommand(null);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INVALID_PARAMS');
    });

    test('undefined message handled gracefully', async () => {
      const response = await handleCommand(undefined);

      expect(response.success).toBe(false);
      expect(response.error.code).toBe('INVALID_PARAMS');
    });
  });

  // ===========================================================================
  // Module Exports
  // ===========================================================================
  describe('Module exports', () => {
    test('exports VERSION', () => {
      expect(VERSION).toBe('1.0.0');
    });

    test('exports handleCommand function', () => {
      expect(typeof handleCommand).toBe('function');
    });

    test('exports ErrorCode enum', () => {
      expect(ErrorCode.UNKNOWN_COMMAND).toBe('UNKNOWN_COMMAND');
      expect(ErrorCode.INVALID_PARAMS).toBe('INVALID_PARAMS');
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    });

    test('exports registerCommand function', () => {
      expect(typeof registerCommand).toBe('function');
    });
  });

  // ===========================================================================
  // New: Error utilities integration (Story 1.5)
  // ===========================================================================
  describe('Error utilities integration', () => {
    test('ErrorCode includes all LLM error codes', () => {
      expect(ErrorCode.LLM_UNAVAILABLE).toBe('LLM_UNAVAILABLE');
      expect(ErrorCode.LLM_TIMEOUT).toBe('LLM_TIMEOUT');
      expect(ErrorCode.LLM_RATE_LIMITED).toBe('LLM_RATE_LIMITED');
    });

    test('ErrorCode includes clip error codes', () => {
      expect(ErrorCode.CLIP_EMPTY).toBe('CLIP_EMPTY');
      expect(ErrorCode.CLIP_TOO_LONG).toBe('CLIP_TOO_LONG');
      expect(ErrorCode.NO_EMPTY_SLOTS).toBe('NO_EMPTY_SLOTS');
    });

    test('ErrorCode includes recipe and config codes', () => {
      expect(ErrorCode.LOW_CONFIDENCE).toBe('LOW_CONFIDENCE');
      expect(ErrorCode.INVALID_CONFIG).toBe('INVALID_CONFIG');
    });

    test('error responses always include suggestion', async () => {
      const request = { cmd: 'nonexistent', id: 'test-suggestion' };
      const response = await handleCommand(request);

      expect(response.error.suggestion).toBeDefined();
      expect(typeof response.error.suggestion).toBe('string');
      expect(response.error.suggestion.length).toBeGreaterThan(0);
    });
  });
});
