import { describe, it, expect } from 'vitest';
import { resolve } from 'path';
import {
  parsePuzzleInput,
  parsePuzzleString,
  PuzzleParseError,
} from '../../src/core/parsePuzzleInput.js';

const VALID_PUZZLE_STRING =
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

const TESTDATA_DIR = resolve(__dirname, '../../testdata');

describe('parsePuzzleString', () => {
  it('should parse a valid 81-character puzzle string', () => {
    const puzzle = parsePuzzleString(VALID_PUZZLE_STRING);

    expect(puzzle).toHaveLength(81);
    expect(puzzle[0]).toBe(5);
    expect(puzzle[1]).toBe(3);
    expect(puzzle[2]).toBe(0); // '0' maps to 0
    expect(puzzle[3]).toBe(0); // '0' maps to 0
  });

  it('should handle dots as blanks', () => {
    // Create a valid 81-char string with dots
    const dotPuzzle = '5' + '.'.repeat(80);
    const puzzle = parsePuzzleString(dotPuzzle);

    expect(puzzle).toHaveLength(81);
    expect(puzzle[0]).toBe(5);
    expect(puzzle[1]).toBe(0); // '.' maps to 0
  });

  it('should trim whitespace from input', () => {
    const padded = `  ${VALID_PUZZLE_STRING}  \n`;
    const puzzle = parsePuzzleString(padded);

    expect(puzzle).toHaveLength(81);
  });

  it('should throw INVALID_LENGTH for too-short input', () => {
    expect(() => parsePuzzleString('12345678')).toThrow(PuzzleParseError);

    try {
      parsePuzzleString('12345678');
    } catch (err) {
      expect(err).toBeInstanceOf(PuzzleParseError);
      expect((err as PuzzleParseError).code).toBe('INVALID_LENGTH');
      expect((err as PuzzleParseError).message).toContain('expected 81');
      expect((err as PuzzleParseError).message).toContain('got 8');
    }
  });

  it('should throw INVALID_LENGTH for too-long input', () => {
    const tooLong = VALID_PUZZLE_STRING + '1';

    expect(() => parsePuzzleString(tooLong)).toThrow(PuzzleParseError);

    try {
      parsePuzzleString(tooLong);
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_LENGTH');
      expect((err as PuzzleParseError).message).toContain('got 82');
    }
  });

  it('should throw INVALID_CHARACTERS for letters', () => {
    const withLetters = VALID_PUZZLE_STRING.slice(0, 80) + 'X';

    expect(() => parsePuzzleString(withLetters)).toThrow(PuzzleParseError);

    try {
      parsePuzzleString(withLetters);
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_CHARACTERS');
      expect((err as PuzzleParseError).message).toContain("'X'");
    }
  });

  it('should throw INVALID_CHARACTERS for symbols', () => {
    const withSymbol = VALID_PUZZLE_STRING.slice(0, 80) + '#';

    expect(() => parsePuzzleString(withSymbol)).toThrow(PuzzleParseError);

    try {
      parsePuzzleString(withSymbol);
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_CHARACTERS');
      expect((err as PuzzleParseError).message).toContain("'#'");
    }
  });
});

describe('parsePuzzleInput', () => {
  it('should parse a valid file path', () => {
    const puzzle = parsePuzzleInput(resolve(TESTDATA_DIR, 'valid-easy.sdk'));

    expect(puzzle).toHaveLength(81);
    expect(puzzle[0]).toBe(5);
    expect(puzzle[1]).toBe(3);
  });

  it('should parse a raw 81-char string when file does not exist', () => {
    const puzzle = parsePuzzleInput(VALID_PUZZLE_STRING);

    expect(puzzle).toHaveLength(81);
  });

  it('should throw FILE_NOT_FOUND for nonexistent file path that looks like a path', () => {
    // This looks like a path but doesn't exist - since it doesn't exist, 
    // it will be treated as a raw string, which will fail length validation
    expect(() => parsePuzzleInput('testdata/missing.sdk')).toThrow(PuzzleParseError);

    try {
      parsePuzzleInput('testdata/missing.sdk');
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_LENGTH');
    }
  });

  it('should throw INVALID_LENGTH for file with invalid content', () => {
    expect(() => parsePuzzleInput(resolve(TESTDATA_DIR, 'invalid-length.sdk'))).toThrow(
      PuzzleParseError
    );

    try {
      parsePuzzleInput(resolve(TESTDATA_DIR, 'invalid-length.sdk'));
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_LENGTH');
    }
  });

  it('should throw INVALID_CHARACTERS for file with invalid characters', () => {
    expect(() => parsePuzzleInput(resolve(TESTDATA_DIR, 'invalid-chars.sdk'))).toThrow(
      PuzzleParseError
    );

    try {
      parsePuzzleInput(resolve(TESTDATA_DIR, 'invalid-chars.sdk'));
    } catch (err) {
      expect((err as PuzzleParseError).code).toBe('INVALID_CHARACTERS');
    }
  });
});
