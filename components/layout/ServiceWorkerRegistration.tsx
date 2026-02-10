"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((reg) => {
          // Check for updates immediately, then every 60s
          reg.update();
          const interval = setInterval(() => reg.update(), 60_000);

          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                window.location.reload();
              }
            });
          });

          return () => clearInterval(interval);
        })
        .catch(() => {
          // SW registration failed — app works fine without it
        });
    }
  }, []);

  return null;
}
