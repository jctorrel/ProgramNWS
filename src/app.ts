import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "node:path";

import { initMongo } from "./db/db";
import createApiRouter from "./routes/index";
import getEnv from "./utils/env";
import { logger } from "./utils/logger";
import { listPrograms } from "./db/programs";
import type { ProgramModule } from "./utils/programs";


// DB
const mongoUri = getEnv("MONGODB_URI");
// OpenAI client
export const openai = new OpenAI({ apiKey: getEnv("OPENAI_API_KEY") });

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

  // DB
  await initMongo(mongoUri);

  // Programs
  const programs = await listPrograms();

  // ---------- STATIC FRONTEND EN PROD ----------
  const staticDir = path.resolve(__dirname, "../public");
  app.use(express.static(staticDir));

  // Routes
  app.use("/api", createApiRouter({
    openai,
    programs
  }));

  // Catch-all pour React Router (après les routes API)
  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });

  return app;
}