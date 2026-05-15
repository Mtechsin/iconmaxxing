import JSZip from "jszip";
import type { EditorState } from "@/types";
import type { ExportTarget } from "@/types";
import { ANDROID_DENSITIES, IOS_SIZES } from "@/lib/constants";
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
  const { sourceImage, backgroundColor, backgroundImage, editor, monochromeThreshold, monochromeInvert } = options;

  // Render at max size (432 = xxxhdpi) then resize down
  const fgFull = renderForExport(432, sourceImage, backgroundColor, backgroundImage, editor, "foreground");
  const bgFull = renderForExport(432, sourceImage, backgroundColor, backgroundImage, editor, "background");
  const monoFull = renderMonochrome(432, sourceImage, editor, monochromeThreshold, monochromeInvert);

  for (const { name, size } of ANDROID_DENSITIES) {
    const folder = zip.folder(`res/mipmap-${name}`)!;

    const fgResized = resizeCanvas(fgFull, size);
    const bgResized = resizeCanvas(bgFull, size);
    const monoResized = resizeCanvas(monoFull, size);

    const [fgBlob, bgBlob, monoBlob] = await Promise.all([
      canvasToBlob(fgResized),
      canvasToBlob(bgResized),
      canvasToBlob(monoResized),
    ]);

    folder.file("ic_launcher_foreground.png", fgBlob);
    folder.file("ic_launcher_background.png", bgBlob);
    folder.file("ic_launcher_monochrome.png", monoBlob);
  }

  // XML files
  const anydpiFolder = zip.folder("res/mipmap-anydpi-v26")!;
  anydpiFolder.file("ic_launcher.xml", generateAdaptiveIconXml());
  anydpiFolder.file("ic_launcher_round.xml", generateRoundIconXml());
}

async function buildIOSZip(zip: JSZip, options: ExportOptions) {
  const { sourceImage, backgroundColor, backgroundImage, editor } = options;

  const iconsetFolder = zip.folder("AppIcon.appiconset")!;

  // Render composite at 1024 then apply iOS mask and resize
  const compositeFull = renderForExport(1024, sourceImage, backgroundColor, backgroundImage, editor, "composite");

  for (const size of IOS_SIZES) {
    const resized = resizeCanvas(compositeFull, size);
    const masked = applyIOSMask(resized, size);
    const blob = await canvasToBlob(masked);
    iconsetFolder.file(`icon_${size}x${size}.png`, blob);
  }

  // Contents.json
  iconsetFolder.file("Contents.json", generateFullContentsJson());
}
