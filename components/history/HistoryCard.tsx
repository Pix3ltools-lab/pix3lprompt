import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { MockPrompt } from "@/data/mock";

interface HistoryCardProps {
  prompt: MockPrompt;
}

export function HistoryCard({ prompt }: HistoryCardProps) {
  return (
    <button className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-elevated">
      <p className="line-clamp-2 text-sm font-medium leading-snug">
        {prompt.subject}
      </p>
      <div className="mt-2 flex flex-wrap gap-1">
        {prompt.styles.map((style) => (
          <Badge key={style} variant="secondary" className="text-[10px]">
            {style}
          </Badge>
        ))}
      </div>
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
