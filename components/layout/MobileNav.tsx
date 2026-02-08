"use client";

import { Clock, PenLine, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

export type MobileTab = "history" | "editor" | "templates";

interface MobileNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const tabs: { id: MobileTab; label: string; icon: React.ElementType }[] = [
  { id: "history", label: "History", icon: Clock },
  { id: "editor", label: "Editor", icon: PenLine },
  { id: "templates", label: "Templates", icon: Lightbulb },
];

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <nav className="flex h-14 items-center border-t border-border bg-card">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
