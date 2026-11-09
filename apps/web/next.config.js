/** @type {import("next").NextConfig} */
import process from "node:process";

const isDev = process.env.NODE_ENV === "development";

// Baseline Content Security Policy. `'unsafe-inline'` is required because
// Next.js and next-themes emit inline bootstrap scripts, and the pages are
// statically prerendered (a nonce needs per-request rendering). Everything
// else is locked to same-origin; Turnstile is allowed for the CAPTCHA widget.
// To tighten script-src further, move the header to `proxy.ts` and switch to
// nonce-based CSP — at the cost of rendering every page dynamically.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com`,
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

const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/db"],
  serverExternalPackages: ["postgres"],
  poweredByHeader: false,
  // Next.js blocks cross-origin requests to dev assets (HMR) by default. Set
  // ALLOWED_DEV_ORIGINS to a comma-separated list of hostnames when exposing
  // the dev server through a tunnel or remote host.
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
