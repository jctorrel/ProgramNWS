// routes/health.js
import express from "express";
import type OpenAI from "openai";
import { logger } from "../utils/logger";
import { AuthRequest } from "../middleware/authMiddleware";
import getEnv from "../utils/env";
import { CheckMonthlyUsage } from "../db/usage";

export default function createHealthRouter(openai: OpenAI): express.Router {
  const router = express.Router();
  const monthlyLimit = parseInt(getEnv("STUDENT_MONTHLY_MESSAGE_LIMIT", "100"));

  router.post("/health", async (_req: AuthRequest, res) => {
    try {

      const { email } = _req.body;
      if (!email) {
        throw new Error("Email is required for health check.");
      }

      const usage = await CheckMonthlyUsage(email, monthlyLimit);
      if (!usage.allowed) {
        return res.status(429).json({
          error: "monthly_quota_exceeded",
          message:
            "Nombre maximum d'échanges autorisés pour ce mois atteint.",
          limit: usage.limit,
          count: usage.count,
          period: usage.period,
        });
      }

      const openaiOk = await testOpenAIConnection(openai);
      // Si ok => 200, sinon => 503
      res.status(openaiOk ? 200 : 503).json({
        ok: true, time: new Date().toISOString(),
        limit: usage.limit,
        count: usage.count,
        period: usage.period,
      });
    } catch (error) {
      logger.error('Health check error:', error);
      res.status(500).json({ ok: false, error: 'health_check_failed' });
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