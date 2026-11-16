import { getFounderSupabase } from './supabaseClient';

export interface AiTurn {
  role: string;
  content: string;
}

export async function requestAdvisor(messages: AiTurn[]): Promise<string | null> {
  const fromPages = await postJson('/api/founder-ai', { messages });
  if (fromPages) return fromPages;

  const client = getFounderSupabase();
  if (!client) return null;
  try {
    const { data, error } = await client.functions.invoke('founder-ai', { body: { messages } });
    if (error || !data || typeof data !== 'object') return null;
    const text = (data as { text?: unknown }).text;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}

async function postJson(url: string, body: unknown): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { text?: unknown; error?: unknown };
    if (data.error || typeof data.text !== 'string' || !data.text.trim()) return null;
    return data.text.trim();
  } catch {
    return null;
  }
}
