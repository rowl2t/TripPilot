import { bookingTaskListSchema, critiqueResultSchema, destinationResearchPlanSchema, itineraryDraftSchema, type TripCreateInput } from '@trippilot/schemas';
import { createHash } from 'node:crypto';
import { createModelRoutingPolicy } from '../model-router';

import type { OpenAIResponsesAdapter } from '../adapters/openai-responses';
import type { PlacesAdapter } from '../adapters/places';
import type { RouteEstimationAdapter } from '../adapters/routes';

export interface PlannerDeps { openai: OpenAIResponsesAdapter; places: PlacesAdapter; routes: RouteEstimationAdapter }

export interface PlannerRunContext {
  userId?: string;
  monthlyUsage?: number;
  monthlyLimit?: number;
  maxInputChars?: number;
  regenerateAttempts?: number;
  maxRegenerateAttempts?: number;
}
export const PROMPT_VERSION = 'v2.0.0';

const SYSTEM_PROMPT = `[${PROMPT_VERSION}] You are a practical travel planner for beginners. Avoid overpacked schedules. Always include transit time, rest, meal windows, and check-in/check-out realities. Keep budget realistic and flag reservation-required items.`;
const CRITIQUE_PROMPT = `[${PROMPT_VERSION}] Critique itinerary for density, route inefficiency, budget overflow, missing meals, missing required reservations, and whether saved-link places were reflected.`;
const REPAIR_PROMPT = `[${PROMPT_VERSION}] Rewrite itinerary from critique while preserving user core preferences and locked selections.`;

export interface PlannerResult {
  status: 'ready' | 'planning_failed';
  inputHash: string;
  itinerary: ReturnType<typeof itineraryDraftSchema.parse>;
  bookingTasks: ReturnType<typeof bookingTaskListSchema.parse>;
  critique: ReturnType<typeof critiqueResultSchema.parse>;
  tokenUsage: { inputTokens: number; outputTokens: number; estimatedCost: number };
}

const planCache = new Map<string, Promise<PlannerResult>>();
const placesCache = new Map<string, Array<{ name: string; city?: string }>>();
const linkAnalysisCache = new Map<string, { summary: string }>();
const perUserRequests = new Map<string, number>();

export const planTrip = async (input: TripCreateInput, deps: PlannerDeps, context: PlannerRunContext = {}): Promise<PlannerResult> => {
  const normalized = normalizeTripInput(input);
  const inputCharLen = JSON.stringify(normalized).length;
  if (inputCharLen > (context.maxInputChars ?? 5000)) throw new Error('Input too long for AI planning');
  if ((context.monthlyUsage ?? 0) >= (context.monthlyLimit ?? 20)) throw new Error('Monthly AI limit exceeded');
  if ((context.regenerateAttempts ?? 0) > (context.maxRegenerateAttempts ?? 5)) throw new Error('Too many regeneration attempts');
  if (context.userId) {
    const count = (perUserRequests.get(context.userId) ?? 0) + 1;
    perUserRequests.set(context.userId, count);
    if (count > 20) throw new Error('Rate limit exceeded');
  }
  const router = createModelRoutingPolicy();
  const inputHash = hashInput(normalized);
  if (planCache.has(inputHash)) return planCache.get(inputHash)!;

  const run = (async () => {
    const linkSummary = normalized.travel_styles.map((s: string) => {
      const k = `style:${normalized.destination_text}:${s}`;
      if (!linkAnalysisCache.has(k)) linkAnalysisCache.set(k, { summary: `${normalized.destination_text} ${s} 핵심 포인트` });
      return linkAnalysisCache.get(k)!;
    });

    const research = destinationResearchPlanSchema.parse({ queries: normalized.travel_styles.map((style: string) => ({ category: style, query: `${normalized.destination_text} ${style}` })) });
    const placeResults = (await Promise.all(research.queries.map(async (q: { query: string }) => {
      if (placesCache.has(q.query)) return placesCache.get(q.query)!;
      const found = await deps.places.search(q.query);
      placesCache.set(q.query, found);
      return found;
    }))).flat();

    const placeOptions = placeResults.slice(0, 6).map((p, i) => ({ name: p.name, city: p.city, reason: 'style match', fit_score: Math.max(0.5, 1 - i * 0.08), pros: ['초보자 동선 용이'], cons: ['성수기 혼잡 가능'], confidence: 0.75 }));

    const itineraryMock = {
      summary: `${normalized.destination_text} ${normalized.days}일 현실형 일정`,
      place_options: placeOptions,
      daily_budget_estimate: Array.from({ length: normalized.days }).map((_, i) => ({ day: i + 1, amount: Math.max(50, normalized.budget.amount / normalized.days), currency: normalized.budget.currency })),
      items: placeOptions.slice(0, normalized.days * 3).map((c, i) => ({ day: Math.floor(i / 3) + 1, title: c.name, item_type: i % 3 === 1 ? 'meal' : 'attraction', start_time: `${9 + (i % 3) * 3}:00`, end_time: `${10 + (i % 3) * 3}:30`, notes: '이동/휴식 시간 반영', estimated_cost: 20 + i * 5, requires_booking: i % 4 === 0, caution: i % 4 === 0 ? '사전 예약 권장' : undefined, alternatives: ['근처 대체 명소'], confidence: 0.72 }))
    };

    const itineraryResponse = await deps.openai.generateStructured({ model: router.route('final_itinerary'), prompt: `${SYSTEM_PROMPT}\nGenerate itinerary with context: ${linkSummary.map((x) => x.summary).join(', ')}`, schemaName: 'itineraryDraft' }, itineraryMock);
    const itinerary = itineraryDraftSchema.parse(itineraryResponse.output);

    const booking = bookingTaskListSchema.parse((await deps.openai.generateStructured({ model: router.route('candidate_extraction'), prompt: `${SYSTEM_PROMPT}\nGenerate booking tasks`, schemaName: 'bookingTasks' }, { tasks: [{ task_type: 'hotel', title: '숙소 예약', recommended_booking_window: '출발 6~8주 전', required: true }] })).output);

    const critiqueRaw = await deps.openai.generateStructured({ model: router.route('critique_repair'), prompt: CRITIQUE_PROMPT, schemaName: 'critiqueResult' }, { issues: [], repaired: false });
    const critique = critiqueResultSchema.parse(critiqueRaw.output);

    const repaired = await deps.openai.generateStructured({ model: router.route('critique_repair'), prompt: REPAIR_PROMPT, schemaName: 'repairPass' }, { repaired: critique.issues.length === 0 });
    const finalCritique = critiqueResultSchema.parse({ issues: critique.issues, repaired: Boolean(repaired.output?.repaired ?? true) });

    const estCost = (itineraryResponse.usage.inputTokens + itineraryResponse.usage.outputTokens) * 0.0000025;
    return { status: 'ready', inputHash, itinerary, bookingTasks: booking, critique: finalCritique, tokenUsage: { inputTokens: itineraryResponse.usage.inputTokens, outputTokens: itineraryResponse.usage.outputTokens, estimatedCost: estCost } };
  })();

  planCache.set(inputHash, run);
  return run;
};

const normalizeTripInput = (input: TripCreateInput) => ({ ...input, destination_text: input.destination_text.trim(), days: Math.max(2, Math.ceil((new Date(input.end_date).getTime() - new Date(input.start_date).getTime()) / 86400000) + 1) });
const hashInput = (input: unknown) => createHash('sha256').update(JSON.stringify(input)).digest('hex');


export const __plannerCaches = { planCache, placesCache, linkAnalysisCache };
