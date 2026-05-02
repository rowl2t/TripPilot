import { createHmac, timingSafeEqual } from 'node:crypto';

export interface StripeCheckoutAdapter { createCheckoutSession(input: { userId: string; tripId?: string }): Promise<{ checkoutUrl: string }> }

export const createStripeCheckoutAdapter = (secret?: string): StripeCheckoutAdapter => ({
  async createCheckoutSession(input) {
    if (!secret) return { checkoutUrl: `https://mock-checkout.local/${input.userId}` };
    return { checkoutUrl: `https://checkout.stripe.com/pay/mock_${input.userId}` };
  }
});

const parseStripeSignature = (signature: string): { timestamp: string; v1: string } | null => {
  const parts = signature.split(',').map((s) => s.trim());
  const t = parts.find((p) => p.startsWith('t='))?.slice(2);
  const v1 = parts.find((p) => p.startsWith('v1='))?.slice(3);
  if (!t || !v1) return null;
  return { timestamp: t, v1 };
};

export const stripeWebhookSkeleton = (signature: string | undefined, payload: string, webhookSecret: string | undefined) => {
  if (!signature || !webhookSecret) return { verified: false, payloadLength: payload.length, reason: 'missing_signature_or_secret' };
  const parsed = parseStripeSignature(signature);
  if (!parsed) return { verified: false, payloadLength: payload.length, reason: 'invalid_signature_header' };

  const signedPayload = `${parsed.timestamp}.${payload}`;
  const expected = createHmac('sha256', webhookSecret).update(signedPayload).digest('hex');
  const provided = parsed.v1;
  if (expected.length !== provided.length) return { verified: false, payloadLength: payload.length, reason: 'signature_mismatch' };

  const ok = timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
  return { verified: ok, payloadLength: payload.length, reason: ok ? null : 'signature_mismatch' };
};
