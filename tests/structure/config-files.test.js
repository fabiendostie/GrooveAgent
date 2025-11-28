/**
 * Configuration Files Tests
 * Verifies AC5: .cursorrules and AC6: CLAUDE.md
 *
 * @module tests/structure/config-files
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

describe('.cursorrules (AC5)', () => {
  const filePath = join(projectRoot, '.cursorrules');

  test('.cursorrules file exists', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  test('.cursorrules contains GrooveAgent context', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('GrooveAgent');
  });

  test('.cursorrules references TELIS methodology', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('TELIS');
  });

  test('.cursorrules contains code generation rules', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('ES2024');
    expect(content).toContain('ESM');
  });
});

describe('CLAUDE.md (AC6)', () => {
  const filePath = join(projectRoot, 'CLAUDE.md');

  test('CLAUDE.md file exists', () => {
    expect(existsSync(filePath)).toBe(true);
  });

  test('CLAUDE.md contains project overview', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('GrooveAgent');
    expect(content).toContain('Max for Live');
  });

  test('CLAUDE.md contains architecture summary', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('Architecture');
    expect(content).toContain('node.script');
  });

  test('CLAUDE.md contains key data structures', () => {
    const content = readFileSync(filePath, 'utf-8');
    expect(content).toContain('Groove Recipe');
  });
});
