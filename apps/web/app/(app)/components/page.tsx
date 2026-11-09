import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { UiShowcase } from "@/components/ui-showcase";

export const metadata: Metadata = {
  title: "Components",
  description: "A live tour of the shared shadcn/ui component library.",
};

export default function ComponentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Components</h1>
        <p className="text-sm text-muted-foreground">
          Every primitive below is imported from{" "}
          <code className="font-mono">@repo/ui</code> and shared across apps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Component library</CardTitle>
          <CardDescription>
            Tabs, tables, forms, overlays and feedback primitives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UiShowcase />
        </CardContent>
      </Card>
    </div>
  );
}
