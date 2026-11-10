import { ArrowRight, Boxes, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { ContactForm } from "@/components/contact-form";

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
    <>
      <section className="relative mx-auto max-w-5xl px-4">
        <div
          aria-hidden
          className="obsidia-glow-radial -top-10 left-1/2 h-72 w-72 -translate-x-1/2"
        />
        <div className="relative flex flex-col items-start gap-6 py-20 sm:py-28">
          <span className="obsidia-pill">pnpm + Next.js + shadcn/ui</span>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
            Build faster with a modern monorepo starter kit
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A production-ready Turborepo setup with a shared UI package,
            Tailwind CSS v4, and shadcn/ui components wired up out of the box.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Open the dashboard
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/about">Learn more</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className="obsidia-glass obsidia-glass-hover"
          >
            <CardHeader>
              <feature.icon className="mb-2 size-6 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Edit{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                apps/web/app/(marketing)/page.tsx
              </code>{" "}
              to get started.
            </CardContent>
          </Card>
        ))}
      </section>

      <section
        id="contact"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pb-24"
      >
        <Card>
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
            <CardDescription>
              Send a message — it is validated with Zod and stored in Postgres
              when a database is configured.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-w-lg">
            <ContactForm />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
