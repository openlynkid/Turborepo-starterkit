/**
 * Single source of truth for site-wide metadata. Referenced by the root
 * layout, `sitemap.ts`, `robots.ts` and the Open Graph image.
 */
export const site = {
  name: "Turborepo Starter Kit",
  title: "Turborepo Starter Kit",
  description:
    "A production-ready Turborepo starter kit built with pnpm, Next.js App Router, Tailwind CSS v4 and shadcn/ui.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  locale: "en_US",
} as const;

export type NavItem = {
  title: string;
  href: string;
};

export const marketingNav: NavItem[] = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/#contact" },
];

export const appNav: NavItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Messages", href: "/messages" },
  { title: "Settings", href: "/settings" },
];
