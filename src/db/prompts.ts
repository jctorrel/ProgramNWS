// src/db/prompts.ts
import { getDb } from "./db";

export interface PromptDoc {
  key: string;
  label?: string;
  content: string;      // le texte du prompt
  createdAt: Date;
  updatedAt: Date;
}

// Récupérer juste le texte du prompt
export async function getPromptContent(key: string): Promise<string | null> {
  const db = getDb();
  const doc = await db.collection<PromptDoc>("prompts").findOne({ key });
  return doc?.content ?? null;
}

// Récupérer le document complet (utile plus tard pour l’admin)
export async function getPrompt(key: string): Promise<PromptDoc | null> {
  const db = getDb();
  return db.collection<PromptDoc>("prompts").findOne({ key });
}

// Lister tous les prompts (pour la future page d’admin)
export async function listPrompts(): Promise<PromptDoc[]> {
  const db = getDb();
  return db.collection<PromptDoc>("prompts").find().sort({ key: 1 }).toArray();
}

// Créer ou mettre à jour un prompt
export async function upsertPrompt(
  key: string,
  content: string,
  options?: { label?: string; type?: string }
): Promise<PromptDoc | null> {
  const db = getDb();
  const now = new Date();

  const update = {
    $set: {
      key,
      content,
      label: options?.label,
      updatedAt: now,
    },
    $setOnInsert: {
      createdAt: now,
    },
  };

  const result = await db
    .collection<PromptDoc>("prompts")
    .findOneAndUpdate({ key }, update, { upsert: true, returnDocument: "after" });

  if (result && !result.key) {
    throw new Error("Impossible de créer/mettre à jour le prompt");
  }

  return result;
}

// Supprimer un prompt (pour plus tard dans l'admin)
export async function deletePrompt(key: string): Promise<void> {
  const db = getDb();
  await db.collection<PromptDoc>("prompts").deleteOne({ key });
}
