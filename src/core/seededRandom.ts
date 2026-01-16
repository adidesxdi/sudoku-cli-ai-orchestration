/**
 * Seeded random number generator using a simple mulberry32 algorithm.
 * Provides deterministic pseudo-random numbers for a given seed.
 */

export interface SeededRandom {
  /**
   * Returns the next pseudo-random float in [0, 1).
   */
  next(): number;

  /**
   * Returns a pseudo-random integer in [min, max] (inclusive).
   */
  nextInt(min: number, max: number): number;

  /**
   * Shuffles an array in place using Fisher-Yates algorithm.
   * Returns the same array reference.
   */
  shuffle<T>(array: T[]): T[];
}

/**
 * Creates a seeded random number generator.
 *
 * Uses the mulberry32 algorithm which is fast, simple, and has good
 * statistical properties for our use case.
 *
 * @param seed - The seed value (integer)
 * @returns A SeededRandom instance
 */
export function createSeededRandom(seed: number): SeededRandom {
  // Ensure seed is a 32-bit integer
  let state = seed >>> 0;

  /**
   * Mulberry32 PRNG - returns a float in [0, 1)
   */
  function next(): number {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function nextInt(min: number, max: number): number {
    return Math.floor(next() * (max - min + 1)) + min;
  }

  function shuffle<T>(array: T[]): T[] {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = nextInt(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  return {
    next,
    nextInt,
    shuffle,
  };
}
