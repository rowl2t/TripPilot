export interface SentryLike {
  captureException: (error: unknown, context?: Record<string, unknown>) => void;
}

export const initSentry = (dsn = process.env.SENTRY_DSN): SentryLike => {
  if (!dsn) {
    return { captureException: () => undefined };
  }

  return {
    captureException: (error, context) => {
      console.error('[sentry]', { dsnConfigured: true, error, context });
    }
  };
};
