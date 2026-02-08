"use client";

import { useState, useEffect } from "react";
import { Info, X } from "lucide-react";

const STORAGE_KEY = "pix3lprompt_warning_dismissed";
const DISMISS_DURATION_DAYS = 7;

export function StorageWarning() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (dismissedAt) {
      const daysSinceDismissed =
        (Date.now() - new Date(dismissedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < DISMISS_DURATION_DAYS) return;
    }
    setIsVisible(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="flex-shrink-0 border-b border-amber-700 bg-amber-900/80 px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-amber-100">
          <Info className="h-4 w-4 flex-shrink-0" />
          <span>Your prompts are saved only on this device.</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-amber-300 underline hover:text-amber-200"
          >
            {isExpanded ? "Hide" : "Learn more"}
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="cursor-pointer p-1 text-amber-300 hover:text-amber-100"
          title="Hide for 7 days"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2 space-y-1 pl-6 text-xs text-amber-200">
          <p>No synchronization between different devices</p>
          <p>Data may be lost if you clear browser data</p>
          <p>API keys are stored only in your browser (IndexedDB)</p>
        </div>
      )}
    </div>
  );
}
