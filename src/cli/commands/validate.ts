import { Command } from 'commander';
import { parsePuzzleInput, PuzzleParseError } from '../../core/parsePuzzleInput.js';
import { validatePuzzle } from '../../core/validatePuzzle.js';

interface ValidateOptions {
  inputEP: string;
}

export function registerValidateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate a Sudoku puzzle')
    .requiredOption('--inputEP <string-or-file>', 'Puzzle as 81-char string or path to file')
    .action((options: ValidateOptions) => {
      try {
        const puzzle = parsePuzzleInput(options.inputEP);
        const result = validatePuzzle(puzzle);

        if (result.isValid) {
          console.log('Puzzle is valid.');
          process.exit(0);
        } else {
          const summary = result.errors.map((e) => e.message).join('; ');
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
