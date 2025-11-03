import { describe, expect, it } from 'vitest';

describe('sanity check', () => {
  it('validates basic arithmetic', () => {
    expect(1 + 1).toBe(2);
  });

  it('ensures test environment loads', () => {
    expect(typeof document).toBe('object');
  });
});
