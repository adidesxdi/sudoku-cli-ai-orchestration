import { Command } from 'commander';
import { parsePuzzleInput, PuzzleParseError } from '../../core/parsePuzzleInput.js';
import { solvePuzzle } from '../../core/solvePuzzle.js';

interface SolveOptions {
  input: string;
}

/**
 * Format a puzzle solution as 9 lines of 9 digits each.
 */
function formatSolution(puzzle: number[]): string {
  const lines: string[] = [];
  for (let row = 0; row < 9; row++) {
    const start = row * 9;
    const rowDigits = puzzle.slice(start, start + 9).join('');
    lines.push(rowDigits);
  }
  return lines.join('\n');
}

export function registerSolveCommand(program: Command): void {
  program
    .command('solve')
    .description('Solve a Sudoku puzzle')
    .requiredOption('--input <string-or-file>', 'Puzzle as 81-char string or path to file')
    .action((options: SolveOptions) => {
      try {
        const puzzle = parsePuzzleInput(options.input);
        const result = solvePuzzle(puzzle);

        if (result.status === 'solved') {
          console.log(formatSolution(result.solution!));
          process.exit(0);
        } else if (result.status === 'unsolvable') {
          console.error('Puzzle is unsolvable.');
          process.exit(1);
        } else {
          // invalid
          const summary = result.errors!.map((e) => e.message).join('; ');
          console.error(`Puzzle is invalid: ${summary}`);
          process.exit(1);
        }
      } catch (err) {
        if (err instanceof PuzzleParseError) {
          console.error(`Error: ${err.message}`);
          process.exit(1);
        }
        throw err;
      }
    });
}
