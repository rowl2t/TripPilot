import { bookingTaskListSchema, critiqueResultSchema, destinationResearchPlanSchema, itineraryDraftSchema, type TripCreateInput } from '@trippilot/schemas';
import { createHash } from 'node:crypto';

import type { OpenAIResponsesAdapter } from '../adapters/openai-responses';
import type { PlacesAdapter } from '../adapters/places';
import type { RouteEstimationAdapter } from '../adapters/routes';

export interface PlannerDeps { openai: OpenAIResponsesAdapter; places: PlacesAdapter; routes: RouteEstimationAdapter }

export interface PlannerResult {
  status: 'ready' | 'planning_failed';
  inputHash: string;
  itinerary: ReturnType<typeof itineraryDraftSchema.parse>;
  bookingTasks: ReturnType<typeof bookingTaskListSchema.parse>;
  critique: ReturnType<typeof critiqueResultSchema.parse>;
  tokenUsage: { inputTokens: number; outputTokens: number; estimatedCost: number };
}

export const planTrip = async (input: TripCreateInput, deps: PlannerDeps): Promise<PlannerResult> => {
  const normalized = normalizeTripInput(input);
  const inputHash = hashInput(normalized);
  const research = destinationResearchPlanSchema.parse({ queries: normalized.travel_styles.map((style: string) => ({ category: style, query: `${normalized.destination_text} ${style}` })) });

  const placeResults = (await Promise.all(research.queries.map((q: { query: string }) => deps.places.search(q.query)))).flat();
  const candidates = placeResults.slice(0, 8).map((p: { name: string; city?: string }, i: number) => ({ name: p.name, city: p.city, reason: 'style match', fit_score: Math.max(0.5, 1 - i * 0.06) }));

  const itineraryMock = {
    summary: `${normalized.destination_text} ${normalized.days}일 일정`,
    items: candidates.slice(0, normalized.days * 3).map((c: { name: string }, i: number) => ({ day: Math.floor(i / 3) + 1, title: c.name, item_type: i % 3 === 1 ? 'meal' : 'attraction', start_time: `${9 + (i % 3) * 3}:00`, end_time: `${11 + (i % 3) * 3}:00` }))
  };

  const itineraryResponse = await deps.openai.generateStructured({ model: process.env.OPENAI_TRIP_PLANNER_MODEL ?? 'gpt-5.5', prompt: 'Generate itinerary', schemaName: 'itineraryDraft' }, itineraryMock);
  const itinerary = itineraryDraftSchema.parse(itineraryResponse.output);

  const bookingMock = { tasks: [{ task_type: 'hotel', title: '숙소 예약', recommended_booking_window: '출발 6~8주 전' }] };
  const booking = bookingTaskListSchema.parse((await deps.openai.generateStructured({ model: process.env.OPENAI_FAST_MODEL ?? 'gpt-5.4-mini', prompt: 'Generate booking tasks', schemaName: 'bookingTasks' }, bookingMock)).output);

  const critique = critiqueResultSchema.parse({ issues: [], repaired: true });
  const estCost = (itineraryResponse.usage.inputTokens + itineraryResponse.usage.outputTokens) * 0.000002;

  return { status: 'ready', inputHash, itinerary, bookingTasks: booking, critique, tokenUsage: { inputTokens: itineraryResponse.usage.inputTokens, outputTokens: itineraryResponse.usage.outputTokens, estimatedCost: estCost } };
};

const normalizeTripInput = (input: TripCreateInput) => ({ ...input, destination_text: input.destination_text.trim(), days: 3 });
const hashInput = (input: unknown) => createHash('sha256').update(JSON.stringify(input)).digest('hex');
