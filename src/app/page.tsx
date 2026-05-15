"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { ImageUploader } from "@/components/ImageUploader";
import { CanvasEditor } from "@/components/CanvasEditor";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { MonochromeControls } from "@/components/MonochromeControls";
import { MaskPreview } from "@/components/MaskPreview";
import { DeviceMockup } from "@/components/DeviceMockup";
import { ExportPanel } from "@/components/ExportPanel";
import { useImageLoader } from "@/hooks/useImageLoader";
import { DEFAULT_BG_COLOR } from "@/lib/constants";
import type { EditorState } from "@/types";

export default function Home() {
  const { image, loading, error, loadImage, clearImage } = useImageLoader();
  const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG_COLOR);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [editorState, setEditorState] = useState<EditorState>({
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });
  const [monochromeThreshold, setMonochromeThreshold] = useState(128);
  const [monochromeInvert, setMonochromeInvert] = useState(false);

  const handleEditorStateChange = useCallback((state: EditorState) => {
    setEditorState(state);
  }, []);

  const handleBackgroundImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setBackgroundImage(img);
    img.src = url;
  }, []);

  const handleNewImage = useCallback(() => {
    clearImage();
    setEditorState({ offsetX: 0, offsetY: 0, scale: 1 });
  }, [clearImage]);

  return (
    <div className="flex flex-col h-dvh">
      <Header />

      <main className="flex-1 overflow-auto p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
          </div>
        )}

        {!image && !loading && (
          <div className="max-w-lg mx-auto mt-8">
            <ImageUploader onImageLoad={loadImage} hasImage={!!image} />
          </div>
        )}

        {image && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 max-w-6xl mx-auto">
            {/* Left column: Canvas + Masks + Device Preview */}
            <div className="flex flex-col gap-4">
              <CanvasEditor
                sourceImage={image}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                onEditorStateChange={handleEditorStateChange}
              />
              <MaskPreview
                sourceImage={image}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                editor={editorState}
              />
              <DeviceMockup
                sourceImage={image}
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                editor={editorState}
              />
            </div>

            {/* Right column: Controls */}
            <div className="flex flex-col gap-4">
              <BackgroundPicker
                color={backgroundColor}
                onColorChange={setBackgroundColor}
                onImageUpload={handleBackgroundImageUpload}
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
                backgroundImage={backgroundImage}
                editor={editorState}
                monochromeThreshold={monochromeThreshold}
                monochromeInvert={monochromeInvert}
              />

              <button
                onClick={handleNewImage}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
              >
                Upload a different image
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
