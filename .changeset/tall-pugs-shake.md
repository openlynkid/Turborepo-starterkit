---
"@repo/ui": patch
---

Replace the shared `globals.css` with the OpenLynk theme: new OKLCH palette and
dark tokens, `shadcn/tailwind.css` import (custom variants, `no-scrollbar`,
`scroll-fade`, `shimmer`), and a `--radius-*` scale. Adds the `shadcn` package as
the CSS source.

Adds the `obsidia-glass` / `obsidia-glass-hover` / `obsidia-pill` /
`obsidia-glow-radial` utilities, backed by `--obsidia-*` tokens so they adapt to
light and dark themes. Applied to the marketing hero and feature cards, the app
shell header/sidebar, and a new Surfaces section in the component showcase.
