import { describe, expect, it } from 'vitest';

import { stripeWebhookSkeleton } from './stripe';

describe('stripe webhook skeleton', () => {
  it('verifies signature presence', () => {
    expect(stripeWebhookSkeleton('sig', '{}').verified).toBe(true);
    expect(stripeWebhookSkeleton(undefined, '{}').verified).toBe(false);
  });
});
