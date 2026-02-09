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

    this.version(2).stores({
      prompts: "++id, rating, targetModel, createdAt, *tags, *styles",
      preferences: "++id, key",
      aiConfig: "++id, provider",
    }).upgrade((tx) => {
      return tx.table("prompts").toCollection().modify((prompt) => {
        // Migrate cameraAngle string to cameraAngles array
        const oldAngle = (prompt as Record<string, unknown>).composition as
          | { aspectRatio: string; cameraAngle?: string }
          | undefined;
        if (oldAngle?.cameraAngle) {
          prompt.cameraAngles = oldAngle.cameraAngle ? [oldAngle.cameraAngle] : [];
          delete (oldAngle as Record<string, unknown>).cameraAngle;
        }
        // Ensure new fields exist
        prompt.cameraAngles ??= [];
        prompt.colorPalette ??= [];
        prompt.medium ??= [];
        prompt.quality ??= [];
        prompt.framing ??= [];
        prompt.mood ??= [];
      });
    });
  }
}

export const db = new Pix3lPromptDB();
