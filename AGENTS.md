<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Project: Adaptive Icon Generator

Single-page, client-side-only PWA. User uploads an image, positions it on a canvas, picks background, adjusts monochrome threshold, exports a ZIP with Android `res/` structure and/or iOS `AppIcon.appiconset`.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Static export → out/
npm run lint         # ESLint
```

## Stack

- Next.js 16 (App Router, `output: 'export'` — static only, NO server)
- React 19, TypeScript 5
- Tailwind CSS v4 (CSS-based config in `globals.css`, NOT `tailwind.config.ts`)
- shadcn/ui (base-ui primitives) — all UI components
- framer-motion — required by itshover animated icons
- JSZip — client-side ZIP generation
- Canvas API — all image processing is browser-native

## Critical Constraints

- **No server code.** `next.config.ts` has `output: 'export'`. No API routes, no server actions.
- **No `next/image` optimization.** Static export requires `images: { unoptimized: true }`.
- **All image processing uses browser Canvas API.** Never import Sharp, Jimp, or Node image libs.
- **Single page.** Only `src/app/page.tsx` — no additional routes.
- **itshover icons use default exports.** Import as `import IconName from "@/components/ui/icon-name"`, NOT named exports.
- **shadcn Slider uses base-ui.** `onValueChange` receives `number | readonly number[]`, not `number[]`. Always handle both: `(v) => handler(Array.isArray(v) ? v[0] : v)`.
- **Viewport/themeColor must use `export const viewport: Viewport`**, not inside `metadata`. Next.js 16 enforces this split.

## File Layout

```
src/app/page.tsx                 ← Entire app (single page)
src/app/layout.tsx               ← Root layout, dark theme, SW registration
src/app/globals.css              ← Tailwind v4 + shadcn theme variables
src/components/ui/               ← shadcn + itshover (auto-generated, avoid hand-editing)
src/components/*.tsx             ← App components (ImageUploader, CanvasEditor, etc.)
src/lib/canvas/                  ← renderer, monochrome, masks, resize
src/lib/export/                  ← zip-builder, android-structure, ios-structure
src/lib/constants.ts             ← Density sizes, iOS sizes, safe zone ratios, color presets
src/hooks/                       ← useCanvasEditor, useImageLoader
src/types/index.ts               ← Shared TypeScript types
public/sw.js                     ← Service worker (cache-first)
public/manifest.json             ← PWA manifest
```

## Export Behavior (3 buttons)

| Button | Output |
|--------|--------|
| Download Android | ZIP: `res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/` with fg/bg/mono PNGs + XML |
| Download iOS | ZIP: `AppIcon.appiconset/` with 1024px + common sizes + Contents.json |
| Download Both | Single ZIP with `android/` and `ios/` subdirectories |

## Android Density Buckets

mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432 (all in px).

## Gotchas

- Tailwind v4: theme lives in CSS (`@theme inline` block), not a JS config file.
- `framer-motion` is a peer dep of itshover icons — must be installed explicitly.
- Canvas `toBlob`/`toDataURL` requires CORS for external images (not an issue here — all user-uploaded via File API).
- The `out/` directory is the build output for static hosting (GitHub Pages, Netlify, Vercel static).
