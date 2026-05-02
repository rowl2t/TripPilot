import { z } from 'zod';

export const profileSchema = z.object({
  id: z.string().uuid(),
  display_name: z.string().nullable(),
  avatar_url: z.string().url().nullable(),
  locale: z.string(),
  home_airport: z.string().nullable(),
  travel_style_defaults: z.record(z.unknown()),
  onboarding_completed: z.boolean().default(false)
});

export type Profile = z.infer<typeof profileSchema>;
