import { describe, it, expect } from 'vitest';
import { spawn } from 'child_process';
import { resolve } from 'path';

const CLI_PATH = resolve(__dirname, '../../dist/cli/index.js');
const TESTDATA_DIR = resolve(__dirname, '../../testdata');

const VALID_PUZZLE =
  '530070000600195000098000060800060003400803001700020006060000280000419005000080079';

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

describe('CLI parse error handling', () => {
  describe('solve command', () => {
    it('should parse and solve valid 81-char string and exit 0', async () => {
      const result = await runCli(['solve', '--input', VALID_PUZZLE]);
      expect(result.code).toBe(0);
      // Should output the solution (9 lines of 9 digits)
      const lines = result.stdout.trim().split('\n');
      expect(lines).toHaveLength(9);
    });

    it('should parse and solve valid file and exit 0', async () => {
      const result = await runCli(['solve', '--input', resolve(TESTDATA_DIR, 'valid-easy.sdk')]);
      expect(result.code).toBe(0);
      // Should output the solution
      const lines = result.stdout.trim().split('\n');
      expect(lines).toHaveLength(9);
    });

    it('should exit non-zero for too-short input', async () => {
      const result = await runCli(['solve', '--input', 'too-short']);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid puzzle length');
    });

    it('should exit non-zero for invalid characters', async () => {
      const invalidChars = VALID_PUZZLE.slice(0, 80) + 'X';
      const result = await runCli(['solve', '--input', invalidChars]);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid character');
    });

    it('should exit non-zero for file with invalid length', async () => {
      const result = await runCli([
        'solve',
        '--input',
        resolve(TESTDATA_DIR, 'invalid-length.sdk'),
      ]);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid puzzle length');
    });

    it('should exit non-zero for file with invalid characters', async () => {
      const result = await runCli([
        'solve',
        '--input',
        resolve(TESTDATA_DIR, 'invalid-chars.sdk'),
      ]);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid character');
    });
  });

  describe('validate command', () => {
    it('should validate valid 81-char string and exit 0', async () => {
      const result = await runCli(['validate', '--inputEP', VALID_PUZZLE]);
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Puzzle is valid');
    });

    it('should validate valid file and exit 0', async () => {
      const result = await runCli([
        'validate',
        '--inputEP',
        resolve(TESTDATA_DIR, 'valid-easy.sdk'),
      ]);
      expect(result.code).toBe(0);
      expect(result.stdout).toContain('Puzzle is valid');
    });

    it('should exit non-zero for too-short input', async () => {
      const result = await runCli(['validate', '--inputEP', 'too-short']);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid puzzle length');
    });

    it('should exit non-zero for invalid characters', async () => {
      const invalidChars = VALID_PUZZLE.slice(0, 80) + '#';
      const result = await runCli(['validate', '--inputEP', invalidChars]);
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('Invalid character');
    });
  });
});
