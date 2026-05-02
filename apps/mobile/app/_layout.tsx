import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '../src/state/query-client';
import { StatusBanner } from '../src/components/StatusBanner';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBanner />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
