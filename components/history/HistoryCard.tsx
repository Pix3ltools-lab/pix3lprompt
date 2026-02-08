"use client";

import { Badge } from "@/components/ui/badge";
import { Star, Trash2 } from "lucide-react";
import type { SavedPrompt } from "@/types";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface HistoryCardProps {
  prompt: SavedPrompt;
  onDelete: (id: number) => void;
}

export function HistoryCard({ prompt, onDelete }: HistoryCardProps) {
  const loadPrompt = useStore((s) => s.loadPrompt);
  const editingPromptId = useStore((s) => s.editingPromptId);
  const isActive = editingPromptId === prompt.id;

  return (
    <button
      onClick={() => loadPrompt(prompt)}
      className={cn(
        "group w-full rounded-lg border p-3 text-left transition-colors",
        isActive
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:bg-elevated"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium leading-snug">
          {prompt.subject || "Untitled prompt"}
        </p>
        <span
          role="button"
          tabIndex={0}
          className="shrink-0 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            if (prompt.id != null) onDelete(prompt.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              if (prompt.id != null) onDelete(prompt.id);
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </span>
      </div>
      {prompt.styles.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {prompt.styles.map((style) => (
            <Badge key={style} variant="secondary" className="text-[10px]">
              {style}
            </Badge>
          ))}
        </div>
      )}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {prompt.rating
            ? Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < prompt.rating!
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-muted-foreground"
                  }`}
                />
              ))
            : <span className="text-[10px] text-muted-foreground">No rating</span>}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {prompt.targetModel}
        </span>
      </div>
    </button>
  );
}
