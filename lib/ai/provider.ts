import type { AiProviderConfig } from "@/types";

export interface Suggestion {
  type: "add" | "remove" | "modify";
  target: string;
  suggestion: string;
  reason: string;
}

export interface PromptContext {
  targetModel: string;
  previousRatings: { prompt: string; rating: number; notes: string }[];
  preferredStyles: string[];
  avoidKeywords: string[];
}

export interface AiProvider {
  name: string;
  optimize(prompt: string, context: PromptContext): Promise<string>;
  generateVariations(
    prompt: string,
    count: number,
    context: PromptContext
  ): Promise<string[]>;
  suggestImprovements(
    prompt: string,
    rating: number,
    notes: string
  ): Promise<Suggestion[]>;
}

export type ProviderType = "openrouter" | "openai" | "anthropic" | "none";

export function createProvider(config: AiProviderConfig): AiProvider {
  // Dynamic imports would be cleaner but for simplicity we use a lazy approach
  // The actual provider classes are imported where needed
  // This factory is used by the hook
  switch (config.provider) {
    case "openrouter":
    case "openai":
    case "anthropic":
      // These are created dynamically in useAiProvider
      throw new Error(`Use createRemoteProvider for ${config.provider}`);
    default:
      // Return local rules — imported inline to avoid circular deps
      throw new Error("Use LocalRulesProvider directly");
  }
}
