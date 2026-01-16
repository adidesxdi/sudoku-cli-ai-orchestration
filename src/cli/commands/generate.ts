import { Command } from 'commander';

type Difficulty = 'easy' | 'medium' | 'hard';

interface GenerateOptions {
  difficulty: Difficulty;
  seed: string;
}

export function registerGenerateCommand(program: Command): void {
  program
    .command('generate')
    .description('Generate a new Sudoku puzzle')
    .requiredOption(
      '--difficulty <level>',
      'Difficulty level: easy, medium, or hard',
      (value: string): Difficulty => {
        const valid: Difficulty[] = ['easy', 'medium', 'hard'];
        if (!valid.includes(value as Difficulty)) {
          throw new Error(`Invalid difficulty: ${value}. Must be one of: ${valid.join(', ')}`);
        }
        return value as Difficulty;
      }
    )
    .requiredOption('--seed <number>', 'Seed for deterministic generation', (value: string) => {
      const num = parseInt(value, 10);
      if (isNaN(num)) {
        throw new Error(`Invalid seed: ${value}. Must be a number.`);
      }
      return num;
    })
    .action((_options: GenerateOptions) => {
      console.log('generate: Not implemented yet');
      process.exit(0);
    });
}
