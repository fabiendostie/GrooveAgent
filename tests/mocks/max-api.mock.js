/**
 * Max API Mock
 * Story 7.3.5: Epic 7 Foundation Testing Suite
 *
 * Mocks the max-api module for testing Node.js code without Max/MSP runtime.
 */

/**
 * Mock outlet function for sending messages to Max
 */
export const outlet = jest.fn((_port, ..._args) => {
  // Mock implementation - just track calls
  return undefined;
});

/**
 * Mock addHandler function for registering message handlers
 */
export const addHandler = jest.fn((_messageName, _handler) => {
  // Mock implementation - store handlers for testing
  return undefined;
});

/**
 * Mock getDict function for reading from Max dictionaries
 */
export const getDict = jest.fn((_dictName) => {
  // Return empty dict by default
  return {};
});

/**
 * Mock setDict function for writing to Max dictionaries
 */
export const setDict = jest.fn((_dictName, _value) => {
  return undefined;
});

/**
 * Mock post function for logging to Max console
 */
export const post = jest.fn((...args) => {
  // Redirect to console.log for testing
  console.log('[Max API Mock]', ...args);
});

/**
 * Reset all mocks (call in beforeEach)
 */
export function resetMocks() {
  outlet.mockClear();
  addHandler.mockClear();
  getDict.mockClear();
  setDict.mockClear();
  post.mockClear();
}

// Default export for CommonJS-style imports
export default {
  outlet,
  addHandler,
  getDict,
  setDict,
  post,
  resetMocks
};
