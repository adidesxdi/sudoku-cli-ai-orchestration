import { describe, it, expect } from 'vitest';
import { generatePuzzle, puzzleToString, Difficulty } from '../../src/core/generatePuzzle.js';
import { validatePuzzle } from '../../src/core/validatePuzzle.js';
import { solvePuzzle, countSolutions } from '../../src/core/solvePuzzle.js';
import { createSeededRandom } from '../../src/core/seededRandom.js';

describe('createSeededRandom', () => {
  it('should produce deterministic sequence for same seed', () => {
    const rng1 = createSeededRandom(42);
    const rng2 = createSeededRandom(42);

    const seq1 = [rng1.next(), rng1.next(), rng1.next()];
    const seq2 = [rng2.next(), rng2.next(), rng2.next()];

    expect(seq1).toEqual(seq2);
  });

  it('should produce different sequences for different seeds', () => {
    const rng1 = createSeededRandom(42);
    const rng2 = createSeededRandom(43);

    expect(rng1.next()).not.toEqual(rng2.next());
  });

  it('should produce values in [0, 1)', () => {
    const rng = createSeededRandom(12345);
    for (let i = 0; i < 100; i++) {
      const val = rng.next();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });

  it('should produce integers in range [min, max]', () => {
    const rng = createSeededRandom(999);
    for (let i = 0; i < 100; i++) {
      const val = rng.nextInt(5, 10);
      expect(val).toBeGreaterThanOrEqual(5);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it('should shuffle deterministically', () => {
    const rng1 = createSeededRandom(42);
    const rng2 = createSeededRandom(42);

    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [1, 2, 3, 4, 5];

    rng1.shuffle(arr1);
    rng2.shuffle(arr2);

    expect(arr1).toEqual(arr2);
  });
});

describe('countSolutions', () => {
  it('should return 1 for puzzle with unique solution', () => {
    // Known puzzle with unique solution
    const puzzle = [
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
    expect(countSolutions(puzzle, 2)).toBe(1);
  });

  it('should return 0 for unsolvable puzzle', () => {
    // Puzzle with contradiction
    const puzzle = [
      5, 5, 0, 0, 0, 0, 0, 0, 0, // Two 5s in row
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
    expect(countSolutions(puzzle, 2)).toBe(0);
  });
});

describe('generatePuzzle', () => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  describe('determinism', () => {
    it.each(difficulties)('should generate same puzzle for same seed (%s)', (difficulty) => {
      const result1 = generatePuzzle(difficulty, 42);
      const result2 = generatePuzzle(difficulty, 42);

      expect(result1.puzzle).toEqual(result2.puzzle);
      expect(result1.solution).toEqual(result2.solution);
    });

    it('should generate different puzzles for different seeds', () => {
      const result1 = generatePuzzle('medium', 42);
      const result2 = generatePuzzle('medium', 43);

      expect(result1.puzzle).not.toEqual(result2.puzzle);
    });

    it('should generate different puzzles for different difficulties with same seed', () => {
      const easy = generatePuzzle('easy', 42);
      const medium = generatePuzzle('medium', 42);
      const hard = generatePuzzle('hard', 42);

      expect(easy.puzzle).not.toEqual(medium.puzzle);
      expect(medium.puzzle).not.toEqual(hard.puzzle);
    });
  });

  describe('validity', () => {
    it.each(difficulties)('should generate valid puzzle (%s)', (difficulty) => {
      const result = generatePuzzle(difficulty, 12345);
      const validation = validatePuzzle(result.puzzle);

      expect(validation.isValid).toBe(true);
    });

    it.each(difficulties)('should generate valid solution (%s)', (difficulty) => {
      const result = generatePuzzle(difficulty, 12345);
      const validation = validatePuzzle(result.solution);

      expect(validation.isValid).toBe(true);
      // Solution should be complete (no zeros)
      expect(result.solution.every((cell) => cell !== 0)).toBe(true);
    });
  });

  describe('uniqueness', () => {
    it.each(difficulties)('should generate puzzle with unique solution (%s)', (difficulty) => {
      const result = generatePuzzle(difficulty, 99);
      const solutionCount = countSolutions(result.puzzle, 2);

      expect(solutionCount).toBe(1);
    });
  });

  describe('solvability', () => {
    it.each(difficulties)('should be solvable by solvePuzzle (%s)', (difficulty) => {
      const result = generatePuzzle(difficulty, 777);
      const solveResult = solvePuzzle(result.puzzle);

      expect(solveResult.status).toBe('solved');
      expect(solveResult.solution).toEqual(result.solution);
    });
  });

  describe('difficulty clue counts', () => {
    it('easy puzzles should have 36-45 clues', () => {
      const result = generatePuzzle('easy', 42);
      const clueCount = result.puzzle.filter((c) => c !== 0).length;

      expect(clueCount).toBeGreaterThanOrEqual(36);
      expect(clueCount).toBeLessThanOrEqual(45);
    });

    it('medium puzzles should have 27-35 clues', () => {
      const result = generatePuzzle('medium', 42);
      const clueCount = result.puzzle.filter((c) => c !== 0).length;

      expect(clueCount).toBeGreaterThanOrEqual(27);
      expect(clueCount).toBeLessThanOrEqual(35);
    });

    it('hard puzzles should have 22-26 clues', () => {
      const result = generatePuzzle('hard', 42);
      const clueCount = result.puzzle.filter((c) => c !== 0).length;

      expect(clueCount).toBeGreaterThanOrEqual(22);
      expect(clueCount).toBeLessThanOrEqual(26);
    });
  });

  describe('snapshot tests for determinism', () => {
    it('should match snapshot for easy seed 42', () => {
      const result = generatePuzzle('easy', 42);
      const puzzleStr = puzzleToString(result.puzzle);

      // This ensures the exact output doesn't change
      expect(puzzleStr).toMatchSnapshot();
    });

    it('should match snapshot for medium seed 42', () => {
      const result = generatePuzzle('medium', 42);
      const puzzleStr = puzzleToString(result.puzzle);

      expect(puzzleStr).toMatchSnapshot();
    });

    it('should match snapshot for hard seed 42', () => {
      const result = generatePuzzle('hard', 42);
      const puzzleStr = puzzleToString(result.puzzle);

      expect(puzzleStr).toMatchSnapshot();
    });
  });
});

describe('puzzleToString', () => {
  it('should convert puzzle to 81-char string', () => {
    const puzzle = Array(81).fill(0);
    puzzle[0] = 5;
    puzzle[80] = 9;

    const str = puzzleToString(puzzle);

    expect(str).toHaveLength(81);
    expect(str[0]).toBe('5');
    expect(str[80]).toBe('9');
    expect(str[1]).toBe('0');
  });
});
