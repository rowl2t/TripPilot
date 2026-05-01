import type { SupabaseClient } from '@supabase/supabase-js';
import { offlinePackSchema } from '@trippilot/schemas';

import { getBookingTasks } from './booking';
import { getTripDetail } from './trip-detail';
import type { ApiResponse } from './types';
import { toApiError } from './types';

export interface EmergencyInfoProvider {
  get(destination: string): Promise<Array<{ label: string; phone: string; note?: string }>>;
}

export const mockEmergencyInfoProvider: EmergencyInfoProvider = {
  async get(destination) {
    return [
      { label: `${destination} Police`, phone: '112' },
      { label: `${destination} Ambulance`, phone: '119' }
    ];
  }
};

export const buildOfflinePack = async (client: SupabaseClient, tripId: string, emergencyProvider: EmergencyInfoProvider = mockEmergencyInfoProvider): Promise<ApiResponse<ReturnType<typeof offlinePackSchema.parse>>> => {
  const detail = await getTripDetail(client, tripId);
  if (!detail.ok) return detail;
  const tasks = await getBookingTasks(client, tripId);
  if (!tasks.ok) return tasks;

  const destination = String(detail.data.trip.destination_text ?? 'destination');
  const emergency = await emergencyProvider.get(destination);

  const pack = offlinePackSchema.parse({
    trip_id: tripId,
    generated_at: new Date().toISOString(),
    trip_summary: `${detail.data.trip.title ?? 'Trip'} / ${destination}`,
    itinerary_days: (detail.data.days ?? []).map((d) => ({ date: String(d.date ?? ''), items: (detail.data.items ?? []).filter((it) => it.day_id === d.id).map((it) => String(it.title ?? '')) })),
    booking_tasks: (tasks.data ?? []).map((t) => String(t.title ?? '')),
    emergency_contacts: emergency,
    checklist: ['여권', '보험증서', '충전기', '상비약'],
    budget_summary: `Budget: ${String(detail.data.trip.budget_amount ?? '-')}`,
    notes: ['가격/재고는 실시간 변동 가능', '중요 예약은 출발 전 재확인']
  });

  return { ok: true, data: pack };
};

export const offlinePackToHtml = (pack: ReturnType<typeof offlinePackSchema.parse>): string => `<!doctype html><html><body><h1>${pack.trip_summary}</h1><h2>Itinerary</h2>${pack.itinerary_days.map((d) => `<h3>${d.date}</h3><ul>${d.items.map((i) => `<li>${i}</li>`).join('')}</ul>`).join('')}<h2>Emergency</h2><ul>${pack.emergency_contacts.map((c) => `<li>${c.label}: ${c.phone}</li>`).join('')}</ul></body></html>`;
