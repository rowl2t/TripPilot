import type { SupabaseClient } from '@supabase/supabase-js';
import { savedLinkCreateSchema, savedLinkPlaceDecisionSchema } from '@trippilot/schemas';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export const createSavedLink = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<Record<string, unknown>>> => {
  const parsed = savedLinkCreateSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid link input', { issues: parsed.error.issues });

  const { data, error } = await client.from('saved_links').insert({ ...parsed.data, analysis_status: 'pending' }).select('*').single();
  if (error || !data) return toApiError('SAVED_LINK_CREATE_FAILED', error?.message ?? 'Failed to save link');
  return { ok: true, data };
};

export const listSavedLinks = async (client: SupabaseClient): Promise<ApiResponse<Array<Record<string, unknown>>>> => {
  const { data, error } = await client.from('saved_links').select('*').order('created_at', { ascending: false });
  if (error) return toApiError('SAVED_LINK_LIST_FAILED', error.message);
  return { ok: true, data: data ?? [] };
};

export const listSavedLinkPlaces = async (client: SupabaseClient, savedLinkId: string): Promise<ApiResponse<Array<Record<string, unknown>>>> => {
  const { data, error } = await client.from('saved_link_places').select('*').eq('saved_link_id', savedLinkId);
  if (error) return toApiError('SAVED_LINK_PLACE_LIST_FAILED', error.message);
  return { ok: true, data: data ?? [] };
};

export const decideSavedLinkPlace = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<null>> => {
  const parsed = savedLinkPlaceDecisionSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid place decision', { issues: parsed.error.issues });

  const patch = parsed.data.decision === 'confirm' ? { user_confirmed: true } : { user_confirmed: false };
  const { error } = await client.from('saved_link_places').update(patch).eq('id', parsed.data.saved_link_place_id);
  if (error) return toApiError('SAVED_LINK_PLACE_DECISION_FAILED', error.message);
  return { ok: true, data: null };
};
