import { createPlacesAdapter, createRouteAdapter, createOpenAIResponsesAdapter, planTrip } from '@trippilot/ai';
import { createSupabaseServerClient } from '@trippilot/api-client';
import { tripCreateSchema } from '@trippilot/schemas';

export const runTripPlanningJob = async (tripId: string): Promise<{ tripId: string; status: string }> => {
  const client = createSupabaseServerClient({ url: process.env.SUPABASE_URL ?? '', serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '' });

  const tripRow = await client.from('trips').select('owner_id').eq('id', tripId).single();
  if (tripRow.error || !tripRow.data) throw new Error(`Trip missing ${tripId}`);

  const tripInputRow = await client.from('trip_inputs').select('id, raw_input').eq('trip_id', tripId).order('created_at', { ascending: false }).limit(1).single();
  if (tripInputRow.error || !tripInputRow.data) throw new Error(`Trip input missing for ${tripId}`);

  const parsed = tripCreateSchema.parse(tripInputRow.data.raw_input);
  const plannerResult = await planTrip(parsed, {
    openai: createOpenAIResponsesAdapter(),
    places: createPlacesAdapter(process.env.GOOGLE_PLACES_API_KEY),
    routes: createRouteAdapter(process.env.GOOGLE_ROUTES_API_KEY)
  });

  await client.from('ai_runs').insert({ user_id: tripRow.data.owner_id, trip_id: tripId, run_type: 'trip_planner_v1', model: process.env.OPENAI_TRIP_PLANNER_MODEL ?? 'gpt-5.5', input_hash: plannerResult.inputHash, prompt_version: 'trip_planner_v1', status: plannerResult.status, token_usage: plannerResult.tokenUsage, cost_estimate: plannerResult.tokenUsage.estimatedCost, output: { itinerary: plannerResult.itinerary, bookingTasks: plannerResult.bookingTasks } });

  await client.from('trips').update({ status: plannerResult.status === 'ready' ? 'ready' : 'planning_failed' }).eq('id', tripId);

  return { tripId, status: plannerResult.status };
};
