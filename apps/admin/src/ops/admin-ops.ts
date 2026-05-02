import type { SupabaseClient } from '@supabase/supabase-js';

export interface AdminDashboardStats {
  totalUsers: number;
  totalTrips: number;
  totalAiRuns: number;
  failedJobs: number;
  aiCostEstimateTotal: number;
  aiFailureRate: number;
  subscriptionSummary: Record<string, number>;
}

export interface AdminOpsContext {
  supabase: SupabaseClient;
}

const countRows = async (supabase: SupabaseClient, table: string, options?: { column?: string; value?: string }): Promise<number> => {
  let query = supabase.from(table).select('*', { count: 'exact', head: true });
  if (options?.column && options.value) query = query.eq(options.column, options.value);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
};

export const getDashboardStats = async ({ supabase }: AdminOpsContext): Promise<AdminDashboardStats> => {
  const [totalUsers, totalTrips, totalAiRuns, failedJobs] = await Promise.all([
    countRows(supabase, 'profiles'),
    countRows(supabase, 'trips'),
    countRows(supabase, 'ai_runs'),
    countRows(supabase, 'ai_runs', { column: 'status', value: 'failed' })
  ]);

  const { data: subscriptions, error } = await supabase.from('subscriptions').select('status');
  if (error) throw error;

  const subscriptionSummary = (subscriptions ?? []).reduce<Record<string, number>>((acc, row) => {
    const key = String(row.status ?? 'unknown');
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const { data: aiRuns, error: aiError } = await supabase.from('ai_runs').select('cost_estimate,status');
  if (aiError) throw aiError;
  const aiCostEstimateTotal = (aiRuns ?? []).reduce((sum, row) => sum + Number(row.cost_estimate ?? 0), 0);
  const aiFailureRate = totalAiRuns === 0 ? 0 : failedJobs / totalAiRuns;

  return { totalUsers, totalTrips, totalAiRuns, failedJobs, aiCostEstimateTotal, aiFailureRate, subscriptionSummary };
};


export const getProviderHealth = async ({ supabase }: AdminOpsContext) => {
  const checks = await Promise.allSettled([
    supabase.from('profiles').select('id', { head: true, count: 'exact' }).limit(1),
    supabase.from('ai_runs').select('id', { head: true, count: 'exact' }).limit(1)
  ]);
  const supabaseOk = checks.every((c) => c.status === 'fulfilled' && !(c as PromiseFulfilledResult<any>).value.error);
  return {
    supabase: supabaseOk ? 'ok' : 'degraded',
    openai: process.env.OPENAI_API_KEY ? 'configured' : 'mock_mode',
    places: process.env.GOOGLE_PLACES_API_KEY ? 'configured' : 'fallback_mode',
    revenuecat: process.env.REVENUECAT_API_KEY ? 'configured' : 'cache_only',
    redisWorker: process.env.REDIS_URL ? 'configured' : 'in_memory_or_pending'
  };
};

export const listAiRuns = async ({ supabase }: AdminOpsContext, limit = 50) => {
  const { data, error } = await supabase
    .from('ai_runs')
    .select('id,status,model,prompt_tokens,completion_tokens,total_tokens,cost_estimate,error_message,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const retryAiRun = async ({ supabase }: AdminOpsContext, runId: string) => {
  const { error } = await supabase.from('ai_runs').update({ status: 'queued', error_message: null }).eq('id', runId);
  if (error) throw error;
};

export const listTrips = async ({ supabase }: AdminOpsContext, limit = 50) => {
  const { data, error } = await supabase
    .from('trips')
    .select('id,owner_id,status,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const listFailedSavedLinks = async ({ supabase }: AdminOpsContext, limit = 50) => {
  const { data, error } = await supabase
    .from('saved_links')
    .select('id,user_id,url,analysis_status,last_error,updated_at')
    .eq('analysis_status', 'failed')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const retrySavedLinkAnalysis = async ({ supabase }: AdminOpsContext, savedLinkId: string) => {
  const { error } = await supabase
    .from('saved_links')
    .update({ analysis_status: 'queued', last_error: null })
    .eq('id', savedLinkId);
  if (error) throw error;
};

export const listSupportThreads = async ({ supabase }: AdminOpsContext, limit = 50) => {
  const { data, error } = await supabase
    .from('support_threads')
    .select('id,user_id,subject,status,created_at,updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const listAuditLogs = async ({ supabase }: AdminOpsContext, limit = 100) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id,actor_user_id,action,target_type,target_id,metadata,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};



export const listSupportTickets = async ({ supabase }: AdminOpsContext, limit = 100) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('id,user_id,trip_id,type,title,status,created_at,attachments')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const updateSupportTicketStatus = async ({ supabase }: AdminOpsContext, ticketId: string, status: 'open' | 'in_progress' | 'resolved', internalNote?: string) => {
  const { error } = await supabase
    .from('support_tickets')
    .update({ status, internal_note: internalNote ?? null })
    .eq('id', ticketId);
  if (error) throw error;
};

export const listFeedbackEvents = async ({ supabase }: AdminOpsContext, limit = 100) => {
  const { data, error } = await supabase
    .from('feedback_events')
    .select('id,user_id,trip_id,itinerary_satisfaction,place_recommendation_quality,booking_checklist_usefulness,comment,created_at')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const listDeletionRequests = async ({ supabase }: AdminOpsContext, limit = 100) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('id,actor_user_id,target_id,metadata,created_at')
    .eq('action', 'account_deletion_requested')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
};

export const recordAuditLog = async (
  { supabase }: AdminOpsContext,
  params: { actorUserId: string; action: string; targetType: string; targetId?: string; metadata?: Record<string, unknown> }
) => {
  const { error } = await supabase.from('audit_logs').insert({
    actor_user_id: params.actorUserId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId ?? null,
    metadata: params.metadata ?? {}
  });
  if (error) throw error;
};
