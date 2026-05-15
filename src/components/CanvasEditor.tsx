"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import RefreshIcon from "@/components/ui/refresh-icon";
import ExpandIcon from "@/components/ui/expand-icon";
import { useCanvasEditor } from "@/hooks/useCanvasEditor";
import { renderComposite, drawSafeZone } from "@/lib/canvas/renderer";
import { EDITOR_CANVAS_SIZE } from "@/lib/constants";
import type { EditorState } from "@/types";

interface CanvasEditorProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  onEditorStateChange: (state: EditorState) => void;
}

export function CanvasEditor({
  sourceImage,
  backgroundColor,
  backgroundImage,
  onEditorStateChange,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setScale, reset, handlers } = useCanvasEditor({
    canvasSize: EDITOR_CANVAS_SIZE,
  });

  // Sync editor state up to parent
  useEffect(() => {
    onEditorStateChange(state);
  }, [state, onEditorStateChange]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderComposite(
      ctx,
      EDITOR_CANVAS_SIZE,
      sourceImage,
      backgroundColor,
      backgroundImage,
      state
    );
    drawSafeZone(ctx, EDITOR_CANVAS_SIZE);
  }, [sourceImage, backgroundColor, backgroundImage, state]);

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Canvas Editor
        </h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={reset} title="Reset position">
            <RefreshIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className="relative mx-auto overflow-hidden rounded-lg border border-border bg-muted/30"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={EDITOR_CANVAS_SIZE}
          height={EDITOR_CANVAS_SIZE}
          className="block w-full max-w-[432px] cursor-grab active:cursor-grabbing"
          style={{ aspectRatio: "1 / 1" }}
          {...handlers}
        />
      </div>

      <div className="flex items-center gap-3 px-1">
        <ExpandIcon className="h-4 w-4 text-muted-foreground shrink-0" />
        <Slider
          value={[state.scale * 100]}
          onValueChange={(v) => setScale((Array.isArray(v) ? v[0] : v) / 100)}
          min={10}
          max={500}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-12 text-right">
          {Math.round(state.scale * 100)}%
        </span>
      </div>
    </Card>
  );
}
