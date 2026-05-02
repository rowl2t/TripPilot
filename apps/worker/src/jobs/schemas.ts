import { z } from 'zod';

export const jobPayloadSchemas = {
  generate_trip_plan: z.object({ tripId: z.string().uuid(), userId: z.string().uuid() }),
  regenerate_trip_plan: z.object({ tripId: z.string().uuid(), userId: z.string().uuid(), reason: z.string().min(1) }),
  analyze_saved_link: z.object({ savedLinkId: z.string().uuid(), userId: z.string().uuid(), url: z.string().url() }),
  create_booking_tasks: z.object({ tripId: z.string().uuid(), userId: z.string().uuid() }),
  sync_calendar_events: z.object({ tripId: z.string().uuid(), userId: z.string().uuid(), provider: z.enum(['google', 'apple']) }),
  send_invite_email: z.object({ tripId: z.string().uuid(), inviterUserId: z.string().uuid(), inviteeEmail: z.string().email() }),
  refresh_affiliate_links: z.object({ tripId: z.string().uuid(), userId: z.string().uuid() })
};
