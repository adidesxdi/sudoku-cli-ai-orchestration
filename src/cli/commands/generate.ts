import { Command } from 'commander';
import { generatePuzzle, puzzleToString, Difficulty } from '../../core/generatePuzzle.js';

interface GenerateOptions {
  difficulty: Difficulty;
  seed: number;
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
    .action((options: GenerateOptions) => {
      try {
        const result = generatePuzzle(options.difficulty, options.seed);
        const puzzleStr = puzzleToString(result.puzzle);
        console.log(puzzleStr);
        process.exit(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${message}`);
        process.exit(1);
      }
    });
}
