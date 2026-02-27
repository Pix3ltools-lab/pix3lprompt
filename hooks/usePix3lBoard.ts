"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db";
import type { Pix3lBoardConfig } from "@/types";

const TOKEN_EXPIRY_MS = 110 * 60 * 1000; // 110 min — refresh before 2h JWT expiry

export interface BoardSummary {
  id: string;
  name: string;
  workspace_id: string;
}

export interface ListSummary {
  id: string;
  name: string;
  position: number;
}

export interface SendPromptData {
  listId: string;
  title: string;
  description?: string;
  prompt: string;
  aiTool?: string;
}

export function usePix3lBoard() {
  const [config, setConfig] = useState<Pix3lBoardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.pix3lboardConfig
      .toCollection()
      .first()
      .then((c) => setConfig(c ?? null));
  }, []);

  const isTokenExpired = useCallback((): boolean => {
    if (!config) return true;
    return Date.now() - config.tokenObtainedAt > TOKEN_EXPIRY_MS;
  }, [config]);

  const isConnected = config !== null && !isTokenExpired();

  const connect = useCallback(
    async (url: string, email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const baseUrl = url.replace(/\/$/, "");
        const res = await fetch(`${baseUrl}/api/auth/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `Authentication failed (${res.status})`);
        }
        const data = await res.json();
        const newConfig: Pix3lBoardConfig = {
          url: baseUrl,
          token: data.token,
          tokenObtainedAt: Date.now(),
          userEmail: data.user.email,
          userName: data.user.name,
        };
        await db.pix3lboardConfig.clear();
        await db.pix3lboardConfig.add(newConfig);
        setConfig(newConfig);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Connection failed");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const disconnect = useCallback(async () => {
    await db.pix3lboardConfig.clear();
    setConfig(null);
    setError(null);
  }, []);

  const getBoards = useCallback(async (): Promise<BoardSummary[]> => {
    if (!config) throw new Error("Not connected to Pix3lBoard");
    const res = await fetch(`${config.url}/api/v1/boards`, {
      headers: { Authorization: `Bearer ${config.token}` },
    });
    if (!res.ok) throw new Error(`Failed to load boards (${res.status})`);
    const data = await res.json();
    return data.data ?? [];
  }, [config]);

  const getLists = useCallback(
    async (boardId: string): Promise<ListSummary[]> => {
      if (!config) throw new Error("Not connected to Pix3lBoard");
      const res = await fetch(`${config.url}/api/v1/boards/${boardId}/lists`, {
        headers: { Authorization: `Bearer ${config.token}` },
      });
      if (!res.ok) throw new Error(`Failed to load lists (${res.status})`);
      const data = await res.json();
      return data.data ?? [];
    },
    [config]
  );

  const sendPrompt = useCallback(
    async (data: SendPromptData): Promise<string> => {
      if (!config) throw new Error("Not connected to Pix3lBoard");
      const res = await fetch(`${config.url}/api/v1/cards`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          list_id: data.listId,
          title: data.title,
          description: data.description ?? "",
          prompt: data.prompt,
          ai_tool: data.aiTool ?? "",
        }),
      });
      if (!res.ok) throw new Error(`Failed to create card (${res.status})`);
      const body = await res.json();
      return body.data?.id ?? "";
    },
    [config]
  );

  return {
    config,
    isConnected,
    isTokenExpired,
    isLoading,
    error,
    connect,
    disconnect,
    getBoards,
    getLists,
    sendPrompt,
  };
}
