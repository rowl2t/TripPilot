import type { SupabaseClient } from '@supabase/supabase-js';
import { castVoteSchema, inviteMemberSchema, voteValueSchema } from '@trippilot/schemas';

import type { ApiResponse } from './types';
import { toApiError } from './types';

export const inviteMember = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<Record<string, unknown>>> => {
  const parsed = inviteMemberSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid invite payload', { issues: parsed.error.issues });

  const { data, error } = await client.from('trip_members').insert({ trip_id: parsed.data.trip_id, invite_email: parsed.data.invite_email, role: parsed.data.role, invite_status: 'pending' }).select('*').single();
  if (error || !data) return toApiError('INVITE_CREATE_FAILED', error?.message ?? 'Invite failed');
  return { ok: true, data };
};

export const listMembers = async (client: SupabaseClient, tripId: string) => {
  const { data, error } = await client.from('trip_members').select('*').eq('trip_id', tripId);
  if (error) return toApiError('MEMBERS_LIST_FAILED', error.message);
  return { ok: true as const, data: data ?? [] };
};

export const castVote = async (client: SupabaseClient, input: unknown): Promise<ApiResponse<null>> => {
  const parsed = castVoteSchema.safeParse(input);
  if (!parsed.success) return toApiError('VALIDATION_ERROR', 'Invalid vote payload', { issues: parsed.error.issues });

  const { error } = await client.from('votes').upsert({ trip_id: parsed.data.trip_id, place_option_id: parsed.data.place_option_id, vote: parsed.data.vote });
  if (error) return toApiError('VOTE_SAVE_FAILED', error.message);
  return { ok: true, data: null };
};

export const summarizeVotes = (votes: Array<{ vote: string }>) => {
  const base: Record<ReturnType<typeof voteValueSchema.parse>, number> = { must: 0, like: 0, neutral: 0, dislike: 0 };
  votes.forEach((v) => {
    if (v.vote in base) base[v.vote as keyof typeof base] += 1;
  });
  return {
    ...base,
    score: base.must * 2 + base.like - base.dislike,
    shouldAvoid: base.dislike >= 2 && base.must === 0
  };
};

export const buildRegenerateConstraints = (voteSummary: ReturnType<typeof summarizeVotes>, placeName: string) => ({
  must_include: voteSummary.must > 0 ? [placeName] : [],
  avoid_places: voteSummary.shouldAvoid ? [placeName] : []
});
