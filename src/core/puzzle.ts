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

/**
 * Get the values in a specific row (0-8).
 * @param puzzle - The puzzle array (length 81)
 * @param rowIndex - Row index (0-8)
 * @returns Array of 9 values in the row
 */
export function getRow(puzzle: Puzzle, rowIndex: number): number[] {
  const start = rowIndex * 9;
  return puzzle.slice(start, start + 9);
}

/**
 * Get the values in a specific column (0-8).
 * @param puzzle - The puzzle array (length 81)
 * @param colIndex - Column index (0-8)
 * @returns Array of 9 values in the column
 */
export function getColumn(puzzle: Puzzle, colIndex: number): number[] {
  const result: number[] = [];
  for (let row = 0; row < 9; row++) {
    result.push(puzzle[row * 9 + colIndex]);
  }
  return result;
}

/**
 * Get the values in a specific 3x3 box (0-8).
 * Boxes are numbered left-to-right, top-to-bottom:
 *   0 1 2
 *   3 4 5
 *   6 7 8
 * @param puzzle - The puzzle array (length 81)
 * @param boxIndex - Box index (0-8)
 * @returns Array of 9 values in the box
 */
export function getBox(puzzle: Puzzle, boxIndex: number): number[] {
  const boxRow = Math.floor(boxIndex / 3) * 3;
  const boxCol = (boxIndex % 3) * 3;
  const result: number[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      result.push(puzzle[(boxRow + r) * 9 + (boxCol + c)]);
    }
  }
  return result;
}
