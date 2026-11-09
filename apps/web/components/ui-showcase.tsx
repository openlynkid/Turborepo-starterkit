"use client";

import * as React from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import { Progress } from "@repo/ui/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Separator } from "@repo/ui/components/ui/separator";
import { Switch } from "@repo/ui/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

const invoices = [
  { id: "INV-001", status: "Paid", amount: "$250.00" },
  { id: "INV-002", status: "Pending", amount: "$150.00" },
  { id: "INV-003", status: "Overdue", amount: "$350.00" },
];

const faqs = [
  {
    question: "Where do the components live?",
    answer:
      "Every component lives in packages/ui/src/components/ui and is shared through @repo/ui.",
  },
  {
    question: "How do I add another one?",
    answer:
      'Run `cd packages/ui && pnpm dlx shadcn@latest add <name>` and normalize any `from "cn"` import.',
  },
];

export function UiShowcase() {
  const [notifications, setNotifications] = React.useState(true);
  const [progress, setProgress] = React.useState(35);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Alert>
            <Info />
            <AlertTitle>Component showcase</AlertTitle>
            <AlertDescription>
              These primitives ship with the starter kit and can be imported
              from <code className="font-mono">@repo/ui</code>.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Storage used</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setProgress((p) => Math.min(100, p + 10))}
              >
                Add 10%
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setProgress((p) => Math.max(0, p - 10))}
              >
                Remove 10%
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "Paid" ? "secondary" : "outline"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invoice.amount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive an email for every new message.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-start gap-3">
            <Checkbox id="terms" defaultChecked />
            <div className="grid gap-1">
              <Label htmlFor="terms">Accept terms</Label>
              <p className="text-sm text-muted-foreground">
                Required before publishing changes.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid max-w-xs gap-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select defaultValue="utc">
              <SelectTrigger id="timezone" className="w-full">
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="asia-jakarta">Asia/Jakarta</SelectItem>
                <SelectItem value="america-new-york">
                  America/New York
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => toast.success("Saved")}>
            Show toast
          </Button>
          <Button size="sm" variant="secondary">
            Secondary
          </Button>
          <Button size="sm" variant="outline">
            Outline
          </Button>
          <Button size="sm" variant="ghost">
            Ghost
          </Button>
          <Button size="sm" variant="destructive">
            Destructive
          </Button>
        </div>

        <Accordion type="single" collapsible className="max-w-xl">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
