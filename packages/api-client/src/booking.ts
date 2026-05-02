import type { SupabaseClient } from '@supabase/supabase-js';
import { bookingTaskPatchSchema } from '@trippilot/schemas';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export const getBookingTasks = async (client: SupabaseClient, tripId: string): Promise<ApiResponse<Array<Record<string, unknown>>>> => {
  const { data, error } = await client.from('booking_tasks').select('*').eq('trip_id', tripId).order('due_date');
  if (error) return toApiError('BOOKING_TASK_FETCH_FAILED', error.message);
  return { ok: true, data: data ?? [] };
};

export const patchBookingTask = async (client: SupabaseClient, taskId: string, patch: unknown): Promise<ApiResponse<Record<string, unknown>>> => {
  const parsed = bookingTaskPatchSchema.safeParse(patch);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid booking patch', { issues: parsed.error.issues });

  const { data, error } = await client.from('booking_tasks').update(parsed.data).eq('id', taskId).select('*').single();
  if (error || !data) return toApiError('BOOKING_TASK_PATCH_FAILED', error?.message ?? 'Task update failed');
  return { ok: true, data };
};

export const buildReminderPayload = (task: { id: string; due_date?: string | null }) => {
  if (!task.due_date) return [];
  return [
    { taskId: task.id, offsetMinutes: 60 },
    { taskId: task.id, offsetMinutes: 30 }
  ];
};
