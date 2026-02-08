import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import type { SavedPrompt } from "@/types";

export function useHistory() {
  const prompts = useLiveQuery(
    () => db.prompts.orderBy("createdAt").reverse().toArray(),
    [],
    []
  );

  async function savePrompt(
    data: Omit<SavedPrompt, "id" | "createdAt" | "updatedAt">
  ): Promise<number> {
    const now = new Date();
    return db.prompts.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }

  async function updatePrompt(
    id: number,
    changes: Partial<SavedPrompt>
  ): Promise<void> {
    await db.prompts.update(id, { ...changes, updatedAt: new Date() });
  }

  async function deletePrompt(id: number): Promise<void> {
    await db.prompts.delete(id);
  }

  async function setRating(id: number, rating: number | null): Promise<void> {
    await db.prompts.update(id, { rating, updatedAt: new Date() });
  }

  async function toggleFavorite(id: number): Promise<void> {
    const prompt = await db.prompts.get(id);
    if (prompt) {
      await db.prompts.update(id, {
        isFavorite: !prompt.isFavorite,
        updatedAt: new Date(),
      });
    }
  }

  return {
    prompts,
    savePrompt,
    updatePrompt,
    deletePrompt,
    setRating,
    toggleFavorite,
  };
}
