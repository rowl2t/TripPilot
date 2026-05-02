import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { stripeWebhookSkeleton } from './stripe';

describe('stripe webhook skeleton', () => {
  it('valid secret/signature일 때만 verified=true', () => {
    const payload = '{}';
    const secret = 'whsec_test';
    const timestamp = '1710000000';
    const sig = createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
    const header = `t=${timestamp},v1=${sig}`;

    expect(stripeWebhookSkeleton(header, payload, secret).verified).toBe(true);
    expect(stripeWebhookSkeleton(undefined, payload, secret).verified).toBe(false);
    expect(stripeWebhookSkeleton(header, payload, 'wrong_secret').verified).toBe(false);
  });
});
