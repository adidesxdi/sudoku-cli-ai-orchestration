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

// Expected solution for the easy puzzle in grid format
const EASY_SOLUTION = [
  '+-------+-------+-------+',
  '| 5 3 4 | 6 7 8 | 9 1 2 |',
  '| 6 7 2 | 1 9 5 | 3 4 8 |',
  '| 1 9 8 | 3 4 2 | 5 6 7 |',
  '+-------+-------+-------+',
  '| 8 5 9 | 7 6 1 | 4 2 3 |',
  '| 4 2 6 | 8 5 3 | 7 9 1 |',
  '| 7 1 3 | 9 2 4 | 8 5 6 |',
  '+-------+-------+-------+',
  '| 9 6 1 | 5 3 7 | 2 8 4 |',
  '| 2 8 7 | 4 1 9 | 6 3 5 |',
  '| 3 4 5 | 2 8 6 | 1 7 9 |',
  '+-------+-------+-------+',
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
    // Should have grid format with borders
    const lines = result.stdout.trim().split('\n');
    expect(lines).toHaveLength(13); // 4 separators + 9 data rows
    // Check that it has the right format
    expect(lines[0]).toBe('+-------+-------+-------+');
    expect(lines[1]).toMatch(/^\| \d \d \d \| \d \d \d \| \d \d \d \|$/);
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
