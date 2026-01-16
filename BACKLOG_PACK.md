# BACKLOG_PACK

---

## Guardrails (for all stories)

- **Tests-first:**  
  - Add or update tests before or alongside implementation.  
  - Do not commit features without corresponding automated tests.

- **Small diffs:**  
  - Keep changes tightly scoped to the current story.  
  - Avoid cross-story refactors unless strictly necessary and explicitly described in the story.

- **Deterministic generator with seed:**  
  - Do **not** use raw `Math.random()` for core generator behavior.  
  - Use a seeded RNG so `difficulty + seed` always produces the same puzzle.

- **No UI:**  
  - This is **CLI-only**.  
  - Do not add any web, GUI, or graphical libraries or entrypoints.

- **Runtime & language constraints:**  
  - **Node.js >= 20** (target this in `engines` and CI).  
  - **TypeScript** only for source files; no plain JS in `src/`.  
  - Prefer strict typing and avoid `any` where possible.

---

## SUD-1 – Project scaffolding & CLI skeleton

**Title**  
SUD-1 – Project scaffolding & CLI skeleton (TypeScript, Node ≥ 20)

**Description**  
Create the initial TypeScript project and CLI skeleton for the `sudoku` command. Provide a minimal but complete Node ≥ 20 setup, TypeScript configuration, test runner, linting, and a basic CLI with `solve`, `validate`, and `generate` subcommands that currently return stub outputs.

**Acceptance Criteria**

- `package.json` exists and:
  - Targets **Node ≥ 20** (via `engines.node` or docs).
  - Has `bin.sudoku` configured to point to the built CLI entry.
  - Has scripts for at least: `build`, `test`, `lint`, `typecheck`.
- TypeScript is configured:
  - `tsconfig.json` with strict mode enabled (`"strict": true`).
  - Source located under `src/`.
- Basic test framework is wired (e.g., Vitest or Jest) and runnable.
- Linting and formatting are configured (e.g., ESLint + Prettier).
- CLI entry:
  - A `sudoku` command exists with subcommands:
    - `solve --input <string-or-file>`
    - `validate --inputEP <string-or-file>`
    - `generate --difficulty <easy|medium|hard> --seed <number>`
  - Each subcommand prints a stub message (e.g., “Not implemented yet”) and exits with code `0`.
- Minimal `README.md` describes:
  - How to install dependencies.
  - How to run the stub CLI and tests.

**Definition of Done (DoD)**

- `npm run build` succeeds without TypeScript errors.
- `npm test` runs and passes (even if only placeholder tests).
- `npm run lint` and `npm run typecheck` succeed.
- After `npm link` (or equivalent), `sudoku` can be invoked from the terminal and shows stub behavior for the three subcommands.
- Project structure (`src/cli`, `src/core`, etc.) is established and ready for later stories.

**Files likely impacted (high-level)**

- `package.json`
- `tsconfig.json`
- `.eslintrc.*`, `.prettierrc.*` (or equivalent)
- `src/cli/index.ts` (main CLI entrypoint)
- `src/cli/commands/solve.ts` (stub)
- `src/cli/commands/validate.ts` (stub)
- `src/cli/commands/generate.ts` (stub)
- `tests/smoke/cli.stubs.test.ts` (or similar)
- `README.md`

**Commands to verify**

- `npm install`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npx sudoku --help` (or `sudoku --help` after `npm link`)
- `sudoku solve --input "123..."` (should print stub and exit `0`)
- `sudoku validate --inputEP "123..."` (stub)
- `sudoku generate --difficulty easy --seed 42` (stub)

**Implementation Notes**

- Use a CLI helper like `commander` or `yargs` to register subcommands; keep argument definitions close to command handlers.
- Keep CLI wiring thin; core logic will live under `src/core` in later stories.
- Start with minimal test that simply asserts the CLI process starts and exits with code `0` for stub commands.

---

## SUD-2 – Input model & robust puzzle parsing

**Title**  
SUD-2 – Input model & robust puzzle parsing (81-char string or file)

**Description**  
Define a shared `Puzzle` model and implement robust parsing utilities that can take either an 81-character string or a file path, perform validation on length and character set, and return a normalized internal representation. Integrate this parsing logic into all three CLI subcommands (still stubbed for core behavior).

**Acceptance Criteria**

- A `Puzzle` type is defined and used across the core modules:
  - Represents a 9×9 Sudoku grid (e.g., `number[]` length 81 or `number[][]`).
  - Uses `0` for empty cells.
- Parsing utilities implemented (e.g., `parsePuzzleInput` and helper functions) that:
  - Receive a single string from CLI (`--input` / `--inputEP`).
  - Resolve this either as:
    - A direct 81-character puzzle string, or
    - A file path whose contents are read into a puzzle string.
  - Normalize input by trimming whitespace around the whole string/file contents.
  - Validate:
    - Exactly 81 characters after normalization.
    - Only characters `1–9`, `0`, or `.`.
  - Map `.` and `0` to internal blank (`0`), digits `1–9` to their numeric values.
- Error behavior:
  - Missing/unreadable file → clear error message.
  - Invalid length → clear error message.
  - Disallowed characters → clear error message.
- All CLI subcommands (`solve`, `validate`, `generate`) now:
  - Use the shared parser.
  - On parsing success: proceed to stub core logic and exit `0`.
  - On parsing failure: print the error and exit with non-zero status.

**Definition of Done (DoD)**

- Unit tests for parsing utilities cover:
  - Valid inline string (81 chars, allowed characters).
  - Invalid inline length (too short/long).
  - Invalid characters (e.g., letters, symbols).
  - Valid file path (contents valid).
  - Nonexistent or unreadable file.
- CLI behavior:
  - Uses a single parsing path; no duplicated parsing logic.
  - Exits non-zero with clear messaging when parse fails.
- TypeScript strict mode passes for new types and functions; no `any` in parsing code.

**Files likely impacted (high-level)**

- `src/core/puzzle.ts` (Puzzle type & helpers)
- `src/core/parsePuzzleInput.ts` (or similar)
- `src/cli/commands/solve.ts` (integrate parser)
- `src/cli/commands/validate.ts` (integrate parser)
- `src/cli/commands/generate.ts` (integrate parser, if needed for future reuse)
- `tests/core/parsePuzzleInput.test.ts`
- `tests/smoke/cli.parse-errors.test.ts`
- Sample test data under `testdata/` (e.g., `testdata/valid-easy.sdk`, `testdata/invalid-length.sdk`)

**Commands to verify**

- `npm run build`
- `npm run typecheck`
- `npm test` (should include parsing unit tests)
- CLI parse behavior:
  - `sudoku solve --input "valid81chars..."`  
  - `sudoku solve --input "too-short"` (expect non-zero exit + clear error)
  - `sudoku solve --input "invalid#chars..."` (non-zero exit)
  - `sudoku solve --input testdata/valid-easy.sdk` (should parse successfully)
  - `sudoku solve --input testdata/missing.sdk` (non-zero exit)

**Implementation Notes**

- Consider a dedicated error type, e.g., `PuzzleParseError`, with a `code` and `message` for consistent CLI mapping.
- For detecting file vs raw string, choose and document a deterministic strategy (e.g., “if path exists on disk, treat as file; else, if length 81, treat as raw puzzle; otherwise error”).
- Keep parsing logic side-effect free except for file I/O; this makes unit testing easier.

---

## SUD-3 – Sudoku validation engine & `sudoku validate`

**Title**  
SUD-3 – Sudoku validation engine & `sudoku validate`

**Description**  
Create the Sudoku validation engine that checks structural and logical consistency of a puzzle (rows, columns, boxes, partial puzzles allowed). Wire this engine into the `sudoku validate` CLI command, built on top of SUD-2’s parser and the shared `Puzzle` model.

**Acceptance Criteria**

- Core validator implemented (e.g., `validatePuzzle(puzzle: Puzzle)`):
  - Confirms grid size is 9×9 / length 81.
  - Ensures each row, column, and 3×3 box has no duplicate digits `1–9` (ignoring zeros).
- Validator returns structured data:
  - `{ isValid: boolean; errors?: ValidationError[] }`  
    where each `ValidationError` describes:
    - The rule violated (row/column/box).
    - The index/coordinate.
    - The offending digit when applicable.
- `sudoku validate --inputEP "<...>"`:
  - Uses SUD-2 parser to obtain `Puzzle`.
  - If parsing fails: prints parse error and exits non-zero.
  - If puzzle is valid: prints “Puzzle is valid.” and exits `0`.
  - If puzzle is invalid: prints “Puzzle is invalid: <summary>” and exits with non-zero status.
- Partial puzzles:
  - Allowed as long as rules are not violated.
  - Validation ignores blanks (0) for duplicates.

**Definition of Done (DoD)**

- Unit tests for validator:
  - Valid full puzzle (no conflicts).
  - Valid partial puzzle with blanks.
  - Conflict in a row.
  - Conflict in a column.
  - Conflict in a box.
- CLI tests:
  - At least one test invokes `sudoku validate` with:
    - A valid puzzle (exit `0`).
    - An invalid puzzle (exit non-zero and includes a hint of the issue).
- Core validator is reused by future stories (solver & generator) instead of duplicating rule checks.

**Files likely impacted (high-level)**

- `src/core/validatePuzzle.ts`
- `src/core/puzzle.ts` (helpers like `getRow`, `getColumn`, `getBox`)
- `src/cli/commands/validate.ts` (wire parser + validator + CLI output)
- `tests/core/validatePuzzle.test.ts`
- `tests/smoke/cli.validate.test.ts`
- `testdata/valid/*.sdk`, `testdata/invalid/*.sdk`

**Commands to verify**

- `npm run build`
- `npm run typecheck`
- `npm test` (should include validator unit tests)
- `sudoku validate --inputEP testdata/valid/full.sdk` (expect “valid”, exit `0`)
- `sudoku validate --inputEP testdata/invalid/row-dup.sdk` (expect clear invalid message, non-zero exit)

**Implementation Notes**

- Implement helper functions:
  - `getRow(puzzle, rowIndex)`, `getColumn(puzzle, colIndex)`, `getBox(puzzle, boxIndex)`.
  - A generic utility `hasDuplicateDigit(values: number[]): boolean`.
- Prefer deterministic and pure functions for the validator; no logging or I/O.
- Use validator in other modules (solver, generator) to reduce bugs and keep one source of truth for rule checking.

---

## SUD-4 – Sudoku solving engine & `sudoku solve`

**Title**  
SUD-4 – Sudoku solving engine & `sudoku solve`

**Description**  
Implement a deterministic Sudoku solver (e.g., backtracking) that takes a valid puzzle and returns a fully solved grid or indicates that the puzzle is unsolvable. Connect this solver to the `sudoku solve` CLI command, using the parser and validator previously implemented.

**Acceptance Criteria**

- Core solver implemented (e.g., `solvePuzzle(puzzle: Puzzle)`):
  - Returns either:
    - `{ status: 'solved'; solution: Puzzle }`, or
    - `{ status: 'unsolvable' }`, or
    - `{ status: 'invalid'; errors: ValidationError[] }` if basic validation fails.
  - Uses deterministic logic (no randomness).
- For valid and solvable puzzles:
  - The returned `solution`:
    - Is a complete grid with no zeros.
    - Passes `validatePuzzle`.
- For already-solved puzzles:
  - Solver returns `status: 'solved'` with the same puzzle (or equivalent).
- `sudoku solve --input "<...>"`:
  - Uses SUD-2 parser and SUD-3 validator/solver.
  - Valid & solvable:
    - Prints solved puzzle (e.g., 9 lines of digits) and exits `0`.
  - Valid but unsolvable:
    - Prints “Puzzle is unsolvable.” and exits non-zero.
  - Invalid:
    - Prints validation errors and exits non-zero.

**Definition of Done (DoD)**

- Unit tests for solver:
  - Multiple known solvable puzzles (easy/medium/hard) with expected solutions (can use snapshot tests).
  - At least one already-solved puzzle.
  - At least one unsolvable or contradictory puzzle.
- CLI tests:
  - `sudoku solve` invoked with:
    - A known solvable puzzle (exit `0`, prints solution).
    - A puzzle known to be unsolvable (non-zero exit, error message).
- Performance:
  - Typical puzzles solve quickly (<< 1s on normal hardware).
- Solver is written in a reusable way so SUD-5 can use it to check generator output and uniqueness.

**Files likely impacted (high-level)**

- `src/core/solvePuzzle.ts`
- `src/core/puzzle.ts` (helper functions to iterate blank cells, etc.)
- `src/core/validatePuzzle.ts` (reused from SUD-3; may add small helper interfaces)
- `src/cli/commands/solve.ts` (wire parser + validator + solver + output)
- `tests/core/solvePuzzle.test.ts`
- `tests/smoke/cli.solve.test.ts`
- `testdata/solvable/*.sdk`, `testdata/unsolvable/*.sdk`

**Commands to verify**

- `npm run build`
- `npm run typecheck`
- `npm test` (includes solver unit tests)
- CLI:
  - `sudoku solve --input testdata/solvable/easy1.sdk` (exit `0`, shows solution)
  - `sudoku solve --input testdata/unsolvable/contradiction.sdk` (non-zero exit, “unsolvable”)

**Implementation Notes**

- Implement a recursive backtracking solver:
  - Find next empty cell.
  - Try digits 1–9, check validity via quick row/column/box checks.
  - Backtrack on conflicts.
- Consider a helper function to count solutions (e.g., `countSolutions(puzzle, limit)`), which will be reused to ensure uniqueness in SUD-5.
- Ensure solver is pure with respect to input puzzle (clone puzzle before mutating).

---

## SUD-5 – Sudoku generator with difficulty & deterministic seed

**Title**  
SUD-5 – Sudoku generator with difficulty & deterministic seed

**Description**  
Implement a deterministic Sudoku generator that, given a difficulty level and seed, produces a valid 9×9 puzzle with exactly one solution. It must reuse the solver and validator, and rely on a seeded RNG so `(difficulty, seed)` always yields the same puzzle. Wire this behavior into `sudoku generate`.

**Acceptance Criteria**

- Core generator implemented (e.g., `generatePuzzle(difficulty: Difficulty, seed: number)`):
  - Returns an object like:
    - `{ puzzle: Puzzle; solution: Puzzle }`.
  - Uses a seeded RNG (no unseeded `Math.random()`).
  - Ensures:
    - Puzzle is structurally valid and passes `validatePuzzle`.
    - Puzzle has exactly one solution (verified via solver / solution-counter).
- Difficulty behavior:
  - `easy`, `medium`, `hard`:
    - Each has a documented heuristic (e.g., clue count ranges or simple complexity metrics).
    - For the same `seed`, different difficulties produce different puzzles or at least different clue patterns.
- Determinism:
  - For a given `(difficulty, seed)`, `generatePuzzle` always returns the same `puzzle`.
- `sudoku generate --difficulty easy|medium|hard --seed <number>`:
  - Validates `difficulty` and `seed` parameters.
  - Generates puzzle, validates it, and confirms uniqueness.
  - Prints the puzzle as an 81-character string using `0` or `.` for blanks.
  - Exits `0` on success; non-zero on any error (invalid params, generation failure).

**Definition of Done (DoD)**

- Unit tests for generator:
  - For each difficulty, at least one fixed seed is used in a snapshot or structurally-checked test to ensure determinism.
  - Generated puzzles pass `validatePuzzle`.
  - Generated puzzles are solvable by `solvePuzzle` and confirmed unique.
- CLI tests:
  - `sudoku generate --difficulty medium --seed 42`:
    - Produces a puzzle that:
      - Validates with `sudoku validate`.
      - Solves with `sudoku solve`.
- No generator code uses unseeded randomness (guard against accidental `Math.random()`).

**Files likely impacted (high-level)**

- `src/core/generatePuzzle.ts`
- `src/core/seededRandom.ts` (or equivalent helper)
- `src/core/solvePuzzle.ts` (reused)
- `src/core/validatePuzzle.ts` (reused)
- `src/cli/commands/generate.ts` (wire CLI options to generator)
- `tests/core/generatePuzzle.test.ts`
- `tests/smoke/cli.generate.test.ts`

**Commands to verify**

- `npm run build`
- `npm run typecheck`
- `npm test` (must include generator unit tests)
- CLI:
  - `sudoku generate --difficulty medium --seed 42`
  - Pipe output into validate and solve:
    - `p=$(sudoku generate --difficulty medium --seed 42); sudoku validate --inputEP "$p"; sudoku solve --input "$p"`

**Implementation Notes**

- Typical pipeline:
  1. Generate a fully solved grid (e.g., by shuffling a base solution using seeded randomness or by running the solver in constructive mode).
  2. Remove clues according to difficulty rules, each time checking:
     - The puzzle remains uniquely solvable (use solution-counting).
  3. Stop when difficulty targets are met.
- Use a well-defined seeded RNG interface, e.g.:
  - `const rng = createSeededRandom(seed);`
  - `rng.next()` returns a deterministic float/number.
- Ensure generator is pure with respect to `seed + difficulty`; avoid external state.

---

## SUD-6 – Tests, CI workflow, documentation & AI-readiness assets

**Title**  
SUD-6 – Tests, CI workflow, documentation & AI-readiness assets

**Description**  
Consolidate quality and usability: ensure all core modules have unit tests and CLI smoke tests, add a CI workflow to run typechecking and tests, finalize documentation (user-focused), and add AI-readiness assets (architecture overview, contribution notes) to help an AI coding assistant and humans collaborate effectively on this repo.

**Acceptance Criteria**

- **Tests (unit + CLI smoke):**
  - Unit tests cover:
    - Parser (SUD-2).
    - Validator (SUD-3).
    - Solver (SUD-4).
    - Generator (SUD-5).
  - CLI smoke/integration tests:
    - Spawn the built CLI (`sudoku`) and verify:
      - Happy paths for `solve`, `validate`, `generate`.
      - Error cases: bad length, invalid characters, missing file, invalid difficulty.
    - Check exit codes and key output substrings.
- **CI workflow:**
  - CI config (e.g., `.github/workflows/ci.yml`) exists and:
    - Runs on pushes and PRs.
    - Installs dependencies (`npm ci` or `npm install`).
    - Runs:
      - `npm run typecheck`
      - `npm run lint`
      - `npm test`
    - Fails the build on any error.
- **Documentation:**
  - `README.md` updated with:
    - Overview, Node ≥ 20 requirement, TypeScript, CLI-only scope.
    - Installation and usage instructions for:
      - `sudoku solve --input "<string-or-file>"`
      - `sudoku validate --inputEP "<string-or-file>"`
      - `sudoku generate --difficulty easy|medium|hard --seed <number>`
    - Input rules (81 chars, allowed characters, blanks as `0`/`.`).
    - Error handling and exit codes.
    - How to run tests and interpret results.
  - A short demo section (script of commands to run for a live demo).
- **AI-readiness assets:**
  - `ARCHITECTURE.md` (or `docs/overview.md`) describing:
    - Module layout (`src/core/`, `src/cli/`).
    - How validator, solver, generator, and parser relate.
    - How CLI commands call core functions.
  - `CONTRIBUTING.md` with:
    - Coding conventions (TypeScript strict, testing rules).
    - Expectations for small diffs and tests-first (restate guardrails).
  - Clear references in `README.md` pointing to these docs.

**Definition of Done (DoD)**

- All tests (unit + CLI smoke) pass locally and in CI.
- CI is green for the main branch and on a sample PR.
- `npm run typecheck` and `npm run lint` are part of the CI workflow and pass.
- Docs are up to date with current behavior and match the epic’s success criteria & DoD.
- AI-readiness docs are present, accurate, and discoverable.
- Demo script has been executed successfully on a clean clone (manual verification).

**Files likely impacted (high-level)**

- `tests/core/*.test.ts` (ensure coverage of parser/validator/solver/generator)
- `tests/smoke/cli.*.test.ts` (solve/validate/generate)
- `.github/workflows/ci.yml` (or equivalent CI config)
- `README.md` (expanded)
- `ARCHITECTURE.md` or `docs/overview.md`
- `CONTRIBUTING.md`
- Possibly `package.json` (ensure scripts align with CI)

**Commands to verify**

- Locally:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
- CLI smoke checks (can be scripted in tests or run manually):
  - `sudoku validate --inputEP testdata/valid/full.sdk`
  - `sudoku solve --input testdata/solvable/easy1.sdk`
  - `sudoku generate --difficulty hard --seed 99`
- CI:
  - Push or open PR and confirm CI passes (via repository’s CI UI).

**Implementation Notes**

- Use `child_process.spawn` or equivalent test runner utilities to exercise CLI in smoke tests.
- Ensure tests are stable and deterministic (no flakiness due to randomness; generator is seeded).
- In `ARCHITECTURE.md`, explicitly describe key functions (`parsePuzzleInput`, `validatePuzzle`, `solvePuzzle`, `generatePuzzle`) so AI tools can easily infer entrypoints and responsibilities.

Sources:

