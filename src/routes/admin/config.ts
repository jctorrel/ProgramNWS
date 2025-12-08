// src/routes/admin/config.ts
import express from "express";
import { getMentorConfig, upsertMentorConfig, MentorConfig } from "../../db/config";
import { logger } from "../../utils/logger";

export default function createAdminConfigRouter(): express.Router {
  const router = express.Router();

  // GET /api/admin/config
  router.get("/config", async (_req, res) => {
    try {
      const cfg = await getMentorConfig();
      if (!cfg) {
        // Pas de config en base
        return res.status(404).json({ error: "config_not_found" });
      }
      res.json(cfg);
    } catch (err) {
      logger.error("Erreur GET /api/admin/config :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // PUT /api/admin/config
  router.put("/config", async (req, res) => {
    try {
      const { school_name, tone, rules } = req.body || {};

      // Validation très simple (tu peux raffiner)
      if (
        typeof school_name !== "string" ||
        typeof tone !== "string" ||
        typeof rules !== "string"
      ) {
        return res.status(400).json({ error: "invalid_payload" });
      }

      const cfg: MentorConfig = { school_name, tone, rules };
      const saved = await upsertMentorConfig(cfg);

      if( !saved || !saved.data ) {
        throw new Error("Upsert failed, no data returned");
      }
      res.json(saved.data);
    } catch (err) {
      logger.error("Erreur PUT /api/admin/config :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  return router;
}
