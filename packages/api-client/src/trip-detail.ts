import type { SupabaseClient } from '@supabase/supabase-js';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export interface TripDetailBundle {
  trip: Record<string, unknown>;
  days: Array<Record<string, unknown>>;
  items: Array<Record<string, unknown>>;
  placeOptions: Array<Record<string, unknown>>;
  bookingTasks: Array<Record<string, unknown>>;
}

export const getTripDetail = async (client: SupabaseClient, tripId: string): Promise<ApiResponse<TripDetailBundle>> => {
  const [trip, days, items, placeOptions, bookingTasks] = await Promise.all([
    client.from('trips').select('*').eq('id', tripId).single(),
    client.from('itinerary_days').select('*').eq('trip_id', tripId).order('day_order'),
    client.from('itinerary_items').select('*').eq('trip_id', tripId).order('sort_order'),
    client.from('trip_place_options').select('*').eq('trip_id', tripId),
    client.from('booking_tasks').select('*').eq('trip_id', tripId)
  ]);

  if (trip.error || !trip.data) return toApiError('TRIP_NOT_FOUND', trip.error?.message ?? 'Trip not found');
  return { ok: true, data: { trip: trip.data, days: days.data ?? [], items: items.data ?? [], placeOptions: placeOptions.data ?? [], bookingTasks: bookingTasks.data ?? [] } };
};

export const updateItineraryItem = async (client: SupabaseClient, itemId: string, patch: Record<string, unknown>) =>
  client.from('itinerary_items').update(patch).eq('id', itemId).select('*').single();

export const selectPlaceOption = async (client: SupabaseClient, optionId: string, itemId: string) => {
  await client.from('trip_place_options').update({ selected: true }).eq('id', optionId);
  return client.from('itinerary_items').update({ source: 'place_option', booking_status: 'updated' }).eq('id', itemId).select('*').single();
};

export const requestRegeneration = async (client: SupabaseClient, tripId: string, scope: 'full' | 'day' | 'constraint', payload: Record<string, unknown>) => {
  const inputHash = JSON.stringify(payload);
  const recent = await client
    .from('ai_runs')
    .select('id,status')
    .eq('trip_id', tripId)
    .eq('run_type', `regenerate_${scope}`)
    .eq('input_hash', inputHash)
    .in('status', ['queued', 'running'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent.data?.id) return { data: recent.data, error: null };

  return client.from('ai_runs').insert({ trip_id: tripId, run_type: `regenerate_${scope}`, model: process.env.OPENAI_FAST_MODEL ?? 'gpt-5.4-mini', input_hash: inputHash, prompt_version: 'trip_regen_v1', status: 'queued', token_usage: {}, output: payload });
};
