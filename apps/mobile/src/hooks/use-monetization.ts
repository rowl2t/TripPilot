import { useMutation, useQuery } from '@tanstack/react-query';
import { createRevenueCatAdapter, enforceUsageLimit, getUsageSnapshot, resolveEntitlement } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

const USER_ID = '11111111-1111-1111-1111-111111111111';

export const useEntitlement = () =>
  useQuery({
    queryKey: ['entitlement'],
    queryFn: async () => {
      const res = await resolveEntitlement(mobileAuthClient, USER_ID);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    }
  });

export const useUsage = () =>
  useQuery({
    queryKey: ['usage'],
    queryFn: async () => {
      const res = await getUsageSnapshot(mobileAuthClient, USER_ID);
      if (!res.ok) throw new Error(res.error.message);
      return res.data;
    }
  });

export const useUsageGate = () =>
  useMutation({ mutationFn: (feature: 'ai_generation' | 'saved_links') => enforceUsageLimit(mobileAuthClient, USER_ID, feature) });

export const usePaywallActions = () => {
  const rc = createRevenueCatAdapter(process.env.EXPO_PUBLIC_REVENUECAT_API_KEY);
  return {
    offerings: () => rc.getOfferings(),
    purchase: (pkg: string) => rc.purchase(pkg),
    restore: () => rc.restore()
  };
};
