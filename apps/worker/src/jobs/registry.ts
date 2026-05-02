import type { JobName } from '../queue/types';
import { jobPayloadSchemas } from './schemas';
import type { WorkerDbAdapter } from '../db/ops';

export interface JobContext { db: WorkerDbAdapter }
export type JobHandler = (payload: unknown, ctx: JobContext) => Promise<void>;

export const jobRegistry: Record<JobName, JobHandler> = {
  generate_trip_plan: async (payload, { db }) => { const p = jobPayloadSchemas.generate_trip_plan.parse(payload); await db.updateTripStatus(p.tripId, 'planning'); await db.updateTripStatus(p.tripId, 'planned'); },
  regenerate_trip_plan: async (payload, { db }) => { const p = jobPayloadSchemas.regenerate_trip_plan.parse(payload); await db.updateTripStatus(p.tripId, 'planning'); await db.updateTripStatus(p.tripId, 'planned'); },
  analyze_saved_link: async (payload, { db }) => { const p = jobPayloadSchemas.analyze_saved_link.parse(payload); await db.updateSavedLinkStatus(p.savedLinkId, 'processing'); await db.updateSavedLinkStatus(p.savedLinkId, 'completed'); },
  create_booking_tasks: async (payload) => { jobPayloadSchemas.create_booking_tasks.parse(payload); },
  sync_calendar_events: async (payload) => { jobPayloadSchemas.sync_calendar_events.parse(payload); },
  send_invite_email: async (payload) => { jobPayloadSchemas.send_invite_email.parse(payload); },
  refresh_affiliate_links: async (payload) => { jobPayloadSchemas.refresh_affiliate_links.parse(payload); }
};
