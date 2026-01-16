import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { resolve } from 'path';

const CLI_PATH = resolve(__dirname, '../../dist/cli/index.js');
const TESTDATA_DIR = resolve(__dirname, '../../testdata');

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

// Valid complete puzzle as string
const VALID_PUZZLE =
  '534678912672195348198342567859761423426853791713924856961537284287419635345286179';

// Invalid puzzle: duplicate 5 in row 1
const INVALID_ROW_DUP =
  '535678912672195348198342567859761423426853791713924856961537284287419635345286179';

describe('CLI validate command', () => {
  it('should validate a correct puzzle string and exit 0', async () => {
    const result = await runCli(['validate', '--inputEP', VALID_PUZZLE]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Puzzle is valid');
  });

  it('should validate a correct puzzle file and exit 0', async () => {
    const result = await runCli([
      'validate',
      '--inputEP',
      resolve(TESTDATA_DIR, 'valid/full.sdk'),
    ]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Puzzle is valid');
  });

  it('should reject puzzle with row duplicate and exit 1', async () => {
    const result = await runCli(['validate', '--inputEP', INVALID_ROW_DUP]);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Puzzle is invalid');
    expect(result.stderr).toContain('row');
  });

  it('should reject puzzle file with row duplicate', async () => {
    const result = await runCli([
      'validate',
      '--inputEP',
      resolve(TESTDATA_DIR, 'invalid/row-dup.sdk'),
    ]);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Puzzle is invalid');
  });

  it('should reject puzzle file with column duplicate', async () => {
    const result = await runCli([
      'validate',
      '--inputEP',
      resolve(TESTDATA_DIR, 'invalid/col-dup.sdk'),
    ]);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Puzzle is invalid');
    expect(result.stderr).toContain('column');
  });

  it('should reject puzzle file with box duplicate', async () => {
    const result = await runCli([
      'validate',
      '--inputEP',
      resolve(TESTDATA_DIR, 'invalid/box-dup.sdk'),
    ]);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Puzzle is invalid');
    expect(result.stderr).toContain('box');
  });

  it('should still handle parse errors correctly', async () => {
    const result = await runCli(['validate', '--inputEP', 'too-short']);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid puzzle length');
  });

  it('should validate partial puzzle with blanks', async () => {
    // Valid partial puzzle
    const partialPuzzle =
      '530070000600195000098000060800060003400803001700020006060000280000419005000080079';
    const result = await runCli(['validate', '--inputEP', partialPuzzle]);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('Puzzle is valid');
  });
});
