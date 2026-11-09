import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

import { LoginForm } from "@/components/login-form";
import {
  isAuthEnabled,
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the application dashboard.",
};

export default async function LoginPage() {
  const store = await cookies();
  if (verifySessionToken(store.get(SESSION_COOKIE)?.value)) {
    redirect("/dashboard");
  }

  const authEnabled = isAuthEnabled();

  return (
    <div className="flex min-h-svh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            {authEnabled
              ? "Enter the admin credentials to continue."
              : "Authentication is not configured on this deployment."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authEnabled ? (
            <LoginForm />
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Set <code className="font-mono">SESSION_SECRET</code>,{" "}
                <code className="font-mono">ADMIN_EMAIL</code> and{" "}
                <code className="font-mono">ADMIN_PASSWORD</code> to require a
                login for the app section.
              </p>
              <Button asChild className="w-full">
                <Link href="/dashboard">Continue without auth</Link>
              </Button>
            </>
          )}
          <p className="text-center text-sm">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground"
            >
              Back to site
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
