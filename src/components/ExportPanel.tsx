"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DownloadIcon from "@/components/ui/download-icon";
import CheckedIcon from "@/components/ui/checked-icon";
import PartyPopperIcon from "@/components/ui/party-popper-icon";
import PackageIcon from "@/components/ui/package-icon";
import { buildAndDownloadZip } from "@/lib/export/zip-builder";
import type { EditorState, ExportTarget } from "@/types";

interface ExportPanelProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
  getCurrentEditorState?: () => EditorState;
  monochromeThreshold: number;
  monochromeInvert: boolean;
}

export function ExportPanel({
  sourceImage,
  backgroundColor,
  backgroundImage,
  editor,
  getCurrentEditorState,
  monochromeThreshold,
  monochromeInvert,
}: ExportPanelProps) {
  const [exporting, setExporting] = useState<ExportTarget | null>(null);
  const [success, setSuccess] = useState<ExportTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async (target: ExportTarget) => {
    if (!sourceImage) return;

    setExporting(target);
    setSuccess(null);
    setError(null);

    await new Promise((r) => requestAnimationFrame(r));

    try {
      // Use the most current editor state to avoid stale state issues
      const currentEditor = getCurrentEditorState ? getCurrentEditorState() : editor;
      
      await buildAndDownloadZip({
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor: currentEditor,
        monochromeThreshold,
        monochromeInvert,
        target,
      });
      setSuccess(target);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (!sourceImage) return null;

  return (
    <Card className="flex flex-col gap-3 p-3">
      <div className="flex items-center gap-2">
        <PackageIcon className="h-3.5 w-3.5 text-muted-foreground" />
        <h3 className="text-s font-medium text-muted-foreground">Export</h3>
      </div>

      <div className="flex flex-col gap-2 flex-1 justify-center">
        <ExportButton label="Android" sublabel="res/ folder" target="android" exporting={exporting} success={success} onExport={handleExport} />
        <ExportButton label="iOS" sublabel="AppIcon.appiconset" target="ios" exporting={exporting} success={success} onExport={handleExport} />
        <ExportButton label="Both" sublabel="Android + iOS ZIP" target="both" exporting={exporting} success={success} onExport={handleExport} />
      </div>

      {success && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-green-400">
          <PartyPopperIcon className="h-4 w-4" />
          <span>Export complete!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center text-xs text-destructive text-center px-2">
          {error}
        </div>
      )}
    </Card>
  );
}

function ExportButton({
  label,
  sublabel,
  target,
  compact = false,
  exporting,
  success,
  onExport,
}: {
  label: string;
  sublabel: string;
  target: ExportTarget;
  compact?: boolean;
  exporting: ExportTarget | null;
  success: ExportTarget | null;
  onExport: (target: ExportTarget) => void;
}) {
  const isExporting = exporting === target;
  const isSuccess = success === target;

  return (
    <Button
      variant="outline"
      className={`h-auto flex items-center justify-start gap-2 ${compact ? "px-2 py-1" : "px-3 py-2"}`}
      disabled={exporting !== null}
      onClick={() => onExport(target)}
    >
      {isSuccess ? (
        <CheckedIcon className={`${compact ? "h-3 w-3" : "h-4 w-4"} text-green-400 shrink-0`} />
      ) : (
        <DownloadIcon className={`${compact ? "h-3 w-3" : "h-4 w-4"} shrink-0`} />
      )}
      <div className="flex flex-col items-start">
        <span className={`${compact ? "text-[10px]" : "text-xs"} font-medium`}>
          {isExporting ? "Generating..." : label}
        </span>
        <span className="text-[10px] text-muted-foreground leading-tight">{sublabel}</span>
      </div>
    </Button>
  );
}
