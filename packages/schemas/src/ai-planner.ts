import { z } from 'zod';

export const researchQuerySchema = z.object({ category: z.string(), query: z.string() });
export const destinationResearchPlanSchema = z.object({ queries: z.array(researchQuerySchema).min(1) });

export const placeCandidateSchema = z.object({
  name: z.string(),
  city: z.string().optional(),
  reason: z.string(),
  fit_score: z.number().min(0).max(1),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.7)
});

export const itineraryItemSchema = z.object({
  day: z.number().int().positive(),
  title: z.string(),
  item_type: z.enum(['attraction', 'meal', 'transport', 'hotel', 'activity', 'buffer', 'booking', 'note']),
  start_time: z.string(),
  end_time: z.string(),
  notes: z.string().optional(),
  estimated_cost: z.number().nonnegative().optional(),
  requires_booking: z.boolean().default(false),
  caution: z.string().optional(),
  alternatives: z.array(z.string()).default([]),
  confidence: z.number().min(0).max(1).default(0.7)
});

export const itineraryDraftSchema = z.object({
  summary: z.string(),
  items: z.array(itineraryItemSchema).min(1),
  place_options: z.array(placeCandidateSchema).default([]),
  daily_budget_estimate: z.array(z.object({ day: z.number().int().positive(), amount: z.number().nonnegative(), currency: z.string() })).default([])
});

export const aiBookingTaskSchema = z.object({
  task_type: z.enum(['flight', 'hotel', 'transport', 'activity', 'restaurant', 'insurance', 'esim', 'document']),
  title: z.string(),
  recommended_booking_window: z.string(),
  caution: z.string().optional(),
  estimated_cost: z.number().nonnegative().optional(),
  required: z.boolean().default(true)
});

export const bookingTaskListSchema = z.object({ tasks: z.array(aiBookingTaskSchema) });

export const critiqueResultSchema = z.object({ issues: z.array(z.string()), repaired: z.boolean() });
