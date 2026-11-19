import { getFounderSupabase, isSupabaseConfigured } from '@/founder/supabaseClient';
import type { Memorial, Memory, RoomMessage, ViewingRecord } from './types';

export function viewingCanSync(): boolean {
  return isSupabaseConfigured();
}

export async function pullViewing(code: string): Promise<ViewingRecord | null> {
  const client = getFounderSupabase();
  if (!client) return null;
  const { data, error } = await client.rpc('read_viewing', { p_code: code });
  if (error || !data || typeof data !== 'object') return null;
  const row = data as { memorial?: Memorial; memories?: Memory[]; messages?: RoomMessage[] };
  if (!row.memorial?.code) return null;
  return {
    memorial: row.memorial,
    memories: Array.isArray(row.memories) ? row.memories : [],
    messages: Array.isArray(row.messages) ? row.messages : [],
  };
}

export async function pushMemorial(memorial: Memorial): Promise<boolean> {
  const client = getFounderSupabase();
  if (!client) return false;
  const { error } = await client.rpc('save_viewing_memorial', { p_code: memorial.code, p_memorial: memorial });
  return !error;
}

export async function pushMemory(code: string, memory: Memory): Promise<boolean> {
  const client = getFounderSupabase();
  if (!client) return false;
  const { error } = await client.rpc('add_viewing_memory', { p_code: code, p_memory: memory });
  return !error;
}

export async function pushMessage(code: string, message: RoomMessage): Promise<boolean> {
  const client = getFounderSupabase();
  if (!client) return false;
  const { error } = await client.rpc('add_viewing_message', { p_code: code, p_message: message });
  return !error;
}
