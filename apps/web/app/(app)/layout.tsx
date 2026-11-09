import Link from "next/link";

import { ModeToggle } from "@repo/ui/components/mode-toggle";
import { Separator } from "@repo/ui/components/ui/separator";

import { AppMobileNav } from "@/components/app-mobile-nav";
import { AppNav } from "@/components/app-nav";
import { site } from "@/lib/site";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl">
        <aside className="hidden w-64 shrink-0 flex-col border-r md:flex">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/" className="font-semibold tracking-tight">
              {site.name}
            </Link>
          </div>
          <div className="flex-1 py-2">
            <AppNav />
          </div>
          <Separator />
          <p className="p-4 text-xs text-muted-foreground">App shell</p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b px-4">
            <AppMobileNav />
            <Link href="/" className="font-semibold tracking-tight md:hidden">
              {site.name}
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/"
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline"
              >
                Back to site
              </Link>
              <ModeToggle />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
