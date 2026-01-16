import { Puzzle, getRow, getColumn, getBox } from './puzzle.js';

/**
 * Type of validation rule that was violated.
 */
export type ValidationRuleType = 'row' | 'column' | 'box' | 'size';

/**
 * Describes a validation error found in a puzzle.
 */
export interface ValidationError {
  /** The type of rule violated */
  rule: ValidationRuleType;
  /** The index of the row/column/box (0-8), or undefined for size errors */
  index?: number;
  /** The digit that caused the conflict (1-9) */
  digit?: number;
  /** Human-readable error message */
  message: string;
}

/**
 * Result of puzzle validation.
 */
export interface ValidationResult {
  /** Whether the puzzle is valid */
  isValid: boolean;
  /** List of validation errors (empty if valid) */
  errors: ValidationError[];
}

/**
 * Check if an array of numbers has duplicate digits 1-9 (ignoring zeros).
 * @param values - Array of numbers
 * @returns The first duplicate digit found, or undefined if no duplicates
 */
export function findDuplicateDigit(values: number[]): number | undefined {
  const seen = new Set<number>();
  for (const val of values) {
    if (val === 0) continue; // Ignore blanks
    if (seen.has(val)) {
      return val;
    }
    seen.add(val);
  }
  return undefined;
}

/**
 * Validate a Sudoku puzzle for structural and logical consistency.
 *
 * Checks:
 * - Grid size is exactly 81 cells
 * - No duplicate digits 1-9 in any row
 * - No duplicate digits 1-9 in any column
 * - No duplicate digits 1-9 in any 3x3 box
 *
 * Partial puzzles (with zeros) are allowed as long as no rules are violated.
 *
 * @param puzzle - The puzzle to validate
 * @returns ValidationResult with isValid flag and any errors found
 */
export function validatePuzzle(puzzle: Puzzle): ValidationResult {
  const errors: ValidationError[] = [];

  // Check size
  if (puzzle.length !== 81) {
    errors.push({
      rule: 'size',
      message: `Invalid puzzle size: expected 81 cells, got ${puzzle.length}`,
    });
    return { isValid: false, errors };
  }

  // Check rows
  for (let i = 0; i < 9; i++) {
    const row = getRow(puzzle, i);
    const dup = findDuplicateDigit(row);
    if (dup !== undefined) {
      errors.push({
        rule: 'row',
        index: i,
        digit: dup,
        message: `Duplicate digit ${dup} in row ${i + 1}`,
      });
    }
  }

  // Check columns
  for (let i = 0; i < 9; i++) {
    const col = getColumn(puzzle, i);
    const dup = findDuplicateDigit(col);
    if (dup !== undefined) {
      errors.push({
        rule: 'column',
        index: i,
        digit: dup,
        message: `Duplicate digit ${dup} in column ${i + 1}`,
      });
    }
  }

  // Check boxes
  for (let i = 0; i < 9; i++) {
    const box = getBox(puzzle, i);
    const dup = findDuplicateDigit(box);
    if (dup !== undefined) {
      errors.push({
        rule: 'box',
        index: i,
        digit: dup,
        message: `Duplicate digit ${dup} in box ${i + 1}`,
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
