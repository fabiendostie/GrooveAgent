/**
 * Directory Structure Tests
 * Verifies AC1: All required directories exist
 *
 * @module tests/structure/directory-structure
 */

import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('Directory Structure (AC1)', () => {
  const requiredDirectories = [
    'src/node',
    'src/node/llm',
    'src/node/midi',
    'src/node/clip',
    'src/node/utils',
    'src/max',
    'docs/context'
  ];

  test.each(requiredDirectories)('%s directory exists', (dir) => {
    const fullPath = join(projectRoot, dir);
    expect(existsSync(fullPath)).toBe(true);
  });
});
