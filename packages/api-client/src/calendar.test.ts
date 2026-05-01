import { describe, expect, it } from 'vitest';

import { toIcs } from './calendar';

describe('toIcs', () => {
  it('builds valid ics envelope', () => {
    const text = toIcs([{ title: 'Test', start_at: '2026-10-01T10:00:00Z', end_at: '2026-10-01T11:00:00Z' }]);
    expect(text).toContain('BEGIN:VCALENDAR');
    expect(text).toContain('SUMMARY:Test');
  });
});
