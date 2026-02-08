export interface SavedPrompt {
  id?: number;
  subject: string;
  styles: string[];
  lighting: string[];
  composition: {
    aspectRatio: string;
    cameraAngle: string;
  };
  details: string;
  negativePrompt: string;
  parameters: Record<string, string | number>;
  targetModel: string;
  assembledPrompt: string;
  rating: number | null;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreference {
  id?: number;
  key: string;
  value: string | number | boolean;
}

export interface AiProviderConfig {
  id?: number;
  provider: "openrouter" | "openai" | "anthropic" | "none";
  apiKey: string;
  model: string;
  baseUrl?: string;
}
