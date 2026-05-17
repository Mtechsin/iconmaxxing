"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SlidersIcon from "@/components/ui/sliders-icon";
import { renderMonochrome } from "@/lib/canvas/monochrome";
import type { EditorState } from "@/types";

interface MonochromeControlsProps {
  sourceImage: HTMLImageElement | null;
  editor: EditorState;
  threshold: number;
  invert: boolean;
  onThresholdChange: (value: number) => void;
  onInvertChange: (value: boolean) => void;
}

export function MonochromeControls({
  sourceImage,
  editor,
  threshold,
  invert,
  onThresholdChange,
  onInvertChange,
}: MonochromeControlsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const canvas = canvasRef.current;
      if (!canvas || !sourceImage) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const previewSize = 160;
      
      // Only set canvas dimensions if they've changed to avoid unnecessary buffer reallocation
      if (canvas.width !== previewSize || canvas.height !== previewSize) {
        canvas.width = previewSize;
        canvas.height = previewSize;
      }

      const monoCanvas = renderMonochrome(
        previewSize,
        sourceImage,
        editor,
        threshold,
        invert
      );
      ctx.clearRect(0, 0, previewSize, previewSize);
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, previewSize, previewSize);
      ctx.drawImage(monoCanvas, 0, 0);
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [sourceImage, editor, threshold, invert]);

  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <SlidersIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-s font-medium text-muted-foreground">Monochrome</h3>
      </div>

      <div className="flex items-start gap-3">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="rounded border border-border shrink-0"
          style={{ width: 56, height: 56 }}
        />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] text-muted-foreground">Threshold: {threshold}</Label>
            <Slider
              value={[threshold]}
              onValueChange={(v) => onThresholdChange(Array.isArray(v) ? v[0] : v)}
              min={0}
              max={255}
              step={1}
            />
          </div>

          <Button
            variant={invert ? "secondary" : "outline"}
            size="sm"
            className="text-[10px] h-6 px-2"
            onClick={() => onInvertChange(!invert)}
          >
            {invert ? "Inverted" : "Invert"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
