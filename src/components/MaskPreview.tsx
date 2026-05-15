"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { renderForExport } from "@/lib/canvas/renderer";
import { applyMask, applyIOSMask } from "@/lib/canvas/masks";
import type { EditorState, MaskShape } from "@/types";

interface MaskPreviewProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
}

const MASKS: { shape: MaskShape; label: string }[] = [
  { shape: "circle", label: "Circle" },
  { shape: "squircle", label: "Squircle" },
  { shape: "rounded-square", label: "Rounded" },
];

export function MaskPreview({
  sourceImage,
  backgroundColor,
  backgroundImage,
  editor,
}: MaskPreviewProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([null, null, null]);
  const iosCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!sourceImage) return;

    const previewSize = 120;
    const compositeCanvas = renderForExport(
      previewSize,
      sourceImage,
      backgroundColor,
      backgroundImage,
      editor,
      "composite"
    );

    // Android masks
    MASKS.forEach((mask, i) => {
      const canvas = canvasRefs.current[i];
      if (!canvas) return;
      canvas.width = previewSize;
      canvas.height = previewSize;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, previewSize, previewSize);

      const masked = applyMask(compositeCanvas, mask.shape, previewSize);
      ctx.drawImage(masked, 0, 0);
    });

    // iOS mask
    const iosCanvas = iosCanvasRef.current;
    if (iosCanvas) {
      iosCanvas.width = previewSize;
      iosCanvas.height = previewSize;
      const ctx = iosCanvas.getContext("2d")!;
      ctx.clearRect(0, 0, previewSize, previewSize);

      const masked = applyIOSMask(compositeCanvas, previewSize);
      ctx.drawImage(masked, 0, 0);
    }
  }, [sourceImage, backgroundColor, backgroundImage, editor]);

  if (!sourceImage) return null;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Preview Masks
      </h3>

      <div className="grid grid-cols-4 gap-3">
        {MASKS.map((mask, i) => (
          <div key={mask.shape} className="flex flex-col items-center gap-1.5">
            <canvas
              ref={(el) => { canvasRefs.current[i] = el; }}
              width={120}
              height={120}
              className="rounded border border-border bg-muted/20"
              style={{ width: 80, height: 80 }}
            />
            <span className="text-[10px] text-muted-foreground">
              {mask.label}
            </span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-1.5">
          <canvas
            ref={iosCanvasRef}
            width={120}
            height={120}
            className="rounded border border-border bg-muted/20"
            style={{ width: 80, height: 80 }}
          />
          <span className="text-[10px] text-muted-foreground">iOS</span>
        </div>
      </div>
    </Card>
  );
}
