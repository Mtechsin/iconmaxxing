import JSZip from "jszip";
import type { EditorState } from "@/types";
import type { ExportTarget } from "@/types";
import { ANDROID_DENSITIES, IOS_ICON_ENTRIES } from "@/lib/constants";
import { renderForExport } from "@/lib/canvas/renderer";
import { renderMonochrome } from "@/lib/canvas/monochrome";
import { applyIOSMask } from "@/lib/canvas/masks";
import { resizeCanvas, canvasToBlob } from "@/lib/canvas/resize";
import {
  generateAdaptiveIconXml,
  generateRoundIconXml,
} from "./android-structure";
import { generateFullContentsJson } from "./ios-structure";

interface ExportOptions {
  sourceImage: HTMLImageElement;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
  monochromeThreshold: number;
  monochromeInvert: boolean;
  target: ExportTarget;
}

/**
 * Build and download the ZIP file for the selected target(s).
 */
export async function buildAndDownloadZip(options: ExportOptions): Promise<void> {
  const zip = new JSZip();
  const { target } = options;

  const prefix = target === "both";

  if (target === "android" || target === "both") {
    const folder = prefix ? zip.folder("android")! : zip;
    await buildAndroidZip(folder, options);
  }

  if (target === "ios" || target === "both") {
    const folder = prefix ? zip.folder("ios")! : zip;
    await buildIOSZip(folder, options);
  }

  // Generate and download
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;

  const names: Record<ExportTarget, string> = {
    android: "android-adaptive-icons.zip",
    ios: "ios-app-icons.zip",
    both: "app-icons.zip",
  };
  a.download = names[target];
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function buildAndroidZip(zip: JSZip, options: ExportOptions) {
  const {
    sourceImage,
    backgroundColor,
    backgroundImage,
    editor,
    monochromeThreshold,
    monochromeInvert,
  } = options;

  let fgFull: HTMLCanvasElement | null = null;
  let bgFull: HTMLCanvasElement | null = null;
  let monoFull: HTMLCanvasElement | null = null;

  try {
    // Render at max size (432 = xxxhdpi) then resize down
    fgFull = renderForExport(432, sourceImage, backgroundColor, backgroundImage, editor, "foreground");
    bgFull = renderForExport(
      432,
      sourceImage,
      backgroundColor,
      backgroundImage,
      { offsetX: 0, offsetY: 0, scale: 1 },
      "background"
    );
    monoFull = renderMonochrome(432, sourceImage, editor, monochromeThreshold, monochromeInvert);
  } catch (error) {
    throw new Error(`Failed to create Android source canvases: ${getErrorMessage(error)}. Try closing other apps to free memory.`);
  }

  // Process each density sequentially to minimize memory usage
  for (const { name, size } of ANDROID_DENSITIES) {
    const folder = zip.folder(`res/mipmap-${name}`)!;

    let fgResized: HTMLCanvasElement | null = null;
    let bgResized: HTMLCanvasElement | null = null;
    let monoResized: HTMLCanvasElement | null = null;

    try {
      fgResized = resizeCanvas(fgFull, size);
      bgResized = resizeCanvas(bgFull, size);
      monoResized = resizeCanvas(monoFull, size);

      const [fgBlob, bgBlob, monoBlob] = await Promise.all([
        canvasToBlob(fgResized),
        canvasToBlob(bgResized),
        canvasToBlob(monoResized),
      ]);

      folder.file("ic_launcher_foreground.png", fgBlob);
      folder.file("ic_launcher_background.png", bgBlob);
      folder.file("ic_launcher_monochrome.png", monoBlob);
    } catch (error) {
      throw new Error(`Failed to render Android ${name} icons: ${getErrorMessage(error)}. Try closing other apps to free memory.`);
    } finally {
      // Explicitly release canvas references for garbage collection
      fgResized = null;
      bgResized = null;
      monoResized = null;
    }
  }

  // Release source canvases
  fgFull = null;
  bgFull = null;
  monoFull = null;

  // XML files
  const anydpiFolder = zip.folder("res/mipmap-anydpi-v26")!;
  anydpiFolder.file("ic_launcher.xml", generateAdaptiveIconXml());
  anydpiFolder.file("ic_launcher_round.xml", generateRoundIconXml());
}

async function buildIOSZip(zip: JSZip, options: ExportOptions) {
  const { sourceImage, backgroundColor, backgroundImage, editor } = options;

  const iconsetFolder = zip.folder("AppIcon.appiconset")!;

  let compositeFull: HTMLCanvasElement | null = null;
  let maskedFull: HTMLCanvasElement | null = null;

  try {
    // Render composite at 1024 then apply iOS mask
    compositeFull = renderForExport(1024, sourceImage, backgroundColor, backgroundImage, editor, "composite");
    maskedFull = applyIOSMask(compositeFull, 1024);
  } catch (error) {
    throw new Error(`Failed to create iOS source canvas: ${getErrorMessage(error)}. Try closing other apps to free memory.`);
  } finally {
    // Release composite canvas immediately after masking
    compositeFull = null;
  }

  // Process each iOS size sequentially to minimize memory usage
  for (const entry of IOS_ICON_ENTRIES) {
    const size = entry.pixelSize;
    let resized: HTMLCanvasElement | null = null;

    try {
      resized = resizeCanvas(maskedFull, size);
      const blob = await canvasToBlob(resized);
      iconsetFolder.file(`icon_${size}x${size}.png`, blob);
    } catch (error) {
      throw new Error(`Failed to render iOS ${size}x${size} icon: ${getErrorMessage(error)}. Try closing other apps to free memory.`);
    } finally {
      // Release resized canvas immediately
      resized = null;
    }
  }

  // Release masked canvas
  maskedFull = null;

  // Contents.json
  iconsetFolder.file("Contents.json", generateFullContentsJson());
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
