"use client";

import { useCallback, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PaintIcon from "@/components/ui/paint-icon";
import UploadIcon from "@/components/ui/upload-icon";
import { COLOR_PRESETS, MAX_FILE_SIZE } from "@/lib/constants";

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

interface BackgroundPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  onImageUpload: (file: File) => void;
  onError?: (message: string) => void;
}

export function BackgroundPicker({
  color,
  onColorChange,
  onImageUpload,
  onError,
}: BackgroundPickerProps) {
  const [inputValue, setInputValue] = useState(color);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      if (HEX_COLOR_REGEX.test(val)) {
        onColorChange(val);
      }
    },
    [onColorChange]
  );

  const handleColorChange = useCallback(
    (newColor: string) => {
      setInputValue(newColor);
      onColorChange(newColor);
    },
    [onColorChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.("File is too large. Maximum size is 10 MB.");
        return;
      }
      onImageUpload(file);
    },
    [onImageUpload, onError]
  );

  return (
    <Card className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <PaintIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-s font-medium text-muted-foreground">Background</h3>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative shrink-0">
          <input
            type="color"
            id="bg-color-picker"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="absolute inset-0 w-7 h-7 cursor-pointer opacity-0"
          />
          <div
            className="w-7 h-7 rounded border border-border cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </div>
        <Input
          id="bg-color"
          value={inputValue}
          onChange={handleTextChange}
          className="h-7 flex-1 text-xs font-mono"
          placeholder="#000000"
        />
      </div>

      <div className="grid grid-cols-8 gap-1 min-[1500px]:grid-cols-10">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            className={`aspect-square w-full max-w-9 rounded border-2 transition-all ${color === preset
              ? "border-primary scale-110"
              : "border-transparent hover:border-muted-foreground/50"
              }`}
            style={{ backgroundColor: preset }}
            onClick={() => handleColorChange(preset)}
            title={preset}
          />
        ))}
      </div>

      <label className="flex items-center justify-center gap-1.5 text-xs border border-border rounded-md px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors">
        <UploadIcon className="h-3 w-3" />
        Upload BG Image
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </label>
    </Card>
  );
}
