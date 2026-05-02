import type { SupabaseClient } from '@supabase/supabase-js';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export const getCalendarEvents = async (client: SupabaseClient, tripId: string): Promise<ApiResponse<Array<Record<string, unknown>>>> => {
  const { data, error } = await client.from('calendar_events').select('*').eq('trip_id', tripId).order('start_at');
  if (error) return toApiError('CALENDAR_FETCH_FAILED', error.message);
  return { ok: true, data: data ?? [] };
};

export const materializeCalendarEvents = async (client: SupabaseClient, tripId: string, userId: string): Promise<ApiResponse<number>> => {
  const [itemsRes, tasksRes] = await Promise.all([
    client.from('itinerary_items').select('id,title,start_time,end_time').eq('trip_id', tripId),
    client.from('booking_tasks').select('id,title,due_date').eq('trip_id', tripId)
  ]);
  if (itemsRes.error || tasksRes.error) return toApiError('CALENDAR_SOURCE_FETCH_FAILED', 'Failed to load itinerary/tasks');

  const events = [
    ...(itemsRes.data ?? []).filter((x) => x.start_time && x.end_time).map((x) => ({ trip_id: tripId, user_id: userId, provider: 'local', title: x.title, start_at: x.start_time, end_at: x.end_time, status: 'confirmed' })),
    ...(tasksRes.data ?? []).filter((x) => x.due_date).map((x) => ({ trip_id: tripId, user_id: userId, provider: 'local', title: `[예약] ${x.title}`, start_at: `${x.due_date}T09:00:00Z`, end_at: `${x.due_date}T09:30:00Z`, status: 'confirmed' }))
  ];

  let inserted = 0;
  for (const event of events) {
    const dup = await client.from('calendar_events').select('id').eq('trip_id', tripId).eq('title', event.title).eq('start_at', event.start_at).maybeSingle();
    if (!dup.data) {
      const ins = await client.from('calendar_events').insert(event);
      if (!ins.error) inserted += 1;
    }
  }
  return { ok: true, data: inserted };
};

export const toIcs = (events: Array<{ title: string; start_at: string; end_at: string }>, calendarName = 'TripPilot Itinerary'): string => {
  const fmt = (iso: string) => iso.replace(/[-:]/g, '').replace('.000', '').replace('Z', 'Z');
  const body = events
    .map(
      (e, i) =>
        `BEGIN:VEVENT\nUID:${i}@trippilot\nDTSTAMP:${fmt(new Date().toISOString())}\nDTSTART:${fmt(e.start_at)}\nDTEND:${fmt(e.end_at)}\nSUMMARY:${e.title}\nEND:VEVENT`
    )
    .join('\n');
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TripPilot//EN\nX-WR-CALNAME:${calendarName}\n${body}\nEND:VCALENDAR`;
};
