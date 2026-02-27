"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Send, ExternalLink } from "lucide-react";
import { usePix3lBoard, type BoardSummary, type ListSummary } from "@/hooks/usePix3lBoard";
import { toast } from "sonner";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  assembledPrompt: string;
  subject: string;
  details: string;
  targetModel: string;
}

export function SendToPix3lBoardModal({
  open,
  onClose,
  assembledPrompt,
  subject,
  details,
  targetModel,
}: Props) {
  const { config, isConnected, isTokenExpired, getBoards, getLists, sendPrompt } = usePix3lBoard();

  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedListId, setSelectedListId] = useState("");
  const [loadingBoards, setLoadingBoards] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [sending, setSending] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load boards when modal opens
  useEffect(() => {
    if (!open || !isConnected) return;
    setFetchError(null);
    setBoards([]);
    setLists([]);
    setSelectedBoardId("");
    setSelectedListId("");
    setLoadingBoards(true);
    getBoards()
      .then((data) => {
        setBoards(data);
        if (data.length === 1) setSelectedBoardId(data[0].id);
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoadingBoards(false));
  }, [open, isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load lists when board is selected
  useEffect(() => {
    if (!selectedBoardId) return;
    setLists([]);
    setSelectedListId("");
    setLoadingLists(true);
    getLists(selectedBoardId)
      .then((data) => {
        const sorted = [...data].sort((a, b) => a.position - b.position);
        setLists(sorted);
        if (sorted.length === 1) setSelectedListId(sorted[0].id);
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoadingLists(false));
  }, [selectedBoardId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSend() {
    if (!selectedListId) return;
    setSending(true);
    try {
      await sendPrompt({
        listId: selectedListId,
        title: subject.trim() || assembledPrompt.slice(0, 80),
        description: details.trim() || undefined,
        prompt: assembledPrompt,
        aiTool: targetModel,
      });
      toast.success("Prompt sent to Pix3lBoard!", {
        description: "A new card has been created in the selected list.",
        action: config
          ? { label: "Open", onClick: () => window.open(config.url, "_blank") }
          : undefined,
      });
      onClose();
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : "Failed to create card");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-border bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Send to Pix3lBoard</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">×</button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Not connected */}
          {!isConnected && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {config && isTokenExpired()
                  ? "Your session has expired. Reconnect in Settings."
                  : "Connect to a Pix3lBoard instance in Settings to use this feature."}
              </p>
              <Link href="/settings" onClick={onClose}>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Go to Settings
                </Button>
              </Link>
            </div>
          )}

          {/* Connected */}
          {isConnected && (
            <>
              {fetchError && (
                <p className="text-xs text-destructive">{fetchError}</p>
              )}

              {/* Board selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Board
                </label>
                {loadingBoards ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading boards...
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    {boards.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBoardId(b.id)}
                        className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                          selectedBoardId === b.id
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                    {boards.length === 0 && !loadingBoards && (
                      <p className="text-xs text-muted-foreground">No boards found.</p>
                    )}
                  </div>
                )}
              </div>

              {/* List selector */}
              {selectedBoardId && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    List
                  </label>
                  {loadingLists ? (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading lists...
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {lists.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => setSelectedListId(l.id)}
                          className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            selectedListId === l.id
                              ? "border-primary bg-primary/5 text-foreground"
                              : "border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {l.name}
                        </button>
                      ))}
                      {lists.length === 0 && !loadingLists && (
                        <p className="text-xs text-muted-foreground">No lists found.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Prompt preview */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prompt preview
                </label>
                <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  {assembledPrompt || "—"}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {isConnected && (
          <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="gap-1.5"
              disabled={!selectedListId || sending || !assembledPrompt}
              onClick={handleSend}
            >
              {sending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
