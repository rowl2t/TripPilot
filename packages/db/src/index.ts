export const TRIPPILOT_SCHEMA_VERSION = '20260501090000_init_trippilot_schema';

export const TRIP_STATUS = ['draft', 'planning', 'ready', 'archived'] as const;
export const TRIP_VISIBILITY = ['private', 'shared'] as const;
export const BOOKING_TASK_STATUS = ['todo', 'scheduled', 'done', 'skipped'] as const;
export const SAVED_LINK_ANALYSIS_STATUS = ['pending', 'processing', 'completed', 'failed'] as const;

export type TripStatus = (typeof TRIP_STATUS)[number];
export type TripVisibility = (typeof TRIP_VISIBILITY)[number];
export type BookingTaskStatus = (typeof BOOKING_TASK_STATUS)[number];
export type SavedLinkAnalysisStatus = (typeof SAVED_LINK_ANALYSIS_STATUS)[number];

export * from './place-normalization';
