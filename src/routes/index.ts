
import express from "express";

import { logger } from "../utils/logger";
import createAuthRouter from "./auth";
import createProgramsRouter from "./admin/programs";
import createAIRouter from "./admin/ai";
import createSyllabusRouter from "./syllabus";
import { requireAuth } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/adminMiddleware";

export default function createApiRouter(args: any): express.Router {
    const router = express.Router();

    // Routes publiques
    router.use("/auth", createAuthRouter());
    router.use("/syllabus", createSyllabusRouter());

    // Routes protégées
    router.use(requireAuth);

    // Routes admin
    router.use(requireAdmin);
    router.use("/admin/ai", createAIRouter(args.openai));
    router.use("/admin/programs", createProgramsRouter());

    logger.info('✅ API routes initialisées.');

    return router;
}