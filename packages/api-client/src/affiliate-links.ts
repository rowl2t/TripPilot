export type BookingTaskType = 'flight' | 'hotel' | 'transport' | 'activity' | 'restaurant' | 'esim' | 'insurance';
export type AffiliateProvider = 'skyscanner' | 'booking' | 'agoda' | 'rome2rio' | 'klook' | 'opentable' | 'airalo' | 'safetywing' | 'google_search';

export interface AffiliateParams {
  destination: string;
  origin?: string;
  startDate?: string;
  endDate?: string;
  travelers?: number;
  currency?: string;
  tripId?: string;
  taskType: BookingTaskType;
}

const UTM = { utm_source: 'trippilot', utm_medium: 'affiliate', utm_campaign: 'booking_checklist' };

const withUtm = (base: string, extra: Record<string, string>) => `${base}?${new URLSearchParams({ ...extra, ...UTM }).toString()}`;

export const buildProviderUrl = (provider: AffiliateProvider, p: AffiliateParams, affiliateId?: string): string => {
  const common = { destination: p.destination, start: p.startDate ?? '', end: p.endDate ?? '', adults: String(p.travelers ?? 1), currency: p.currency ?? 'USD', aff_id: affiliateId ?? '' };
  switch (provider) {
    case 'skyscanner': return withUtm('https://www.skyscanner.com/transport/flights', common);
    case 'booking': return withUtm('https://www.booking.com/searchresults.html', common);
    case 'agoda': return withUtm('https://www.agoda.com/search', common);
    case 'rome2rio': return withUtm('https://www.rome2rio.com/map', { q: `${p.origin ?? ''} ${p.destination}` });
    case 'klook': return withUtm('https://www.klook.com/search', common);
    case 'opentable': return withUtm('https://www.opentable.com/s', { q: p.destination });
    case 'airalo': return withUtm('https://www.airalo.com/search', { q: p.destination });
    case 'safetywing': return withUtm('https://safetywing.com/nomad-insurance', common);
    default: return withUtm('https://www.google.com/search', { q: `${p.destination} ${p.taskType} booking` });
  }
};

export const defaultProviderByTask: Record<BookingTaskType, AffiliateProvider> = {
  flight: 'skyscanner', hotel: 'booking', transport: 'rome2rio', activity: 'klook', restaurant: 'opentable', esim: 'airalo', insurance: 'safetywing'
};

export const buildBookingLink = (params: AffiliateParams, opts?: { provider?: AffiliateProvider; providerAvailable?: boolean; affiliateId?: string }) => {
  const provider = opts?.provider ?? defaultProviderByTask[params.taskType];
  const chosen = opts?.providerAvailable === false ? 'google_search' : provider;
  const url = buildProviderUrl(chosen, params, opts?.affiliateId ?? process.env.AFFILIATE_ID);
  return {
    provider: chosen,
    url,
    disclaimer: '예약 가능 여부와 가격은 외부 사이트에서 최종 확인해 주세요.'
  };
};

export const buildOutboundClickEvent = (input: { provider: AffiliateProvider; taskType: BookingTaskType; tripId?: string; taskId?: string }) => ({
  event: 'outbound_click',
  provider: input.provider,
  task_type: input.taskType,
  trip_id: input.tripId ?? null,
  task_id: input.taskId ?? null,
  created_at: new Date().toISOString()
});
