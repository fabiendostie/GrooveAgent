/**
 * Mock for max-api module
 * Used in unit tests to simulate Max for Live environment
 *
 * @module tests/__mocks__/max-api
 */

import { jest } from '@jest/globals';

/** @type {jest.Mock} */
export const outlet = jest.fn();

/** @type {jest.Mock} */
export const post = jest.fn();

/** @type {jest.Mock} */
export const addHandler = jest.fn();

/**
 * Reset all mocks
 */
export function resetMocks() {
  outlet.mockReset();
  post.mockReset();
  addHandler.mockReset();
}

export default {
  outlet,
  post,
  addHandler
};
