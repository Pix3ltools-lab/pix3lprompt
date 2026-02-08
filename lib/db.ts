import Dexie, { type Table } from "dexie";
import type { SavedPrompt, UserPreference, AiProviderConfig } from "@/types";

class Pix3lPromptDB extends Dexie {
  prompts!: Table<SavedPrompt>;
  preferences!: Table<UserPreference>;
  aiConfig!: Table<AiProviderConfig>;

  constructor() {
    super("pix3lprompt");
    this.version(1).stores({
      prompts: "++id, rating, targetModel, createdAt, *tags, *styles",
      preferences: "++id, key",
      aiConfig: "++id, provider",
    });
  }
}

export const db = new Pix3lPromptDB();
