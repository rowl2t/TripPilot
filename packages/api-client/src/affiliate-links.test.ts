import { describe, expect, it } from 'vitest';
import { buildBookingLink, buildOutboundClickEvent, buildProviderUrl } from './affiliate-links';

describe('affiliate link builders', () => {
  it('builds provider url with travel params and utm', () => {
    const url = buildProviderUrl('booking', { taskType: 'hotel', destination: 'Tokyo', startDate: '2026-09-01', endDate: '2026-09-05', travelers: 2, currency: 'USD' }, 'aff-1');
    expect(url).toContain('booking.com');
    expect(url).toContain('utm_source=trippilot');
    expect(url).toContain('aff_id=aff-1');
  });

  it('falls back to search when provider unavailable', () => {
    const out = buildBookingLink({ taskType: 'flight', destination: 'Osaka' }, { providerAvailable: false });
    expect(out.provider).toBe('google_search');
    expect(out.disclaimer).toContain('외부 사이트');
  });

  it('creates minimal outbound click event', () => {
    const ev = buildOutboundClickEvent({ provider: 'klook', taskType: 'activity', tripId: 't1' });
    expect(ev.provider).toBe('klook');
    expect(ev.trip_id).toBe('t1');
  });
});
