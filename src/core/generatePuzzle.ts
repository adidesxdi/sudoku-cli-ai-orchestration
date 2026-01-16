import { Puzzle } from './puzzle.js';
import { validatePuzzle } from './validatePuzzle.js';
import { countSolutions } from './solvePuzzle.js';
import { createSeededRandom, SeededRandom } from './seededRandom.js';

/**
 * Difficulty levels for puzzle generation.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Clue count ranges for each difficulty level.
 * These determine how many filled cells remain in the generated puzzle.
 *
 * - easy: 36-45 clues (easier to solve)
 * - medium: 27-35 clues (moderate challenge)
 * - hard: 22-26 clues (harder puzzles)
 */
const DIFFICULTY_CLUES: Record<Difficulty, { min: number; max: number }> = {
  easy: { min: 36, max: 45 },
  medium: { min: 27, max: 35 },
  hard: { min: 22, max: 26 },
};

/**
 * Result of puzzle generation.
 */
export interface GenerateResult {
  /** The generated puzzle with some cells empty (0) */
  puzzle: Puzzle;
  /** The complete solution */
  solution: Puzzle;
}

/**
 * Generate a fully solved Sudoku grid using backtracking with randomized digit order.
 * This creates a valid complete grid that will be used as the solution.
 */
function generateSolvedGrid(rng: SeededRandom): Puzzle {
  const puzzle: Puzzle = Array(81).fill(0);

  function fillRecursive(index: number): boolean {
    if (index === 81) {
      return true; // Grid is complete
    }

    // Randomize digit order for variety
    const digits = rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const digit of digits) {
      if (isValidPlacement(puzzle, index, digit)) {
        puzzle[index] = digit;

        if (fillRecursive(index + 1)) {
          return true;
        }

        puzzle[index] = 0;
      }
    }

    return false;
  }

  fillRecursive(0);
  return puzzle;
}

/**
 * Check if placing a digit at a given position is valid.
 */
function isValidPlacement(puzzle: Puzzle, index: number, digit: number): boolean {
  const row = Math.floor(index / 9);
  const col = index % 9;

  // Check row
  for (let c = 0; c < 9; c++) {
    if (puzzle[row * 9 + c] === digit) return false;
  }

  // Check column
  for (let r = 0; r < 9; r++) {
    if (puzzle[r * 9 + col] === digit) return false;
  }

  // Check 3x3 box
  const boxRowStart = Math.floor(row / 3) * 3;
  const boxColStart = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (puzzle[(boxRowStart + r) * 9 + (boxColStart + c)] === digit) return false;
    }
  }

  return true;
}

/**
 * Remove clues from a solved grid while ensuring unique solvability.
 *
 * @param solution - The complete solved grid
 * @param targetClues - Target number of clues to leave
 * @param rng - Seeded random number generator
 * @returns Puzzle with some cells removed
 */
function removeClues(solution: Puzzle, targetClues: number, rng: SeededRandom): Puzzle {
  const puzzle = [...solution];

  // Create randomized list of cell indices
  const indices = rng.shuffle([...Array(81).keys()]);

  let cluesRemaining = 81;

  for (const index of indices) {
    if (cluesRemaining <= targetClues) {
      break;
    }

    const backup = puzzle[index];

    // Skip if already empty
    if (backup === 0) continue;

    // Try removing this clue
    puzzle[index] = 0;

    // Check if puzzle still has unique solution
    if (countSolutions(puzzle, 2) !== 1) {
      // Restore clue - removing it would create multiple solutions or no solution
      puzzle[index] = backup;
    } else {
      cluesRemaining--;
    }
  }

  return puzzle;
}

/**
 * Generate a Sudoku puzzle with the specified difficulty and seed.
 *
 * The generation process:
 * 1. Generate a fully solved grid using randomized backtracking
 * 2. Remove clues according to difficulty while maintaining unique solvability
 *
 * For a given (difficulty, seed) pair, this function always returns the same puzzle.
 *
 * @param difficulty - The difficulty level ('easy', 'medium', 'hard')
 * @param seed - The seed for deterministic random generation
 * @returns GenerateResult with puzzle and solution
 */
export function generatePuzzle(difficulty: Difficulty, seed: number): GenerateResult {
  // Create seeded RNG - different difficulties get different effective seeds
  // to ensure different puzzles for same seed but different difficulty
  const effectiveSeed = seed * 3 + ['easy', 'medium', 'hard'].indexOf(difficulty);
  const rng = createSeededRandom(effectiveSeed);

  // Generate complete solution
  const solution = generateSolvedGrid(rng);

  // Validate the solution (should always pass)
  const validation = validatePuzzle(solution);
  if (!validation.isValid) {
    throw new Error('Generated solution failed validation - this should not happen');
  }

  // Determine target clue count for difficulty
  const { min, max } = DIFFICULTY_CLUES[difficulty];
  const targetClues = rng.nextInt(min, max);

  // Remove clues while maintaining unique solvability
  const puzzle = removeClues(solution, targetClues, rng);

  return {
    puzzle,
    solution,
  };
}

/**
 * Convert a puzzle to an 81-character string.
 * Uses '0' for empty cells.
 */
export function puzzleToString(puzzle: Puzzle): string {
  return puzzle.map((cell) => cell.toString()).join('');
}
