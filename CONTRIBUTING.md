# Contributing to Sudoku CLI

Thank you for your interest in contributing! This document outlines the coding conventions, workflow expectations, and guardrails for this project.

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd sudoku-cli-ai-orchestration
npm install

# Build and test
npm run build
npm run typecheck
npm run lint
npm test

# Try the CLI
npx sudoku --help
```

## Project Guardrails

These rules apply to **all changes** (from `BACKLOG_PACK.md`):

### 1. Tests-First

- Add or update tests **before or alongside** implementation
- Do not commit features without corresponding automated tests
- Tests must be deterministic (no flakiness)

### 2. Small Diffs

- Keep changes tightly scoped to the current story/issue
- Avoid cross-story refactors unless strictly necessary
- One logical change per commit/PR when possible

### 3. Deterministic Generator

- **Never** use raw `Math.random()` for core generator behavior
- Use the seeded RNG (`createSeededRandom`) so `difficulty + seed` always produces the same puzzle

### 4. CLI-Only

- This is a **command-line tool only**
- Do not add web, GUI, or graphical libraries
- No UI entrypoints

### 5. Runtime & Language

- **Node.js >= 20** (enforced in `engines` and CI)
- **TypeScript only** for source files (no plain JS in `src/`)
- Use strict typing; avoid `any` where possible

---

## Coding Conventions

### TypeScript

- Strict mode enabled (`"strict": true` in tsconfig)
- Prefer explicit types over inference for function signatures
- Use `readonly` for immutable data
- Avoid `any`; use `unknown` if type is truly unknown

```typescript
// Good
function solvePuzzle(puzzle: Puzzle): SolveResult { ... }

// Avoid
function solvePuzzle(puzzle: any): any { ... }
```

### File Organization

```
src/
├── cli/           # CLI layer (thin, delegates to core)
│   ├── index.ts   # Entry point
│   └── commands/  # One file per subcommand
└── core/          # Business logic (pure functions)
    ├── puzzle.ts  # Shared types
    └── *.ts       # Feature modules
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | camelCase | `parsePuzzleInput.ts` |
| Types/Interfaces | PascalCase | `Puzzle`, `SolveResult` |
| Functions | camelCase | `validatePuzzle()` |
| Constants | UPPER_SNAKE | `DIFFICULTY_CLUES` |

### Error Handling

- Use custom error classes with codes for programmatic handling
- Include clear, user-friendly messages
- CLI exits with code `1` on errors

```typescript
export class PuzzleParseError extends Error {
  constructor(
    public readonly code: 'INVALID_LENGTH' | 'INVALID_CHARACTERS',
    message: string
  ) {
    super(message);
    this.name = 'PuzzleParseError';
  }
}
```

---

## Testing

### Test Framework

We use [Vitest](https://vitest.dev/) for testing.

### Test Structure

```
tests/
├── core/     # Unit tests (fast, isolated, pure functions)
└── smoke/    # CLI integration tests (spawn child process)
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { validatePuzzle } from '../../src/core/validatePuzzle.js';

describe('validatePuzzle', () => {
  it('should validate a correct puzzle', () => {
    const puzzle = [...]; // 81 numbers
    const result = validatePuzzle(puzzle);
    expect(result.isValid).toBe(true);
  });

  it('should detect duplicate in row', () => {
    const puzzle = [...]; // puzzle with row duplicate
    const result = validatePuzzle(puzzle);
    expect(result.isValid).toBe(false);
    expect(result.errors[0].rule).toBe('row');
  });
});
```

### CLI Smoke Tests

```typescript
import { execSync } from 'node:child_process';

it('should solve a valid puzzle', () => {
  const result = execSync('node dist/cli/index.js solve --input "..."', {
    encoding: 'utf-8',
  });
  expect(result).toContain('solution');
});
```

### Running Tests

```bash
npm test                 # Run all tests once
npm run test:watch       # Watch mode for development
npm test -- --coverage   # With coverage report
```

---

## Development Workflow

### 1. Before Starting Work

- Check `BACKLOG_PACK.md` for story requirements
- Understand acceptance criteria
- Review existing code in relevant modules

### 2. Implementation

1. Write failing tests first (when feasible)
2. Implement the feature
3. Ensure all tests pass
4. Run linting and type-checking

```bash
npm run typecheck
npm run lint
npm test
```

### 3. Before Committing

```bash
# Full verification
npm run build
npm run typecheck
npm run lint
npm test
```

### 4. Commit Messages

Use clear, descriptive commit messages:

```
feat(generator): add deterministic puzzle generation

- Implement generatePuzzle with seeded RNG
- Add difficulty-based clue count targets
- Ensure unique solution via countSolutions
```

---

## Pull Request Guidelines

1. **One Story Per PR** — Keep PRs focused on a single backlog item
2. **Include Tests** — All new features must have tests
3. **Pass CI** — Ensure typecheck, lint, and tests pass
4. **Update Docs** — If behavior changes, update README/ARCHITECTURE
5. **Small Diffs** — Avoid unrelated changes

### PR Checklist

- [ ] Tests added/updated
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] Documentation updated (if applicable)
- [ ] Commit messages are clear

---

## For AI Coding Assistants

When working on this codebase:

1. **Read the Guardrails** — Always follow the rules at the top of this document
2. **Check BACKLOG_PACK.md** — Understand story requirements before implementing
3. **Check ARCHITECTURE.md** — Understand module relationships
4. **Use Existing Patterns** — Follow established code patterns
5. **Keep Changes Small** — One story at a time
6. **Test Everything** — Don't skip tests

### Key Files to Understand

| File | Purpose |
|------|---------|
| `BACKLOG_PACK.md` | Story definitions and acceptance criteria |
| `ARCHITECTURE.md` | Module layout and design decisions |
| `.github/copilot-instructions.md` | AI assistant guidelines |
| `tsconfig.json` | TypeScript configuration |
| `vitest.config.ts` | Test configuration |

---

## Getting Help

- **Architecture Questions** — See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Story Details** — See [BACKLOG_PACK.md](BACKLOG_PACK.md)
- **Usage Examples** — See [README.md](README.md)
