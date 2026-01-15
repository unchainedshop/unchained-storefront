/**
 * Next.js Middleware
 * Handles URL redirects based on configured rules
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface Redirect {
  id: string;
  from: string;
  to: string;
  type: 301 | 302;
  enabled: boolean;
}

// Cache for redirects with TTL
let redirectsCache: Redirect[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 60 * 1000; // 1 minute cache

async function getRedirects(request: NextRequest): Promise<Redirect[]> {
  const now = Date.now();

  // Return cached redirects if still valid
  if (redirectsCache && now - cacheTimestamp < CACHE_TTL) {
    return redirectsCache;
  }

  try {
    // Build absolute URL for the API call
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const host = request.headers.get("host") || "localhost:3000";
    const apiUrl = `${protocol}://${host}/api/redirects`;

    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch redirects:", response.status);
      return redirectsCache || [];
    }

    const data = await response.json();
    redirectsCache = data.redirects || [];
    cacheTimestamp = now;
    return redirectsCache;
  } catch (error) {
    console.error("Error fetching redirects:", error);
    return redirectsCache || [];
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes, static files, and admin pages
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/admin/") ||
    pathname.includes("/admin/") || // Handle locale prefixes like /de/admin/
    pathname.includes(".") // Static files
  ) {
    return NextResponse.next();
  }

  // Get redirects
  const redirects = await getRedirects(request);

  // Find matching redirect
  const redirect = redirects.find((r) => r.enabled && r.from === pathname);

  if (redirect) {
    const destination = redirect.to.startsWith("http")
      ? redirect.to
      : new URL(redirect.to, request.url).toString();

    return NextResponse.redirect(destination, {
      status: redirect.type,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
