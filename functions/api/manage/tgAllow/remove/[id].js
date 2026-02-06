export async function onRequest(context) {
  const { env, params } = context;

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

  await env.tg_allowlist.delete(userId);

  return new Response(
    JSON.stringify({ success: true, userId }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
