import { describe, expect, it, vi } from 'vitest';

import { refreshSession, signInWithPassword } from './auth';

describe('auth helpers', () => {
  it('returns validation error for invalid sign-in payload', async () => {
    const client = { auth: { signInWithPassword: vi.fn() } } as any;
    const result = await signInWithPassword(client, { email: 'bad' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe('VALIDATION_ERROR');
  });

  it('refreshes session and returns access token', async () => {
    const client = {
      auth: {
        refreshSession: vi.fn().mockResolvedValue({
          error: null,
          data: {
            session: {
              access_token: 'token',
              refresh_token: 'refresh',
              expires_at: 9999999999,
              user: { id: '11111111-1111-1111-1111-111111111111', email: 'a@a.com' }
            }
          }
        })
      }
    } as any;

    const result = await refreshSession(client);
    expect(result).toEqual({ ok: true, data: { accessToken: 'token' } });
  });
});
