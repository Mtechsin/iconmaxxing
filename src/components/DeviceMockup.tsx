"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { renderForExport } from "@/lib/canvas/renderer";
import { applyMask, applyIOSMask } from "@/lib/canvas/masks";
import type { EditorState } from "@/types";

interface DeviceMockupProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
}

export function DeviceMockup({
  sourceImage,
  backgroundColor,
  backgroundImage,
  editor,
}: DeviceMockupProps) {
  const androidCanvasRef = useRef<HTMLCanvasElement>(null);
  const iosCanvasRef = useRef<HTMLCanvasElement>(null);
  const [androidMock, setAndroidMock] = useState<HTMLImageElement | null>(null);
  const [iosMock, setIosMock] = useState<HTMLImageElement | null>(null);
  const [activeTab, setActiveTab] = useState("android");

  // Load mock images
  useEffect(() => {
    const pixelImg = new Image();
    pixelImg.onload = () => setAndroidMock(pixelImg);
    pixelImg.src = "/mocks/pixel10.png";

    const iphoneImg = new Image();
    iphoneImg.onload = () => setIosMock(iphoneImg);
    iphoneImg.src = "/mocks/iphone17.png";
  }, []);

  // Render Android mockup
  useEffect(() => {
    const canvas = androidCanvasRef.current;
    if (!canvas || !androidMock) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // We show only the top portion of the mock
    const mockW = androidMock.width;
    const mockH = androidMock.height;
    const cropRatio = 0.35; // Show top 35% of the phone
    const cropH = mockH * cropRatio;

    // Canvas dimensions match the cropped area, scaled down for display
    const displayW = 320;
    const scale = displayW / mockW;
    const displayH = cropH * scale;

    canvas.width = displayW;
    canvas.height = displayH;

    // Draw cropped top section of mock
    ctx.drawImage(
      androidMock,
      0, 0, mockW, cropH, // source: top portion
      0, 0, displayW, displayH // dest: fill canvas
    );

    // Overlay the icon if we have a source image
    if (sourceImage) {
      const iconSize = 48; // Icon size on the mockup
      const compositeCanvas = renderForExport(
        120,
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor,
        "composite"
      );
      const maskedIcon = applyMask(compositeCanvas, "squircle", 120);

      // Position: top-left area of home screen (below status bar, left side)
      // These values approximate a typical Android home screen icon grid
      const iconX = displayW * 0.08;
      const iconY = displayH * 0.55;

      ctx.drawImage(maskedIcon, iconX, iconY, iconSize, iconSize);
    }
  }, [androidMock, sourceImage, backgroundColor, backgroundImage, editor]);

  // Render iOS mockup
  useEffect(() => {
    const canvas = iosCanvasRef.current;
    if (!canvas || !iosMock) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mockW = iosMock.width;
    const mockH = iosMock.height;
    const cropRatio = 0.35;
    const cropH = mockH * cropRatio;

    const displayW = 320;
    const scale = displayW / mockW;
    const displayH = cropH * scale;

    canvas.width = displayW;
    canvas.height = displayH;

    // Draw cropped top section of mock
    ctx.drawImage(
      iosMock,
      0, 0, mockW, cropH,
      0, 0, displayW, displayH
    );

    // Overlay the icon
    if (sourceImage) {
      const iconSize = 48;
      const compositeCanvas = renderForExport(
        120,
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor,
        "composite"
      );
      const maskedIcon = applyIOSMask(compositeCanvas, 120);

      // Position: top-left of iOS home screen grid
      const iconX = displayW * 0.08;
      const iconY = displayH * 0.55;

      ctx.drawImage(maskedIcon, iconX, iconY, iconSize, iconSize);
    }
  }, [iosMock, sourceImage, backgroundColor, backgroundImage, editor]);

  if (!sourceImage) return null;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Device Preview
      </h3>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as string)} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="android" className="flex-1">Android</TabsTrigger>
          <TabsTrigger value="ios" className="flex-1">iOS</TabsTrigger>
        </TabsList>

        <div className={`mt-3 ${activeTab === "android" ? "block" : "hidden"}`}>
          <div className="flex justify-center">
            <canvas
              ref={androidCanvasRef}
              className="rounded-xl border border-border w-full max-w-[320px]"
              style={{ aspectRatio: "auto" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Pixel — Home Screen
          </p>
        </div>

        <div className={`mt-3 ${activeTab === "ios" ? "block" : "hidden"}`}>
          <div className="flex justify-center">
            <canvas
              ref={iosCanvasRef}
              className="rounded-xl border border-border w-full max-w-[320px]"
              style={{ aspectRatio: "auto" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            iPhone — Home Screen
          </p>
        </div>
      </Tabs>
    </Card>
  );
}
