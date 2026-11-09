import { NextResponse, type NextRequest } from "next/server";

import {
  isAuthEnabled,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

/** Routes that require a session when authentication is enabled. */
const PROTECTED_PREFIXES = ["/dashboard", "/messages", "/settings"];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Builds the Content Security Policy for a request.
 *
 * `script-src` uses a per-request nonce with `'strict-dynamic'` instead of
 * `'unsafe-inline'`, so only scripts Next.js tags with the nonce (and the
 * scripts they load) may run — an injected inline script cannot. Development
 * adds `'unsafe-eval'`, which React needs for its dev-time debugging.
 *
 * `style-src` keeps `'unsafe-inline'`: inline style attributes (Radix
 * positioning, sonner, progress) are lower risk than scripts, and styling them
 * with nonces would require rendering every page dynamically for little gain.
 */
function buildContentSecurityPolicy(nonce: string, isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

/**
 * Two responsibilities, in order:
 *
 * 1. Generate a per-request CSP nonce, attach the policy to the response, and
 *    forward it on the request so Next.js can nonce its own scripts.
 * 2. Optimistically gate the app section so unauthenticated users are
 *    redirected to `/login` without a round trip. The `(app)` layout performs
 *    the authoritative check, so a missed match here still cannot leak data.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce, isDev);

  if (isAuthEnabled() && isProtectedPath(request.nextUrl.pathname)) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!verifySessionToken(token)) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      const redirect = NextResponse.redirect(url);
      redirect.headers.set("Content-Security-Policy", contentSecurityPolicy);
      return redirect;
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  // Page requests only: skip API routes, static assets and prefetches, none of
  // which render HTML that needs the nonce.
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
