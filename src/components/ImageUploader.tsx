"use client";

import { useCallback, useState } from "react";
import UploadIcon from "@/components/ui/upload-icon";

interface ImageUploaderProps {
  onImageLoad: (file: File) => void;
  hasImage: boolean;
}

export function ImageUploader({ onImageLoad, hasImage }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onImageLoad(file);
    },
    [onImageLoad]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageLoad(file);
    },
    [onImageLoad]
  );

  if (hasImage) return null;

  return (
    <label
      htmlFor="file-input"
      className={`relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer bg-card text-card-foreground ring-1 ring-foreground/10 ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="pointer-events-none flex flex-col items-center gap-3">
        <UploadIcon className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-lg font-medium">Drop your image here</p>
          <p className="text-sm text-muted-foreground">
            or click to browse. PNG, JPG, SVG, WebP supported.
          </p>
        </div>
      </div>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
    </label>
  );
}
