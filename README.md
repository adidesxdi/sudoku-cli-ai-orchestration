# Sudoku CLI

A command-line tool for solving, validating, and generating Sudoku puzzles.

## Requirements

- **Node.js >= 20**
- TypeScript (compiled via `npm run build`)

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd sudoku-cli-ai-orchestration

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional, for using `sudoku` command anywhere)
npm link
```

## Usage

After building, you can run the CLI using `npx sudoku` or `sudoku` (if linked):

### Solve a puzzle

Solve a Sudoku puzzle and display the solution in a visual grid format.

```bash
# Using an 81-character string
sudoku solve --input "530070000600195000098000060800060003400803001700020006060000280000419005000080079"

# Using a file
sudoku solve --input testdata/solvable/easy1.sdk
```

**Output format:** The solver displays the solution as a 9×9 grid with box borders:
```
+-------+-------+-------+
| 5 3 4 | 6 7 8 | 9 1 2 |
| 6 7 2 | 1 9 5 | 3 4 8 |
| 1 9 8 | 3 4 2 | 5 6 7 |
+-------+-------+-------+
| 8 5 9 | 7 6 1 | 4 2 3 |
| 4 2 6 | 8 5 3 | 7 9 1 |
| 7 1 3 | 9 2 4 | 8 5 6 |
+-------+-------+-------+
| 9 6 1 | 5 3 7 | 2 8 4 |
| 2 8 7 | 4 1 9 | 6 3 5 |
| 3 4 5 | 2 8 6 | 1 7 9 |
+-------+-------+-------+
```

**Exit codes:**
- `0` - Puzzle solved successfully
- `1` - Puzzle is unsolvable or invalid

### Validate a puzzle

Check if a puzzle follows Sudoku rules (no duplicate digits in rows, columns, or 3×3 boxes).

```bash
# Using an 81-character string
sudoku validate --inputEP "530070000600195000098000060800060003400803001700020006060000280000419005000080079"

# Using a file
sudoku validate --inputEP testdata/solvable/easy1.sdk
```

**Output:**
- Valid puzzle: `Puzzle is valid.` (exit code 0)
- Invalid puzzle: `Puzzle is invalid: <error details>` (exit code 1)

**Note:** Partial puzzles (with empty cells) are valid as long as no rules are violated.

### Generate a puzzle

Generate a new Sudoku puzzle with a specified difficulty and seed for deterministic output.

```bash
sudoku generate --difficulty easy --seed 42
sudoku generate --difficulty medium --seed 123
sudoku generate --difficulty hard --seed 999
```

> **Note:** The generate command is not yet implemented and currently outputs a stub message.

## Input Format

Puzzles are represented as 81-character strings or files:
- **Digits `1-9`** represent filled cells
- **`0` or `.`** represent empty cells
- Leading/trailing whitespace is trimmed
- Input can be either:
  - A direct 81-character string, or
  - A file path (file contents will be read and parsed)

**Example puzzle string:**
```
530070000600195000098000060800060003400803001700020006060000280000419005000080079
```

**Example file** (`easy1.sdk`):
```
530070000600195000098000060800060003400803001700020006060000280000419005000080079
```

### Error Handling

The CLI provides clear error messages for common issues:

```bash
# Invalid length
$ sudoku solve --input "too-short"
Error: Invalid puzzle length: expected 81 characters, got 9

# Invalid characters
$ sudoku solve --input "530070000600195000098000060800060003400803001700020006060000280000419005000080@@@"
Error: Invalid character in puzzle: '@'. Only digits 0-9 and '.' are allowed.

# File not found
$ sudoku solve --input missing.sdk
Error: File not found: missing.sdk

# Invalid puzzle (rule violations)
$ sudoku solve --input testdata/unsolvable/contradiction.sdk
Puzzle is invalid: Duplicate digit 5 in row 1
```

## Development

### Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run typecheck` | Type-check without emitting files |
| `npm run lint` | Run ESLint on source and test files |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

### Project Structure

```
src/
├── cli/
│   ├── index.ts              # CLI entry point
│   └── commands/
│       ├── solve.ts          # solve subcommand (implemented)
│       ├── validate.ts       # validate subcommand (implemented)
│       └── generate.ts       # generate subcommand (stub)
└── core/
    ├── puzzle.ts             # Puzzle type and utilities
    ├── parsePuzzleInput.ts   # Input parsing and validation
    ├── validatePuzzle.ts     # Sudoku validation engine
    └── solvePuzzle.ts        # Sudoku solving engine (backtracking)

tests/
├── core/                     # Unit tests for core modules
│   ├── parsePuzzleInput.test.ts
│   ├── validatePuzzle.test.ts
│   └── solvePuzzle.test.ts
└── smoke/                    # CLI integration tests
    ├── cli.solve.test.ts
    ├── cli.validate.test.ts
    ├── cli.parse-errors.test.ts
    └── cli.stubs.test.ts

testdata/
├── solvable/                 # Valid solvable puzzles
│   ├── easy1.sdk
│   ├── medium1.sdk
│   ├── hard1.sdk
│   └── already-solved.sdk
└── unsolvable/               # Invalid or unsolvable puzzles
    └── contradiction.sdk
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Type-check the code
npm run typecheck

# Lint the code
npm run lint
```

### Demo / Quick Start

Here's a quick demo of the implemented features:

```bash
# Build the project
npm run build

# Solve an easy puzzle from a file
sudoku solve --input testdata/solvable/easy1.sdk

# Solve using a string directly
sudoku solve --input "530070000600195000098000060800060003400803001700020006060000280000419005000080079"

# Validate a puzzle
sudoku validate --inputEP testdata/solvable/medium1.sdk

# Try an invalid puzzle
sudoku validate --inputEP testdata/unsolvable/contradiction.sdk

# Generate a puzzle (not yet implemented)
sudoku generate --difficulty medium --seed 42
```

## Implementation Status

Based on the [BACKLOG_PACK.md](BACKLOG_PACK.md):

- ✅ **SUD-1**: Project scaffolding & CLI skeleton
- ✅ **SUD-2**: Input model & robust puzzle parsing
- ✅ **SUD-3**: Sudoku validation engine & `sudoku validate`
- ✅ **SUD-4**: Sudoku solving engine & `sudoku solve`
- ⏳ **SUD-5**: Sudoku generator with difficulty & deterministic seed (not yet implemented)
- ⏳ **SUD-6**: Tests, CI workflow, documentation & AI-readiness assets (in progress)

## How It Works

### Solver Algorithm

The solver uses a **deterministic backtracking algorithm**:
1. Find the next empty cell (value 0)
2. Try digits 1-9 in order
3. For each digit, check if placement is valid (no conflicts in row, column, or 3×3 box)
4. Recursively solve the rest of the puzzle
5. If no solution is found, backtrack and try the next digit

This approach guarantees finding a solution if one exists, and correctly identifies unsolvable puzzles.

### Validator

The validator checks:
- Grid size is exactly 81 cells
- No duplicate digits 1-9 in any row
- No duplicate digits 1-9 in any column  
- No duplicate digits 1-9 in any 3×3 box

Empty cells (0 or `.`) are ignored during duplicate checking, allowing partial puzzles to be validated.

## Additional Resources

- **Backlog**: See [BACKLOG_PACK.md](BACKLOG_PACK.md) for the complete project plan and story details
- **Copilot Instructions**: See [.github/copilot-instructions.md](.github/copilot-instructions.md) for development guidelines

## License

MIT
