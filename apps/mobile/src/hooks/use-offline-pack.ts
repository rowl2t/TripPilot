import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buildOfflinePack, offlinePackToHtml } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';
import { loadPack, savePack } from '../state/offline-pack-cache';

export const useOfflinePack = (tripId: string) =>
  useQuery({
    queryKey: ['offline-pack', tripId],
    queryFn: async () => {
      const cached = await loadPack(tripId);
      return cached ? (JSON.parse(cached) as Record<string, unknown>) : null;
    }
  });

export const useGenerateOfflinePack = (tripId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result = await buildOfflinePack(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      await savePack(tripId, JSON.stringify(result.data));
      return result.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['offline-pack', tripId] })
  });
};

export const useOfflinePackExport = () =>
  useMutation({
    mutationFn: async (pack: Parameters<typeof offlinePackToHtml>[0]) => {
      const html = offlinePackToHtml(pack);
      return html;
    }
  });
