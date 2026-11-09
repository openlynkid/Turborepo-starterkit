import { NextResponse, type NextRequest } from "next/server";

import {
  isAuthEnabled,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

/**
 * Optimistic auth gate for the app section. Runs before the route renders so
 * unauthenticated users are redirected to `/login` without a round trip.
 *
 * This is the first of two layers: the `(app)` layout performs the
 * authoritative check, so a missed match here still cannot leak data.
 */
export function proxy(request: NextRequest) {
  if (!isAuthEnabled()) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/messages/:path*", "/settings/:path*"],
};
