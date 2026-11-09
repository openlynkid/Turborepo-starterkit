import { ArrowRight, Boxes, Sparkles, Zap } from "lucide-react";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ModeToggle } from "@repo/ui/components/mode-toggle";

const features = [
  {
    icon: Zap,
    title: "Turborepo",
    description:
      "High-performance build system with intelligent caching and task pipelines.",
  },
  {
    icon: Boxes,
    title: "pnpm workspaces",
    description:
      "Fast, disk-efficient package management with strict dependency isolation.",
  },
  {
    icon: Sparkles,
    title: "shadcn/ui",
    description:
      "Accessible, customizable components built on Radix UI and Tailwind CSS.",
  },
];

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="font-semibold tracking-tight">
            Turborepo Starter Kit
          </span>
          <ModeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4">
        <section className="flex flex-col items-start gap-6 py-20 sm:py-28">
          <Badge variant="secondary">pnpm + Next.js + shadcn/ui</Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Build faster with a modern monorepo starter kit
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A production-ready Turborepo setup with a shared UI package,
            Tailwind CSS v4, and shadcn/ui components wired up out of the box.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">
              Get started
              <ArrowRight />
            </Button>
            <Button size="lg" variant="outline">
              Read the docs
            </Button>
          </div>
        </section>

        <section className="grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-2 size-6 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Edit{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  apps/web/app/page.tsx
                </code>{" "}
                to get started.
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
