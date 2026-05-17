"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import RefreshIcon from "@/components/ui/refresh-icon";
import ExpandIcon from "@/components/ui/expand-icon";
import ImageIcon from "@/components/ui/image-icon";
import { useCanvasEditor } from "@/hooks/useCanvasEditor";
import { renderComposite, drawSafeZone } from "@/lib/canvas/renderer";
import { EDITOR_CANVAS_SIZE } from "@/lib/constants";
import type { EditorState } from "@/types";

interface CanvasEditorProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  onEditorStateChange: (state: EditorState) => void;
  onGetCurrentState?: (getCurrentState: () => EditorState) => void;
  compact?: boolean;
}

export function CanvasEditor({
  sourceImage,
  backgroundColor,
  backgroundImage,
  onEditorStateChange,
  onGetCurrentState,
  compact = false,
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, setScale, reset, handleWheelRef, handlers } = useCanvasEditor({
    canvasSize: EDITOR_CANVAS_SIZE,
    canvasRef,
  });

  // Sync editor state up to parent
  useEffect(() => {
    onEditorStateChange(state);
  }, [state, onEditorStateChange]);

  // Provide getCurrentState callback to parent for immediate access
  useEffect(() => {
    if (onGetCurrentState) {
      onGetCurrentState(() => state);
    }
  }, [state, onGetCurrentState]);

  // Attach wheel listener with passive: false so preventDefault works.
  // Uses a ref for the handler so this effect runs only once on mount.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => handleWheelRef.current(e);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [handleWheelRef]);

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
    <Card className="flex h-full min-h-0 w-full flex-col gap-2 p-2.5 md:p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-s font-medium text-muted-foreground">Canvas Editor</h3>
        </div>
        <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs" onClick={reset} title="Reset position">
          <RefreshIcon className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/30"
        style={{ touchAction: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={EDITOR_CANVAS_SIZE}
          height={EDITOR_CANVAS_SIZE}
          className="block aspect-square h-auto max-h-full w-auto max-w-full cursor-grab object-contain active:cursor-grabbing"
          style={{
            width: compact ? "min(100%, 260px)" : "min(100%, 420px)",
            height: compact ? "min(100%, 260px)" : "min(100%, 420px)",
          }}
          role="img"
          aria-label="Icon canvas editor - drag to position, scroll to zoom"
          {...handlers}
        />
      </div>

      <div className="flex items-center gap-2 px-1">
        <ExpandIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Slider
          value={[state.scale * 100]}
          onValueChange={(v) => setScale((Array.isArray(v) ? v[0] : v) / 100)}
          min={10}
          max={500}
          step={1}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-10 text-right">
          {Math.round(state.scale * 100)}%
        </span>
      </div>
    </Card>
  );
}
