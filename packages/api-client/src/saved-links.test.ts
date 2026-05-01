import { describe, expect, it } from 'vitest';
import { savedLinkCreateSchema } from '@trippilot/schemas';

describe('saved link schema', () => {
  it('validates url', () => {
    expect(savedLinkCreateSchema.safeParse({ url: 'https://example.com/reel/1' }).success).toBe(true);
  });
});
