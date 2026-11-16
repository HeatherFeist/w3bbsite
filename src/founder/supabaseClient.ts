import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null | undefined;

export function supabaseEnv(): { url: string; key: string } | null {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';
  if (!url || !key) return null;
  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return supabaseEnv() !== null;
}

/**
 * Founder auth is separate from the lead-capture client in src/lib/db.ts.
 * Without VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY the platform stays in demo mode.
 */
export function getFounderSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const env = supabaseEnv();
  if (!env) {
    client = null;
    return client;
  }
  client = createClient(env.url, env.key, {
    auth: {
      persistSession: true,
      storageKey: 'w3bb-founder-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return client;
}
