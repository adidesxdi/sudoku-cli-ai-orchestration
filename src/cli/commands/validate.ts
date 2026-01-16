import { Command } from 'commander';
import { parsePuzzleInput, PuzzleParseError } from '../../core/parsePuzzleInput.js';

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
        // Stub: puzzle parsed successfully, validator not implemented yet
        console.log(`validate: Parsed puzzle with ${puzzle.filter((c) => c !== 0).length} clues`);
        console.log('validate: Not implemented yet');
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
