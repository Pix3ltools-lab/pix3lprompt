"use client";

import { useState } from "react";
import { MobileNav, type MobileTab } from "@/components/layout/MobileNav";
import { HistoryPanel } from "@/components/history/HistoryPanel";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { TemplatesPanel } from "@/components/templates/TemplatesPanel";

export function MobileLayout() {
  const [activeTab, setActiveTab] = useState<MobileTab>("editor");

  return (
    <div className="flex h-dvh flex-col">
      <div className="flex-1 overflow-y-auto">
        {activeTab === "history" && <HistoryPanel mobile />}
        {activeTab === "editor" && <EditorPanel />}
        {activeTab === "templates" && <TemplatesPanel mobile />}
      </div>
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
