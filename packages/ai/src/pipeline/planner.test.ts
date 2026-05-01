import { describe, expect, it } from 'vitest';

import { createOpenAIResponsesAdapter } from '../adapters/openai-responses';
import { createPlacesAdapter } from '../adapters/places';
import { createRouteAdapter } from '../adapters/routes';
import { planTrip } from './planner';

describe('planTrip pipeline', () => {
  it('produces validated itinerary with mock providers', async () => {
    const result = await planTrip(
      {
        destination_text: 'Tokyo',
        origin_text: 'Seoul',
        start_date: '2026-10-01',
        end_date: '2026-10-05',
        travelers_count: 2,
        companion_type: 'friends',
        budget: { amount: 3000, currency: 'USD', budget_level: 'standard' },
        travel_styles: ['food', 'culture']
      },
      { openai: createOpenAIResponsesAdapter(), places: createPlacesAdapter(), routes: createRouteAdapter() }
    );

    expect(result.status).toBe('ready');
    expect(result.itinerary.items.length).toBeGreaterThan(0);
  });
});
