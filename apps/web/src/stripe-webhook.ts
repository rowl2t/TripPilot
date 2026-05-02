import { stripeWebhookSkeleton } from '@trippilot/api-client';

export const handleStripeWebhook = (signature: string | undefined, payload: string) => {
  const verified = stripeWebhookSkeleton(signature, payload);
  return { statusCode: verified.verified ? 200 : 400, body: verified };
};
