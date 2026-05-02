export interface StripeCheckoutAdapter { createCheckoutSession(input: { userId: string; tripId?: string }): Promise<{ checkoutUrl: string }> }

export const createStripeCheckoutAdapter = (secret?: string): StripeCheckoutAdapter => ({
  async createCheckoutSession(input) {
    if (!secret) return { checkoutUrl: `https://mock-checkout.local/${input.userId}` };
    return { checkoutUrl: `https://checkout.stripe.com/pay/mock_${input.userId}` };
  }
});

export const stripeWebhookSkeleton = (signature: string | undefined, payload: string) => ({ verified: Boolean(signature), payloadLength: payload.length });
