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

**Output:** An 81-character puzzle string using `0` for empty cells:
```
027000048390000020100090037009001080705008200840020700938040500000000000671005093
```

**Difficulty levels:**
| Level | Clues | Description |
|-------|-------|-------------|
| `easy` | 36-45 | Good for beginners |
| `medium` | 27-35 | Moderate challenge |
| `hard` | 22-26 | Requires advanced techniques |

**Determinism:** The same `--difficulty` and `--seed` combination always produces the same puzzle.

**Exit codes:**
- `0` - Puzzle generated successfully
- `1` - Invalid parameters

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
│       ├── solve.ts          # solve subcommand
│       ├── validate.ts       # validate subcommand
│       └── generate.ts       # generate subcommand
└── core/
    ├── puzzle.ts             # Puzzle type and utilities
    ├── parsePuzzleInput.ts   # Input parsing and validation
    ├── validatePuzzle.ts     # Sudoku validation engine
    ├── solvePuzzle.ts        # Sudoku solving engine (backtracking)
    ├── generatePuzzle.ts     # Sudoku generator with difficulty
    └── seededRandom.ts       # Deterministic RNG (Mulberry32)

tests/
├── core/                     # Unit tests for core modules
│   ├── parsePuzzleInput.test.ts
│   ├── validatePuzzle.test.ts
│   ├── solvePuzzle.test.ts
│   └── generatePuzzle.test.ts
└── smoke/                    # CLI integration tests
    ├── cli.solve.test.ts
    ├── cli.validate.test.ts
    ├── cli.generate.test.ts
    ├── cli.parse-errors.test.ts
    └── cli.stubs.test.ts

testdata/
├── solvable/                 # Valid solvable puzzles
├── valid/                    # Valid puzzles for validation tests
├── invalid/                  # Invalid puzzles (rule violations)
└── unsolvable/               # Unsolvable puzzles
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

Here's a quick demo of all features:

```bash
# Build the project
npm run build

# 1. Generate a puzzle with a specific seed (deterministic)
sudoku generate --difficulty medium --seed 42
# Output: 027000048390000020100090037009001080705008200840020700938040500000000000671005093

# 2. Validate the generated puzzle
sudoku validate --inputEP "027000048390000020100090037009001080705008200840020700938040500000000000671005093"
# Output: Puzzle is valid.

# 3. Solve the puzzle
sudoku solve --input "027000048390000020100090037009001080705008200840020700938040500000000000671005093"
# Output: Solved grid with box borders

# 4. Full pipeline: generate → validate → solve
p=$(sudoku generate --difficulty hard --seed 99)
echo "Generated: $p"
sudoku validate --inputEP "$p"
sudoku solve --input "$p"

# 5. Work with puzzle files
sudoku solve --input testdata/solvable/easy1.sdk
sudoku validate --inputEP testdata/solvable/medium1.sdk

# 6. Error handling examples
sudoku solve --input "too-short"           # Invalid length error
sudoku validate --inputEP "invalid@chars"  # Invalid character error
sudoku generate --difficulty extreme --seed 1  # Invalid difficulty
```

## Implementation Status

Based on the [BACKLOG_PACK.md](BACKLOG_PACK.md):

- ✅ **SUD-1**: Project scaffolding & CLI skeleton
- ✅ **SUD-2**: Input model & robust puzzle parsing
- ✅ **SUD-3**: Sudoku validation engine & `sudoku validate`
- ✅ **SUD-4**: Sudoku solving engine & `sudoku solve`
- ✅ **SUD-5**: Sudoku generator with difficulty & deterministic seed
- ✅ **SUD-6**: Tests, CI workflow, documentation & AI-readiness assets

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

### Generator

The generator creates puzzles with guaranteed unique solutions:
1. Generate a fully solved grid using randomized backtracking (seeded RNG)
2. Remove clues one at a time in random order
3. After each removal, verify the puzzle still has exactly one solution
4. Stop when target clue count for difficulty is reached

The seeded RNG (Mulberry32 algorithm) ensures the same seed always produces the same puzzle.

## Additional Resources

- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md) for module layout and design
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for coding conventions and guidelines
- **Backlog**: See [BACKLOG_PACK.md](BACKLOG_PACK.md) for the complete project plan and story details
- **Copilot Instructions**: See [.github/copilot-instructions.md](.github/copilot-instructions.md) for AI assistant guidelines

## License

MIT
