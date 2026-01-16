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

// Easy puzzle as string (same as testdata/solvable/easy1.sdk)
const EASY_PUZZLE = '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

// Expected solution for the easy puzzle
const EASY_SOLUTION = [
  '534678912',
  '672195348',
  '198342567',
  '859761423',
  '426853791',
  '713924856',
  '961537284',
  '287419635',
  '345286179',
].join('\n');

describe('CLI solve command', () => {
  it('should solve a solvable puzzle string and exit 0', async () => {
    const result = await runCli(['solve', '--input', EASY_PUZZLE]);
    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe(EASY_SOLUTION);
  });

  it('should solve a solvable puzzle file and exit 0', async () => {
    const result = await runCli([
      'solve',
      '--input',
      resolve(TESTDATA_DIR, 'solvable/easy1.sdk'),
    ]);
    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe(EASY_SOLUTION);
  });

  it('should solve a medium difficulty puzzle', async () => {
    const result = await runCli([
      'solve',
      '--input',
      resolve(TESTDATA_DIR, 'solvable/medium1.sdk'),
    ]);
    expect(result.code).toBe(0);
    // Should have 9 lines of 9 digits each
    const lines = result.stdout.trim().split('\n');
    expect(lines).toHaveLength(9);
    lines.forEach((line) => {
      expect(line).toHaveLength(9);
      expect(/^[1-9]{9}$/.test(line)).toBe(true);
    });
  });

  it('should solve an already-solved puzzle', async () => {
    const result = await runCli([
      'solve',
      '--input',
      resolve(TESTDATA_DIR, 'solvable/already-solved.sdk'),
    ]);
    expect(result.code).toBe(0);
    expect(result.stdout.trim()).toBe(EASY_SOLUTION);
  });

  it('should reject unsolvable puzzle and exit non-zero', async () => {
    const result = await runCli([
      'solve',
      '--input',
      resolve(TESTDATA_DIR, 'unsolvable/contradiction.sdk'),
    ]);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain('Puzzle is invalid');
  });

  it('should handle parse errors correctly', async () => {
    const result = await runCli(['solve', '--input', 'too-short']);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid puzzle length');
  });

  it('should handle invalid puzzle strings', async () => {
    const result = await runCli(['solve', '--input', 'not-a-valid-puzzle']);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Invalid puzzle length');
  });
});
