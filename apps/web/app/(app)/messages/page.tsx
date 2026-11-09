import type { Metadata } from "next";

import { Badge } from "@repo/ui/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { ContactForm } from "@/components/contact-form";
import { getContactRepository } from "@/lib/db";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = {
  title: "Messages",
  description: "All messages captured by the contact form.",
};

// Always read the current database state instead of a build-time snapshot.
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const repository = getContactRepository();
  const messages = repository ? await repository.list(50) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Submissions stored through the contact repository.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stored messages</CardTitle>
          <CardDescription>
            {repository
              ? `${messages.length} message(s) in the database.`
              : "No database configured — nothing is persisted yet."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No messages to show. Use the form below to add one.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b text-xs text-muted-foreground uppercase">
                  <tr>
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Email</th>
                    <th className="py-2 pr-4 font-medium">Message</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((message) => (
                    <tr key={message.id} className="border-b last:border-0">
                      <td className="py-3 pr-4 font-medium">{message.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {message.email}
                      </td>
                      <td className="max-w-xs truncate py-3 pr-4">
                        {message.message}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary">{message.status}</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Add a message</CardTitle>
          <CardDescription>
            The same action used by the marketing site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  );
}
