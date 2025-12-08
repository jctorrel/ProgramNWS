import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo'; // ✅ Ajouter cet import
import cors from "cors";
import OpenAI from "openai";
import path from "node:path";

import { initMongo } from "./db/db";
import createApiRouter from "./routes/index";
import getEnv from "./utils/env";
import { logger } from "./utils/logger";
import { getPromptContent } from "./db/prompts";
import { getMentorConfig } from "./db/config";
import { listPrograms } from "./db/programs";
import type { ProgramModule } from "./utils/programs";

// Session
declare module 'express-session' {
  interface SessionData {
    studentEmail: string;
    module: ProgramModule;
    initialized: boolean;
  }
}

// DB
const mongoUri = getEnv("MONGODB_URI");
// OpenAI client
export const openai = new OpenAI({ apiKey: getEnv("OPENAI_API_KEY") });
// Prompts
const mentorPromptTemplate = getEnv("MENTOR_PROMPT_TEMPLATE");
const summaryPromptTemplate = getEnv("SUMMARY_PROMPT_TEMPLATE");
// Frontend origin for CORS
const FRONTEND_ORIGIN =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_ORIGIN
    : "https://localhost:3000";

export default async function buildApp(): Promise<express.Express> {
  const app = express();

  // Middlewares
  app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
  app.use(express.json());

  // ✅ Configuration session avec MongoDB
  app.use(session({
    store: MongoStore.create({
      mongoUrl: mongoUri,
      collectionName: 'sessions',
      ttl: 60 * 60 * 2, // 2h de conversation
      autoRemove: 'native',
      touchAfter: 60 // Optimisation : update max 1x/minute
    }),
    secret: getEnv("SESSION_SECRET"),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2, // 2h (cohérent avec le TTL)
      sameSite: 'lax'
    },
    name: 'mentorai.sid' // Nom custom pour le cookie
  }));

  // DB
  await initMongo(mongoUri);

  // Config
  const mentorConfig = await getMentorConfig();

  // Programs
  const programs = await listPrograms();

  // Prompts
  const mentorSystemTemplate: string | null = await getPromptContent(mentorPromptTemplate);
  const summarySystemTemplate: string | null = await getPromptContent(summaryPromptTemplate);

  if (!mentorConfig) {
    logger.error("Config introuvable");
    throw new Error("Config introuvable");
  }
  if (!programs) {
    logger.error("Programs introuvables");
    throw new Error("Programs introuvables");
  }
  if (!mentorSystemTemplate) {
    logger.error(`Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
    throw new Error(`Prompt mentor introuvable pour la clé : ${mentorPromptTemplate}`);
  }
  if (!summarySystemTemplate) {
    logger.error(`Prompt summary introuvable pour la clé : ${summaryPromptTemplate}`);
    throw new Error(`Prompt summary introuvable pour la clé : ${summaryPromptTemplate}`);
  }

  logger.info("✅ Config et prompts chargés");

  // ---------- STATIC FRONTEND EN PROD ----------
  const staticDir = path.resolve(__dirname, "../public");
  app.use(express.static(staticDir));

  // Routes
  app.use("/api", createApiRouter({
    openai,
    mentorSystemTemplate,
    summarySystemTemplate,
    mentorConfig,
    programs
  }));

  // Catch-all pour React Router (après les routes API)
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });

  return app;
}