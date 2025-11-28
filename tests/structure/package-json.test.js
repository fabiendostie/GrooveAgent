/**
 * Package.json Tests
 * Verifies AC2: package.json structure and AC4: dependencies
 *
 * @module tests/structure/package-json
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');
const nodeDir = join(projectRoot, 'src', 'node');

describe('package.json (AC2)', () => {
  let packageJson;

  beforeAll(() => {
    const pkgPath = join(nodeDir, 'package.json');
    expect(existsSync(pkgPath)).toBe(true);
    packageJson = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  });

  test('has name grooveagent-node', () => {
    expect(packageJson.name).toBe('grooveagent-node');
  });

  test('has type: commonjs for M4L compatibility', () => {
    expect(packageJson.type).toBe('commonjs');
  });

  test('has max-api in dependencies', () => {
    expect(packageJson.dependencies).toHaveProperty('max-api');
  });

  test('has engines.node >= 20.0.0', () => {
    expect(packageJson.engines).toHaveProperty('node');
    expect(packageJson.engines.node).toMatch(/>=20/);
  });

  test('has test script', () => {
    expect(packageJson.scripts).toHaveProperty('test');
  });

  test('has lint script', () => {
    expect(packageJson.scripts).toHaveProperty('lint');
  });
});

describe('npm install (AC4)', () => {
  test('node_modules/max-api exists', () => {
    const maxApiPath = join(nodeDir, 'node_modules', 'max-api');
    expect(existsSync(maxApiPath)).toBe(true);
  });
});
