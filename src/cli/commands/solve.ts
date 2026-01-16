import { Command } from 'commander';

export function registerSolveCommand(program: Command): void {
  program
    .command('solve')
    .description('Solve a Sudoku puzzle')
    .requiredOption('--input <string-or-file>', 'Puzzle as 81-char string or path to file')
    .action((_options) => {
      console.log('solve: Not implemented yet');
      process.exit(0);
    });
}
