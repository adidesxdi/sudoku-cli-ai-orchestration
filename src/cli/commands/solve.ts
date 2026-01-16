import { Command } from 'commander';
import { parsePuzzleInput, PuzzleParseError } from '../../core/parsePuzzleInput.js';
import { solvePuzzle } from '../../core/solvePuzzle.js';

interface SolveOptions {
  input: string;
}

/**
 * Format a puzzle solution as a visual grid with borders.
 * Uses dots (.) for empty cells (zeros) and spaces between digits.
 */
function formatSolution(puzzle: number[]): string {
  const lines: string[] = [];
  const separator = '+-------+-------+-------+';

  for (let row = 0; row < 9; row++) {
    // Add horizontal separator before rows 0, 3, 6
    if (row % 3 === 0) {
      lines.push(separator);
    }

    const start = row * 9;
    const rowValues = puzzle.slice(start, start + 9);
    
    // Format the row with vertical separators
    const formattedRow: string[] = [];
    for (let col = 0; col < 9; col++) {
      const value = rowValues[col];
      const display = value === 0 ? '.' : value.toString();
      
      // Add opening border
      if (col === 0) {
        formattedRow.push('|');
      }
      
      // Add the value with space
      formattedRow.push(' ' + display);
      
      // Add closing border for boxes
      if ((col + 1) % 3 === 0) {
        formattedRow.push(' |');
      }
    }
    
    lines.push(formattedRow.join(''));
  }
  
  // Add final horizontal separator
  lines.push(separator);
  
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
