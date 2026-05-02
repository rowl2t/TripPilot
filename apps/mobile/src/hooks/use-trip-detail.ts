import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getTripDetail, requestRegeneration, selectPlaceOption, updateItineraryItem } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

export const useTripDetail = (tripId: string) =>
  useQuery({
    queryKey: ['trip-detail', tripId],
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const result = await getTripDetail(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useUpdateItem = (tripId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, patch }: { itemId: string; patch: Record<string, unknown> }) => updateItineraryItem(mobileAuthClient, itemId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-detail', tripId] })
  });
};

export const useSelectOption = (tripId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ optionId, itemId }: { optionId: string; itemId: string }) => selectPlaceOption(mobileAuthClient, optionId, itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trip-detail', tripId] })
  });
};

export const useRegenerate = (tripId: string) =>
  useMutation({ mutationFn: (payload: { scope: 'full' | 'day' | 'constraint'; data: Record<string, unknown> }) => requestRegeneration(mobileAuthClient, tripId, payload.scope, payload.data) });
