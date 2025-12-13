// routes/admin/ai.js
import express from "express";
import type OpenAI from "openai";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../middleware/authMiddleware";

export default function createAIRouter(openai: OpenAI): express.Router {
  const router = express.Router();

  router.post("/", async (_req: AuthRequest, res) => {
    try {

      const { program, message } = _req.body;
      if (!program || !message) {
        throw new Error("Instructions and program are required for AI.");
      }
      const openaiOk = await testOpenAIConnection(openai);
      // Si ok => 200, sinon => 503
      res.status(openaiOk ? 200 : 503).json({ok: true, program: JSON.stringify(program)});
    } catch (error) {
      logger.error('AI check error:', error);
      res.status(500).json({ ok: false, error: 'ai_check_failed' });
    }
  });

  return router;
}

async function testOpenAIConnection(openai: OpenAI): Promise<boolean> {
  try {
    await openai.models.list();
    return true;
  } catch (err) {
    logger.error("HealthCheck OpenAI failed:", err);
    return false;
  }
}