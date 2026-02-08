"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { db } from "@/lib/db";
import type { AiProviderConfig } from "@/types";
import type { AiProvider, PromptContext } from "@/lib/ai/provider";
import { LocalRulesProvider } from "@/lib/ai/local-rules";
import { OpenRouterProvider } from "@/lib/ai/openrouter";

const localProvider = new LocalRulesProvider();

function buildProvider(config: AiProviderConfig | null): AiProvider {
  if (!config || config.provider === "none" || !config.apiKey) {
    return localProvider;
  }

  switch (config.provider) {
    case "openrouter":
      return new OpenRouterProvider(config.apiKey, config.model);
    // openai and anthropic can be added later — they follow the same pattern
    default:
      return localProvider;
  }
}

export function useAiProvider() {
  const [config, setConfig] = useState<AiProviderConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    db.aiConfig
      .toCollection()
      .first()
      .then((c) => setConfig(c ?? null));
  }, []);

  const provider = useMemo(() => buildProvider(config), [config]);
  const isLocal = provider instanceof LocalRulesProvider;

  const optimize = useCallback(
    async (prompt: string, context: PromptContext): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        return await provider.optimize(prompt, context);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Optimization failed";
        setError(msg);
        // Fallback to local rules
        return localProvider.optimize(prompt, context);
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const generateVariations = useCallback(
    async (
      prompt: string,
      count: number,
      context: PromptContext
    ): Promise<string[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await provider.generateVariations(prompt, count, context);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Variation generation failed";
        setError(msg);
        return localProvider.generateVariations(prompt, count, context);
      } finally {
        setIsLoading(false);
      }
    },
    [provider]
  );

  const reloadConfig = useCallback(async () => {
    const c = await db.aiConfig.toCollection().first();
    setConfig(c ?? null);
  }, []);

  return {
    provider,
    config,
    isLocal,
    isLoading,
    error,
    optimize,
    generateVariations,
    reloadConfig,
  };
}
