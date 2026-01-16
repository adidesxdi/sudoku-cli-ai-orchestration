import { describe, it, expect } from 'vitest';
import { validatePuzzle, findDuplicateDigit } from '../../src/core/validatePuzzle.js';
import { getRow, getColumn, getBox } from '../../src/core/puzzle.js';

// Valid complete puzzle (no conflicts)
const VALID_FULL_PUZZLE = [
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

// Valid partial puzzle with blanks (0s)
const VALID_PARTIAL_PUZZLE = [
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

// Invalid: duplicate in row 0 (two 5s)
const INVALID_ROW_DUP = [
  5, 3, 5, 6, 7, 8, 9, 1, 2, // <-- duplicate 5 in row 0
  6, 7, 2, 1, 9, 0, 3, 4, 8,
  1, 9, 8, 3, 4, 2, 0, 6, 7,
  8, 0, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 0, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 0, 6,
  9, 6, 1, 0, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 0,
  3, 4, 0, 2, 8, 6, 1, 7, 9,
];

// Invalid: duplicate in column 0 (two 5s)
const INVALID_COL_DUP = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  5, 7, 2, 1, 9, 0, 3, 4, 8, // <-- duplicate 5 in column 0
  1, 9, 8, 3, 4, 2, 0, 6, 7,
  8, 0, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 0, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 0, 6,
  9, 6, 1, 0, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 0,
  3, 4, 0, 2, 8, 6, 1, 7, 9,
];

// Invalid: duplicate in box 0 (two 5s in top-left 3x3)
const INVALID_BOX_DUP = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,
  6, 5, 2, 1, 9, 0, 3, 4, 8, // <-- 5 duplicated in box 0
  1, 9, 8, 3, 4, 2, 0, 6, 7,
  8, 0, 9, 7, 6, 1, 4, 2, 3,
  4, 2, 6, 8, 0, 3, 7, 9, 1,
  7, 1, 3, 9, 2, 4, 8, 0, 6,
  9, 6, 1, 0, 3, 7, 2, 8, 4,
  2, 8, 7, 4, 1, 9, 6, 3, 0,
  3, 4, 0, 2, 8, 6, 1, 7, 9,
];

describe('findDuplicateDigit', () => {
  it('should return undefined for array with no duplicates', () => {
    expect(findDuplicateDigit([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBeUndefined();
  });

  it('should return undefined for array with zeros only', () => {
    expect(findDuplicateDigit([0, 0, 0, 0, 0, 0, 0, 0, 0])).toBeUndefined();
  });

  it('should ignore zeros when checking duplicates', () => {
    expect(findDuplicateDigit([1, 0, 2, 0, 3, 0, 0, 0, 0])).toBeUndefined();
  });

  it('should find duplicate digit', () => {
    expect(findDuplicateDigit([1, 2, 3, 1, 5, 6, 7, 8, 9])).toBe(1);
  });
});

describe('puzzle helpers', () => {
  it('getRow should return correct row', () => {
    expect(getRow(VALID_FULL_PUZZLE, 0)).toEqual([5, 3, 4, 6, 7, 8, 9, 1, 2]);
    expect(getRow(VALID_FULL_PUZZLE, 8)).toEqual([3, 4, 5, 2, 8, 6, 1, 7, 9]);
  });

  it('getColumn should return correct column', () => {
    expect(getColumn(VALID_FULL_PUZZLE, 0)).toEqual([5, 6, 1, 8, 4, 7, 9, 2, 3]);
    expect(getColumn(VALID_FULL_PUZZLE, 8)).toEqual([2, 8, 7, 3, 1, 6, 4, 5, 9]);
  });

  it('getBox should return correct box', () => {
    // Box 0 (top-left)
    expect(getBox(VALID_FULL_PUZZLE, 0)).toEqual([5, 3, 4, 6, 7, 2, 1, 9, 8]);
    // Box 8 (bottom-right)
    expect(getBox(VALID_FULL_PUZZLE, 8)).toEqual([2, 8, 4, 6, 3, 5, 1, 7, 9]);
  });
});

describe('validatePuzzle', () => {
  it('should validate a correct full puzzle', () => {
    const result = validatePuzzle(VALID_FULL_PUZZLE);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate a correct partial puzzle with blanks', () => {
    const result = validatePuzzle(VALID_PARTIAL_PUZZLE);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect duplicate in a row', () => {
    const result = validatePuzzle(INVALID_ROW_DUP);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);

    const rowError = result.errors.find((e) => e.rule === 'row');
    expect(rowError).toBeDefined();
    expect(rowError?.index).toBe(0);
    expect(rowError?.digit).toBe(5);
  });

  it('should detect duplicate in a column', () => {
    const result = validatePuzzle(INVALID_COL_DUP);
    expect(result.isValid).toBe(false);

    const colError = result.errors.find((e) => e.rule === 'column');
    expect(colError).toBeDefined();
    expect(colError?.index).toBe(0);
    expect(colError?.digit).toBe(5);
  });

  it('should detect duplicate in a box', () => {
    const result = validatePuzzle(INVALID_BOX_DUP);
    expect(result.isValid).toBe(false);

    const boxError = result.errors.find((e) => e.rule === 'box');
    expect(boxError).toBeDefined();
    expect(boxError?.index).toBe(0);
    expect(boxError?.digit).toBe(5);
  });

  it('should reject puzzle with wrong size', () => {
    const result = validatePuzzle([1, 2, 3]); // Only 3 cells
    expect(result.isValid).toBe(false);
    expect(result.errors[0].rule).toBe('size');
    expect(result.errors[0].message).toContain('expected 81');
  });

  it('should collect multiple errors', () => {
    // Puzzle with duplicates in multiple places
    const multipleErrors = [
      5, 5, 4, 6, 7, 8, 9, 1, 2, // row 0: two 5s
      6, 7, 2, 1, 9, 0, 3, 4, 8,
      1, 9, 8, 3, 4, 2, 0, 6, 7,
      8, 0, 9, 7, 6, 1, 4, 2, 3,
      4, 2, 6, 8, 0, 3, 7, 9, 1,
      7, 1, 3, 9, 2, 4, 8, 0, 6,
      9, 6, 1, 0, 3, 7, 2, 8, 4,
      2, 8, 7, 4, 1, 9, 6, 3, 0,
      3, 4, 0, 2, 8, 6, 1, 7, 9,
    ];
    const result = validatePuzzle(multipleErrors);
    expect(result.isValid).toBe(false);
    // Should have row and box error (both in top-left area)
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});
