/**
 * Jest Configuration for GrooveAgent
 * ES Module compatible configuration
 *
 * Story 7.3.5: Added coverage thresholds for Epic 7 Foundation Testing
 */

export default {
  testEnvironment: 'node',
  transform: {},
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'tests/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'text-summary'],

  // Coverage thresholds (Story 7.3.5: Epic 7 Foundation Testing)
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    // Critical components require higher coverage
    './src/node/commands/workflow-dispatcher.js': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Files to collect coverage from
  collectCoverageFrom: [
    'src/node/**/*.js',
    '!src/node/**/*.test.js',
    '!src/node/index.js', // Entry point, tested via integration
    '!**/node_modules/**'
  ],

  // Setup files
  setupFilesAfterEnv: [],

  // Test timeout
  testTimeout: 10000
};
