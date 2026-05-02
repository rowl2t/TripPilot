import { create } from 'zustand';

interface UiState {
  notificationEnabled: boolean;
  bookingReminders: boolean;
  tripReminders: boolean;
  marketingReminders: boolean;
  setNotificationSettings: (patch: Partial<Omit<UiState, 'setNotificationSettings'>>) => void;
}

export const useUiStore = create<UiState>((set) => ({
  notificationEnabled: true,
  bookingReminders: true,
  tripReminders: true,
  marketingReminders: false,
  setNotificationSettings: (patch) => set(patch)
}));
