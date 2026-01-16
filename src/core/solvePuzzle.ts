import { Puzzle, getRow, getColumn, getBox } from './puzzle.js';
import { validatePuzzle, ValidationError } from './validatePuzzle.js';

/**
 * Result status of a solve attempt.
 */
export type SolveStatus = 'solved' | 'unsolvable' | 'invalid';

/**
 * Result of solving a puzzle.
 */
export interface SolveResult {
  /** Status of the solve attempt */
  status: SolveStatus;
  /** The solution if status is 'solved' */
  solution?: Puzzle;
  /** Validation errors if status is 'invalid' */
  errors?: ValidationError[];
}

/**
 * Check if placing a digit at a given position is valid.
 * Returns true if the digit doesn't conflict with row, column, or box rules.
 */
function isValidPlacement(puzzle: Puzzle, index: number, digit: number): boolean {
  const row = Math.floor(index / 9);
  const col = index % 9;
  const boxIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

  // Check row
  const rowValues = getRow(puzzle, row);
  if (rowValues.includes(digit)) return false;

  // Check column
  const colValues = getColumn(puzzle, col);
  if (colValues.includes(digit)) return false;

  // Check box
  const boxValues = getBox(puzzle, boxIndex);
  if (boxValues.includes(digit)) return false;

  return true;
}

/**
 * Find the next empty cell (value 0) in the puzzle.
 * Returns the index of the empty cell, or -1 if no empty cells remain.
 */
function findEmptyCell(puzzle: Puzzle): number {
  return puzzle.findIndex((cell) => cell === 0);
}

/**
 * Recursive backtracking solver.
 * Returns true if the puzzle was solved, false otherwise.
 * Modifies the puzzle in place.
 */
function solveRecursive(puzzle: Puzzle): boolean {
  const emptyIndex = findEmptyCell(puzzle);

  // No empty cells means puzzle is solved
  if (emptyIndex === -1) {
    return true;
  }

  // Try digits 1-9
  for (let digit = 1; digit <= 9; digit++) {
    if (isValidPlacement(puzzle, emptyIndex, digit)) {
      puzzle[emptyIndex] = digit;

      if (solveRecursive(puzzle)) {
        return true;
      }

      // Backtrack
      puzzle[emptyIndex] = 0;
    }
  }

  return false;
}

/**
 * Solve a Sudoku puzzle using deterministic backtracking.
 *
 * Returns:
 * - { status: 'solved', solution: Puzzle } for valid and solvable puzzles
 * - { status: 'unsolvable' } for valid but unsolvable puzzles
 * - { status: 'invalid', errors: ValidationError[] } for invalid puzzles
 *
 * The input puzzle is not modified.
 *
 * @param puzzle - The puzzle to solve
 * @returns SolveResult indicating success or failure
 */
export function solvePuzzle(puzzle: Puzzle): SolveResult {
  // First validate the input puzzle
  const validation = validatePuzzle(puzzle);
  if (!validation.isValid) {
    return {
      status: 'invalid',
      errors: validation.errors,
    };
  }

  // Clone the puzzle to avoid modifying the input
  const workingPuzzle = [...puzzle];

  // Attempt to solve
  const solved = solveRecursive(workingPuzzle);

  if (solved) {
    return {
      status: 'solved',
      solution: workingPuzzle,
    };
  } else {
    return {
      status: 'unsolvable',
    };
  }
}
