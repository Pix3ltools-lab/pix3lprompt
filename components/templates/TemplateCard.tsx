import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Template } from "@/data/mock";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium">{template.name}</h4>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {template.style}
        </Badge>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
        {template.preview}
      </p>
      <Button size="sm" variant="outline" className="mt-2 h-7 w-full text-xs">
        Use
      </Button>
    </div>
  );
}
