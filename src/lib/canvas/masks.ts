import type { MaskShape } from "@/types";
import { getContext2D } from "@/lib/utils";

/**
 * Apply a mask shape to a canvas and return the clipped result.
 */
export function applyMask(
  sourceCanvas: HTMLCanvasElement,
  shape: MaskShape,
  outputSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = getContext2D(canvas);

  ctx.save();

  // Create clip path based on shape
  switch (shape) {
    case "circle":
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      break;

    case "squircle":
      drawSquircle(ctx, outputSize);
      break;

    case "rounded-square":
      const radius = outputSize * 0.2;
      ctx.beginPath();
      ctx.roundRect(0, 0, outputSize, outputSize, radius);
      ctx.closePath();
      break;
  }

  ctx.clip();
  ctx.drawImage(sourceCanvas, 0, 0, outputSize, outputSize);
  ctx.restore();

  return canvas;
}

/**
 * Draw a squircle (superellipse) path — the Android default adaptive icon shape.
 */
function drawSquircle(ctx: CanvasRenderingContext2D, size: number) {
  const n = 5; // Superellipse exponent (Android uses ~5)
  const steps = 200;
  const half = size / 2;

  ctx.beginPath();

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const cosT = Math.cos(t);
    const sinT = Math.sin(t);

    const x = half + half * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n);
    const y = half + half * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
}

/**
 * Draw iOS-style rounded rectangle (continuous corners / superellipse).
 */
export function applyIOSMask(
  sourceCanvas: HTMLCanvasElement,
  outputSize: number
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;
  const ctx = getContext2D(canvas);

  // iOS uses ~22.37% corner radius relative to icon size
  const radius = outputSize * 0.2237;

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, outputSize, outputSize, radius);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(sourceCanvas, 0, 0, outputSize, outputSize);
  ctx.restore();

  return canvas;
}
