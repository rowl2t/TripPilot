import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export interface SupabasePublicConfig {
  url: string;
  anonKey: string;
}

export interface SupabaseServiceConfig {
  url: string;
  serviceRoleKey: string;
}

export const createSupabaseBrowserClient = ({ url, anonKey }: SupabasePublicConfig): SupabaseClient =>
  createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

export const createSupabaseMobileClient = <TStorage extends { getItem: (k: string) => Promise<string | null>; setItem: (k: string, v: string) => Promise<void>; removeItem: (k: string) => Promise<void>; }>(
  config: SupabasePublicConfig,
  storage: TStorage
): SupabaseClient =>
  createClient(config.url, config.anonKey, {
    auth: {
      storage,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false
    }
  });

export const createSupabaseServerClient = ({ url, serviceRoleKey }: SupabaseServiceConfig): SupabaseClient =>
  createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
