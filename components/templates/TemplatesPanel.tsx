"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Star, Image, Film, Music } from "lucide-react";
import { templates } from "@/data/mock";
import { useStore } from "@/lib/store";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { SavedPrompt } from "@/types";

interface TemplatesPanelProps {
  mobile?: boolean;
}

function FavoriteCard({ prompt }: { prompt: SavedPrompt }) {
  const loadPrompt = useStore((s) => s.loadPrompt);
  const setActivePanel = useStore((s) => s.setActivePanel);

  function handleUse() {
    loadPrompt(prompt);
    setActivePanel("editor");
  }

  return (
    <button
      onClick={handleUse}
      className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-elevated"
    >
      <p className="line-clamp-1 text-sm font-medium">
        {prompt.subject || "Untitled prompt"}
      </p>
      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
        {prompt.styles.join(", ")}
      </p>
      <div className="mt-1.5 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < (prompt.rating ?? 0)
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    </button>
  );
}

export function TemplatesPanel({ mobile }: TemplatesPanelProps) {
  const imageTemplates = templates.filter((t) => t.category === "image");
  const videoTemplates = templates.filter((t) => t.category === "video");
  const audioTemplates = templates.filter((t) => t.category === "audio");

  const favorites = useLiveQuery(
    () =>
      db.prompts
        .where("rating")
        .aboveOrEqual(4)
        .reverse()
        .sortBy("updatedAt"),
    [],
    []
  );

  const content = (
    <div className="flex flex-col gap-4">
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <Image className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Image
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {imageTemplates.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {imageTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <Film className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Video
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {videoTemplates.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {videoTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <Music className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Audio
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {audioTemplates.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          {audioTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <div className="mb-2 flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-muted-foreground" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Favorites
          </h3>
          <Badge variant="secondary" className="text-[10px]">
            {favorites.length}
          </Badge>
        </div>
        {favorites.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            Save prompts with 4+ stars to see them here.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((prompt) => (
              <FavoriteCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );

  if (mobile) {
    return <div className="p-4">{content}</div>;
  }

  return <Sidebar title="Templates">{content}</Sidebar>;
}
