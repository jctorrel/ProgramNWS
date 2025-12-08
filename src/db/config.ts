// src/db/config.ts
import { getDb } from "./db";

export interface MentorConfig {
  school_name: string;
  tone: string;
  rules: string;
}

interface ConfigDoc {
  key: string;
  data: MentorConfig;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION = "configs";
const MENTOR_CONFIG_KEY = "mentor_config";

export async function getMentorConfig(): Promise<MentorConfig> {
  const db = getDb();
  const doc = await db.collection<ConfigDoc>(COLLECTION).findOne({ key: MENTOR_CONFIG_KEY });
  if (!doc) {
    throw new Error(`Config "${MENTOR_CONFIG_KEY}" introuvable en base`);
  }
  return doc.data;
}

export async function upsertMentorConfig(config: MentorConfig): Promise<ConfigDoc | null>{
  const db = getDb();
  const now = new Date();

  const result = await db.collection<ConfigDoc>(COLLECTION).findOneAndUpdate(
    { key: MENTOR_CONFIG_KEY },
    {
      $set: {
        key: MENTOR_CONFIG_KEY,
        data: config,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true, returnDocument: "after" }
  );

  if (result && !result.key) {
    throw new Error("Impossible de créer/mettre à jour la configuration du mentor");
  }

  return result;
}
