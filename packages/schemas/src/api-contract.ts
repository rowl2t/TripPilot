import { z } from 'zod';

export const API_VERSION = '2026-05-02.v1';

export const paginationSchema = z.object({ cursor: z.string().nullable().default(null), limit: z.number().int().min(1).max(100).default(20), has_more: z.boolean().default(false) });
export const pagedResponseSchema = <T extends z.ZodTypeAny>(item: T) => z.object({ items: z.array(item), page: paginationSchema });

export const tripResourceSchema = z.object({ id: z.string(), title: z.string(), destination_text: z.string(), start_date: z.string(), end_date: z.string(), status: z.string() });
export const itineraryItemResourceSchema = z.object({ id: z.string(), trip_id: z.string(), day: z.number().int(), title: z.string(), item_type: z.string() });
export const placeOptionResourceSchema = z.object({ id: z.string(), trip_id: z.string(), option_group: z.string(), fit_score: z.number() });
export const savedLinkResourceSchema = z.object({ id: z.string(), user_id: z.string(), url: z.string().url(), analysis_status: z.string() });
export const bookingTaskResourceSchema = z.object({ id: z.string(), trip_id: z.string(), task_type: z.string(), title: z.string(), status: z.string() });
export const calendarEventResourceSchema = z.object({ id: z.string(), trip_id: z.string(), title: z.string(), start_at: z.string(), end_at: z.string() });
export const subscriptionResourceSchema = z.object({ id: z.string(), user_id: z.string(), provider: z.string(), entitlement: z.string(), status: z.string() });

export const supportTicketRequestSchema = z.object({ userId: z.string().uuid(), type: z.enum(['app_error', 'billing_subscription', 'ai_quality', 'booking_link_issue', 'account_privacy', 'other']), title: z.string().min(2).max(120), content: z.string().min(5).max(4000), tripId: z.string().uuid().optional(), screenshotUrls: z.array(z.string().url()).max(5).optional() });
export const supportTicketResponseSchema = z.object({ id: z.string(), status: z.string() });
