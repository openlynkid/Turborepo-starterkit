/** @type {import("next").NextConfig} */
import process from "node:process";

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
          // Content-Security-Policy is set per-request in `proxy.ts` so it can
          // carry a nonce (see that file for the policy).
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
