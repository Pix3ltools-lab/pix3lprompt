"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Template } from "@/data/mock";
import { useStore } from "@/lib/store";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const store = useStore();

  function handleUse() {
    store.resetEditor();
    store.setSubject(template.subject);
    store.setDetails(template.details);
    store.setAspectRatio(template.aspectRatio);
    template.styles.forEach((s) => store.toggleStyle(s));
    template.lighting.forEach((l) => store.toggleLighting(l));
    template.cameraAngles?.forEach((c) => store.toggleCameraAngle(c));
    template.colorPalette?.forEach((c) => store.toggleColorPalette(c));
    template.medium?.forEach((m) => store.toggleMedium(m));
    template.quality?.forEach((q) => store.toggleQuality(q));
    template.framing?.forEach((f) => store.toggleFraming(f));
    template.mood?.forEach((m) => store.toggleMood(m));
    store.setActivePanel("editor");
  }

  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{template.name}</h4>
        {template.styles[0] && (
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {template.styles[0]}
          </Badge>
        )}
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
