import { z } from 'zod';

export const planSchema = z.enum(['free', 'pro_monthly', 'trip_pack']);

export const entitlementSchema = z.object({
  user_id: z.string().uuid(),
  plan: planSchema,
  ai_generation_limit: z.number().int().positive(),
  saved_links_limit: z.number().int().positive(),
  offline_pack_enabled: z.boolean(),
  advanced_booking_enabled: z.boolean()
});

export const usageSnapshotSchema = z.object({
  ai_runs_this_month: z.number().int().nonnegative(),
  saved_links_total: z.number().int().nonnegative(),
  trips_total: z.number().int().nonnegative()
});
