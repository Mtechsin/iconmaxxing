"use client";

import { useState, useCallback, useRef } from "react";
import type { EditorState } from "@/types";

interface UseCanvasEditorOptions {
  canvasSize: number;
}

export function useCanvasEditor({ canvasSize }: UseCanvasEditorOptions) {
  const [state, setState] = useState<EditorState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const setScale = useCallback((scale: number) => {
    setState((prev) => ({ ...prev, scale: Math.max(0.1, Math.min(5, scale)) }));
  }, []);

  const setOffset = useCallback((offsetX: number, offsetY: number) => {
    setState((prev) => ({ ...prev, offsetX, offsetY }));
  }, []);

  const reset = useCallback(() => {
    setState({ offsetX: 0, offsetY: 0, scale: 1 });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };

      setState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy,
      }));
    },
    []
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setState((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale + delta)),
      }));
    },
    []
  );

  // Touch support
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef({ x: 0, y: 0 });

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current) {
      const dx = e.touches[0].clientX - lastPos.current.x;
      const dy = e.touches[0].clientY - lastPos.current.y;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      setState((prev) => ({
        ...prev,
        offsetX: prev.offsetX + dx,
        offsetY: prev.offsetY + dy,
      }));
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      const scaleDelta = (dist - lastTouchDist.current) * 0.005;
      lastTouchDist.current = dist;

      setState((prev) => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale + scaleDelta)),
      }));
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    lastTouchDist.current = null;
  }, []);

  return {
    state,
    setScale,
    setOffset,
    reset,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onWheel: handleWheel,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
