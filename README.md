# Turborepo Starter Kit

A modern, production-ready monorepo starter kit built with **Turborepo**, **pnpm workspaces**, **Next.js**, **Tailwind CSS v4**, and **shadcn/ui**.

## What's inside

This monorepo is managed by [Turborepo](https://turborepo.dev) and [pnpm workspaces](https://pnpm.io/workspaces).

### Apps and packages

- `apps/web` – [Next.js](https://nextjs.org) app (App Router, React 19, Tailwind CSS v4)
- `packages/ui` – shared React component library with [shadcn/ui](https://ui.shadcn.com) components and Tailwind theme
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
- **Playwright** – end-to-end tests

## Requirements

- Node.js >= 24
- pnpm >= 9 (`corepack enable` or `npm i -g pnpm`)

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
code as `*.test.ts(x)` files (for example `packages/ui/src/components/ui/button.test.tsx`).

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

## Environment variables

Copy `.env.example` to `.env` and fill in the values. `.env*` files are ignored by Git
and picked up by Turborepo as task inputs.

## Working with shadcn/ui

All UI components live in `packages/ui/src/components/ui` and are shared across apps. The
shadcn CLI is configured in both `packages/ui/components.json` (source of truth) and
`apps/web/components.json`.

To add a new component:

```bash
cd packages/ui
pnpm dlx shadcn@latest add <component>
```

Import components in an app using the workspace alias:

```tsx
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
```

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
