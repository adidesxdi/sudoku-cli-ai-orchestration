import { describe, it, expect } from 'vitest';
import { createEmptyPuzzle, Puzzle } from '../../src/core/puzzle.js';

describe('Puzzle type', () => {
  it('should create an empty puzzle with 81 zeros', () => {
    const puzzle: Puzzle = createEmptyPuzzle();
    expect(puzzle).toHaveLength(81);
    expect(puzzle.every((cell) => cell === 0)).toBe(true);
  });
});
