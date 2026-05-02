export interface NotificationPayload {
  idempotencyKey: string;
  title: string;
  body: string;
  scheduledAt: string;
}

export interface NotificationProvider {
  requestPermission: () => Promise<'granted' | 'denied'>;
  registerToken: () => Promise<string | null>;
  schedule: (payload: NotificationPayload) => Promise<void>;
}

const sentKeys = new Set<string>();

export const createMockNotificationProvider = (): NotificationProvider => ({
  requestPermission: async () => 'granted',
  registerToken: async () => 'mock-token',
  schedule: async (payload) => {
    if (sentKeys.has(payload.idempotencyKey)) return;
    sentKeys.add(payload.idempotencyKey);
  }
});

export const createExpoNotificationProvider = (): NotificationProvider => ({
  requestPermission: async () => (process.env.EXPO_NOTIFICATIONS_ENABLED === '1' ? 'granted' : 'denied'),
  registerToken: async () => process.env.EXPO_PUSH_TOKEN ?? null,
  schedule: async (payload) => {
    if (sentKeys.has(payload.idempotencyKey)) return;
    sentKeys.add(payload.idempotencyKey);
  }
});
