export interface RetryOptions { retries?: number; baseDelayMs?: number; timeoutMs?: number }

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const withTimeout = async <T>(fn: () => Promise<T>, timeoutMs = 5000): Promise<T> => {
  const timer = new Promise<T>((_, rej) => setTimeout(() => rej(new Error('TIMEOUT')), timeoutMs));
  return Promise.race([fn(), timer]);
};

export const withRetryBackoff = async <T>(fn: () => Promise<T>, opts: RetryOptions = {}): Promise<T> => {
  const retries = opts.retries ?? 2;
  const baseDelayMs = opts.baseDelayMs ?? 250;
  let lastErr: unknown;
  for (let i = 0; i <= retries; i += 1) {
    try { return await withTimeout(fn, opts.timeoutMs ?? 4000); } catch (e) { lastErr = e; if (i < retries) await sleep(baseDelayMs * (2 ** i)); }
  }
  throw lastErr;
};

export const createCircuitBreaker = (threshold = 3, coolDownMs = 30_000) => {
  let fails = 0;
  let openedAt = 0;
  return {
    isOpen: () => fails >= threshold && Date.now() - openedAt < coolDownMs,
    async run<T>(fn: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
      if (fails >= threshold && Date.now() - openedAt < coolDownMs) return fallback();
      try { const out = await fn(); fails = 0; return out; } catch { fails += 1; if (fails >= threshold) openedAt = Date.now(); return fallback(); }
    }
  };
};
