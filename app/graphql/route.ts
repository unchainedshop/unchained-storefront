import { parse, serialize } from 'cookie';

export const dynamic = 'force-dynamic';

function rewriteCookie(setCookieHeader) {
  if (!setCookieHeader) return null;
  const cookies = parse(setCookieHeader);
  const tokenKey = Object.keys(cookies).find((k) => k.includes('token'));
  return serialize(tokenKey, cookies[tokenKey], {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  const res = await fetch(
    `${process.env.UNCHAINED_ENDPOINT}${url.search || ''}`,
    {
      body: request.body,
      method: 'GET',
      // @ts-ignore-next-line
      duplex: 'half',
      headers: request.headers,
    },
  );
  const buffer = await res.arrayBuffer();
  return new Response(buffer, {
    status: res.status,
    statusText: res.statusText,
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);

  const res = await fetch(
    `${process.env.UNCHAINED_ENDPOINT}${url.search || ''}`,
    {
      body: request.body,
      method: 'POST',
      // @ts-ignore-next-line
      duplex: 'half',
      headers: request.headers,
    },
  );
  const buffer = await res.arrayBuffer();
  const rewrittenCookie = rewriteCookie(res.headers.get('set-cookie'));
  return new Response(buffer, {
    status: res.status,
    statusText: res.statusText,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'set-cookie': rewrittenCookie,
    },
  });
}
