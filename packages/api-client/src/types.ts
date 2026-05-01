import type { ApiError } from '@trippilot/schemas';

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = { ok: false; error: ApiError['error'] };
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export const toApiError = (code: string, message: string, details?: Record<string, unknown>): ApiFailure => ({
  ok: false,
  error: { code, message, details }
});
