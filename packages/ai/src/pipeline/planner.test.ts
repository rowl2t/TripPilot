import { describe, expect, it } from 'vitest';

import { createOpenAIResponsesAdapter } from '../adapters/openai-responses';
import { createPlacesAdapter } from '../adapters/places';
import { createRouteAdapter } from '../adapters/routes';
import { __plannerCaches, PROMPT_VERSION, planTrip } from './planner';

const cases = [
  { destination_text: 'Tokyo', origin_text: 'Seoul', start_date: '2026-10-01', end_date: '2026-10-04', travelers_count: 2, companion_type: 'friends', budget: { amount: 2500, currency: 'USD', budget_level: 'standard' }, travel_styles: ['food', 'culture'] }
] as const;

describe('planTrip pipeline quality', () => {
  it('uses prompt versioning', () => {
    expect(PROMPT_VERSION).toBe('v2.0.0');
  });

  it('validates mock trip input', async () => {
    for (const input of cases) {
      const result = await planTrip(input, { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() });
      expect(result.status).toBe('ready');
      expect(result.itinerary.items.length).toBeGreaterThan(0);
      expect(result.itinerary.place_options.length).toBeGreaterThan(0);
    }
  });

  it('handles cache hit/miss for trip results', async () => {
    __plannerCaches.planCache.clear();
    const input = cases[0];
    await planTrip(input, { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() });
    expect(__plannerCaches.planCache.size).toBe(1);
    await planTrip(input, { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() });
    expect(__plannerCaches.planCache.size).toBe(1);
  });

  it('handles place/search and link-analysis caches', async () => {
    __plannerCaches.placesCache.clear();
    __plannerCaches.linkAnalysisCache.clear();
    await planTrip(cases[0], { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() });
    expect(__plannerCaches.placesCache.size).toBeGreaterThan(0);
    expect(__plannerCaches.linkAnalysisCache.size).toBeGreaterThan(0);
  });
});
