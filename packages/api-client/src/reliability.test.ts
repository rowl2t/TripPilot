import { describe, expect, it } from 'vitest';
import { createCircuitBreaker, withRetryBackoff } from './reliability';

describe('reliability helpers', () => {
  it('retries and succeeds', async () => {
    let n = 0;
    const out = await withRetryBackoff(async () => {
      n += 1;
      if (n < 2) throw new Error('fail');
      return 'ok';
    }, { retries: 2, baseDelayMs: 1 });
    expect(out).toBe('ok');
  });

  it('opens circuit and uses fallback', async () => {
    const cb = createCircuitBreaker(1, 1000);
    const v1 = await cb.run(async () => { throw new Error('x'); }, async () => 'fallback');
    const v2 = await cb.run(async () => 'live', async () => 'fallback');
    expect(v1).toBe('fallback');
    expect(v2).toBe('fallback');
  });
});
