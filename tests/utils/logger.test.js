/**
 * Unit Tests for Logger Module
 * Tests log levels, data parameter, Max console integration
 *
 * AC1: Logger module enhanced with data parameter
 * AC2: Log levels work correctly
 * AC3: Logs appear in Max console
 *
 * @module tests/utils/logger
 */

import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import {
  LOG_PREFIX,
  Level,
  setMaxApiPost,
  setTimestamp,
  log,
  info,
  error,
  debug,
  warn
} from '../../src/node/utils/logger.js';

describe('Logger Module', () => {
  let consoleSpy;
  let mockMaxApiPost;

  beforeEach(() => {
    // Reset mocks
    mockMaxApiPost = jest.fn();
    setMaxApiPost(mockMaxApiPost);
    setTimestamp(false);

    // Spy on console methods
    consoleSpy = {
      log: jest.spyOn(console, 'log').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      debug: jest.spyOn(console, 'debug').mockImplementation()
    };
  });

  afterEach(() => {
    // Restore console methods
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    setMaxApiPost(null);
  });

  // ===========================================================================
  // Constants and exports
  // ===========================================================================
  describe('Constants and exports', () => {
    test('LOG_PREFIX is [GrooveAgent]', () => {
      expect(LOG_PREFIX).toBe('[GrooveAgent]');
    });

    test('Level enum has DEBUG, INFO, WARN, ERROR', () => {
      expect(Level.DEBUG).toBe('DEBUG');
      expect(Level.INFO).toBe('INFO');
      expect(Level.WARN).toBe('WARN');
      expect(Level.ERROR).toBe('ERROR');
    });

    test('exports all expected functions', () => {
      expect(typeof setMaxApiPost).toBe('function');
      expect(typeof setTimestamp).toBe('function');
      expect(typeof log).toBe('function');
      expect(typeof info).toBe('function');
      expect(typeof error).toBe('function');
      expect(typeof debug).toBe('function');
      expect(typeof warn).toBe('function');
    });
  });

  // ===========================================================================
  // AC2: Log levels work correctly
  // ===========================================================================
  describe('AC2: Log levels use correct console methods', () => {
    test('ERROR level uses console.error', () => {
      log(Level.ERROR, 'test', 'error message');
      expect(consoleSpy.error).toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('WARN level uses console.warn', () => {
      log(Level.WARN, 'test', 'warn message');
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('INFO level uses console.log', () => {
      log(Level.INFO, 'test', 'info message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test('DEBUG level uses console.debug', () => {
      log(Level.DEBUG, 'test', 'debug message');
      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    test('unknown level defaults to console.log', () => {
      log('UNKNOWN', 'test', 'unknown message');
      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // AC1: Logger supports optional data parameter
  // ===========================================================================
  describe('AC1: Optional data parameter', () => {
    test('log includes data in console output when provided', () => {
      const data = { artist: 'J Dilla' };
      log(Level.INFO, 'LLM', 'Researching artist', data);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] LLM: Researching artist'),
        data
      );
    });

    test('log works without data parameter', () => {
      log(Level.INFO, 'test', 'no data');

      expect(consoleSpy.log).toHaveBeenCalledWith(expect.stringContaining('[INFO] test: no data'));
    });

    test('log handles null data gracefully', () => {
      log(Level.INFO, 'test', 'null data', null);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test: null data')
      );
    });

    test('log handles undefined data gracefully', () => {
      log(Level.INFO, 'test', 'undefined data', undefined);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] test: undefined data')
      );
    });

    test('error convenience function passes data', () => {
      const data = { errorCode: 'E001' };
      error('ctx', 'error msg', data);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] ctx: error msg'),
        data
      );
    });

    test('warn convenience function passes data', () => {
      const data = { warning: true };
      warn('ctx', 'warn msg', data);

      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] ctx: warn msg'),
        data
      );
    });

    test('info convenience function passes data', () => {
      const data = { info: 'value' };
      info('ctx', 'info msg', data);

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] ctx: info msg'),
        data
      );
    });

    test('debug convenience function passes data', () => {
      const data = { debug: 'value' };
      debug('ctx', 'debug msg', data);

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] ctx: debug msg'),
        data
      );
    });
  });

  // ===========================================================================
  // AC3: Logs appear in Max console
  // ===========================================================================
  describe('AC3: Max console integration', () => {
    test('maxApi.post is called with formatted message', () => {
      log(Level.INFO, 'cmd', 'test message');

      expect(mockMaxApiPost).toHaveBeenCalled();
      expect(mockMaxApiPost).toHaveBeenCalledWith(
        expect.stringContaining('[GrooveAgent] [INFO] cmd: test message')
      );
    });

    test('maxApi.post includes stringified data', () => {
      const data = { key: 'value' };
      log(Level.INFO, 'ctx', 'with data', data);

      expect(mockMaxApiPost).toHaveBeenCalledWith(expect.stringContaining('{"key":"value"}'));
    });

    test('handles non-stringifiable data gracefully', () => {
      const circular = {};
      circular.self = circular;

      // Should not throw
      expect(() => {
        log(Level.INFO, 'ctx', 'circular data', circular);
      }).not.toThrow();

      expect(mockMaxApiPost).toHaveBeenCalled();
    });

    test('log works when maxApiPost is null', () => {
      setMaxApiPost(null);

      expect(() => {
        log(Level.INFO, 'test', 'no max api');
      }).not.toThrow();

      expect(consoleSpy.log).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // Timestamp support
  // ===========================================================================
  describe('Timestamp support', () => {
    test('timestamp not included by default', () => {
      log(Level.INFO, 'test', 'no timestamp');

      const call = consoleSpy.log.mock.calls[0][0];
      // ISO timestamp format check - should NOT match
      expect(call).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    test('timestamp included when enabled', () => {
      setTimestamp(true);
      log(Level.INFO, 'test', 'with timestamp');

      const call = consoleSpy.log.mock.calls[0][0];
      // Should start with ISO timestamp
      expect(call).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    test('timestamp can be disabled after enabling', () => {
      setTimestamp(true);
      setTimestamp(false);
      log(Level.INFO, 'test', 'disabled timestamp');

      const call = consoleSpy.log.mock.calls[0][0];
      expect(call).not.toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });
  });

  // ===========================================================================
  // Log message formatting
  // ===========================================================================
  describe('Log message formatting', () => {
    test('format includes prefix, level, context, message', () => {
      log(Level.INFO, 'myContext', 'myMessage');

      expect(consoleSpy.log).toHaveBeenCalledWith('[GrooveAgent] [INFO] myContext: myMessage');
    });

    test('convenience functions format correctly', () => {
      info('ctx', 'info msg');
      expect(consoleSpy.log).toHaveBeenCalledWith('[GrooveAgent] [INFO] ctx: info msg');

      error('ctx', 'error msg');
      expect(consoleSpy.error).toHaveBeenCalledWith('[GrooveAgent] [ERROR] ctx: error msg');

      warn('ctx', 'warn msg');
      expect(consoleSpy.warn).toHaveBeenCalledWith('[GrooveAgent] [WARN] ctx: warn msg');

      debug('ctx', 'debug msg');
      expect(consoleSpy.debug).toHaveBeenCalledWith('[GrooveAgent] [DEBUG] ctx: debug msg');
    });
  });

  // ===========================================================================
  // Backward compatibility
  // ===========================================================================
  describe('Backward compatibility', () => {
    test('log works with 3 parameters (level, context, message)', () => {
      expect(() => {
        log(Level.INFO, 'ctx', 'message');
      }).not.toThrow();

      expect(consoleSpy.log).toHaveBeenCalled();
    });

    test('convenience functions work with 2 parameters', () => {
      expect(() => {
        info('ctx', 'message');
        error('ctx', 'message');
        warn('ctx', 'message');
        debug('ctx', 'message');
      }).not.toThrow();
    });
  });
});
