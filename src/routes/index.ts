
import express from "express";

import { logger } from "../utils/logger";
import createHealthRouter from "./health";
import createChatRouter from "./chat";
import createInitRouter from "./init";
import createProgramRouter from "./program";
import createAuthRouter from "./auth";
import createConfigRouter from "./admin/config";
import createPromptsRouter from "./admin/prompts";
import createProgramsRouter from "./admin/programs";
import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

export default function createApiRouter(args: any): express.Router {
    const router = express.Router();

    // Routes publiques
    router.use("/auth", createAuthRouter());

    // Routes protégées
    router.use(requireAuth);
    router.use("/", createHealthRouter(args.openai));
    router.use("/", createInitRouter(args.programs));
    router.use("/", createProgramRouter(args.programs));
    router.use("/", createChatRouter(args));

    // Routes admin
    router.use(requireAdmin);
    router.use("/admin", createConfigRouter());
    router.use("/admin/prompts", createPromptsRouter());
    router.use("/admin/programs", createProgramsRouter());

    logger.info('✅ API routes initialisées.');

    return router;
}