import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { getContactRepository } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of the messages captured by the contact form.",
};

// Always read the current database state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const repository = getContactRepository();

  const messages = repository ? await repository.list(5) : [];
  const total = messages.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Recent activity from the contact form.
        </p>
      </div>

      {!repository ? (
        <Card>
          <CardHeader>
            <CardTitle>No database configured</CardTitle>
            <CardDescription>
              Set <code className="font-mono">DATABASE_URL</code> and run{" "}
              <code className="font-mono">
                pnpm --filter @repo/db db:migrate
              </code>{" "}
              to see live data here. The app works without a database — this
              page just stays empty.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/#contact">Try the contact form</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Recent messages" value={String(total)} />
            <StatCard
              label="Latest sender"
              value={messages[0]?.name ?? "—"}
              hint={messages[0] ? messages[0].email : undefined}
            />
            <StatCard
              label="Last received"
              value={messages[0] ? formatDateTime(messages[0].createdAt) : "—"}
            />
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Latest messages</CardTitle>
                <CardDescription>
                  The five most recent submissions.
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/messages">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet. Submit the contact form to see one here.
                </p>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-start justify-between gap-4 rounded-md border p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {message.name}{" "}
                        <span className="font-normal text-muted-foreground">
                          {message.email}
                        </span>
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {message.message}
                      </p>
                    </div>
                    <Badge variant="secondary">{message.status}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      {hint ? (
        <CardContent className="text-xs text-muted-foreground">
          {hint}
        </CardContent>
      ) : null}
    </Card>
  );
}
