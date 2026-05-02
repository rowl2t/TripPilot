import { describe, expect, it, vi } from 'vitest';
import { createTripPlanning } from './trip-planning';

const makeClient = () => ({
  from: vi.fn((table: string) => {
    if (table === 'trips') {
      return {
        insert: () => ({ select: () => ({ single: async () => ({ data: { id: '11111111-1111-1111-1111-111111111111' }, error: null }) }) })
      };
    }
    return {
      insert: () => ({ select: () => ({ single: async () => ({ data: { id: '22222222-1111-1111-1111-111111111111' }, error: null }) }) })
    };
  })
}) as any;

describe('createTripPlanning', () => {
  it('validates input and returns error', async () => {
    const result = await createTripPlanning(makeClient(), { destination_text: '' });
    expect(result.ok).toBe(false);
  });

  it('creates planning records and returns mock job id', async () => {
    const result = await createTripPlanning(makeClient(), {
      destination_text: 'Tokyo', origin_text: 'Seoul', start_date: '2026-10-01', end_date: '2026-10-05', travelers_count: 2,
      companion_type: 'friends', budget: { amount: 2000, currency: 'USD', budget_level: 'standard' },
      travel_styles: ['food', 'culture']
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.status).toBe('planning');
  });
});
