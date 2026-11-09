"use client";

import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  SwatchBook,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@repo/ui/lib/utils";

import { appNav } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/messages": MessageSquare,
  "/components": SwatchBook,
  "/settings": Settings,
};

export function AppNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-2">
      {appNav.map((item) => {
        const Icon = icons[item.href] ?? LayoutDashboard;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
