import type { Metadata } from "next";

import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "What the Turborepo starter kit includes and how the monorepo is organised.",
};

const stack = [
  { name: "Turborepo", detail: "Task pipeline, remote-cache ready" },
  { name: "pnpm workspaces", detail: "Version catalog + strict isolation" },
  {
    name: "Next.js App Router",
    detail: "React Server Components, route groups",
  },
  { name: "Tailwind CSS v4", detail: "CSS-first configuration" },
  { name: "shadcn/ui", detail: "Shared component package" },
  { name: "Drizzle ORM", detail: "Postgres schema, migrations, repositories" },
  { name: "Vitest + Playwright", detail: "Unit and end-to-end tests" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <Badge variant="secondary">About</Badge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
        A monorepo starter kit that is ready for production
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Everything is wired together: shared configuration, typed environment
        variables, a Postgres data layer, and CI that runs lint, types, tests
        and end-to-end checks on every push.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((item) => (
          <Card key={item.name}>
            <CardHeader>
              <CardTitle className="text-base">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {item.detail}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
