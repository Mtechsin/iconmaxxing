"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import RefreshIcon from "@/components/ui/refresh-icon";

interface UpdateBannerProps {
  isVisible: boolean;
  onReload: () => void;
  onDismiss: () => void;
}

export function UpdateBanner({ isVisible, onReload, onDismiss }: UpdateBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-[10000] bg-primary text-primary-foreground shadow-lg border-b border-primary-foreground/20"
        >
          <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <RefreshIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                A new version is available
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onReload}
                className="h-7 px-3 text-xs"
              >
                Reload
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDismiss}
                className="h-7 px-2 text-xs hover:bg-primary-foreground/10"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}