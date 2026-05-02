import type { NotificationPayload } from './provider';

export interface BookingTaskReminderInput { id: string; title: string; due_date?: string | null }
export interface TripReminderInput { tripId: string; startDate: string; title: string }

const addDays = (iso: string, days: number): string => {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const buildBookingReminders = (tasks: BookingTaskReminderInput[]): NotificationPayload[] =>
  tasks.flatMap((t) => {
    if (!t.due_date) return [];
    return [7, 3, 0].map((d) => ({ idempotencyKey: `booking-${t.id}-${d}`, title: `예약 리마인더: ${t.title}`, body: d === 0 ? '오늘 마감 예정이에요.' : `${d}일 후 마감이에요.`, scheduledAt: addDays(t.due_date, -d) }));
  });

export const buildTripReminders = (trip: TripReminderInput): NotificationPayload[] => [
  { idempotencyKey: `trip-${trip.tripId}-14`, title: `${trip.title} 출발 14일 전`, body: '예약 상태를 최종 확인해 주세요.', scheduledAt: addDays(trip.startDate, -14) },
  { idempotencyKey: `trip-${trip.tripId}-7`, title: `${trip.title} 출발 7일 전`, body: '준비물 체크리스트를 점검해 주세요.', scheduledAt: addDays(trip.startDate, -7) },
  { idempotencyKey: `trip-${trip.tripId}-1`, title: `${trip.title} 출발 1일 전`, body: '오프라인 여행팩 생성을 권장해요.', scheduledAt: addDays(trip.startDate, -1) },
  { idempotencyKey: `trip-${trip.tripId}-0`, title: `${trip.title} 출발 당일`, body: '오늘 일정 요약을 확인하세요.', scheduledAt: addDays(trip.startDate, 0) }
];
