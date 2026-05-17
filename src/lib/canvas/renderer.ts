import type { EditorState } from "@/types";
import { SAFE_ZONE_RATIO } from "@/lib/constants";
import { getContext2D } from "@/lib/utils";

/**
 * Render the composite icon (background + foreground) onto a canvas.
 */
export function renderComposite(
  ctx: CanvasRenderingContext2D,
  canvasSize: number,
  sourceImage: HTMLImageElement | null,
  backgroundColor: string,
  backgroundImage: HTMLImageElement | null,
  editor: EditorState
) {
  const { offsetX, offsetY, scale } = editor;

  // Clear
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Draw background
  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, canvasSize, canvasSize);
  } else {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }

  // Draw foreground image
  if (sourceImage) {
    const imgAspect = sourceImage.width / sourceImage.height;
    let drawW: number, drawH: number;

    // Fit image within canvas, then apply scale
    if (imgAspect > 1) {
      drawW = canvasSize * scale;
      drawH = (canvasSize / imgAspect) * scale;
    } else {
      drawH = canvasSize * scale;
      drawW = (canvasSize * imgAspect) * scale;
    }

    const drawX = (canvasSize - drawW) / 2 + offsetX;
    const drawY = (canvasSize - drawH) / 2 + offsetY;

    ctx.drawImage(sourceImage, drawX, drawY, drawW, drawH);
  }
}

/**
 * Draw the safe zone overlay (dashed circle at 66% of canvas).
 */
export function drawSafeZone(
  ctx: CanvasRenderingContext2D,
  canvasSize: number
) {
  const radius = (canvasSize * SAFE_ZONE_RATIO) / 2;
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

  ctx.save();
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Render for export at a specific size (no safe zone overlay).
 */
export function renderForExport(
  size: number,
  sourceImage: HTMLImageElement | null,
  backgroundColor: string,
  backgroundImage: HTMLImageElement | null,
  editor: EditorState,
  layer: "foreground" | "background" | "composite"
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = getContext2D(canvas);

  // Scale factor relative to the working canvas (432px)
  const scaleFactor = size / 432;

  if (layer === "background") {
    if (backgroundImage) {
      ctx.drawImage(backgroundImage, 0, 0, size, size);
    } else {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, size, size);
    }
    return canvas;
  }

  if (layer === "foreground") {
    // Transparent background, only foreground image
    if (sourceImage) {
      const imgAspect = sourceImage.width / sourceImage.height;
      let drawW: number, drawH: number;

      if (imgAspect > 1) {
        drawW = size * editor.scale;
        drawH = (size / imgAspect) * editor.scale;
      } else {
        drawH = size * editor.scale;
        drawW = (size * imgAspect) * editor.scale;
      }

      const drawX = (size - drawW) / 2 + editor.offsetX * scaleFactor;
      const drawY = (size - drawH) / 2 + editor.offsetY * scaleFactor;

      ctx.drawImage(sourceImage, drawX, drawY, drawW, drawH);
    }
    return canvas;
  }

  // Composite
  renderComposite(
    ctx,
    size,
    sourceImage,
    backgroundColor,
    backgroundImage,
    {
      offsetX: editor.offsetX * scaleFactor,
      offsetY: editor.offsetY * scaleFactor,
      scale: editor.scale,
    }
  );
  return canvas;
}
