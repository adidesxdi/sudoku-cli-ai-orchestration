import { Command } from 'commander';
import { parsePuzzleInput, PuzzleParseError } from '../../core/parsePuzzleInput.js';

interface SolveOptions {
  input: string;
}

export function registerSolveCommand(program: Command): void {
  program
    .command('solve')
    .description('Solve a Sudoku puzzle')
    .requiredOption('--input <string-or-file>', 'Puzzle as 81-char string or path to file')
    .action((options: SolveOptions) => {
      try {
        const puzzle = parsePuzzleInput(options.input);
        // Stub: puzzle parsed successfully, solver not implemented yet
        console.log(`solve: Parsed puzzle with ${puzzle.filter((c) => c !== 0).length} clues`);
        console.log('solve: Not implemented yet');
        process.exit(0);
      } catch (err) {
        if (err instanceof PuzzleParseError) {
          console.error(`Error: ${err.message}`);
          process.exit(1);
        }
        throw err;
      }
    });
}
