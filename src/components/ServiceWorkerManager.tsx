"use client";

import { useState, useEffect } from "react";
import { UpdateBanner } from "./UpdateBanner";

export function ServiceWorkerManager() {
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "activated" && navigator.serviceWorker.controller) {
              setShowUpdateBanner(true);
            }
          });
        });
      } catch (error) {
        console.warn("Service worker registration failed:", error);
      }
    };

    window.addEventListener("load", registerSW);
    return () => window.removeEventListener("load", registerSW);
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdateBanner(false);
  };

  return (
    <UpdateBanner
      isVisible={showUpdateBanner}
      onReload={handleReload}
      onDismiss={handleDismiss}
    />
  );
}