import { z } from 'zod';

export const companionTypeSchema = z.enum(['solo', 'couple', 'friends', 'family', 'business']);
export const budgetLevelSchema = z.enum(['budget', 'standard', 'premium', 'luxury']);

export const tripCreateSchema = z.object({
  destination_text: z.string().min(2),
  origin_text: z.string().min(2),
  is_international: z.boolean().optional(),
  start_date: z.string(),
  end_date: z.string(),
  travelers_count: z.number().int().positive(),
  companion_type: companionTypeSchema,
  budget: z.object({
    amount: z.number().nonnegative(),
    currency: z.string().length(3),
    budget_level: budgetLevelSchema
  }),
  travel_styles: z.array(z.string().min(1)).min(1),
  avoid_text: z.string().optional(),
  mobility_constraints: z.array(z.string()).default([]),
  dietary_constraints: z.array(z.string()).default([]),
  include_saved_links: z.boolean().default(true),
  selected_saved_link_ids: z.array(z.string().uuid()).default([])
});

export type TripCreateInput = z.infer<typeof tripCreateSchema>;
