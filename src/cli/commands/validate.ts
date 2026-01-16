import { Command } from 'commander';

export function registerValidateCommand(program: Command): void {
  program
    .command('validate')
    .description('Validate a Sudoku puzzle')
    .requiredOption('--inputEP <string-or-file>', 'Puzzle as 81-char string or path to file')
    .action((_options) => {
      console.log('validate: Not implemented yet');
      process.exit(0);
    });
}
