"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Template } from "@/data/mock";
import { useStore } from "@/lib/store";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const setSubject = useStore((s) => s.setSubject);
  const setDetails = useStore((s) => s.setDetails);
  const setAspectRatio = useStore((s) => s.setAspectRatio);
  const setActivePanel = useStore((s) => s.setActivePanel);
  const store = useStore();

  function handleUse() {
    // Reset first, then populate from template
    store.resetEditor();
    setSubject(template.subject);
    setDetails(template.details);
    setAspectRatio(template.aspectRatio);
    // Set styles and lighting by toggling each one
    template.styles.forEach((s) => store.toggleStyle(s));
    template.lighting.forEach((l) => store.toggleLighting(l));
    // Switch to editor on mobile
    setActivePanel("editor");
  }

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{template.name}</h4>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {template.styles[0]}
        </Badge>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
        {template.preview}
      </p>
      <Button
        size="sm"
        variant="outline"
        className="mt-2 h-7 w-full text-xs"
        onClick={handleUse}
      >
        Use
      </Button>
    </div>
  );
}
