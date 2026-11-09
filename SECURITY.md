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
