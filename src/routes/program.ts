// routes/health.js
import express from "express";
import { getActiveModules } from "../utils/programs";
import type { ProgramModule, Programs } from "../utils/programs";
import { AuthRequest } from "../middleware/authMiddleware";
import { getProgram } from "../db/programs";
import { logger } from "../utils/logger";

export default function createProgramRouter(programs: Programs): express.Router {
    const router = express.Router();

    router.post("/program", async (_req: AuthRequest, res) => {
        const { programID, moduleID, studentEmail } = _req.body;

        if (!programID) {
            return res
                .status(400)
                .json({ reply: "programID est requis." });
        }

        const program = await getProgram(programID);
        if (!program) {
            return res
                .status(404)
                .json({ reply: "Programme introuvable." });
        }
        const modules: ProgramModule[] = await getActiveModules(program);
        const modulesById = Object.fromEntries(modules.map(m => [m.id, m]));

        _req.session.studentEmail = studentEmail;
        _req.session.module = modulesById[moduleID];
        _req.session.initialized = true;

        logger.info("✅ Chargement du module : " + modulesById[moduleID].label);
        try {
            res.status(200).json({ ok: true, module: modulesById[moduleID].content });
        } catch (error) {
            logger.error('Program loading error:', error);
            res.status(500).json({ error: 'program_loading_failed' });
        }
    });

    return router;
}