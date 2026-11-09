import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ModeToggle } from "@repo/ui/components/mode-toggle";
import { Separator } from "@repo/ui/components/ui/separator";

import { env } from "@/env";

export const metadata: Metadata = {
  title: "Settings",
  description: "Workspace and environment settings.",
};

export default function SettingsPage() {
  const databaseConfigured = Boolean(env.DATABASE_URL);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          A small settings surface to show how a page reads validated env.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how the interface looks.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Theme</span>
          <ModeToggle />
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>
            Values are parsed at startup by <code>@repo/env</code>.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Row
            label="Database"
            value={databaseConfigured ? "configured" : "not configured"}
          />
          <Separator />
          <Row label="Node environment" value={env.NODE_ENV ?? "unknown"} />
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
