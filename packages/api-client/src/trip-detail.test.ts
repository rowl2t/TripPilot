import { describe, expect, it, vi } from 'vitest';
import { getTripDetail } from './trip-detail';

describe('getTripDetail', () => {
  it('returns bundle', async () => {
    const client = { from: vi.fn(() => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { id: 't1' }, error: null }), order: async () => ({ data: [], error: null }) }), order: async () => ({ data: [], error: null }) }) })) } as any;
    const result = await getTripDetail(client, 't1');
    expect(result.ok).toBe(true);
  });
});
