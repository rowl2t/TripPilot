import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { supportTicketRequestSchema, supportTicketResponseSchema } from '@trippilot/schemas';
import type { ApiResponse } from './types';
import { toApiError } from './types';

const supportTicketInputSchema = supportTicketRequestSchema;
const feedbackInputSchema = z.object({
  userId: z.string().uuid(),
  tripId: z.string().uuid().optional(),
  itinerarySatisfaction: z.number().int().min(1).max(5),
  placeRecommendationQuality: z.number().int().min(1).max(5),
  bookingChecklistUsefulness: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional()
});

export interface SupportEmailAdapter { sendReceiptEmail: (input: { toUserId: string; ticketId: string; title: string }) => Promise<void> }
export const createSupportEmailAdapter = (apiKey?: string): SupportEmailAdapter => ({ sendReceiptEmail: async () => { if (!apiKey) return; } });

export const submitSupportTicket = async (client: SupabaseClient, input: unknown, emailAdapter: SupportEmailAdapter = createSupportEmailAdapter(process.env.RESEND_API_KEY)): Promise<ApiResponse<{ id: string; status: string }>> => {
  const parsed = supportTicketInputSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid support ticket');

  const { data, error } = await client.from('support_tickets').insert({
    user_id: parsed.data.userId,
    type: parsed.data.type,
    title: parsed.data.title,
    content: parsed.data.content,
    trip_id: parsed.data.tripId ?? null,
    status: 'open',
    attachments: parsed.data.screenshotUrls ?? []
  }).select('id,status').single();
  if (error) return toApiError('SUPPORT_TICKET_FAILED', 'Unable to create ticket');

  const out = supportTicketResponseSchema.parse({ id: String(data.id), status: String(data.status) });
  await emailAdapter.sendReceiptEmail({ toUserId: parsed.data.userId, ticketId: out.id, title: parsed.data.title });
  return { ok: true, data: out };
};

export const submitFeedbackEvent = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<{ id: string }>> => {
  const parsed = feedbackInputSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid feedback event');
  const { data, error } = await client.from('feedback_events').insert({ user_id: parsed.data.userId, trip_id: parsed.data.tripId ?? null, itinerary_satisfaction: parsed.data.itinerarySatisfaction, place_recommendation_quality: parsed.data.placeRecommendationQuality, booking_checklist_usefulness: parsed.data.bookingChecklistUsefulness, comment: parsed.data.comment ?? null }).select('id').single();
  if (error) return toApiError('FEEDBACK_FAILED', 'Unable to submit feedback');
  return { ok: true, data: { id: String(data.id) } };
};
