"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { HistoryCard } from "@/components/history/HistoryCard";
import { useHistory } from "@/hooks/useHistory";

interface HistoryPanelProps {
  mobile?: boolean;
}

export function HistoryPanel({ mobile }: HistoryPanelProps) {
  const { prompts, deletePrompt } = useHistory();

  const content =
    prompts.length === 0 ? (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No saved prompts yet.
        <br />
        Create one in the editor and hit Save.
      </p>
    ) : (
      <div className="flex flex-col gap-2">
        {prompts.map((prompt) => (
          <HistoryCard
            key={prompt.id}
            prompt={prompt}
            onDelete={deletePrompt}
          />
        ))}
      </div>
    );

  if (mobile) {
    return <div className="p-4">{content}</div>;
  }

  return <Sidebar title="History">{content}</Sidebar>;
}
