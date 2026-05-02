import type { TripCreateInput } from '@trippilot/schemas';

export interface EvalInputCase {
  id: string;
  input: TripCreateInput;
  mustKeywords?: string[];
  avoidKeywords?: string[];
  savedPlaces?: string[];
}

export const evalInputs: EvalInputCase[] = [
  { id: 'jp-3n4d', input: { destination_text: 'Tokyo', origin_text: 'Seoul', start_date: '2026-09-10', end_date: '2026-09-13', travelers_count: 2, companion_type: 'friends', budget: { amount: 2600, currency: 'USD', budget_level: 'standard' }, travel_styles: ['food', 'culture'] } },
  { id: 'jeju-2n3d', input: { destination_text: 'Jeju', origin_text: 'Seoul', start_date: '2026-06-01', end_date: '2026-06-03', travelers_count: 2, companion_type: 'couple', budget: { amount: 1200000, currency: 'KRW', budget_level: 'standard' }, travel_styles: ['nature'] } },
  { id: 'europe-10d', input: { destination_text: 'Europe', origin_text: 'Busan', start_date: '2026-07-01', end_date: '2026-07-10', travelers_count: 2, companion_type: 'friends', budget: { amount: 7000, currency: 'EUR', budget_level: 'premium' }, travel_styles: ['museum', 'architecture'] } },
  { id: 'family-trip', input: { destination_text: 'Osaka', origin_text: 'Daegu', start_date: '2026-08-01', end_date: '2026-08-05', travelers_count: 4, companion_type: 'family', budget: { amount: 3500, currency: 'USD', budget_level: 'standard' }, travel_styles: ['family', 'kids'] } },
  { id: 'budget-trip', input: { destination_text: 'Fukuoka', origin_text: 'Seoul', start_date: '2026-10-01', end_date: '2026-10-04', travelers_count: 1, companion_type: 'solo', budget: { amount: 500, currency: 'USD', budget_level: 'budget' }, travel_styles: ['budget', 'walking'] } },
  { id: 'must-avoid', input: { destination_text: 'Kyoto', origin_text: 'Seoul', start_date: '2026-11-01', end_date: '2026-11-05', travelers_count: 2, companion_type: 'couple', budget: { amount: 2200, currency: 'USD', budget_level: 'standard' }, travel_styles: ['temple', 'food'] }, mustKeywords: ['temple'], avoidKeywords: ['nightclub'] },
  { id: 'saved-links-case', input: { destination_text: 'Bangkok', origin_text: 'Incheon', start_date: '2026-12-01', end_date: '2026-12-06', travelers_count: 2, companion_type: 'friends', budget: { amount: 1800, currency: 'USD', budget_level: 'standard' }, travel_styles: ['street_food', 'market'] }, savedPlaces: ['Chatuchak', 'Wat Arun'] },
  { id: 'long-haul', input: { destination_text: 'New York', origin_text: 'Seoul', start_date: '2026-05-01', end_date: '2026-05-08', travelers_count: 2, companion_type: 'couple', budget: { amount: 5000, currency: 'USD', budget_level: 'premium' }, travel_styles: ['city', 'show'] } },
  { id: 'workation', input: { destination_text: 'Bali', origin_text: 'Seoul', start_date: '2026-04-01', end_date: '2026-04-14', travelers_count: 1, companion_type: 'solo', budget: { amount: 2400, currency: 'USD', budget_level: 'standard' }, travel_styles: ['relax', 'cafe'] } },
  { id: 'winter-trip', input: { destination_text: 'Sapporo', origin_text: 'Seoul', start_date: '2026-01-10', end_date: '2026-01-15', travelers_count: 3, companion_type: 'friends', budget: { amount: 2800, currency: 'USD', budget_level: 'standard' }, travel_styles: ['snow', 'food'] } }
];
