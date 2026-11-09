"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";

import { submitContactAction } from "@/lib/actions";

type Errors = Record<string, string[]>;

export function ContactForm() {
  const [pending, setPending] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setPending(true);
    setErrors({});

    try {
      const result = await submitContactAction(data);

      if (result.ok) {
        toast.success("Message sent", {
          description: "Thanks — we'll get back to you shortly.",
        });
        form.reset();
        return;
      }

      setErrors(result.errors);
      toast.error("Please fix the highlighted fields");
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" autoComplete="name" required />
        <FieldError messages={errors.name} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <FieldError messages={errors.email} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:opacity-50"
        />
        <FieldError messages={errors.message} />
      </div>

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) {
    return null;
  }
  return (
    <p role="alert" className="text-sm text-destructive">
      {messages[0]}
    </p>
  );
}
