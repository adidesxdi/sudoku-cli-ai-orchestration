import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { resolve } from 'path';

const CLI_PATH = resolve(__dirname, '../../dist/cli/index.js');

function runCli(args: string[]): Promise<{ code: number | null; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn('node', [CLI_PATH, ...args], {
      env: { ...process.env },
    });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    proc.on('close', (code) => {
      resolve({ code, stdout, stderr });
    });
  });
}

describe('CLI stub commands', () => {
  it('should show help with --help', async () => {
    const result = await runCli(['--help']);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('sudoku');
    expect(result.stdout).toContain('solve');
    expect(result.stdout).toContain('validate');
    expect(result.stdout).toContain('generate');
  });

  it('should run solve command and solve puzzle', async () => {
    // Use a valid solvable puzzle
    const solvablePuzzle = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const result = await runCli(['solve', '--input', solvablePuzzle]);
    expect(result.code).toBe(0);
    // Should output 9 lines of 9 digits (the solution)
    const lines = result.stdout.trim().split('\n');
    expect(lines).toHaveLength(9);
  });

  it('should run validate command and show result', async () => {
    // Use a valid puzzle that passes validation
    const validPuzzle =
      '534678912672195348198342567859761423426853791713924856961537284287419635345286179';
    const result = await runCli(['validate', '--inputEP', validPuzzle]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Puzzle is valid');
  });

  it('should run generate command with stub output', async () => {
    const result = await runCli(['generate', '--difficulty', 'easy', '--seed', '42']);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Not implemented yet');
  });

  it('should reject invalid difficulty', async () => {
    const result = await runCli(['generate', '--difficulty', 'impossible', '--seed', '42']);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('Invalid difficulty');
  });

  it('should reject non-numeric seed', async () => {
    const result = await runCli(['generate', '--difficulty', 'easy', '--seed', 'abc']);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('Invalid seed');
  });
});
