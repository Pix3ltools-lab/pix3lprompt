import { Sidebar } from "@/components/layout/Sidebar";
import { HistoryCard } from "@/components/history/HistoryCard";
import { mockPrompts } from "@/data/mock";

interface HistoryPanelProps {
  mobile?: boolean;
}

export function HistoryPanel({ mobile }: HistoryPanelProps) {
  const content = (
    <div className="flex flex-col gap-2">
      {mockPrompts.map((prompt) => (
        <HistoryCard key={prompt.id} prompt={prompt} />
      ))}
    </div>
  );

  if (mobile) {
    return <div className="p-4">{content}</div>;
  }

  return <Sidebar title="History">{content}</Sidebar>;
}
