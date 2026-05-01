import { describe, expect, it } from 'vitest';
import { offlinePackToHtml } from './offline-pack';

describe('offlinePackToHtml', () => {
  it('renders html string', () => {
    const html = offlinePackToHtml({ trip_id: '11111111-1111-1111-1111-111111111111', generated_at: new Date().toISOString(), trip_summary: 'Trip', itinerary_days: [], booking_tasks: [], emergency_contacts: [], checklist: [], budget_summary: '-', notes: [] });
    expect(html).toContain('<html>');
  });
});
