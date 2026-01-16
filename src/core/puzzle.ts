// Placeholder for core Sudoku types and utilities
// This file will be expanded in later stories (SUD-2+)

/**
 * Represents a 9x9 Sudoku grid as a flat array of 81 numbers.
 * 0 represents an empty cell, 1-9 represent filled cells.
 */
export type Puzzle = number[];

/**
 * Creates an empty puzzle (all zeros)
 */
export function createEmptyPuzzle(): Puzzle {
  return Array(81).fill(0);
}
