import { z } from 'zod';

export const researchQuerySchema = z.object({ category: z.string(), query: z.string() });
export const destinationResearchPlanSchema = z.object({ queries: z.array(researchQuerySchema).min(1) });

export const placeCandidateSchema = z.object({
  name: z.string(),
  city: z.string().optional(),
  reason: z.string(),
  fit_score: z.number().min(0).max(1)
});

export const itineraryItemSchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  item_type: z.enum(['attraction', 'meal', 'transport', 'hotel', 'activity', 'buffer', 'booking', 'note']),
  start_time: z.string(),
  end_time: z.string(),
  notes: z.string().optional()
});

export const itineraryDraftSchema = z.object({ summary: z.string(), items: z.array(itineraryItemSchema).min(1) });

export const bookingTaskSchema = z.object({
  task_type: z.enum(['flight', 'hotel', 'transport', 'activity', 'restaurant', 'insurance', 'esim', 'document']),
  title: z.string(),
  recommended_booking_window: z.string(),
  caution: z.string().optional()
});

export const bookingTaskListSchema = z.object({ tasks: z.array(bookingTaskSchema) });

export const critiqueResultSchema = z.object({ issues: z.array(z.string()), repaired: z.boolean() });
