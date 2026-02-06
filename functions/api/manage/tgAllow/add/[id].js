export async function onRequest(context) {
  const { env, params, request } = context;

  if (!env.tg_allowlist) {
    return new Response(
      JSON.stringify({ error: 'KV binding tg_allowlist is missing.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const userId = String(params.id || '').trim();
  if (!/^\d+$/.test(userId)) {
    return new Response(
      JSON.stringify({ error: 'Invalid user id. Expect numeric Telegram user id.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = request.method === 'POST' ? await safeJson(request) : null;
  const note = typeof body?.note === 'string' ? body.note.slice(0, 200) : '';

  await env.tg_allowlist.put(userId, '1', {
    metadata: {
      addedAt: Date.now(),
      note,
    },
  });

  return new Response(
    JSON.stringify({ success: true, userId }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}

async function safeJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
