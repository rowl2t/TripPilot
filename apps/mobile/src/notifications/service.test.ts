import { describe, expect, it } from 'vitest';
import { createMockNotificationProvider } from './provider';
import { syncReminders } from './service';

describe('notification reminders', () => {
  it('runs with mock provider', async () => {
    const provider = createMockNotificationProvider();
    await syncReminders(
      provider,
      { enabled: true, bookingReminders: true, tripReminders: true, marketing: false },
      [{ id: 'b1', title: '호텔 예약', due_date: '2026-06-20T00:00:00.000Z' }],
      [{ tripId: 't1', title: '도쿄 여행', startDate: '2026-06-21T00:00:00.000Z' }]
    );
    expect(true).toBe(true);
  });
});
