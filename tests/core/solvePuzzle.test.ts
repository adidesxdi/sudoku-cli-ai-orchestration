import { describe, it, expect } from 'vitest';
import { solvePuzzle } from '../../src/core/solvePuzzle.js';
import { validatePuzzle } from '../../src/core/validatePuzzle.js';

// Easy puzzle (from valid-easy.sdk / solvable/easy1.sdk)
const EASY_PUZZLE = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
];

// Expected solution for the easy puzzle
const EASY_SOLUTION = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];

// Medium difficulty puzzle
const MEDIUM_PUZZLE = [
  0, 0, 3, 0, 2, 0, 6, 0, 0,
  9, 0, 0, 3, 0, 5, 0, 0, 1,
  0, 0, 1, 8, 0, 6, 4, 0, 0,
  0, 0, 8, 1, 0, 2, 9, 0, 0,
  7, 0, 0, 0, 0, 0, 0, 0, 8,
  0, 0, 6, 7, 0, 8, 2, 0, 0,
  0, 0, 2, 6, 0, 9, 5, 0, 0,
  8, 0, 0, 2, 0, 3, 0, 0, 9,
  0, 0, 5, 0, 1, 0, 3, 0, 0,
];

// Hard difficulty puzzle
const HARD_PUZZLE = [
  4, 0, 0, 0, 0, 0, 8, 0, 5,
  0, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 7, 0, 0, 0, 0, 0,
  0, 2, 0, 0, 0, 0, 0, 6, 0,
  0, 0, 0, 0, 8, 0, 4, 0, 0,
  0, 0, 0, 0, 1, 0, 0, 0, 0,
  0, 0, 0, 6, 0, 3, 0, 7, 0,
  5, 0, 0, 2, 0, 0, 0, 0, 0,
  1, 0, 4, 0, 0, 0, 0, 0, 0,
];

// Already solved puzzle
const ALREADY_SOLVED = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 7, 2, 1, 9, 5, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 5, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 5,
  3, 4, 5, 2, 8, 6, 1, 7, 9,
];

// Invalid puzzle - has contradiction (two 5s in first row and box)
const INVALID_PUZZLE = [
  5, 1, 5, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,
  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,
  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
];

// Unsolvable puzzle - valid but has no solution
// This creates a valid-looking puzzle but with conflicting constraints
const UNSOLVABLE_PUZZLE = [
  5, 1, 6, 8, 4, 9, 7, 3, 2,
  3, 0, 7, 6, 0, 5, 0, 0, 0,
  8, 0, 9, 7, 0, 0, 0, 6, 5,
  1, 3, 5, 0, 6, 0, 9, 0, 7,
  4, 7, 2, 5, 9, 1, 0, 0, 6,
  9, 6, 8, 3, 7, 0, 0, 5, 0,
  2, 5, 3, 1, 8, 6, 0, 7, 4,
  6, 8, 4, 2, 0, 7, 5, 0, 0,
  7, 9, 1, 0, 5, 0, 6, 0, 8,
];

describe('solvePuzzle', () => {
  it('should solve an easy puzzle', () => {
    const result = solvePuzzle(EASY_PUZZLE);
    expect(result.status).toBe('solved');
    expect(result.solution).toBeDefined();
    expect(result.solution).toEqual(EASY_SOLUTION);

    // Verify solution has no zeros
    expect(result.solution!.every((cell) => cell !== 0)).toBe(true);

    // Verify solution passes validation
    const validation = validatePuzzle(result.solution!);
    expect(validation.isValid).toBe(true);
  });

  it('should solve a medium puzzle', () => {
    const result = solvePuzzle(MEDIUM_PUZZLE);
    expect(result.status).toBe('solved');
    expect(result.solution).toBeDefined();

    // Verify solution has no zeros
    expect(result.solution!.every((cell) => cell !== 0)).toBe(true);

    // Verify solution passes validation
    const validation = validatePuzzle(result.solution!);
    expect(validation.isValid).toBe(true);
  });

  it('should solve a hard puzzle', () => {
    const result = solvePuzzle(HARD_PUZZLE);
    expect(result.status).toBe('solved');
    expect(result.solution).toBeDefined();

    // Verify solution has no zeros
    expect(result.solution!.every((cell) => cell !== 0)).toBe(true);

    // Verify solution passes validation
    const validation = validatePuzzle(result.solution!);
    expect(validation.isValid).toBe(true);
  });

  it('should handle already-solved puzzles', () => {
    const result = solvePuzzle(ALREADY_SOLVED);
    expect(result.status).toBe('solved');
    expect(result.solution).toBeDefined();
    expect(result.solution).toEqual(ALREADY_SOLVED);
  });

  it('should detect invalid puzzles', () => {
    const result = solvePuzzle(INVALID_PUZZLE);
    expect(result.status).toBe('invalid');
    expect(result.errors).toBeDefined();
    expect(result.errors!.length).toBeGreaterThan(0);
  });

  it('should detect unsolvable puzzles', () => {
    const result = solvePuzzle(UNSOLVABLE_PUZZLE);
    expect(result.status).toBe('unsolvable');
    expect(result.solution).toBeUndefined();
  });

  it('should not modify the input puzzle', () => {
    const originalPuzzle = [...EASY_PUZZLE];
    solvePuzzle(EASY_PUZZLE);
    expect(EASY_PUZZLE).toEqual(originalPuzzle);
  });

  it('should solve quickly (performance check)', () => {
    const startTime = Date.now();
    const result = solvePuzzle(EASY_PUZZLE);
    const endTime = Date.now();
    const elapsed = endTime - startTime;

    expect(result.status).toBe('solved');
    // Easy puzzles should solve very quickly
    expect(elapsed).toBeLessThan(1000);
  });
});
