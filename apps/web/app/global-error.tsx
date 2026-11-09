"use client";

import * as React from "react";

import { Button } from "@repo/ui/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-4 text-center font-sans">
          <h1 className="text-3xl font-bold tracking-tight">
            Application error
          </h1>
          <p className="max-w-md text-muted-foreground">
            The application failed to render. Reload the page to try again.
          </p>
          <Button onClick={reset}>Reload</Button>
        </div>
      </body>
    </html>
  );
}
