import { getContext2D } from "@/lib/utils";

/**
 * Resize a canvas to a target size using high-quality downsampling.
 */
export function resizeCanvas(
  source: HTMLCanvasElement,
  targetSize: number
): HTMLCanvasElement {
  const drawScaled = (
    input: HTMLCanvasElement,
    width: number,
    height: number
  ): HTMLCanvasElement => {
    const output = document.createElement("canvas");
    output.width = width;
    output.height = height;
    const ctx = getContext2D(output);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(input, 0, 0, width, height);
    return output;
  };

  let current = source;
  while (current.width / 2 > targetSize && current.height / 2 > targetSize) {
    current = drawScaled(
      current,
      Math.max(targetSize, Math.floor(current.width / 2)),
      Math.max(targetSize, Math.floor(current.height / 2))
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = getContext2D(canvas);

  // Use high-quality image smoothing for downscaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(current, 0, 0, targetSize, targetSize);

  return canvas;
}

/**
 * Convert a canvas to a PNG Blob.
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(
          new Error(
            `Canvas export failed (${canvas.width}x${canvas.height}). This may be due to memory limits or a security restriction.`
          )
        );
      }
    }, "image/png");
  });
}
