# Architecture Overview

This document describes the module layout and design of the Sudoku CLI tool, intended for both human developers and AI coding assistants.

## Module Layout

```
src/
├── cli/                      # Command-line interface layer
│   ├── index.ts              # CLI entry point (Commander setup)
│   └── commands/
│       ├── solve.ts          # solve subcommand
│       ├── validate.ts       # validate subcommand
│       └── generate.ts       # generate subcommand
└── core/                     # Business logic (pure functions)
    ├── puzzle.ts             # Puzzle type and grid utilities
    ├── parsePuzzleInput.ts   # Input parsing (string or file)
    ├── validatePuzzle.ts     # Sudoku rule validation
    ├── solvePuzzle.ts        # Backtracking solver
    ├── generatePuzzle.ts     # Puzzle generator with difficulty
    └── seededRandom.ts       # Deterministic RNG
```

## Core Modules

### `puzzle.ts` — Puzzle Type & Utilities

**Purpose:** Defines the shared `Puzzle` type and helper functions for grid access.

```typescript
// Type definition
export type Puzzle = number[];  // Length 81, values 0-9 (0 = empty)

// Key exports
export function getRow(puzzle: Puzzle, rowIndex: number): number[];
export function getColumn(puzzle: Puzzle, colIndex: number): number[];
export function getBox(puzzle: Puzzle, boxIndex: number): number[];
```

**Usage:** All other core modules import `Puzzle` from here.

---

### `parsePuzzleInput.ts` — Input Parsing

**Purpose:** Parse puzzle input from CLI arguments (string or file path).

```typescript
// Key exports
export function parsePuzzleInput(input: string): Puzzle;
export class PuzzleParseError extends Error {
  code: 'INVALID_LENGTH' | 'INVALID_CHARACTERS' | 'FILE_NOT_FOUND' | 'FILE_READ_ERROR';
}
```

**Behavior:**
1. Check if input is a file path (exists on disk)
2. If file: read contents and parse
3. If not file: treat as 81-char puzzle string
4. Validate: exactly 81 chars, only `0-9` and `.`
5. Normalize: `.` → `0`, digits → numeric values

**Error Codes:**
| Code | Meaning |
|------|---------|
| `INVALID_LENGTH` | Input is not exactly 81 characters |
| `INVALID_CHARACTERS` | Contains characters other than 0-9 and `.` |
| `FILE_NOT_FOUND` | File path specified but file doesn't exist |
| `FILE_READ_ERROR` | File exists but couldn't be read |

---

### `validatePuzzle.ts` — Sudoku Validation

**Purpose:** Check if a puzzle follows Sudoku rules.

```typescript
// Key exports
export function validatePuzzle(puzzle: Puzzle): ValidationResult;
export function findDuplicateDigit(values: number[]): number | undefined;

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  rule: 'row' | 'column' | 'box' | 'size';
  index?: number;
  digit?: number;
  message: string;
}
```

**Rules Checked:**
- Grid size is exactly 81 cells
- No duplicate digits 1-9 in any row
- No duplicate digits 1-9 in any column
- No duplicate digits 1-9 in any 3×3 box

**Note:** Zeros (empty cells) are ignored during duplicate checking.

---

### `solvePuzzle.ts` — Sudoku Solver

**Purpose:** Solve a Sudoku puzzle using backtracking.

```typescript
// Key exports
export function solvePuzzle(puzzle: Puzzle): SolveResult;
export function countSolutions(puzzle: Puzzle, limit?: number): number;

export type SolveStatus = 'solved' | 'unsolvable' | 'invalid';

export interface SolveResult {
  status: SolveStatus;
  solution?: Puzzle;
  errors?: ValidationError[];
}
```

**Algorithm:**
1. Validate input puzzle first
2. Find next empty cell (value 0)
3. Try digits 1-9 in order
4. Check validity after each placement
5. Recursively solve remaining cells
6. Backtrack if no valid digit found

**`countSolutions`:** Used by generator to verify unique solvability. Stops counting at `limit` (default 2).

---

### `generatePuzzle.ts` — Puzzle Generator

**Purpose:** Generate valid Sudoku puzzles with specified difficulty.

```typescript
// Key exports
export function generatePuzzle(difficulty: Difficulty, seed: number): GenerateResult;
export function puzzleToString(puzzle: Puzzle): string;

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GenerateResult {
  puzzle: Puzzle;
  solution: Puzzle;
}
```

**Difficulty Clue Counts:**
| Difficulty | Clues |
|------------|-------|
| `easy` | 36-45 |
| `medium` | 27-35 |
| `hard` | 22-26 |

**Algorithm:**
1. Generate a fully solved grid using randomized backtracking
2. Shuffle cell indices using seeded RNG
3. Remove clues one at a time
4. After each removal, verify unique solvability via `countSolutions`
5. Stop when target clue count is reached

---

### `seededRandom.ts` — Deterministic RNG

**Purpose:** Provide reproducible random numbers for the generator.

```typescript
// Key exports
export function createSeededRandom(seed: number): SeededRandom;

export interface SeededRandom {
  next(): number;           // Float in [0, 1)
  nextInt(min: number, max: number): number;  // Integer in [min, max]
  shuffle<T>(array: T[]): T[];  // In-place Fisher-Yates shuffle
}
```

**Algorithm:** Mulberry32 PRNG — fast, simple, good distribution.

---

## CLI Commands

Each command follows the same pattern:

```
CLI Input → parsePuzzleInput → Core Function → Format Output → Exit
```

### `sudoku solve --input <string-or-file>`

```
Input → parsePuzzleInput → solvePuzzle → Print grid → Exit 0/1
```

### `sudoku validate --inputEP <string-or-file>`

```
Input → parsePuzzleInput → validatePuzzle → Print result → Exit 0/1
```

### `sudoku generate --difficulty <level> --seed <number>`

```
Options → generatePuzzle → puzzleToString → Print → Exit 0/1
```

---

## Data Flow Diagram

```
                    ┌─────────────────┐
                    │   CLI Layer     │
                    │  (Commander)    │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌───────────┐
    │  solve.ts │    │validate.ts│    │generate.ts│
    └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
          │                │                │
          ▼                ▼                ▼
    ┌─────────────────────────────────────────────┐
    │              parsePuzzleInput               │
    │         (string/file → Puzzle)              │
    └─────────────────────┬───────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │solvePuzzle│   │validatePu.│   │generatePu.│
    └─────┬─────┘   └───────────┘   └─────┬─────┘
          │                               │
          │         ┌─────────────────────┤
          │         │                     │
          ▼         ▼                     ▼
    ┌───────────────────┐           ┌───────────┐
    │  validatePuzzle   │◄──────────│countSolut.│
    │  (shared rules)   │           └───────────┘
    └───────────────────┘                 │
                                          ▼
                                    ┌───────────┐
                                    │seededRand.│
                                    └───────────┘
```

---

## Key Design Decisions

1. **Pure Core Functions:** All core modules are pure functions (except file I/O in parser). This makes testing easy and behavior predictable.

2. **Shared Validation:** `validatePuzzle` is reused by both solver and generator to ensure consistent rule checking.

3. **Deterministic Generator:** Uses Mulberry32 seeded RNG so `(difficulty, seed)` always produces the same puzzle.

4. **Exit Codes:** CLI uses standard conventions:
   - `0` = success
   - `1` = error (invalid input, unsolvable, etc.)

5. **Error Types:** Custom error classes with codes for programmatic handling.

---

## Entry Points for AI Assistants

When working on this codebase:

| Task | Start Here |
|------|------------|
| Add new input format | `src/core/parsePuzzleInput.ts` |
| Modify Sudoku rules | `src/core/validatePuzzle.ts` |
| Improve solver performance | `src/core/solvePuzzle.ts` |
| Change difficulty curves | `src/core/generatePuzzle.ts` (DIFFICULTY_CLUES) |
| Add new CLI command | `src/cli/commands/` + register in `src/cli/index.ts` |
| Add puzzle helpers | `src/core/puzzle.ts` |

---

## Testing Structure

```
tests/
├── core/                     # Unit tests (fast, isolated)
│   ├── parsePuzzleInput.test.ts
│   ├── puzzle.test.ts
│   ├── validatePuzzle.test.ts
│   ├── solvePuzzle.test.ts
│   └── generatePuzzle.test.ts
└── smoke/                    # CLI integration tests (spawn process)
    ├── cli.solve.test.ts
    ├── cli.validate.test.ts
    ├── cli.generate.test.ts
    ├── cli.parse-errors.test.ts
    └── cli.stubs.test.ts
```

All tests are deterministic. Generator tests use fixed seeds.
