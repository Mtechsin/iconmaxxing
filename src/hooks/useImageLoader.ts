"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MAX_FILE_SIZE, MIN_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION } from "@/lib/constants";

export function useImageLoader() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);
  const revokedUrlsRef = useRef(new Set<string>());

  const revokeUrl = useCallback((url: string) => {
    if (revokedUrlsRef.current.has(url)) return;
    URL.revokeObjectURL(url);
    revokedUrlsRef.current.add(url);
  }, []);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 10 MB.");
      return;
    }

    setLoading(true);
    setError(null);
    revokedUrlsRef.current.clear();

    if (inFlightUrlRef.current) {
      revokeUrl(inFlightUrlRef.current);
      inFlightUrlRef.current = null;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const url = URL.createObjectURL(file);
    inFlightUrlRef.current = url;
    const img = new Image();

    img.onload = () => {
      revokeUrl(url);
      if (inFlightUrlRef.current === url) {
        inFlightUrlRef.current = null;
      }
      if (requestIdRef.current !== requestId) return;
      if (img.width > MAX_IMAGE_DIMENSION || img.height > MAX_IMAGE_DIMENSION) {
        setError(`Image is too large. Maximum dimension is ${MAX_IMAGE_DIMENSION}px.`);
        setLoading(false);
        return;
      }
      if (img.width < MIN_IMAGE_DIMENSION || img.height < MIN_IMAGE_DIMENSION) {
        setError(`Image is too small. Minimum dimension is ${MIN_IMAGE_DIMENSION}px.`);
        setLoading(false);
        return;
      }
      setImage(img);
      setLoading(false);
    };

    img.onerror = () => {
      revokeUrl(url);
      if (inFlightUrlRef.current === url) {
        inFlightUrlRef.current = null;
      }
      if (requestIdRef.current !== requestId) return;
      setError("Failed to load image.");
      setLoading(false);
    };

    img.src = url;
  }, [revokeUrl]);

  const clearImage = useCallback(() => {
    requestIdRef.current += 1;
    if (inFlightUrlRef.current) {
      revokeUrl(inFlightUrlRef.current);
      inFlightUrlRef.current = null;
    }
    setImage(null);
    setLoading(false);
    setError(null);
  }, [revokeUrl]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      if (inFlightUrlRef.current) {
        revokeUrl(inFlightUrlRef.current);
        inFlightUrlRef.current = null;
      }
    };
  }, [revokeUrl]);

  return { image, loading, error, loadImage, clearImage, setError };
}
