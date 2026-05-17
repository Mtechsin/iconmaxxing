"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { EditorState } from "@/types";

interface UseCanvasEditorOptions {
  canvasSize: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useCanvasEditor({ canvasSize, canvasRef }: UseCanvasEditorOptions) {
  const [state, setState] = useState<EditorState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const canvasSizeRef = useRef(canvasSize);

  useEffect(() => {
    canvasSizeRef.current = canvasSize;
  }, [canvasSize]);

  /** Get the ratio between intrinsic canvas size and displayed CSS size */
  const getDisplayRatio = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return 1;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return 1;
    return canvasSizeRef.current / rect.width;
  }, [canvasRef]);

  const clampOffset = useCallback(
    (offset: number) => Math.max(-canvasSizeRef.current, Math.min(canvasSizeRef.current, offset)),
    []
  );

  const setScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, scale: Math.max(0.1, Math.min(5, scale)) }));
  }, []);

  const setOffset = useCallback((offsetX: number, offsetY: number) => {
    setState((prev) => ({
      ...prev,
      offsetX: clampOffset(offsetX),
      offsetY: clampOffset(offsetY),
    }));
  }, [clampOffset]);

  const reset = useCallback(() => {
    setState({ offsetX: 0, offsetY: 0, scale: 1 });
  }, []);

  // Document-level mouse handlers for reliable drag termination
  const handleDocMouseMove = useRef((e: MouseEvent) => {
    if (!isDragging.current) return;
    const ratio = getDisplayRatio();
    const dx = (e.clientX - lastPos.current.x) * ratio;
    const dy = (e.clientY - lastPos.current.y) * ratio;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setState((prev) => ({
      ...prev,
      offsetX: clampOffset(prev.offsetX + dx),
      offsetY: clampOffset(prev.offsetY + dy),
    }));
  });

  const handleDocMouseUp = useRef(() => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleDocMouseMove.current);
    document.removeEventListener("mouseup", handleDocMouseUp.current);
  });

  // Keep refs up to date with latest closures
  useEffect(() => {
    handleDocMouseMove.current = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const ratio = getDisplayRatio();
      const dx = (e.clientX - lastPos.current.x) * ratio;
      const dy = (e.clientY - lastPos.current.y) * ratio;
      lastPos.current = { x: e.clientX, y: e.clientY };

      setState((prev) => ({
        ...prev,
        offsetX: clampOffset(prev.offsetX + dx),
        offsetY: clampOffset(prev.offsetY + dy),
      }));
    };

    handleDocMouseUp.current = () => {
      isDragging.current = false;
      document.removeEventListener("mousemove", handleDocMouseMove.current);
      document.removeEventListener("mouseup", handleDocMouseUp.current);
    };
  }, [clampOffset, getDisplayRatio]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    document.addEventListener("mousemove", handleDocMouseMove.current);
    document.addEventListener("mouseup", handleDocMouseUp.current);
  }, []);

  // Store wheel handler in a ref so the listener never goes stale
  const handleWheelRef = useRef<(e: WheelEvent) => void>(() => {});

  useEffect(() => {
    handleWheelRef.current = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setState((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale + delta)),
      }));
    };
  }, []);

  // Touch support
  const lastTouchDist = useRef<number | null>(null);
  const prevTouchCount = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      isDragging.current = false;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
    prevTouchCount.current = e.touches.length;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touchCount = e.touches.length;

      if (touchCount === 1 && isDragging.current) {
        // When transitioning from 2-finger pinch to 1-finger drag,
        // reset lastPos to avoid a jump from the stale position.
        if (prevTouchCount.current === 2) {
          lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }

        const ratio = getDisplayRatio();
        const dx = (e.touches[0].clientX - lastPos.current.x) * ratio;
        const dy = (e.touches[0].clientY - lastPos.current.y) * ratio;
        lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        setState((prev) => ({
          ...prev,
          offsetX: clampOffset(prev.offsetX + dx),
          offsetY: clampOffset(prev.offsetY + dy),
        }));
      } else if (touchCount === 2 && lastTouchDist.current !== null) {
        const dx = e.touches[1].clientX - e.touches[0].clientX;
        const dy = e.touches[1].clientY - e.touches[0].clientY;
        const dist = Math.hypot(dx, dy);
        
        // Use ratio-based scaling for consistent sensitivity regardless of finger spacing
        const scaleRatio = dist / lastTouchDist.current;
        const scaleDelta = (scaleRatio - 1) * 2; // Sensitivity multiplier
        lastTouchDist.current = dist;

        setState((prev) => ({
          ...prev,
          scale: Math.max(0.1, Math.min(5, prev.scale * (1 + scaleDelta))),
        }));
      }

      prevTouchCount.current = touchCount;
    },
    [clampOffset, getDisplayRatio]
  );

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      isDragging.current = false;
      lastTouchDist.current = null;
      prevTouchCount.current = 0;
    } else if (e.touches.length === 1) {
      // One finger lifted during pinch — prepare for single-finger drag
      isDragging.current = true;
      lastTouchDist.current = null;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      prevTouchCount.current = 1;
    }
  }, []);

  // Cleanup document listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleDocMouseMove.current);
      document.removeEventListener("mouseup", handleDocMouseUp.current);
    };
  }, []);

  return {
    state,
    setScale,
    setOffset,
    reset,
    handleWheelRef,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
