import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBookingTasks, patchBookingTask } from '@trippilot/api-client';

import { mobileAuthClient } from '../index';

export const useBookingTasks = (tripId: string) =>
  useQuery({
    queryKey: ['booking-tasks', tripId],
    queryFn: async () => {
      const result = await getBookingTasks(mobileAuthClient, tripId);
      if (!result.ok) throw new Error(result.error.message);
      return result.data;
    }
  });

export const useBookingTaskPatch = (tripId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, patch }: { taskId: string; patch: Record<string, unknown> }) => patchBookingTask(mobileAuthClient, taskId, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['booking-tasks', tripId] })
  });
};
