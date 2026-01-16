#!/usr/bin/env node

import { Command } from 'commander';
import { registerSolveCommand } from './commands/solve.js';
import { registerValidateCommand } from './commands/validate.js';
import { registerGenerateCommand } from './commands/generate.js';

const program = new Command();

program
  .name('sudoku')
  .description('A CLI tool for solving, validating, and generating Sudoku puzzles')
  .version('0.1.0');

registerSolveCommand(program);
registerValidateCommand(program);
registerGenerateCommand(program);

program.parse(process.argv);
