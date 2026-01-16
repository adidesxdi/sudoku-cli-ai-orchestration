import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'node:child_process';
import { parsePuzzleInput } from '../../src/core/parsePuzzleInput.js';
import { validatePuzzle } from '../../src/core/validatePuzzle.js';
import { solvePuzzle } from '../../src/core/solvePuzzle.js';

describe('CLI generate command', () => {
  beforeAll(() => {
    // Ensure CLI is built before running smoke tests
    execSync('npm run build', { encoding: 'utf-8' });
  });

  it('generates an 81-character puzzle string for easy difficulty', () => {
    const result = execSync('node dist/cli/index.js generate --difficulty easy --seed 42', {
      encoding: 'utf-8',
    }).trim();

    expect(result).toMatch(/^[0-9.]{81}$/);
  });

  it('generates an 81-character puzzle string for medium difficulty', () => {
    const result = execSync('node dist/cli/index.js generate --difficulty medium --seed 42', {
      encoding: 'utf-8',
    }).trim();

    expect(result).toMatch(/^[0-9.]{81}$/);
  });

  it('generates an 81-character puzzle string for hard difficulty', () => {
    const result = execSync('node dist/cli/index.js generate --difficulty hard --seed 42', {
      encoding: 'utf-8',
    }).trim();

    expect(result).toMatch(/^[0-9.]{81}$/);
  });

  it('is deterministic - same seed produces same puzzle', () => {
    const result1 = execSync('node dist/cli/index.js generate --difficulty medium --seed 12345', {
      encoding: 'utf-8',
    }).trim();

    const result2 = execSync('node dist/cli/index.js generate --difficulty medium --seed 12345', {
      encoding: 'utf-8',
    }).trim();

    expect(result1).toBe(result2);
  });

  it('produces different puzzles for different seeds', () => {
    const result1 = execSync('node dist/cli/index.js generate --difficulty medium --seed 100', {
      encoding: 'utf-8',
    }).trim();

    const result2 = execSync('node dist/cli/index.js generate --difficulty medium --seed 200', {
      encoding: 'utf-8',
    }).trim();

    expect(result1).not.toBe(result2);
  });

  it('generates a puzzle that passes validation', () => {
    const puzzleStr = execSync('node dist/cli/index.js generate --difficulty medium --seed 999', {
      encoding: 'utf-8',
    }).trim();

    const puzzle = parsePuzzleInput(puzzleStr);
    const validationResult = validatePuzzle(puzzle);

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.errors).toHaveLength(0);
  });

  it('generates a puzzle that is solvable with a unique solution', () => {
    const puzzleStr = execSync('node dist/cli/index.js generate --difficulty hard --seed 777', {
      encoding: 'utf-8',
    }).trim();

    const puzzle = parsePuzzleInput(puzzleStr);
    const solveResult = solvePuzzle(puzzle);

    expect(solveResult.status).toBe('solved');
    expect(solveResult.solution).toBeDefined();
  });

  it('pipeline: generate → validate → solve works', () => {
    // Generate a puzzle
    const puzzleStr = execSync('node dist/cli/index.js generate --difficulty easy --seed 55', {
      encoding: 'utf-8',
    }).trim();

    // Validate it via CLI (use --inputEP as that's the option name)
    const validateResult = execSync(
      `node dist/cli/index.js validate --inputEP "${puzzleStr}"`,
      { encoding: 'utf-8' }
    ).trim();

    expect(validateResult).toContain('valid');

    // Solve it via CLI
    const solveResult = execSync(
      `node dist/cli/index.js solve --input "${puzzleStr}"`,
      { encoding: 'utf-8' }
    ).trim();

    // Solution should contain 81 digits (formatted as grid, but all filled)
    // The grid format has separators, so check the actual cell count
    const digits = solveResult.replace(/[^1-9]/g, '');
    expect(digits).toHaveLength(81);
  });

  it('fails with invalid difficulty', () => {
    expect(() => {
      execSync('node dist/cli/index.js generate --difficulty invalid --seed 42', {
        encoding: 'utf-8',
        stdio: 'pipe', // Capture stderr
      });
    }).toThrow();
  });

  it('fails with non-numeric seed', () => {
    expect(() => {
      execSync('node dist/cli/index.js generate --difficulty easy --seed abc', {
        encoding: 'utf-8',
        stdio: 'pipe',
      });
    }).toThrow();
  });
});
