# Security Policy

## Supported versions

This project is a starter kit. Security fixes are applied to the `main` branch,
which is the only supported line.

## Reporting a vulnerability

Please do not report security vulnerabilities through public GitHub issues.

Instead, report them privately by opening a
[GitHub security advisory](https://github.com/openlynkid/Turborepo-starterkit/security/advisories/new)
or by emailing the maintainers. Include:

- A description of the issue and its impact
- Steps to reproduce, or a proof of concept
- Affected versions or commits, if known

You can expect an acknowledgement within a few days. We will keep you updated as
we investigate and will credit you in the fix unless you prefer otherwise.

## Handling secrets

- Never commit credentials. `.env` files are git-ignored; use `.env.example` to
  document the variables a deployment needs.
- Environment variables are validated at runtime by `@repo/env`. Server
  variables stay on the server — only `NEXT_PUBLIC_*` values reach the browser.
- Use the platform's secret store (for example Vercel Environment Variables or
  GitHub Actions secrets) for production values.

## Dependency policy

pnpm enforces a supply-chain policy: packages published within the last 24 hours
are rejected unless explicitly excluded. Dependencies are updated through
[Renovate](./renovate.json) and reviewed like any other change.

`pnpm-workspace.yaml` also pins a few transitive dependencies through
`overrides` when no upstream release has picked up the fix yet (for example
`esbuild` and `minimatch`). Each override is commented with the advisory it
addresses. Re-check them with `pnpm audit` whenever dependencies are bumped.

## Baseline hardening

- The web app sends a `Content-Security-Policy` (default-src 'self', no
  object-src, frame-ancestors 'none') plus `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security` and
  `Permissions-Policy` headers, and disables the `X-Powered-By` header (see
  `apps/web/next.config.js`). The headers are covered by an end-to-end test.
  The CSP currently allows `'unsafe-inline'` for scripts because the pages are
  statically prerendered; to tighten it, move the header to `proxy.ts` and use
  nonces (this forces dynamic rendering).
- Authentication is available for the app section. Set `SESSION_SECRET`,
  `ADMIN_EMAIL` and `ADMIN_PASSWORD` to require a login for `/dashboard`,
  `/messages` and `/settings`. The session is a signed, `HttpOnly`, `SameSite=Lax`
  cookie verified by `proxy.ts` and again in the `(app)` layout. When these
  variables are unset the app stays open (local development and CI).
- Login attempts are rate-limited per client IP (fixed window, `LOGIN_RATE_LIMIT_MAX`
  / `LOGIN_RATE_LIMIT_WINDOW_MS`) to blunt online password guessing against the
  admin account. The limiter is in-process, so add a shared limit at the edge
  behind multiple instances.
- The public contact endpoint is rate-limited per client IP (fixed window,
  `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MS`). The limiter is in-process, so
  behind multiple instances add a shared limit at the edge (for example Vercel
  Firewall) as well.
- Cloudflare Turnstile can be enabled by setting `TURNSTILE_SECRET_KEY` and
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the contact form then requires a CAPTCHA
  token that is verified server-side.
- All external input (the contact form and `POST /api/contact`) is validated
  with the shared Zod schema on the server before it reaches the database.

## Observability

- `apps/web/instrumentation.ts` exports `onRequestError`, which logs structured
  server errors. Point it at a provider (Sentry, Axiom, a webhook, ...) before
  shipping.
- `GET /api/health` reports app and database health for probes.
