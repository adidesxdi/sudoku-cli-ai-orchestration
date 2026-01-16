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

```bash
sudoku solve --input "<81-char-puzzle-string>"
sudoku solve --input path/to/puzzle.sdk
```

### Validate a puzzle

```bash
sudoku validate --inputEP "<81-char-puzzle-string>"
sudoku validate --inputEP path/to/puzzle.sdk
```

### Generate a puzzle

```bash
sudoku generate --difficulty easy --seed 42
sudoku generate --difficulty medium --seed 123
sudoku generate --difficulty hard --seed 999
```

> **Note:** All commands currently output stub messages. Full implementation is coming in later stories.

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
│   ├── index.ts          # CLI entry point
│   └── commands/
│       ├── solve.ts      # solve subcommand
│       ├── validate.ts   # validate subcommand
│       └── generate.ts   # generate subcommand
└── core/
    └── puzzle.ts         # Puzzle type and utilities

tests/
├── core/                 # Unit tests for core modules
└── smoke/                # CLI integration tests
```

## Input Format

Puzzles are represented as 81-character strings:
- Digits `1-9` represent filled cells
- `0` or `.` represent empty cells
- Whitespace is trimmed

Example:
```
530070000600195000098000060800060003400803001700020006060000280000419005000080079
```

## License

MIT
