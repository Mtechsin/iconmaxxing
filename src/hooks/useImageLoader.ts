"use client";

import { useState, useCallback } from "react";

export function useImageLoader() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setLoading(true);
    setError(null);

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      setImage(img);
      setLoading(false);
    };

    img.onerror = () => {
      setError("Failed to load image.");
      setLoading(false);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, []);

  const clearImage = useCallback(() => {
    if (image?.src) {
      URL.revokeObjectURL(image.src);
    }
    setImage(null);
    setError(null);
  }, [image]);

  return { image, loading, error, loadImage, clearImage };
}
