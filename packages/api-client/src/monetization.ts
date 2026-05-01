import type { SupabaseClient } from '@supabase/supabase-js';
import { entitlementSchema, usageSnapshotSchema } from '@trippilot/schemas';

import type { ApiResponse } from './types';
import { toApiError } from './types';

const FREE = { ai_generation_limit: 2, saved_links_limit: 20, offline_pack_enabled: false, advanced_booking_enabled: false };
const PRO = { ai_generation_limit: 9999, saved_links_limit: 5000, offline_pack_enabled: true, advanced_booking_enabled: true };

export const resolveEntitlement = async (client: SupabaseClient, userId: string): Promise<ApiResponse<ReturnType<typeof entitlementSchema.parse>>> => {
  const sub = await client.from('subscriptions').select('provider, entitlement, status').eq('user_id', userId).eq('status', 'active').limit(1).maybeSingle();
  const isPro = !!sub.data && sub.data.entitlement?.toLowerCase().includes('pro');
  const plan = isPro ? 'pro_monthly' : 'free';
  return { ok: true, data: entitlementSchema.parse({ user_id: userId, plan, ...(isPro ? PRO : FREE) }) };
};

export const getUsageSnapshot = async (client: SupabaseClient, userId: string): Promise<ApiResponse<ReturnType<typeof usageSnapshotSchema.parse>>> => {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [aiRuns, savedLinks, trips] = await Promise.all([
    client.from('ai_runs').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', monthStart.toISOString()),
    client.from('saved_links').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    client.from('trips').select('id', { count: 'exact', head: true }).eq('owner_id', userId)
  ]);

  return {
    ok: true,
    data: usageSnapshotSchema.parse({ ai_runs_this_month: aiRuns.count ?? 0, saved_links_total: savedLinks.count ?? 0, trips_total: trips.count ?? 0 })
  };
};

export const enforceUsageLimit = async (client: SupabaseClient, userId: string, feature: 'ai_generation' | 'saved_links'): Promise<ApiResponse<{ allowed: boolean; reason?: string }>> => {
  const [ent, usage] = await Promise.all([resolveEntitlement(client, userId), getUsageSnapshot(client, userId)]);
  if (!ent.ok || !usage.ok) return toApiError('USAGE_CHECK_FAILED', 'Failed to compute usage');

  if (feature === 'ai_generation' && usage.data.ai_runs_this_month >= ent.data.ai_generation_limit) return { ok: true, data: { allowed: false, reason: 'AI generation monthly quota exceeded' } };
  if (feature === 'saved_links' && usage.data.saved_links_total >= ent.data.saved_links_limit) return { ok: true, data: { allowed: false, reason: 'Saved links quota exceeded' } };
  return { ok: true, data: { allowed: true } };
};
