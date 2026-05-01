import { createTripPlanning } from '@trippilot/api-client';
import type { SupabaseClient } from '@supabase/supabase-js';

export const submitTripPlanning = async (client: SupabaseClient, draft: Record<string, unknown>) => createTripPlanning(client, draft);
