import { z } from 'zod';

export const affiliateProviderSchema = z.enum(['skyscanner', 'booking', 'agoda', 'klook', 'kkday', 'google_travel', 'manual']);
export const bookingTaskTypeSchema = z.enum(['flight', 'hotel', 'transport', 'activity', 'restaurant', 'insurance', 'esim', 'document']);
export const bookingTaskStatusSchema = z.enum(['todo', 'scheduled', 'done', 'skipped']);

export const bookingTaskSchema = z.object({
  id: z.string().uuid(),
  trip_id: z.string().uuid(),
  task_type: bookingTaskTypeSchema,
  title: z.string(),
  description: z.string().nullable().optional(),
  recommended_booking_window: z.string().optional(),
  due_date: z.string().nullable().optional(),
  provider_name: affiliateProviderSchema.optional(),
  affiliate_url: z.string().url().nullable().optional(),
  status: bookingTaskStatusSchema,
  estimated_cost: z.number().optional(),
  checklist_notes: z.string().optional()
});

export const bookingTaskPatchSchema = z.object({
  status: bookingTaskStatusSchema.optional(),
  due_date: z.string().optional(),
  checklist_notes: z.string().optional()
});
