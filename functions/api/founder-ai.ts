interface FunctionContext {
  request: Request;
  env: {
    AI_API_KEY?: string;
    OPENAI_API_KEY?: string;
    AI_BASE_URL?: string;
    AI_MODEL?: string;
  };
}

const POLICY =
  'You are the W3BB Launch Coach. Do not invent grant amounts, deadlines, revenue forecasts, or a claim that a business is Trust-Approved. The seven learning pathways are new tracks, not existing courses. Trust-Approved Certification is a separate business-level review. Point founders to the existing Business Builder and Entrepreneur Launchpad.';

export async function onRequestPost(context: FunctionContext): Promise<Response> {
  return handleAdvisor(context.request, context.env);
}

export async function handleAdvisor(
  request: Request,
  env: FunctionContext['env'],
): Promise<Response> {
  const key = env.AI_API_KEY || env.OPENAI_API_KEY;
  if (!key) {
    return Response.json({ error: 'unconfigured' });
  }

  let body: { messages?: { role?: string; content?: string }[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
  if (!incoming.length || incoming.some((message) => typeof message?.content !== 'string' || message.content.length > 6000)) {
    return Response.json({ error: 'invalid_messages' }, { status: 400 });
  }

  const messages = [
    { role: 'system', content: POLICY },
    ...incoming.map((message) => ({
      role: message.role === 'assistant' || message.role === 'system' ? message.role : 'user',
      content: message.content as string,
    })),
  ];

  try {
    const base = (env.AI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const response = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.AI_MODEL || 'gpt-4o-mini',
        temperature: 0.4,
        messages,
      }),
    });
    if (!response.ok) {
      return Response.json({ error: 'upstream' }, { status: 502 });
    }
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return Response.json({ error: 'empty' }, { status: 502 });
    return Response.json({ text });
  } catch {
    return Response.json({ error: 'upstream' }, { status: 502 });
  }
}
