"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import { MonochromeControls } from "@/components/MonochromeControls";
import { ExportPanel } from "@/components/ExportPanel";
import TrashIcon from "@/components/ui/trash-icon";
import type { AnimatedIconHandle } from "@/components/ui/types";
import { useRef } from "react";

interface MobileControlsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  backgroundColor: string;
  onColorChange: (color: string) => void;
  onBackgroundImageUpload: (file: File) => void;
  onError?: (message: string) => void;
  backgroundImage: HTMLImageElement | null;
  sourceImage: HTMLImageElement;
  editor: { offsetX: number; offsetY: number; scale: number };
  monochromeThreshold: number;
  monochromeInvert: boolean;
  onThresholdChange: (value: number) => void;
  onInvertChange: (value: boolean) => void;
  onNewImage: () => void;
}

export function MobileControlsDrawer({
  isOpen,
  onClose,
  backgroundColor,
  onColorChange,
  onBackgroundImageUpload,
  onError,
  backgroundImage,
  sourceImage,
  editor,
  monochromeThreshold,
  monochromeInvert,
  onThresholdChange,
  onInvertChange,
  onNewImage,
}: MobileControlsDrawerProps) {
  const trashIconRef = useRef<AnimatedIconHandle>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-black/50 z-[9998]"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[9999] max-h-[80vh] flex flex-col bg-background border-t border-border rounded-t-xl overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex items-center justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Close button */}
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
                aria-label="Close controls"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
              <div className="flex flex-col gap-3">
                <BackgroundPicker
                  color={backgroundColor}
                  onColorChange={onColorChange}
                  onImageUpload={onBackgroundImageUpload}
                  onError={onError}
                />

                <MonochromeControls
                  sourceImage={sourceImage}
                  editor={editor}
                  threshold={monochromeThreshold}
                  invert={monochromeInvert}
                  onThresholdChange={onThresholdChange}
                  onInvertChange={onInvertChange}
                />

                <ExportPanel
                  sourceImage={sourceImage}
                  backgroundColor={backgroundColor}
                  backgroundImage={backgroundImage}
                  editor={editor}
                  monochromeThreshold={monochromeThreshold}
                  monochromeInvert={monochromeInvert}
                />

                <Card className="flex flex-col p-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onNewImage();
                      onClose();
                    }}
                    onMouseEnter={() => trashIconRef.current?.startAnimation()}
                    onMouseLeave={() => trashIconRef.current?.stopAnimation()}
                    className="flex items-center justify-center gap-2 text-xs w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
                  >
                    <TrashIcon ref={trashIconRef} className="h-4 w-4" />
                    Upload a different image
                  </Button>
                </Card>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
