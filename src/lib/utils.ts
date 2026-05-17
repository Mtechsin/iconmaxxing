import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely get a 2D rendering context from a canvas element.
 * Throws a descriptive error instead of returning null.
 */
export function getContext2D(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      `Failed to get 2D context for canvas (${canvas.width}x${canvas.height}). ` +
      `The browser may have run out of canvas memory.`
    );
  }
  return ctx;
}
