import type { SupabaseClient } from '@supabase/supabase-js';
import { tripCreateSchema, type TripCreateInput } from '@trippilot/schemas';
import type { ApiResponse } from './types';
import { toApiError } from './types';

export interface PlanningKickoffResult {
  tripId: string;
  tripInputId: string;
  planningJobId: string;
  status: 'planning';
}

const makeMockJobId = (tripId: string): string => `job_mock_${tripId.slice(0, 8)}`;

export const createTripPlanning = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<PlanningKickoffResult>> => {
  const parsed = tripCreateSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid trip planning input', { issues: parsed.error.issues });

  const tripInsert = mapTrip(parsed.data);
  const tripResponse = await client.from('trips').insert(tripInsert).select('id').single();
  if (tripResponse.error || !tripResponse.data) return toApiError('TRIP_INSERT_FAILED', tripResponse.error?.message ?? 'Trip insert failed');

  const tripId = tripResponse.data.id as string;
  const planningJobId = makeMockJobId(tripId);

  const tripInputResponse = await client
    .from('trip_inputs')
    .insert({
      trip_id: tripId,
      raw_input: parsed.data,
      normalized_input: normalizeInput(parsed.data),
      ai_summary: `Planning job queued (${planningJobId})`
    })
    .select('id')
    .single();

  if (tripInputResponse.error || !tripInputResponse.data) {
    return toApiError('TRIP_INPUT_INSERT_FAILED', tripInputResponse.error?.message ?? 'Trip input insert failed', { tripId });
  }

  return { ok: true, data: { tripId, tripInputId: tripInputResponse.data.id as string, planningJobId, status: 'planning' } };
};

const mapTrip = (input: TripCreateInput) => ({
  title: `${input.destination_text} Trip`,
  destination_text: input.destination_text,
  start_date: input.start_date,
  end_date: input.end_date,
  travelers_count: input.travelers_count,
  budget_amount: input.budget.amount,
  budget_currency: input.budget.currency,
  travel_styles: input.travel_styles,
  status: 'planning' as const
});

const normalizeInput = (input: TripCreateInput) => ({
  ...input,
  destination_text: input.destination_text.trim(),
  origin_text: input.origin_text.trim(),
  inferred_trip_type: input.is_international ? 'international' : 'domestic_or_unknown'
});
