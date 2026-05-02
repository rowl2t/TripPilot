export interface PostHogLike {
  capture: (event: string, properties?: Record<string, unknown>) => void;
}

export const initPostHog = (apiKey = process.env.POSTHOG_API_KEY): PostHogLike => {
  if (!apiKey) {
    return { capture: () => undefined };
  }

  return {
    capture: (event, properties) => {
      console.info('[posthog]', { event, properties, keyConfigured: true });
    }
  };
};
