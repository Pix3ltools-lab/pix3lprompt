import { HistoryPanel } from "@/components/history/HistoryPanel";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { TemplatesPanel } from "@/components/templates/TemplatesPanel";

export function DesktopLayout() {
  return (
    <div className="flex flex-1">
      <HistoryPanel />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <EditorPanel />
      </main>
      <TemplatesPanel />
    </div>
  );
}
