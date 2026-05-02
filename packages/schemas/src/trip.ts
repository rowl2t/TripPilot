import { z } from 'zod';

export const tripStatusSchema = z.enum(['draft', 'planning', 'ready', 'archived']);

export const tripSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  title: z.string().min(1),
  destination_text: z.string().min(1),
  start_date: z.string(),
  end_date: z.string(),
  status: tripStatusSchema
});
