# IconMaxxing

Generate production-ready **Android adaptive icons** and **iOS app icons** from any image — entirely in the browser. No uploads, no servers, no accounts.

![CI](https://github.com/YOUR_USERNAME/iconmaxxing/actions/workflows/ci.yml/badge.svg)

**[Live Demo](https://iconizer.amadoson3001.workers.dev)** — try it now, no install needed.

---

## Showcase

| Feature | Preview |
|---------|---------|
| Upload any image | ![Upload](assets/Screenshots/upload.png) |
| Canvas editor with drag & zoom | ![Editor](assets/Screenshots/editor.png) |
| Background picker & color presets | ![Background](assets/Screenshots/background.png) |
| Monochrome threshold control | ![Monochrome](assets/Screenshots/monochrome.png) |
| Live mask previews (circle, squircle, iOS) | ![Masks](assets/Screenshots/masks.png) |
| Device mockups (Pixel & iPhone) | ![Mockups](assets/Screenshots/mockups.png) |
| Export Android & iOS ZIPs | ![Export](assets/Screenshots/export.png) |

<details>
<summary><strong>Full Preview — Upload to Final Icon</strong></summary>

**Step 1: Upload your image**

![Upload](assets/Screenshots/upload.png)

**Step 2: Edit, position, and export**

![Website](assets/Screenshots/website.png)

</details>

---

## Features

- **Android adaptive icons** — exports foreground, background, and monochrome layers across all density buckets (mdpi → xxxhdpi) with correct XML files
- **iOS app icons** — exports all required sizes with a valid `Contents.json` for Xcode
- **Download both** — single ZIP with `android/` and `ios/` subdirectories
- **Canvas editor** — drag to reposition, scroll/pinch to zoom, 1:1 cursor tracking
- **Background picker** — solid color, hex input, 12 presets, or upload a background image
- **Monochrome layer** — adjustable luminance threshold + invert for Android 13+ themed icons
- **Live previews** — circle, squircle, rounded-square, and iOS mask shapes
- **Device mockups** — Pixel and iPhone home screen previews
- **PWA** — installable, works fully offline after first load
- **Privacy-first** — all processing is client-side; nothing leaves your device

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, static export) |
| UI | React 19, TypeScript 5, Tailwind CSS v4 |
| Components | shadcn/ui (base-ui primitives) |
| Animations | framer-motion |
| Image processing | Browser Canvas API |
| ZIP generation | JSZip |
| Hosting | Cloudflare Pages |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Local Development

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/iconmaxxing.git
cd iconmaxxing

# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
# Production build → out/
npm run build

# Lint
npm run lint
```

The build output is a fully static site in `out/` — no Node.js server required.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Entire app (single page)
│   ├── layout.tsx            # Root layout, dark theme, SW registration
│   └── globals.css           # Tailwind v4 theme variables
├── components/
│   ├── CanvasEditor.tsx      # Interactive canvas (drag/zoom)
│   ├── BackgroundPicker.tsx  # Color + image background
│   ├── MonochromeControls.tsx# Threshold slider + invert
│   ├── MaskPreview.tsx       # 4 mask shape previews
│   ├── DeviceMockup.tsx      # Pixel + iPhone previews
│   ├── ExportPanel.tsx       # Download buttons
│   ├── MobileControlsDrawer.tsx # Bottom sheet for mobile
│   ├── UpdateBanner.tsx      # Non-blocking PWA update notification
│   └── ui/                   # shadcn + animated icons
├── hooks/
│   ├── useCanvasEditor.ts    # Pan/zoom state + mouse/touch handlers
│   └── useImageLoader.ts     # File → HTMLImageElement with validation
├── lib/
│   ├── canvas/
│   │   ├── renderer.ts       # Composite + export rendering
│   │   ├── monochrome.ts     # Luminance threshold → B&W silhouette
│   │   ├── masks.ts          # Circle, squircle, rounded-square, iOS masks
│   │   └── resize.ts         # Progressive high-quality downsampling
│   ├── export/
│   │   ├── zip-builder.ts    # ZIP orchestration + download trigger
│   │   ├── android-structure.ts # XML templates + folder paths
│   │   └── ios-structure.ts  # Contents.json generation
│   └── constants.ts          # Density sizes, iOS sizes, color presets
└── types/
    └── index.ts              # EditorState, IconProject, ExportTarget
```

---

## Export Output

### Android ZIP
```
res/
├── mipmap-mdpi/
│   ├── ic_launcher_foreground.png   (108×108)
│   ├── ic_launcher_background.png   (108×108)
│   └── ic_launcher_monochrome.png   (108×108)
├── mipmap-hdpi/        (162×162)
├── mipmap-xhdpi/       (216×216)
├── mipmap-xxhdpi/      (324×324)
├── mipmap-xxxhdpi/     (432×432)
└── mipmap-anydpi-v26/
    ├── ic_launcher.xml
    └── ic_launcher_round.xml
```

### iOS ZIP
```
AppIcon.appiconset/
├── icon_1024x1024.png
├── icon_180x180.png
├── icon_167x167.png
├── ... (13 sizes total)
└── Contents.json
```

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full Cloudflare Pages setup instructions.

**Quick summary:**
- Build command: `npm run build`
- Output directory: `out`
- Node.js version: 20
- Security headers are pre-configured in `public/_headers`

---

## Browser Support

Any modern browser with Canvas API support. Tested on:
- Chrome 120+
- Firefox 121+
- Safari 17+
- Edge 120+

---

## License

MIT
