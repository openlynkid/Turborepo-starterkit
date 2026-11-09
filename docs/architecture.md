# Architecture

This document explains how the monorepo is put together: the workspace graph,
how each package talks to the others, and the conventions that keep it
consistent.

## Workspace graph

```
apps/web ──▶ @repo/ui          (components, hooks, Tailwind theme)
         ├─▶ @repo/db          (Drizzle client, schema, repositories)
         ├─▶ @repo/env         (validated environment variables)
         └─▶ @repo/validators  (shared Zod schemas)
                ▲
@repo/ui, @repo/db, @repo/env, @repo/validators
         └─▶ @repo/eslint-config, @repo/typescript-config
```

`@repo/eslint-config` and `@repo/typescript-config` are dev-only and shared by
every workspace. `@repo/validators` has no workspace dependencies, so it can be
imported from the client, route handlers and server actions alike.

Turborepo wires the tasks together in `turbo.json`. `build` depends on the
`^build` of dependencies, `test` depends on `^build`, and `test:e2e` depends on
the app's own `build`. That ordering is what lets a fresh clone run
`pnpm test` without a manual build step.

## Packages

### `apps/web`

The Next.js App Router application. It is split into two route groups:

- `(marketing)` — public pages (landing page, about) wrapped in a site header
  and footer.
- `(app)` — the product shell (dashboard, messages, components, settings)
  wrapped in a sidebar and top bar.

Route groups do not appear in the URL. `/dashboard` maps to
`app/(app)/dashboard/page.tsx`.

Shared pieces live in `apps/web/components` (layout chrome and the contact
form), site metadata in `apps/web/lib/site.ts`, and the environment facade in
`apps/web/env.ts`.

### `packages/ui`

The shared component library. It ships:

- `src/components/ui/*` — shadcn/ui components built on Radix primitives.
- `src/components/*` — app-level pieces such as the theme provider and toggle.
- `src/styles/globals.css` — the Tailwind v4 theme, imported by each app.
- `src/lib/utils.ts` — the `cn` class-merge helper.

Apps import components through the workspace alias:

```tsx
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
```

### `packages/db`

Wraps Drizzle ORM and postgres.js. `src/schema` defines tables, `src/
repositories` exposes typed data access, and `drizzle/` holds generated SQL
migrations. The production driver is created by `createDbClient(url)`;
`createTestDb()` from `@repo/db/testing` runs the same migrations against an
in-process PGlite instance for tests.

### `packages/env`

Validates environment variables with t3-env and Zod. Server variables are only
readable on the server; only `NEXT_PUBLIC_*` values are exposed to the browser.

### `packages/validators`

Shared Zod schemas. The contact form schema is used by the client form, the
route handler and the server action, so validation rules live in one place.

## Data flow of the contact form

1. The client form (`apps/web/components/contact-form.tsx`) validates input with
   `contactFormSchema` through react-hook-form and `zodResolver`.
2. It calls the `submitContactAction` server action, which delegates to
   `submitContact` in `apps/web/lib/contact.ts`.
3. `submitContact` re-validates on the server and, when a repository is
   available, persists the row through `@repo/db`.
4. `apps/web/lib/db.ts` returns `null` when `DATABASE_URL` is unset, so the app
   validates and skips writes with no database configured.

The same logic backs `POST /api/contact`, so the API and the UI cannot drift.

## Auth and abuse protection

The app section can be protected with an opt-in single-admin login. Two layers
enforce it:

1. `apps/web/proxy.ts` — Next.js 16's Proxy (the renamed middleware). It reads
   the signed session cookie and redirects unauthenticated requests to `/login`.
2. `apps/web/app/(app)/layout.tsx` — the authoritative server-side check. Even
   if a request reached the layout without passing the Proxy matcher, it cannot
   render protected data without a valid session.

`apps/web/lib/session.ts` owns the session format: an HMAC-SHA256 signature over
a base64url payload, stored in an `HttpOnly`, `SameSite=Lax` cookie.
`isAuthEnabled()` gates every check, so auth stays off until `SESSION_SECRET`,
`ADMIN_EMAIL` and `ADMIN_PASSWORD` are all set.

Contact submissions pass through `apps/web/lib/contact-guard.ts` before
validation: a per-IP fixed-window rate limit (`lib/rate-limit.ts`) and, when
configured, a Cloudflare Turnstile check (`lib/turnstile.ts`). Both the route
handler and the server action call the same guard, so the API and the UI stay in
sync.

## Operations

- `GET /api/health` reports app and database status for liveness/readiness
  probes (`apps/web/app/api/health/route.ts`).
- `apps/web/instrumentation.ts` exports `onRequestError` to capture server
  errors with the monitoring provider of your choice.
- Deploys apply migrations with `pnpm --filter @repo/db db:migrate:deploy`
  (`packages/db/scripts/migrate.mjs`), which skips cleanly when `DATABASE_URL`
  is unset.

## Conventions

- **Version catalog.** Shared versions live in the `catalog` section of
  `pnpm-workspace.yaml` and are referenced with `catalog:`.
- **React pin.** React and React DOM are pinned with an `overrides` entry in
  `pnpm-workspace.yaml`. Without it, transitive dependencies can resolve a
  different React copy, which silently breaks components that rely on shared
  React context (for example Sonner toasts). Keep the override in sync with the
  catalog versions.
- **TypeScript.** Every workspace extends a preset from
  `@repo/typescript-config` and runs `tsc --noEmit` for `check-types`.
- **Linting.** Every workspace extends a preset from `@repo/eslint-config` and
  runs `eslint --max-warnings 0`.
- **Commits.** Conventional Commits, enforced by Commitlint on the `commit-msg`
  hook. Staged files are formatted and linted by `lint-staged`.

## Releases

The repo uses [Changesets](./../.changeset). `.github/workflows/release.yml`
opens a "Version Packages" pull request whenever changesets are present, and
publishes when it is merged.
