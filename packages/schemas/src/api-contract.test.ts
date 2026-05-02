import { describe, expect, it } from 'vitest';
import { API_VERSION, supportTicketRequestSchema, tripResourceSchema } from './api-contract';

describe('api contract schemas', () => {
  it('parses trip resource', () => {
    const parsed = tripResourceSchema.parse({ id: 't1', title: 'Tokyo Trip', destination_text: 'Tokyo', start_date: '2026-06-01', end_date: '2026-06-03', status: 'planning' });
    expect(parsed.destination_text).toBe('Tokyo');
  });

  it('validates support request shape', () => {
    const ok = supportTicketRequestSchema.safeParse({ userId: '00000000-0000-0000-0000-000000000000', type: 'ai_quality', title: 'title', content: 'content here' });
    expect(ok.success).toBe(true);
    expect(API_VERSION).toContain('v1');
  });
});
