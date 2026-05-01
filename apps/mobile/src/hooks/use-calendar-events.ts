import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCalendarEvents, materializeCalendarEvents, toIcs } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

export const useCalendarEvents = (tripId: string) =>
  useQuery({
    queryKey: ['calendar-events', tripId],
    queryFn: async () => {
      const result = await getCalendarEvents(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useMaterializeCalendarEvents = (tripId: string, userId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => materializeCalendarEvents(mobileAuthClient, tripId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar-events', tripId] })
  });
};

export const exportIcsText = (events: Array<{ title: string; start_at: string; end_at: string }>) => toIcs(events);
