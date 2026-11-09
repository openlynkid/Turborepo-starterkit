"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@repo/ui/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { contactFormSchema } from "@repo/validators";

import { submitContactAction } from "@/lib/actions";

type ContactFormValues = z.input<typeof contactFormSchema>;

const defaultValues: ContactFormValues = { name: "", email: "", message: "" };

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await submitContactAction(values);

    if (result.ok) {
      toast.success("Message sent", {
        description: "Thanks — we'll get back to you shortly.",
      });
      form.reset(defaultValues);
      return;
    }

    for (const [field, messages] of Object.entries(result.errors)) {
      form.setError(field as keyof ContactFormValues, {
        message: messages[0],
      });
    }
    toast.error("Please fix the highlighted fields");
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormDescription>
                At least 10 characters. Stored in Postgres when configured.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="justify-self-start"
        >
          {form.formState.isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
