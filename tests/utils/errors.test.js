/**
 * Unit Tests for Error Utilities Module
 * Tests ErrorCode enum, getSuggestion, categorizeError, and createError
 *
 * AC4: Error codes defined
 * AC5: Error suggestions provided
 * AC6: Error categorization works
 *
 * @module tests/utils/errors
 */

import { describe, test, expect } from '@jest/globals';
import {
  ErrorCode,
  getSuggestion,
  categorizeError,
  createError,
  DEFAULT_SUGGESTION
} from '../../src/node/utils/errors.js';

describe('Error Utilities Module', () => {
  // ===========================================================================
  // AC4: Error codes defined
  // ===========================================================================
  describe('ErrorCode enum', () => {
    test('defines all system error codes', () => {
      expect(ErrorCode.UNKNOWN_COMMAND).toBe('UNKNOWN_COMMAND');
      expect(ErrorCode.INVALID_PARAMS).toBe('INVALID_PARAMS');
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR');
    });

    test('defines all LLM error codes', () => {
      expect(ErrorCode.LLM_UNAVAILABLE).toBe('LLM_UNAVAILABLE');
      expect(ErrorCode.LLM_TIMEOUT).toBe('LLM_TIMEOUT');
      expect(ErrorCode.LLM_RATE_LIMITED).toBe('LLM_RATE_LIMITED');
    });

    test('defines all clip error codes', () => {
      expect(ErrorCode.CLIP_EMPTY).toBe('CLIP_EMPTY');
      expect(ErrorCode.CLIP_TOO_LONG).toBe('CLIP_TOO_LONG');
      expect(ErrorCode.NO_EMPTY_SLOTS).toBe('NO_EMPTY_SLOTS');
    });

    test('defines recipe and config error codes', () => {
      expect(ErrorCode.LOW_CONFIDENCE).toBe('LOW_CONFIDENCE');
      expect(ErrorCode.INVALID_CONFIG).toBe('INVALID_CONFIG');
    });

    test('uses SCREAMING_SNAKE_CASE format', () => {
      const errorCodes = Object.keys(ErrorCode);
      const screaming = /^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$/;

      errorCodes.forEach((code) => {
        expect(code).toMatch(screaming);
        expect(ErrorCode[code]).toMatch(screaming);
      });
    });

    test('has exactly 11 error codes', () => {
      const codeCount = Object.keys(ErrorCode).length;
      expect(codeCount).toBe(11);
    });
  });

  // ===========================================================================
  // AC5: Error suggestions provided
  // ===========================================================================
  describe('getSuggestion function', () => {
    test('returns suggestion for UNKNOWN_COMMAND', () => {
      const suggestion = getSuggestion(ErrorCode.UNKNOWN_COMMAND);
      expect(suggestion).toContain('command');
    });

    test('returns suggestion for INVALID_PARAMS', () => {
      const suggestion = getSuggestion(ErrorCode.INVALID_PARAMS);
      expect(suggestion).toContain('request');
    });

    test('returns suggestion for INTERNAL_ERROR', () => {
      const suggestion = getSuggestion(ErrorCode.INTERNAL_ERROR);
      expect(suggestion).toContain('console');
    });

    test('returns suggestion for LLM_UNAVAILABLE', () => {
      const suggestion = getSuggestion(ErrorCode.LLM_UNAVAILABLE);
      expect(suggestion).toContain('LLM');
    });

    test('returns suggestion for LLM_TIMEOUT', () => {
      const suggestion = getSuggestion(ErrorCode.LLM_TIMEOUT);
      expect(suggestion).toContain('timed out');
    });

    test('returns suggestion for LLM_RATE_LIMITED', () => {
      const suggestion = getSuggestion(ErrorCode.LLM_RATE_LIMITED);
      expect(suggestion).toContain('Rate');
    });

    test('returns suggestion for CLIP_EMPTY', () => {
      const suggestion = getSuggestion(ErrorCode.CLIP_EMPTY);
      expect(suggestion).toContain('clip');
    });

    test('returns suggestion for CLIP_TOO_LONG', () => {
      const suggestion = getSuggestion(ErrorCode.CLIP_TOO_LONG);
      expect(suggestion).toContain('16');
    });

    test('returns suggestion for NO_EMPTY_SLOTS', () => {
      const suggestion = getSuggestion(ErrorCode.NO_EMPTY_SLOTS);
      expect(suggestion).toContain('slot');
    });

    test('returns suggestion for LOW_CONFIDENCE', () => {
      const suggestion = getSuggestion(ErrorCode.LOW_CONFIDENCE);
      expect(suggestion).toContain('sources');
    });

    test('returns suggestion for INVALID_CONFIG', () => {
      const suggestion = getSuggestion(ErrorCode.INVALID_CONFIG);
      expect(suggestion).toContain('Settings');
    });

    test('all ErrorCodes have corresponding suggestions', () => {
      Object.values(ErrorCode).forEach((code) => {
        const suggestion = getSuggestion(code);
        expect(suggestion).toBeDefined();
        expect(typeof suggestion).toBe('string');
        expect(suggestion.length).toBeGreaterThan(0);
        expect(suggestion).not.toBe(DEFAULT_SUGGESTION);
      });
    });

    test('returns generic suggestion for unknown codes', () => {
      const suggestion = getSuggestion('UNKNOWN_CODE_XYZ');
      expect(suggestion).toBe(DEFAULT_SUGGESTION);
    });

    test('returns generic suggestion for null', () => {
      const suggestion = getSuggestion(null);
      expect(suggestion).toBe(DEFAULT_SUGGESTION);
    });

    test('returns generic suggestion for undefined', () => {
      const suggestion = getSuggestion(undefined);
      expect(suggestion).toBe(DEFAULT_SUGGESTION);
    });
  });

  // ===========================================================================
  // AC6: Error categorization works
  // ===========================================================================
  describe('categorizeError function', () => {
    test('identifies timeout errors by code', () => {
      const error = new Error('Request failed');
      error.code = 'ETIMEDOUT';
      expect(categorizeError(error)).toBe(ErrorCode.LLM_TIMEOUT);
    });

    test('identifies timeout errors by message', () => {
      const error = new Error('Request timed out after 30s');
      expect(categorizeError(error)).toBe(ErrorCode.LLM_TIMEOUT);
    });

    test('identifies network errors by ECONNREFUSED', () => {
      const error = new Error('connect failed');
      error.code = 'ECONNREFUSED';
      expect(categorizeError(error)).toBe(ErrorCode.LLM_UNAVAILABLE);
    });

    test('identifies network errors by ENOTFOUND', () => {
      const error = new Error('host not found');
      error.code = 'ENOTFOUND';
      expect(categorizeError(error)).toBe(ErrorCode.LLM_UNAVAILABLE);
    });

    test('identifies network errors by ECONNRESET', () => {
      const error = new Error('connection reset');
      error.code = 'ECONNRESET';
      expect(categorizeError(error)).toBe(ErrorCode.LLM_UNAVAILABLE);
    });

    test('identifies network errors by message', () => {
      const error = new Error('Network connection refused');
      expect(categorizeError(error)).toBe(ErrorCode.LLM_UNAVAILABLE);
    });

    test('identifies fetch failed errors', () => {
      const error = new Error('fetch failed');
      expect(categorizeError(error)).toBe(ErrorCode.LLM_UNAVAILABLE);
    });

    test('identifies rate limit errors by message', () => {
      const error = new Error('Rate limit exceeded');
      expect(categorizeError(error)).toBe(ErrorCode.LLM_RATE_LIMITED);
    });

    test('identifies rate limit errors by status 429', () => {
      const error = new Error('Too many requests');
      error.status = 429;
      expect(categorizeError(error)).toBe(ErrorCode.LLM_RATE_LIMITED);
    });

    test('identifies validation errors by invalid message', () => {
      const error = new Error('Invalid parameter value');
      expect(categorizeError(error)).toBe(ErrorCode.INVALID_PARAMS);
    });

    test('identifies validation errors by missing message', () => {
      const error = new Error('Missing required field');
      expect(categorizeError(error)).toBe(ErrorCode.INVALID_PARAMS);
    });

    test('identifies config errors', () => {
      const error = new Error('Config file corrupted');
      expect(categorizeError(error)).toBe(ErrorCode.INVALID_CONFIG);
    });

    test('identifies settings errors', () => {
      const error = new Error('Settings cannot be loaded');
      expect(categorizeError(error)).toBe(ErrorCode.INVALID_CONFIG);
    });

    test('defaults to INTERNAL_ERROR for unknown errors', () => {
      const error = new Error('Something went wrong');
      expect(categorizeError(error)).toBe(ErrorCode.INTERNAL_ERROR);
    });

    test('defaults to INTERNAL_ERROR for null', () => {
      expect(categorizeError(null)).toBe(ErrorCode.INTERNAL_ERROR);
    });

    test('defaults to INTERNAL_ERROR for undefined', () => {
      expect(categorizeError(undefined)).toBe(ErrorCode.INTERNAL_ERROR);
    });

    test('handles error with no message', () => {
      const error = new Error();
      expect(categorizeError(error)).toBe(ErrorCode.INTERNAL_ERROR);
    });
  });

  // ===========================================================================
  // createError helper
  // ===========================================================================
  describe('createError function', () => {
    test('creates error detail with code, message, suggestion', () => {
      const error = createError(ErrorCode.CLIP_EMPTY, 'Clip has no notes');

      expect(error.code).toBe(ErrorCode.CLIP_EMPTY);
      expect(error.message).toBe('Clip has no notes');
      expect(error.suggestion).toBeDefined();
    });

    test('auto-populates suggestion from getSuggestion', () => {
      const error = createError(ErrorCode.LLM_TIMEOUT, 'Request timed out');

      expect(error.suggestion).toContain('timed out');
    });

    test('uses custom suggestion when provided', () => {
      const customSuggestion = 'Custom advice here';
      const error = createError(ErrorCode.INTERNAL_ERROR, 'Something broke', customSuggestion);

      expect(error.suggestion).toBe(customSuggestion);
    });

    test('returns object with exactly 3 properties', () => {
      const error = createError(ErrorCode.UNKNOWN_COMMAND, 'Unknown');
      const keys = Object.keys(error);

      expect(keys).toHaveLength(3);
      expect(keys).toContain('code');
      expect(keys).toContain('message');
      expect(keys).toContain('suggestion');
    });
  });
});
