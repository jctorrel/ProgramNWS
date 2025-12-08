// src/db/index.ts
import { Db, MongoClient } from "mongodb";
import { logger } from "../utils/logger";

let client: MongoClient;
let db: Db;

export async function initMongo(uri: string, dbName: string = ""): Promise<{ client: MongoClient; db: Db }> {
  if (db) return { client, db };

  if (!uri) throw new Error("MONGODB_URI manquant");
  client = new MongoClient(uri);

  await client.connect();
  db = dbName ? client.db(dbName) : client.db();

  await db.collection("student_summaries").createIndex({ email: 1 }, { unique: true });
  await db.collection("prompts").createIndex({ key: 1 }, { unique: true });
  await db.collection("configs").createIndex({ key: 1 }, { unique: true });
  await db.collection("programs").createIndex({ key: 1 }, { unique: true });
  await db.collection("student_usage").createIndex({ email: 1, period: 1 },{ unique: true });

  logger.info("✅ Mongo connecté");

  return { client, db };
}

export function getDb(): Db {
  if (!db) throw new Error("Mongo non initialisé. Appellez initMongo() d'abord.");
  return db;
}

export async function closeMongo() {
  if (client) {
    await client.close();
    logger.info("🛑 MongoDB déconnecté");
  }
}
