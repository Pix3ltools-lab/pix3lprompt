"use client";

import { MobileNav } from "@/components/layout/MobileNav";
import { HistoryPanel } from "@/components/history/HistoryPanel";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { TemplatesPanel } from "@/components/templates/TemplatesPanel";
import { useStore } from "@/lib/store";

export function MobileLayout() {
  const activePanel = useStore((s) => s.activePanel);
  const setActivePanel = useStore((s) => s.setActivePanel);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        {activePanel === "history" && <HistoryPanel mobile />}
        {activePanel === "editor" && <EditorPanel />}
        {activePanel === "templates" && <TemplatesPanel mobile />}
      </div>
      <MobileNav activeTab={activePanel} onTabChange={setActivePanel} />
    </div>
  );
}
