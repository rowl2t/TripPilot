import type { NotificationProvider } from './provider';
import { buildBookingReminders, buildTripReminders, type BookingTaskReminderInput, type TripReminderInput } from './reminders';

export interface ReminderSettings {
  enabled: boolean;
  bookingReminders: boolean;
  tripReminders: boolean;
  marketing: boolean;
}

export const syncReminders = async (
  provider: NotificationProvider,
  settings: ReminderSettings,
  bookingTasks: BookingTaskReminderInput[],
  trips: TripReminderInput[]
) => {
  if (!settings.enabled) return;
  const permission = await provider.requestPermission();
  if (permission !== 'granted') return;
  await provider.registerToken();

  if (settings.bookingReminders) {
    for (const payload of buildBookingReminders(bookingTasks)) await provider.schedule(payload);
  }
  if (settings.tripReminders) {
    for (const trip of trips) for (const payload of buildTripReminders(trip)) await provider.schedule(payload);
  }
};
