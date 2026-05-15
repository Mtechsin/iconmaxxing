import type { EditorState } from "@/types";
import { renderForExport } from "./renderer";

/**
 * Generate a monochrome (silhouette) version of the foreground.
 * Pixels above the luminance threshold become white, below become black (or inverted).
 */
export function renderMonochrome(
  size: number,
  sourceImage: HTMLImageElement | null,
  editor: EditorState,
  threshold: number,
  invert: boolean
): HTMLCanvasElement {
  // First render the foreground only
  const fgCanvas = renderForExport(size, sourceImage, "#000000", null, editor, "foreground");
  const fgCtx = fgCanvas.getContext("2d")!;
  const imageData = fgCtx.getImageData(0, 0, size, size);
  const data = imageData.data;

  // Create output canvas
  const outCanvas = document.createElement("canvas");
  outCanvas.width = size;
  outCanvas.height = size;
  const outCtx = outCanvas.getContext("2d")!;
  const outData = outCtx.createImageData(size, size);
  const out = outData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Calculate luminance
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    // If pixel is transparent, keep it transparent
    if (a < 10) {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 0;
      continue;
    }

    // Apply threshold
    const isLight = luminance >= threshold;
    const fillWhite = invert ? !isLight : isLight;

    if (fillWhite) {
      out[i] = 255;
      out[i + 1] = 255;
      out[i + 2] = 255;
      out[i + 3] = 255;
    } else {
      out[i] = 0;
      out[i + 1] = 0;
      out[i + 2] = 0;
      out[i + 3] = 255;
    }
  }

  outCtx.putImageData(outData, 0, 0);
  return outCanvas;
}
