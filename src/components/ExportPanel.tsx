"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DownloadIcon from "@/components/ui/download-icon";
import CheckedIcon from "@/components/ui/checked-icon";
import PartyPopperIcon from "@/components/ui/party-popper-icon";
import { buildAndDownloadZip } from "@/lib/export/zip-builder";
import type { EditorState, ExportTarget } from "@/types";

interface ExportPanelProps {
  sourceImage: HTMLImageElement | null;
  backgroundColor: string;
  backgroundImage: HTMLImageElement | null;
  editor: EditorState;
  monochromeThreshold: number;
  monochromeInvert: boolean;
}

export function ExportPanel({
  sourceImage,
  backgroundColor,
  backgroundImage,
  editor,
  monochromeThreshold,
  monochromeInvert,
}: ExportPanelProps) {
  const [exporting, setExporting] = useState<ExportTarget | null>(null);
  const [success, setSuccess] = useState<ExportTarget | null>(null);

  const handleExport = async (target: ExportTarget) => {
    if (!sourceImage) return;

    setExporting(target);
    setSuccess(null);

    try {
      await buildAndDownloadZip({
        sourceImage,
        backgroundColor,
        backgroundImage,
        editor,
        monochromeThreshold,
        monochromeInvert,
        target,
      });
      setSuccess(target);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(null);
    }
  };

  if (!sourceImage) return null;

  return (
    <Card className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-medium text-muted-foreground">Export</h3>

      <div className="flex flex-col gap-2">
        <ExportButton
          label="Download Android"
          sublabel="Adaptive icon res/ folder"
          target="android"
          exporting={exporting}
          success={success}
          onExport={handleExport}
        />
        <ExportButton
          label="Download iOS"
          sublabel="AppIcon.appiconset"
          target="ios"
          exporting={exporting}
          success={success}
          onExport={handleExport}
        />
        <ExportButton
          label="Download Both"
          sublabel="Android + iOS in one ZIP"
          target="both"
          exporting={exporting}
          success={success}
          onExport={handleExport}
        />
      </div>

      {success && (
        <div className="flex items-center justify-center gap-2 text-sm text-green-400">
          <PartyPopperIcon className="h-5 w-5" />
          <span>Export complete!</span>
        </div>
      )}
    </Card>
  );
}

function ExportButton({
  label,
  sublabel,
  target,
  exporting,
  success,
  onExport,
}: {
  label: string;
  sublabel: string;
  target: ExportTarget;
  exporting: ExportTarget | null;
  success: ExportTarget | null;
  onExport: (target: ExportTarget) => void;
}) {
  const isExporting = exporting === target;
  const isSuccess = success === target;

  return (
    <Button
      variant="outline"
      className="h-auto flex items-center justify-start gap-3 px-4 py-3"
      disabled={exporting !== null}
      onClick={() => onExport(target)}
    >
      {isSuccess ? (
        <CheckedIcon className="h-5 w-5 text-green-400 shrink-0" />
      ) : (
        <DownloadIcon className="h-5 w-5 shrink-0" />
      )}
      <div className="flex flex-col items-start">
        <span className="text-sm font-medium">
          {isExporting ? "Generating..." : label}
        </span>
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      </div>
    </Button>
  );
}
