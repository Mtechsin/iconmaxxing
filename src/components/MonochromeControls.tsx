"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sourceImage) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const previewSize = 160;
    canvas.width = previewSize;
    canvas.height = previewSize;

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
  }, [sourceImage, editor, threshold, invert]);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Monochrome Layer
      </h3>

      <div className="flex items-start gap-4">
        <canvas
          ref={canvasRef}
          width={160}
          height={160}
          className="rounded-lg border border-border shrink-0"
          style={{ width: 120, height: 120 }}
        />

        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Threshold: {threshold}</Label>
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
            className="text-xs"
            onClick={() => onInvertChange(!invert)}
          >
            {invert ? "Inverted" : "Invert"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
