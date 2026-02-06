export async function onRequest(context) {
  const { env, request } = context;

  if (!env.tg_allowlist) {
    return new Response(
      JSON.stringify({ error: 'KV binding tg_allowlist is missing.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const url = new URL(request.url);
  const raw = url.searchParams.get('limit');
  let limit = parseInt(raw || '100', 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 100;
  if (limit > 1000) limit = 1000;

  const cursor = url.searchParams.get('cursor') || undefined;
  const value = await env.tg_allowlist.list({ limit, cursor });

  return new Response(JSON.stringify(value), {
    headers: { 'Content-Type': 'application/json' },
  });
}
