import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCalendarEvents, materializeCalendarEvents, toIcs } from '@trippilot/api-client';
import { mobileAuthClient } from '../index';

export const monthKey = (iso?: string) => (iso ? iso.slice(0, 7) : 'unknown');

export const useCalendarEvents = (tripId: string, month = 'all') =>
  useQuery({
    queryKey: ['calendar-events', tripId, month],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const result = await getCalendarEvents(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      if (month === 'all') return result.data;
      return result.data.filter((ev) => String(ev.start_at ?? '').startsWith(month));
    }
  });

export const useMaterializeCalendarEvents = (tripId: string, userId: string, month = 'all') => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: () => materializeCalendarEvents(mobileAuthClient, tripId, userId), onSuccess: () => qc.invalidateQueries({ queryKey: ['calendar-events', tripId, month] }) });
};

export const exportIcsText = (events: Array<{ title: string; start_at: string; end_at: string }>) => toIcs(events);
