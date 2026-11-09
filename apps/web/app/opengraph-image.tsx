import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #09090b 0%, #1e1b4b 100%)",
        color: "white",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 28,
          letterSpacing: 1,
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        <div style={{ width: 48, height: 4, background: "#818cf8" }} />
        Monorepo starter kit
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
          {site.title}
        </div>
        <div style={{ fontSize: 32, opacity: 0.8, maxWidth: 900 }}>
          Turborepo · pnpm · Next.js App Router · Tailwind v4 · shadcn/ui
        </div>
      </div>
    </div>,
    size,
  );
}
