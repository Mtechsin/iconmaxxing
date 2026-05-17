"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { CanvasEditor } from "@/components/CanvasEditor";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { MonochromeControls } from "@/components/MonochromeControls";
import { MaskPreview } from "@/components/MaskPreview";
import { DeviceMockup } from "@/components/DeviceMockup";
import { ExportPanel } from "@/components/ExportPanel";
import { MobileControlsDrawer } from "@/components/MobileControlsDrawer";
import { useImageLoader } from "@/hooks/useImageLoader";
import TrashIcon from "@/components/ui/trash-icon";
import { DEFAULT_BG_COLOR, MIN_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION } from "@/lib/constants";
import type { EditorState } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AnimatedIconHandle } from "@/components/ui/types";

export default function Home() {
  const { image, loading, error, loadImage, clearImage, setError } = useImageLoader();
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG_COLOR);
  const trashIconRef = useRef<AnimatedIconHandle>(null);
  const [backgroundImage, setBackgroundImage] = useState<{
    image: HTMLImageElement;
    blobUrl: string;
  } | null>(null);
  const revokedBgUrlsRef = useRef(new Set<string>());
  const [editorState, setEditorState] = useState<EditorState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [monochromeThreshold, setMonochromeThreshold] = useState(128);
  const [monochromeInvert, setMonochromeInvert] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const getCurrentEditorStateRef = useRef<(() => EditorState) | null>(null);

  const handleEditorStateChange = useCallback((state: EditorState) => {
    setEditorState(state);
  }, []);

  const handleGetCurrentState = useCallback((getCurrentState: () => EditorState) => {
    getCurrentEditorStateRef.current = getCurrentState;
  }, []);

  const handleBackgroundImageUpload = useCallback((file: File) => {
    // Revoke previous background image URL if it exists
    if (backgroundImage?.blobUrl) {
      if (!revokedBgUrlsRef.current.has(backgroundImage.blobUrl)) {
        URL.revokeObjectURL(backgroundImage.blobUrl);
        revokedBgUrlsRef.current.add(backgroundImage.blobUrl);
      }
    }
    revokedBgUrlsRef.current.clear();
    
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        setError(`Background image is too large. Maximum dimension is ${MAX_IMAGE_DIMENSION}px.`);
        URL.revokeObjectURL(url);
        return;
      }
      if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
        setError(`Background image is too small. Minimum dimension is ${MIN_IMAGE_DIMENSION}px.`);
        URL.revokeObjectURL(url);
        return;
      }
      // Keep the blob URL alive while the image is in use
      setBackgroundImage({ image: img, blobUrl: url });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  }, [backgroundImage, setError]);

  useEffect(() => {
    return () => {
      if (backgroundImage?.blobUrl && !revokedBgUrlsRef.current.has(backgroundImage.blobUrl)) {
        URL.revokeObjectURL(backgroundImage.blobUrl);
        revokedBgUrlsRef.current.add(backgroundImage.blobUrl);
      }
    };
  }, [backgroundImage]);

  const handleNewImage = useCallback(() => {
    clearImage();
    setEditorState({ offsetX: 0, offsetY: 0, scale: 1 });
  }, [clearImage]);

  const sidebarControls = image && (
    <>
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <BackgroundPicker
        color={backgroundColor}
        onColorChange={setBackgroundColor}
        onImageUpload={handleBackgroundImageUpload}
        onError={setError}
      />
      <MonochromeControls
        sourceImage={image}
        editor={editorState}
        threshold={monochromeThreshold}
        invert={monochromeInvert}
        onThresholdChange={setMonochromeThreshold}
        onInvertChange={setMonochromeInvert}
      />
      <ExportPanel
        sourceImage={image}
        backgroundColor={backgroundColor}
        backgroundImage={backgroundImage?.image || null}
        editor={editorState}
        getCurrentEditorState={getCurrentEditorStateRef.current || undefined}
        monochromeThreshold={monochromeThreshold}
        monochromeInvert={monochromeInvert}
      />
      <Card className="flex flex-col p-3">
        <Button
          variant="outline"
          onClick={handleNewImage}
          onMouseEnter={() => trashIconRef.current?.startAnimation()}
          onMouseLeave={() => trashIconRef.current?.stopAnimation()}
          className="flex items-center justify-center gap-2 text-xs w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
        >
          <TrashIcon ref={trashIconRef} className="h-4 w-4" />
          Upload a different image
        </Button>
      </Card>
    </>
  );

  return (
    <>
      <div className="flex flex-col h-dvh overflow-hidden">
        <Header onMobileControlsOpen={image ? () => setMobileDrawerOpen(true) : undefined} />

        <main className="flex-1 overflow-hidden p-2.5 sm:p-3">
        {/* Upload state */}
        {!image && !loading && (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-md">
              {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <ImageUploader onImageLoad={loadImage} hasImage={false} />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Editor: Responsive layout */}
        {image && (
          <>
            {/* Phone: single column */}
            <div className="md:hidden flex h-full flex-col gap-2.5 overflow-y-auto">
              <div className="w-full shrink-0" style={{ height: "clamp(220px, 42dvh, 340px)" }}>
                <CanvasEditor
                  sourceImage={image}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage?.image || null}
                  onEditorStateChange={handleEditorStateChange}
                  onGetCurrentState={handleGetCurrentState}
                  compact
                />
              </div>
              <MaskPreview
                sourceImage={image}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage?.image || null}
                editor={editorState}
              />
              <div className="min-h-[260px] flex-1 shrink-0">
                <DeviceMockup
                  sourceImage={image}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage?.image || null}
                  editor={editorState}
                  compact
                />
              </div>
            </div>

            {/* Tablet: 2-column */}
            <div className="hidden md:flex xl:hidden flex-row gap-3 h-full">
              <div className="flex flex-col gap-3 flex-[1.05] min-w-0 overflow-y-auto">
                <div className="w-full max-w-[390px] mx-auto shrink-0" style={{ height: "clamp(260px, 42dvh, 430px)" }}>
                  <CanvasEditor
                    sourceImage={image}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage?.image || null}
                    onEditorStateChange={handleEditorStateChange}
                    onGetCurrentState={handleGetCurrentState}
                  />
                </div>
                <MaskPreview
                  sourceImage={image}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage?.image || null}
                  editor={editorState}
                />
                <div className="min-h-[220px] flex-1">
                  <DeviceMockup
                    sourceImage={image}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage?.image || null}
                    editor={editorState}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-[0.95] min-w-[280px] shrink-0 overflow-y-auto">
                {sidebarControls}
              </div>
            </div>

            {/* Desktop: 3-column */}
            <div className="hidden xl:flex flex-row gap-4 h-full w-full">
              {/* Left: Canvas Editor */}
              <div className="flex flex-col shrink-0 h-full xl:max-w-[420px] w-full">
                <CanvasEditor
                  sourceImage={image}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage?.image || null}
                  onEditorStateChange={handleEditorStateChange}
                  onGetCurrentState={handleGetCurrentState}
                />
              </div>

              {/* Middle: Mask Previews + Device Mockup */}
              <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto xl:overflow-hidden h-full">
                <MaskPreview
                  sourceImage={image}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage?.image || null}
                  editor={editorState}
                />
                <div className="flex-1 min-h-0">
                  <DeviceMockup
                    sourceImage={image}
                    backgroundColor={backgroundColor}
                    backgroundImage={backgroundImage?.image || null}
                    editor={editorState}
                    desktopLarge
                  />
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex flex-col gap-2 shrink-0 overflow-y-auto h-full xl:max-w-[380px] w-full">
                {sidebarControls}
              </div>
            </div>

            {/* Mobile drawer */}
          </>
        )}
      </main>
      </div>

      {/* Mobile drawer — outside overflow-hidden container */}
      {image && (
        <MobileControlsDrawer
          isOpen={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          backgroundColor={backgroundColor}
          onColorChange={setBackgroundColor}
          onBackgroundImageUpload={handleBackgroundImageUpload}
          onError={setError}
          backgroundImage={backgroundImage?.image || null}
          sourceImage={image}
          editor={editorState}
          monochromeThreshold={monochromeThreshold}
          monochromeInvert={monochromeInvert}
          onThresholdChange={setMonochromeThreshold}
          onInvertChange={setMonochromeInvert}
          onNewImage={handleNewImage}
        />
      )}
    </>
  );
}
