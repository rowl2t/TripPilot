import { z } from 'zod';

export const emergencyContactSchema = z.object({ label: z.string(), phone: z.string(), note: z.string().optional() });
export const offlinePackSchema = z.object({
  trip_id: z.string().uuid(),
  generated_at: z.string(),
  trip_summary: z.string(),
  itinerary_days: z.array(z.object({ date: z.string(), items: z.array(z.string()) })),
  booking_tasks: z.array(z.string()),
  emergency_contacts: z.array(emergencyContactSchema),
  checklist: z.array(z.string()),
  budget_summary: z.string(),
  notes: z.array(z.string())
});
