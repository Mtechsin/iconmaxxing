"use client";

import { useRef, useEffect, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Card } from "@/components/ui/card";
import SmartphoneIcon from "@/components/ui/smartphone-icon";
import AndroidIcon from "@/components/ui/android-icon";
import AppleIcon from "@/components/ui/apple-icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderForExport } from "@/lib/canvas/renderer";
import { applyMask, applyIOSMask } from "@/lib/canvas/masks";
import type { EditorState } from "@/types";

interface DeviceMockupProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
  compact?: boolean;
  desktopLarge?: boolean;
}

export function DeviceMockup({
  sourceImage,
  backgroundColor,
  backgroundImage,
  editor,
  compact = false,
  desktopLarge = false,
}: DeviceMockupProps) {
  const androidCanvasRef = useRef<HTMLCanvasElement>(null);
  const iosCanvasRef = useRef<HTMLCanvasElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [androidMock, setAndroidMock] = useState<HTMLImageElement | null>(null);
  const [iosMock, setIosMock] = useState<HTMLImageElement | null>(null);
  const [previewWidth, setPreviewWidth] = useState(compact ? 160 : 240);
  const [useTabs, setUseTabs] = useState(compact);
  const [activePreview, setActivePreview] = useState("android");
  const activeMock = activePreview === "ios" ? iosMock : androidMock;

  useEffect(() => {
    const pixelImg = new Image();
    pixelImg.onload = () => setAndroidMock(pixelImg);
    pixelImg.src = "/mocks/pixel10.png";

    const iphoneImg = new Image();
    iphoneImg.onload = () => setIosMock(iphoneImg);
    iphoneImg.src = "/mocks/iphone17.png";
  }, []);

  useEffect(() => {
    const wrapper = previewWrapRef.current;
    if (!wrapper) return;

    let rafId: number;
    let lastWidth = 0;
    let lastHeight = 0;

    const updateWidth = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      if (Math.abs(width - lastWidth) < 2 && Math.abs(height - lastHeight) < 2) return;
      lastWidth = width;
      lastHeight = height;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cropRatio = 0.42;
        const mockRatio = activeMock ? (activeMock.height * cropRatio) / activeMock.width : 0.86;
        const tabsNeeded = compact || width < 500 || height < 310;
        const columns = tabsNeeded ? 1 : 2;
        const gap = tabsNeeded ? 0 : 16;
        const labelSpace = 24;
        const tabsSpace = tabsNeeded ? 40 : 0;
        const maxByWidth = (width - gap * (columns - 1)) / columns;
        const maxByHeight = Math.max(96, (height - labelSpace - tabsSpace) / mockRatio);
        const maxWidth = tabsNeeded ? (compact ? 180 : 240) : desktopLarge ? 340 : 260;
        const minWidth = compact ? 112 : 136;

        setUseTabs(tabsNeeded);
        setPreviewWidth(Math.max(minWidth, Math.min(maxWidth, maxByWidth, maxByHeight)));
      });
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [activeMock, compact, desktopLarge]);

  useEffect(() => {
    const canvas = androidCanvasRef.current;
    if (!canvas || !androidMock) return;
    // Skip rendering if this tab is inactive in tabbed mode
    if (useTabs && activePreview !== "android") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mockW = androidMock.width;
    const mockH = androidMock.height;
    const cropRatio = 0.42;
    const cropH = mockH * cropRatio;
    const displayW = previewWidth;
    const scale = displayW / mockW;
    const displayH = cropH * scale;

    canvas.width = displayW;
    canvas.height = displayH;

    ctx.drawImage(androidMock, 0, 0, mockW, cropH, 0, 0, displayW, displayH);

    if (sourceImage) {
      const iconSize = displayW * 0.125;
      const renderSize = Math.max(48, Math.ceil(iconSize * 2));
      const compositeCanvas = renderForExport(
        renderSize,
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor,
        "composite"
      );
      const maskedIcon = applyMask(compositeCanvas, "squircle", renderSize);

      ctx.drawImage(maskedIcon, displayW * 0.13, displayH * 0.34, iconSize, iconSize);
    }
  }, [androidMock, sourceImage, backgroundColor, backgroundImage, editor, previewWidth, activePreview, useTabs]);

  useEffect(() => {
    const canvas = iosCanvasRef.current;
    if (!canvas || !iosMock) return;
    // Skip rendering if this tab is inactive in tabbed mode
    if (useTabs && activePreview !== "ios") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mockW = iosMock.width;
    const mockH = iosMock.height;
    const cropRatio = 0.42;
    const cropH = mockH * cropRatio;
    const displayW = previewWidth;
    const scale = displayW / mockW;
    const displayH = cropH * scale;

    canvas.width = displayW;
    canvas.height = displayH;

    ctx.drawImage(iosMock, 0, 0, mockW, cropH, 0, 0, displayW, displayH);

    if (sourceImage) {
      const iconSize = displayW * 0.125;
      const renderSize = Math.max(48, Math.ceil(iconSize * 2));
      const compositeCanvas = renderForExport(
        renderSize,
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor,
        "composite"
      );
      const maskedIcon = applyIOSMask(compositeCanvas, renderSize);

      ctx.drawImage(maskedIcon, displayW * 0.13, displayH * 0.34, iconSize, iconSize);
    }
  }, [iosMock, sourceImage, backgroundColor, backgroundImage, editor, previewWidth, activePreview, useTabs]);

  if (!sourceImage) return null;

  return (
    <Card className="flex h-full min-h-0 flex-col gap-2 p-2.5 md:p-3">
      <div className="flex items-center gap-2">
        <SmartphoneIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-s font-medium text-muted-foreground">Device Previews</h3>
      </div>

      <div ref={previewWrapRef} className="min-h-0 flex-1 overflow-hidden">
        {useTabs ? (
          <Tabs
            value={activePreview}
            onValueChange={setActivePreview}
            className="flex h-full min-h-0 flex-col gap-2"
          >
            <TabsList className="grid h-8 w-full grid-cols-2">
              <TabsTrigger value="android" className="text-xs">
                <AndroidIcon className="h-3.5 w-3.5" />
                Android
              </TabsTrigger>
              <TabsTrigger value="ios" className="text-xs">
                <AppleIcon className="h-3.5 w-3.5" />
                iOS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="android" className="min-h-0 flex-1">
              <DeviceCanvas
                canvasRef={androidCanvasRef}
                icon={<AndroidIcon className="h-4 w-4" />}
                label="Pixel Home Screen"
                width={previewWidth}
                aspectRatio={getPreviewAspectRatio(androidMock)}
              />
            </TabsContent>
            <TabsContent value="ios" className="min-h-0 flex-1">
              <DeviceCanvas
                canvasRef={iosCanvasRef}
                icon={<AppleIcon className="h-4 w-4" />}
                label="iPhone Home Screen"
                width={previewWidth}
                aspectRatio={getPreviewAspectRatio(iosMock)}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex h-full min-h-0 flex-row flex-wrap items-center justify-center gap-3 overflow-hidden md:gap-4">
            <DeviceCanvas
              canvasRef={androidCanvasRef}
              icon={<AndroidIcon className="h-4 w-4" />}
              label="Pixel Home Screen"
              width={previewWidth}
              aspectRatio={getPreviewAspectRatio(androidMock)}
            />
            <DeviceCanvas
              canvasRef={iosCanvasRef}
              icon={<AppleIcon className="h-4 w-4" />}
              label="iPhone Home Screen"
              width={previewWidth}
              aspectRatio={getPreviewAspectRatio(iosMock)}
            />
          </div>
        )}
      </div>
    </Card>
  );
}

function DeviceCanvas({
  canvasRef,
  icon,
  label,
  width,
  aspectRatio,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  icon: ReactNode;
  label: string;
  width: number;
  aspectRatio: number;
}) {
  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="h-auto max-h-[calc(100%-1.625rem)] rounded-lg border border-border object-contain"
        style={{ width: `${width}px`, maxWidth: "100%", aspectRatio }}
      />
      <p className="mt-1.5 flex items-center justify-center gap-1 text-center text-[10px] text-muted-foreground md:text-[11px]">
        {icon}
        {label}
      </p>
    </div>
  );
}

function getPreviewAspectRatio(mock: HTMLImageElement | null) {
  const cropRatio = 0.42;
  return mock ? mock.width / (mock.height * cropRatio) : 1.16;
}
