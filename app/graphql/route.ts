import { parseSetCookie, stringifySetCookie } from 'cookie';

export const dynamic = 'force-dynamic';

const HOP_BY_HOP_HEADERS = ['host', 'connection', 'content-length'];

// Re-scope the backend's session cookie to this origin, keeping its expiry.
function rewriteTokenCookie(setCookieHeaders: string[]) {
  const tokenHeader = setCookieHeaders.find((header) =>
    parseSetCookie(header).name?.includes('token'),
  );
  if (!tokenHeader) return null;
  const { name, value, expires, maxAge } = parseSetCookie(tokenHeader);
  return stringifySetCookie({
    name,
    value,
    expires,
    maxAge,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
}

async function proxy(request: Request) {
  const { search } = new URL(request.url);
  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  const res = await fetch(`${process.env.UNCHAINED_ENDPOINT}${search}`, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    // @ts-ignore duplex is required by undici for streamed request bodies
    duplex: hasBody ? 'half' : undefined,
  });

  const responseHeaders = new Headers({
    'content-type': 'application/json; charset=utf-8',
  });
  const cookie = rewriteTokenCookie(res.headers.getSetCookie());
  if (cookie) responseHeaders.set('set-cookie', cookie);

  return new Response(await res.arrayBuffer(), {
    status: res.status,
    statusText: res.statusText,
    headers: responseHeaders,
  });
}

export { proxy as GET, proxy as POST };
