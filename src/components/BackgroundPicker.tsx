"use client";

import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PaintIcon from "@/components/ui/paint-icon";
import { COLOR_PRESETS } from "@/lib/constants";

interface BackgroundPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  onImageUpload: (file: File) => void;
}

export function BackgroundPicker({
  color,
  onColorChange,
  onImageUpload,
}: BackgroundPickerProps) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onImageUpload(file);
    },
    [onImageUpload]
  );

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <PaintIcon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">
          Background
        </h3>
      </div>

      <div className="flex items-center gap-2">
        <Label htmlFor="bg-color" className="text-xs shrink-0">
          Color
        </Label>
        <div className="relative">
          <input
            type="color"
            id="bg-color-picker"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="absolute inset-0 w-8 h-8 cursor-pointer opacity-0"
          />
          <div
            className="w-8 h-8 rounded-md border border-border cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </div>
        <Input
          id="bg-color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className="flex-1 h-8 text-xs font-mono"
          placeholder="#000000"
        />
      </div>

      <div className="grid grid-cols-6 gap-1.5">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset}
            className={`w-full aspect-square rounded-md border-2 transition-all ${
              color === preset
                ? "border-primary scale-110"
                : "border-transparent hover:border-muted-foreground/50"
            }`}
            style={{ backgroundColor: preset }}
            onClick={() => onColorChange(preset)}
            title={preset}
          />
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs w-full"
          onClick={() => document.getElementById("bg-image-input")?.click()}
        >
          Upload Background Image
        </Button>
        <input
          id="bg-image-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </Card>
  );
}
