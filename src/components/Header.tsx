"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
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
    <header className="flex items-center justify-between px-4 py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          IG
        </div>
        <div>
          <h1 className="text-base font-semibold leading-tight">
            Adaptive Icon Generator
          </h1>
          <p className="text-xs text-muted-foreground">
            Android &amp; iOS app icons
          </p>
        </div>
      </div>

      {installPrompt && !installed && (
        <Button variant="outline" size="sm" onClick={handleInstall}>
          Install App
        </Button>
      )}
    </header>
  );
}
