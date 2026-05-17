"use client";

import { useCallback, useState } from "react";
import UploadIcon from "@/components/ui/upload-icon";
import ImageIcon from "@/components/ui/image-icon";

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
      if (e.dataTransfer.files.length === 0) return;
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      onImageLoad(file);
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
      className={`relative flex flex-col items-center justify-center gap-3 md:gap-4 rounded-xl border-2 border-dashed p-6 md:p-8 lg:p-12 transition-colors cursor-pointer bg-card text-card-foreground ring-1 ring-foreground/10 ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center gap-2 md:gap-3">
        <div className="relative flex items-center gap-2 md:gap-3">
          <UploadIcon className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-muted-foreground" />
          <ImageIcon className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 text-muted-foreground/60" />
        </div>
        <div className="text-center">
          <p className="text-base md:text-lg font-medium">Drop your image here</p>
          <p className="text-xs md:text-sm text-muted-foreground">
            or click to browse. PNG, JPG, or WebP recommended.
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
