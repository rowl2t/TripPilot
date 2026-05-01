import { describe, expect, it } from 'vitest';

import { buildAffiliateUrl } from './url-builder';

describe('buildAffiliateUrl', () => {
  it('builds deterministic mock-friendly url', () => {
    const url = buildAffiliateUrl('klook', { destination: 'Tokyo', startDate: '2026-10-01' });
    expect(url).toContain('klook');
    expect(url).toContain('Tokyo');
  });
});
