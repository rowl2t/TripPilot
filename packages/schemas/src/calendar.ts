import { z } from 'zod';

export const calendarProviderSchema = z.enum(['local', 'google', 'apple']);

export const calendarEventSchema = z.object({
  id: z.string().uuid().optional(),
  trip_id: z.string().uuid(),
  user_id: z.string().uuid().optional(),
  provider: calendarProviderSchema,
  external_event_id: z.string().optional(),
  title: z.string(),
  start_at: z.string(),
  end_at: z.string(),
  status: z.string().default('confirmed')
});
