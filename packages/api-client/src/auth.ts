import type { SupabaseClient } from '@supabase/supabase-js';

import { sessionSchema, signInWithPasswordSchema, signUpSchema } from '@trippilot/schemas';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export const signInWithPassword = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<{ userId: string }>> => {
  const parsed = signInWithPasswordSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid login payload', { issues: parsed.error.issues });

  const { error, data } = await client.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return toApiError('AUTH_SIGNIN_FAILED', error?.message ?? 'Sign in failed');
  return { ok: true, data: { userId: data.user.id } };
};

export const signUpWithPassword = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<{ userId: string }>> => {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid signup payload', { issues: parsed.error.issues });
  const { email, password } = parsed.data;
  const { error, data } = await client.auth.signUp({ email, password });
  if (error || !data.user) return toApiError('AUTH_SIGNUP_FAILED', error?.message ?? 'Sign up failed');
  return { ok: true, data: { userId: data.user.id } };
};

export const refreshSession = async (client: SupabaseClient): Promise<ApiResponse<{ accessToken: string }>> => {
  const { data, error } = await client.auth.refreshSession();
  if (error || !data.session) return toApiError('AUTH_REFRESH_FAILED', error?.message ?? 'Refresh failed');
  const parsed = sessionSchema.safeParse({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresAt: data.session.expires_at,
    userId: data.session.user.id,
    email: data.session.user.email
  });
  if (!parsed.success) return toApiError('SESSION_INVALID', 'Session payload invalid');
  return { ok: true, data: { accessToken: parsed.data.accessToken } };
};

export const signOut = async (client: SupabaseClient): Promise<ApiResponse<{ signedOut: true }>> => {
  const { error } = await client.auth.signOut();
  if (error) return toApiError('AUTH_SIGNOUT_FAILED', error.message);
  return { ok: true, data: { signedOut: true } };
};
