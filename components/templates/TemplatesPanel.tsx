import { Sidebar } from "@/components/layout/Sidebar";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { Separator } from "@/components/ui/separator";
import { templates } from "@/data/mock";

interface TemplatesPanelProps {
  mobile?: boolean;
}

export function TemplatesPanel({ mobile }: TemplatesPanelProps) {
  const quickStart = templates.filter((t) => t.category === "quick-start");
  const favorites = templates.filter((t) => t.category === "favorites");

  const content = (
    <div className="flex flex-col gap-4">
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Start
        </h3>
        <div className="flex flex-col gap-2">
          {quickStart.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
      <Separator />
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Favorites
        </h3>
        <div className="flex flex-col gap-2">
          {favorites.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </div>
  );

  if (mobile) {
    return <div className="p-4">{content}</div>;
  }

  return <Sidebar title="Templates">{content}</Sidebar>;
}
