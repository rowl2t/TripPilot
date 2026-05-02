import type { ApiError } from '@trippilot/schemas';
import type { SupabaseClient } from '@supabase/supabase-js';

export const INTERNAL_API_VERSION = '2026-05-02.v1';

export type ApiSuccess<T> = { ok: true; data: T; version?: string };
export type ApiFailure = { ok: false; error: ApiError['error']; version?: string };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface Pagination { cursor: string | null; limit: number; has_more: boolean }
export interface Paged<T> { items: T[]; page: Pagination }

export interface AuthAwareClient { client: SupabaseClient; userId?: string | null; isAuthenticated: boolean }

export const toApiError = (code: string, message: string, details?: Record<string, unknown>): ApiFailure => ({ ok: false, error: { code, message, details }, version: INTERNAL_API_VERSION });
export const withVersion = <T>(data: T): ApiSuccess<T> => ({ ok: true, data, version: INTERNAL_API_VERSION });
export const normalizeUnknownError = (error: unknown): ApiFailure => toApiError('UNKNOWN_ERROR', error instanceof Error ? error.message : 'Unknown error');
