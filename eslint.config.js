/**
 * ESLint Configuration for GrooveAgent
 * Flat config format (ESLint 9.x compatible)
 */

import js from '@eslint/js';

export default [
  // Base recommended rules
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'src/node/node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.cursor/**',
      '.bmad/**'
    ]
  },

  // JavaScript files configuration
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        // Node.js globals
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        // Jest globals
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      // Error prevention
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'no-undef': 'error',
      'no-console': 'off', // We use console for logging

      // Code quality
      eqeqeq: ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',

      // Style (enforced by Prettier, but good to have)
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],

      // Best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-return-await': 'error',
      'require-await': 'error'
    }
  },

  // Test files
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      sourceType: 'module'
    }
  }
];
