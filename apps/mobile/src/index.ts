import * as SecureStore from 'expo-secure-store';

import { createSupabaseMobileClient } from '@trippilot/api-client';

const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key)
};

export const mobileAuthClient = createSupabaseMobileClient(
  {
    url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? ''
  },
  secureStorage
);

export const resolveMobileRoute = (isAuthenticated: boolean, onboardingCompleted: boolean): string => {
  if (!isAuthenticated) return '/auth/sign-in';
  if (!onboardingCompleted) return '/onboarding';
  return '/trips';
};
