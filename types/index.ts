export interface SavedPrompt {
  id?: number;
  subject: string;
  styles: string[];
  lighting: string[];
  cameraAngles?: string[];
  colorPalette?: string[];
  medium?: string[];
  quality?: string[];
  framing?: string[];
  mood?: string[];
  composition: {
    aspectRatio: string;
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
  provider: "openrouter" | "openai" | "anthropic" | "lmstudio" | "none";
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface Pix3lBoardConfig {
  id?: number;
  url: string;              // e.g. "https://board.example.com"
  token: string;            // Bearer JWT
  tokenObtainedAt: number;  // Date.now() — used to detect 2h expiry
  userEmail: string;
  userName: string;
}
