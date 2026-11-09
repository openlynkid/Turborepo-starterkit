# Turborepo Starter Kit

[![CI](https://github.com/openlynkid/Turborepo-starterkit/actions/workflows/ci.yml/badge.svg)](https://github.com/openlynkid/Turborepo-starterkit/actions/workflows/ci.yml)

A modern, production-ready monorepo starter kit built with **Turborepo**, **pnpm workspaces**, **Next.js**, **Tailwind CSS v4**, and **shadcn/ui**.

## What's inside

This monorepo is managed by [Turborepo](https://turborepo.dev) and [pnpm workspaces](https://pnpm.io/workspaces).

### Apps and packages

- `apps/web` – [Next.js](https://nextjs.org) app (App Router, React 19, Tailwind CSS v4)
- `packages/ui` – shared React component library with [shadcn/ui](https://ui.shadcn.com) components and Tailwind theme
- `packages/db` – [Drizzle ORM](https://orm.drizzle.team) schema, migrations and repositories for PostgreSQL
- `packages/env` – type-safe environment variable validation ([t3-env](https://env.t3.gg) + Zod)
- `packages/validators` – shared [Zod](https://zod.dev) schemas for forms and API input
- `packages/eslint-config` – shared ESLint configurations
- `packages/typescript-config` – shared `tsconfig.json` presets

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Tooling

- **Turborepo** – task orchestration and caching
- **pnpm** – fast, disk-efficient package manager (with a version catalog)
- **Tailwind CSS v4** – utility-first CSS with the new CSS-first config
- **shadcn/ui** – accessible components built on Radix UI primitives
- **ESLint** + **Prettier** – linting and formatting
- **Husky** + **lint-staged** + **Commitlint** – Git hooks and Conventional Commits
- **Vitest** + **Testing Library** – unit tests
- **Drizzle ORM** + **postgres.js** – typed SQL and migrations for PostgreSQL
- **Playwright** – end-to-end tests
- **Changesets** – versioning and changelogs
- **Renovate** – automated dependency updates

## Documentation

- [`docs/architecture.md`](./docs/architecture.md) – workspace graph, data flow
  and conventions
- [`docs/components.md`](./docs/components.md) – the component library and how
  to add to it
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) – setup, commit conventions, releases
- [`SECURITY.md`](./SECURITY.md) – how to report a vulnerability
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)

## Requirements

- Node.js >= 24
- pnpm 11 (`corepack enable` then pnpm is pinned via the `packageManager` field)

> **Note:** pnpm 11 enforces a supply-chain policy (`minimumReleaseAge`) that refuses
> packages published within the last 24 hours. If `pnpm install --frozen-lockfile` fails with
> `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`, the lockfile has stale entries — regenerate it
> with `pnpm clean --lockfile && pnpm install` using the pinned pnpm version.

## Getting started

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Build all apps and packages
pnpm build

# Lint and type-check everything
pnpm lint
pnpm check-types

# Run unit tests
pnpm test

# Run end-to-end tests (builds the web app first)
pnpm test:e2e
```

The web app runs at [http://localhost:3000](http://localhost:3000).

## Testing

Unit tests use [Vitest](https://vitest.dev) with Testing Library and live next to the
code as `*.test.ts(x)` files (for example `packages/ui/src/components/ui/button.test.tsx`,
`packages/validators/src/schemas/contact.test.ts`, `apps/web/lib/contact.test.ts`).

```bash
pnpm test            # run all unit tests once
pnpm test:coverage   # run with coverage (packages/ui)
```

End-to-end tests use [Playwright](https://playwright.dev) and live in `apps/web/e2e`.
The first run needs a browser:

```bash
pnpm --filter web exec playwright install chromium
pnpm test:e2e
```

## Version catalog

Shared dependency versions are declared once in the `catalog` section of
`pnpm-workspace.yaml`. Packages reference them with `catalog:` so versions stay in sync:

```json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

## Git hooks

[Husky](https://typicode.github.io/husky) installs hooks on `pnpm install`:

- **pre-commit** – runs `lint-staged` (ESLint `--fix` + Prettier on staged files)
- **commit-msg** – validates messages with [Commitlint](https://commitlint.js.org)
  (Conventional Commits, e.g. `feat: add button component`)

## Continuous integration

Every push to `main` and every pull request runs the workflow in
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml) on GitHub Actions. It has two jobs:

- **Lint, types & tests** – `pnpm format:check`, `pnpm lint`, `pnpm check-types`,
  `pnpm test`, then `pnpm build`.
- **End-to-end tests** – installs Playwright's Chromium and runs `pnpm test:e2e`
  (the Playwright report is uploaded as a build artifact).

Dependencies are installed with `pnpm install --frozen-lockfile`, Node comes from `.nvmrc`,
and `.turbo` is cached between runs so repeated jobs reuse task results.

Run the same checks locally before pushing:

```bash
pnpm format:check && pnpm lint && pnpm check-types && pnpm test && pnpm build
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values. `.env*` files are ignored by Git
and picked up by Turborepo as task inputs.

Variables are validated at runtime with [`@repo/env`](./packages/env) (t3-env + Zod), so a
missing or malformed value fails fast with a clear error:

```ts
// apps/web/env.ts — server-only values
import { createServerEnv } from "@repo/env";

export const env = createServerEnv();

// apps/web/client-env.ts — NEXT_PUBLIC_* values, safe for the browser bundle
import { createClientEnv } from "@repo/env";

export const clientEnv = createClientEnv({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
});
```

The client values live in their own module (`apps/web/client-env.ts`) so client
components only bundle the `NEXT_PUBLIC_*` schema — importing `@/env` would pull
the server schema into the browser.

Add new variables to the schemas in `packages/env/src/core.ts`. Server variables stay on
the server; only `NEXT_PUBLIC_*` values reach the browser.

## Validators

[`@repo/validators`](./packages/validators) holds shared [Zod](https://zod.dev) schemas so
the same rules apply on the client, in route handlers, and in server actions:

```ts
import { contactFormSchema } from "@repo/validators";

const parsed = contactFormSchema.safeParse(input);
if (!parsed.success) {
  // parsed.error.issues -> field-level errors
}
```

See `apps/web/app/api/contact/route.ts` and `apps/web/lib/contact.ts` for a working example.

## Data layer

[`@repo/db`](./packages/db) wraps [Drizzle ORM](https://orm.drizzle.team) and
[postgres.js](https://github.com/porsager/postgres) for PostgreSQL. Schema lives in
`packages/db/src/schema`, repositories in `packages/db/src/repositories`, and generated SQL
migrations in `packages/db/drizzle`.

Set `DATABASE_URL` in `.env` to enable persistence. It is optional: without it the app
validates submissions but skips writes, so the starter kit runs with no database at all.

```bash
# Apply the committed migrations to the database in DATABASE_URL
pnpm --filter @repo/db db:migrate

# After editing a schema file, generate a new migration
pnpm --filter @repo/db db:generate
```

Query through a repository rather than the raw client:

```ts
import { createContactRepository } from "@repo/db";

const repo = createContactRepository(db);
await repo.create({ name, email, message });
```

Tests run against [PGlite](https://pglite.dev), an in-process Postgres, so the real schema
and SQL are exercised without a server. `createTestDb()` from `@repo/db/testing` applies the
migrations and returns a ready-to-use database.

## App structure and UX

The web app is organised into two route groups so marketing pages and product pages can
evolve independently:

```
apps/web/app
├── (marketing)      # public site: site header + footer
│   ├── page.tsx     # landing page (with the contact form)
│   ├── about/
│   └── loading.tsx
├── (app)            # product shell: sidebar + top bar (auth-protected)
│   ├── dashboard/
│   ├── messages/
│   ├── components/  # live component library tour
│   └── settings/
├── login/           # admin sign-in
├── api/contact/     # route handler
├── api/health/      # liveness/readiness probe
├── error.tsx        # route error boundary
├── global-error.tsx # root error boundary
├── not-found.tsx    # 404 page
├── sitemap.ts       # /sitemap.xml
├── robots.ts        # /robots.txt
├── manifest.ts      # /manifest.webmanifest
└── opengraph-image.tsx
```

Route groups (`(marketing)`, `(app)`) do not affect the URL — `/dashboard` still maps to
`app/(app)/dashboard/page.tsx`. Shared layout pieces live in `apps/web/components`
(`site-header`, `site-footer`, `app-nav`, `app-mobile-nav`, `contact-form`) and site-wide
metadata in `apps/web/lib/site.ts`.

Forms show feedback with [Sonner](https://sonner.emilkowal.dev) toasts. The `<Toaster />`
is mounted once in the root layout, so any client component can call `toast()`:

```tsx
import { toast } from "sonner";

toast.success("Message sent");
```

## Authentication

The app section (`/dashboard`, `/messages`, `/settings`) can be protected with a
single-admin login. Authentication is **opt-in**: it turns on only when
`SESSION_SECRET`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` are all set.

```bash
SESSION_SECRET=$(openssl rand -base64 48)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

When configured, unauthenticated visitors are redirected to `/login` by
`apps/web/proxy.ts` (Next.js 16's Proxy, the renamed middleware) and again by the
`(app)` layout, which performs the authoritative server-side check. Sessions are
signed, `HttpOnly` cookies verified with an HMAC (`apps/web/lib/session.ts`).
Leave the variables unset and the app stays open — convenient for local
development and CI.

## Abuse protection

`POST /api/contact` and the contact server action share a fixed-window rate limit
per client IP (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`). Login attempts have
their own, stricter limit (`LOGIN_RATE_LIMIT_MAX`, `LOGIN_RATE_LIMIT_WINDOW_MS`).
To require a CAPTCHA, set `TURNSTILE_SECRET_KEY` and
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`; the form then renders a Cloudflare Turnstile
widget and the server verifies the token. The in-process limiter protects a
single instance — behind multiple instances add a shared limit at the edge as
well.

## Health & observability

`GET /api/health` returns `200` with the database status (`ok`,
`not-configured`, or `degraded`) for liveness/readiness probes.
`apps/web/instrumentation.ts` logs structured server errors via Next.js's
`onRequestError` hook; wire it to your monitoring provider before shipping.

## SEO

Metadata is defined in `apps/web/app/layout.tsx` (title template, Open Graph, Twitter card)
and per page. `sitemap.ts`, `robots.ts`, `manifest.ts` and `opengraph-image.tsx` are
generated by Next.js conventions, so there is no static file to keep in sync.

> **Note:** React and React DOM are pinned with an `overrides` entry in `pnpm-workspace.yaml`.
> Without it, transitive dependencies (such as `@floating-ui/react-dom` via `radix-ui`) can
> resolve a different React copy than the app, which silently breaks components that rely on
> shared React context or module state (for example Sonner toasts). Keep the override in sync
> with the versions in the catalog.

## Working with shadcn/ui

All UI components live in `packages/ui/src/components/ui` and are shared across apps. The
shadcn CLI is configured in both `packages/ui/components.json` (source of truth) and
`apps/web/components.json`.

To add a new component:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

If the registry writes a bare `from "cn"` import, point it at the workspace helper:

```ts
import { cn } from "@repo/ui/lib/utils";
```

Import components in an app using the workspace alias:

```tsx
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
```

The web app ships a live tour of the library at `/components`, and
[`docs/components.md`](./docs/components.md) lists every component with its
import path.

## Releases

The project uses [Changesets](https://github.com/changesets/changesets). Record
a change with:

```bash
pnpm changeset        # describe the change, pick a bump
```

`.github/workflows/release.yml` opens a "Version Packages" pull request that
consumes the pending changesets and updates the changelogs. Merging it publishes
the packages (set `NPM_TOKEN` to publish to a registry).

## Deployment

`apps/web/vercel.json` configures the web app for [Vercel](https://vercel.com):

- **Root directory:** `apps/web`
- **Install command:** `cd ../.. && pnpm install --frozen-lockfile`
- **Build command:** `cd ../.. && pnpm turbo run build --filter=web && pnpm --filter @repo/db db:migrate:deploy`

The build command applies the committed Drizzle migrations before the app is
released, so a fresh deployment creates the schema. `db:migrate:deploy` skips
cleanly when `DATABASE_URL` is unset and only runs on Vercel **production**
deployments (`VERCEL_ENV`), so preview builds never touch the production schema.

Set the environment variables from `.env.example` in the project settings.
The repository is also configured for [Renovate](./renovate.json), which opens
grouped dependency-update pull requests on a weekly schedule.

## Tailwind CSS

The Tailwind theme (CSS variables, dark mode, base styles) is defined once in
`packages/ui/src/styles/globals.css` and imported by each app:

```css
/* apps/web/app/globals.css */
@import "@repo/ui/globals.css";
```

The `@source` directives in that file tell Tailwind to scan the monorepo so classes used
in any app or package are included in the generated CSS.

## Useful commands

Run a command for a single workspace with a filter:

```bash
pnpm --filter web dev
pnpm --filter @repo/ui check-types
```

## Adding a new app

```bash
cd apps
pnpm dlx create-next-app@latest <app-name>
```

Then add `@repo/ui`, `@repo/eslint-config`, and `@repo/typescript-config` as workspace
dependencies and reuse the shared Tailwind setup as shown in `apps/web`.

## License

[MIT](./LICENSE)
