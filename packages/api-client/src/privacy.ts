import type { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import type { ApiResponse } from './types';
import { toApiError } from './types';

const deleteAccountInputSchema = z.object({ userId: z.string().uuid(), reason: z.string().max(500).optional(), confirmText: z.literal('DELETE') });
const exportDataInputSchema = z.object({ userId: z.string().uuid() });

interface PrivacyExportBundle {
  profile: Record<string, unknown> | null;
  trips: Array<Record<string, unknown>>;
  itinerary: Array<Record<string, unknown>>;
  saved_links: Array<Record<string, unknown>>;
  booking_tasks: Array<Record<string, unknown>>;
  votes: Array<Record<string, unknown>>;
  calendar_events: Array<Record<string, unknown>>;
  exported_at: string;
}

const withoutSecrets = (row: Record<string, unknown>) => {
  const clone = { ...row };
  delete clone.access_token;
  delete clone.refresh_token;
  delete clone.service_role_key;
  delete clone.api_key;
  delete clone.secret;
  return clone;
};

export const buildUserDataExport = async (client: SupabaseClient, userId: string): Promise<ApiResponse<{ json: PrivacyExportBundle; zipReady: { files: string[] } }>> => {
  const [profileR, tripsR, itineraryR, savedLinksR, bookingR, votesR, calendarR] = await Promise.all([
    client.from('profiles').select('*').eq('id', userId).maybeSingle(),
    client.from('trips').select('*').eq('owner_id', userId),
    client.from('itinerary_items').select('*').eq('user_id', userId),
    client.from('saved_links').select('*').eq('user_id', userId),
    client.from('booking_tasks').select('*').eq('user_id', userId),
    client.from('votes').select('*').eq('user_id', userId),
    client.from('calendar_events').select('*').eq('user_id', userId)
  ]);

  const errs = [profileR, tripsR, itineraryR, savedLinksR, bookingR, votesR, calendarR].find((r) => r.error);
  if (errs?.error) return toApiError('EXPORT_FAILED', errs.error.message);

  const json: PrivacyExportBundle = {
    profile: profileR.data ? withoutSecrets(profileR.data as Record<string, unknown>) : null,
    trips: (tripsR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    itinerary: (itineraryR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    saved_links: (savedLinksR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    booking_tasks: (bookingR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    votes: (votesR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    calendar_events: (calendarR.data ?? []).map((r) => withoutSecrets(r as Record<string, unknown>)),
    exported_at: new Date().toISOString()
  };

  return { ok: true, data: { json, zipReady: { files: ['profile.json', 'trips.json', 'itinerary.json', 'saved-links.json', 'booking-tasks.json', 'votes.json', 'calendar-events.json'] } } };
};

export const requestAccountDeletion = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<{ queued: true; scheduledFor: string }>> => {
  const parsed = deleteAccountInputSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid deletion request');

  const scheduledFor = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();
  const { error } = await client.from('audit_logs').insert({
    actor_user_id: parsed.data.userId,
    action: 'account_deletion_requested',
    target_type: 'profile',
    target_id: parsed.data.userId,
    metadata: { reason: parsed.data.reason ?? null, scheduled_for: scheduledFor, status: 'queued' }
  });
  if (error) return toApiError('DELETE_REQUEST_FAILED', 'Unable to create deletion request');

  const { error: softDeleteError } = await client.from('profiles').update({ deletion_requested_at: new Date().toISOString(), deleted_at: null }).eq('id', parsed.data.userId);
  if (softDeleteError) return toApiError('DELETE_REQUEST_FAILED', 'Unable to mark profile for deletion');

  return { ok: true, data: { queued: true, scheduledFor } };
};

export const requestDataExport = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<{ queued: true; expiresInSeconds: number }>> => {
  const parsed = exportDataInputSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid export request');

  const { error } = await client.from('audit_logs').insert({
    actor_user_id: parsed.data.userId,
    action: 'data_export_requested',
    target_type: 'profile',
    target_id: parsed.data.userId,
    metadata: { url_ttl_seconds: 600 }
  });
  if (error) return toApiError('EXPORT_REQUEST_FAILED', 'Unable to create export request');
  return { ok: true, data: { queued: true, expiresInSeconds: 600 } };
};

export const adminDeleteSupabaseAuthUser = async (serviceClient: SupabaseClient, userId: string): Promise<ApiResponse<{ deleted: true }>> => {
  const { error } = await serviceClient.auth.admin.deleteUser(userId);
  if (error) return toApiError('AUTH_DELETE_FAILED', error.message);
  return { ok: true, data: { deleted: true } };
};
