import { describe, expect, it } from 'vitest';
import { requestAccountDeletion } from './privacy';

const mockClient = {
  from: () => ({
    insert: async () => ({ error: null }),
    update: () => ({ eq: async () => ({ error: null }) })
  })
} as any;

describe('privacy api', () => {
  it('requires destructive confirmation for deletion request', async () => {
    const bad = await requestAccountDeletion(mockClient, { userId: '00000000-0000-0000-0000-000000000000' });
    expect(bad.ok).toBe(false);
  });

  it('queues deletion when confirm text provided', async () => {
    const res = await requestAccountDeletion(mockClient, { userId: '00000000-0000-0000-0000-000000000000', confirmText: 'DELETE' });
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.data.queued).toBe(true);
  });
});
