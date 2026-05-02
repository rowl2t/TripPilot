import { affiliateProviderSchema } from '@trippilot/schemas';

export type Provider = ReturnType<typeof affiliateProviderSchema.parse>;

export const buildAffiliateUrl = (provider: Provider, params: { destination: string; startDate?: string; endDate?: string }): string => {
  const q = new URLSearchParams({ destination: params.destination, start: params.startDate ?? '', end: params.endDate ?? '' });
  const map: Record<Provider, string> = {
    skyscanner: 'https://www.skyscanner.com/transport/flights',
    booking: 'https://www.booking.com/searchresults.html',
    agoda: 'https://www.agoda.com/search',
    klook: 'https://www.klook.com/search',
    kkday: 'https://www.kkday.com/en/search',
    google_travel: 'https://www.google.com/travel',
    manual: 'https://www.google.com/search'
  };
  return `${map[provider]}?${q.toString()}`;
};
