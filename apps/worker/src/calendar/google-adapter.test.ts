import { describe, expect, it } from 'vitest';

import { createGoogleCalendarAdapter } from './google-adapter';

describe('google calendar adapter', () => {
  it('returns mock id without credentials', async () => {
    const adapter = createGoogleCalendarAdapter({});
    const result = await adapter.insertEvent('primary', { title: 'Trip', startAt: '2026-10-01T10:00:00Z', endAt: '2026-10-01T11:00:00Z' });
    expect(result.externalEventId).toContain('mock_');
  });
});
