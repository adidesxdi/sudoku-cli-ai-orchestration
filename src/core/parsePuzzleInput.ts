import { existsSync, readFileSync } from 'fs';
import { Puzzle } from './puzzle.js';

/**
 * Error codes for puzzle parsing failures.
 */
export type PuzzleParseErrorCode =
  | 'INVALID_LENGTH'
  | 'INVALID_CHARACTERS'
  | 'FILE_NOT_FOUND'
  | 'FILE_READ_ERROR';

/**
 * Custom error class for puzzle parsing failures.
 */
export class PuzzleParseError extends Error {
  readonly code: PuzzleParseErrorCode;

  constructor(code: PuzzleParseErrorCode, message: string) {
    super(message);
    this.name = 'PuzzleParseError';
    this.code = code;
  }
}

/**
 * Allowed characters in a puzzle string: digits 0-9 and dot (.)
 */
const ALLOWED_CHARS = /^[0-9.]+$/;

/**
 * Parse a raw 81-character puzzle string into a Puzzle array.
 * Does NOT handle file I/O - use parsePuzzleInput for that.
 *
 * @param raw - The raw puzzle string (should be exactly 81 chars after trim)
 * @returns Puzzle - Array of 81 numbers (0 for blanks, 1-9 for digits)
 * @throws PuzzleParseError if validation fails
 */
export function parsePuzzleString(raw: string): Puzzle {
  const normalized = raw.trim();

  // Validate length
  if (normalized.length !== 81) {
    throw new PuzzleParseError(
      'INVALID_LENGTH',
      `Invalid puzzle length: expected 81 characters, got ${normalized.length}`
    );
  }

  // Validate characters
  if (!ALLOWED_CHARS.test(normalized)) {
    const invalidChar = normalized.split('').find((c) => !/[0-9.]/.test(c));
    throw new PuzzleParseError(
      'INVALID_CHARACTERS',
      `Invalid character in puzzle: '${invalidChar}'. Only digits 0-9 and '.' are allowed.`
    );
  }

  // Convert to number array
  return normalized.split('').map((char) => {
    if (char === '.' || char === '0') {
      return 0;
    }
    return parseInt(char, 10);
  });
}

/**
 * Reads content from a file path.
 *
 * @param filePath - Path to the file
 * @returns The file contents as a string
 * @throws PuzzleParseError if file doesn't exist or can't be read
 */
function readPuzzleFile(filePath: string): string {
  if (!existsSync(filePath)) {
    throw new PuzzleParseError('FILE_NOT_FOUND', `File not found: ${filePath}`);
  }

  try {
    return readFileSync(filePath, 'utf-8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new PuzzleParseError('FILE_READ_ERROR', `Failed to read file: ${message}`);
  }
}

/**
 * Parse puzzle input from either an 81-char string or a file path.
 *
 * Detection strategy:
 * 1. If input exists as a file on disk → read file contents
 * 2. Otherwise → treat as raw puzzle string
 *
 * @param input - Either an 81-char puzzle string or a path to a file
 * @returns Puzzle - Array of 81 numbers
 * @throws PuzzleParseError on any parsing failure
 */
export function parsePuzzleInput(input: string): Puzzle {
  let puzzleString: string;

  // Check if input is a file path
  if (existsSync(input)) {
    puzzleString = readPuzzleFile(input);
  } else {
    puzzleString = input;
  }

  return parsePuzzleString(puzzleString);
}
