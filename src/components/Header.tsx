"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GearIcon from "@/components/ui/gear-icon";

interface HeaderProps {
  onMobileControlsOpen?: () => void;
}

export function Header({ onMobileControlsOpen }: HeaderProps) {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const installedHandler = () => setInstalled(true);

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompt = installPrompt as any;
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === "accepted") {
      setInstalled(true);
    }
    setInstallPrompt(null);
  };

  return (
    <header className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-border">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary text-primary-foreground font-bold text-xs md:text-sm">
          IM
        </div>
        <div>
          <h1 className="text-sm md:text-base font-semibold leading-tight">
            IconMaxxing
          </h1>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            Android &amp; iOS app icons
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onMobileControlsOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMobileControlsOpen}
            className="md:hidden flex items-center gap-1.5"
          >
            <GearIcon className="h-4 w-4" />
            Controls
          </Button>
        )}

        {installPrompt && !installed && (
          <Button variant="outline" size="sm" onClick={handleInstall}>
            Install App
          </Button>
        )}
      </div>
    </header>
  );
}
