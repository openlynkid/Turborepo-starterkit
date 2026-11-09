# Contributing

Thanks for taking the time to contribute. This document explains how to set up
the project, the conventions we follow, and how to get a change merged.

## Getting started

Requirements: Node.js >= 24 and pnpm 11 (`corepack enable`).

```bash
pnpm install
pnpm dev          # start all apps in watch mode
```

The web app is served at http://localhost:3000.

## Project layout

| Path                         | Purpose                                                   |
| ---------------------------- | --------------------------------------------------------- |
| `apps/web`                   | Next.js app (App Router, React 19, Tailwind CSS v4)       |
| `packages/ui`                | Shared shadcn/ui components, hooks and the Tailwind theme |
| `packages/db`                | Drizzle ORM schema, migrations and repositories           |
| `packages/env`               | Type-safe environment validation (t3-env + Zod)           |
| `packages/validators`        | Shared Zod schemas                                        |
| `packages/eslint-config`     | Shared ESLint presets                                     |
| `packages/typescript-config` | Shared `tsconfig.json` presets                            |

See [`docs/architecture.md`](./docs/architecture.md) for a deeper tour and
[`README.md`](./README.md) for the full feature list.

## Local checks

Run the same checks CI runs before opening a pull request:

```bash
pnpm format:check
pnpm lint
pnpm check-types
pnpm test
pnpm build
pnpm test:e2e
```

`pnpm test:e2e` builds the web app and drives it with Playwright, so it is the
slowest step. Install the browser once with:

```bash
pnpm --filter web exec playwright install chromium
```

## Commit conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org) and
enforces the format with Commitlint on the `commit-msg` hook:

```
feat(ui): add switch component
fix(web): prevent toast from unmounting
docs: describe the data layer
chore: bump turbo
```

Allowed types include `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
`test`, `build`, `ci`, `chore` and `revert`.

## Working with UI components

Components live in `packages/ui/src/components/ui` and are shared through
`@repo/ui`. Add a new one with the shadcn CLI:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

After the CLI runs, normalize the `cn` import so it points at the workspace
helper (the registry sometimes writes `from "cn"`):

```ts
import { cn } from "@repo/ui/lib/utils";
```

Then run `pnpm format` and `pnpm --filter @repo/ui check-types`.

## Adding dependencies

Declare the version once in the `catalog` section of `pnpm-workspace.yaml` and
reference it with `catalog:`:

```yaml
catalog:
  some-lib: ^1.2.3
```

```json
{ "dependencies": { "some-lib": "catalog:" } }
```

This keeps versions in sync across apps and packages. Do not pin React or React
DOM anywhere except the shared `overrides` entry — see the note in
`docs/architecture.md`.

## Database changes

Schema lives in `packages/db/src/schema`. After editing it, generate a
migration and commit the SQL:

```bash
pnpm --filter @repo/db db:generate
pnpm --filter @repo/db db:migrate
```

Tests run against an in-process Postgres (PGlite), so no server is required.

## Releases

The project uses [Changesets](https://github.com/changesets/changesets). Add a
changeset for any user-facing change:

```bash
pnpm changeset
```

The release workflow opens a "Version Packages" pull request that consumes the
pending changesets and updates the changelogs. Merging it publishes the
packages.
