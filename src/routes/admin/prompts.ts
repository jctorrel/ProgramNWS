// src/routes/prompts.ts
import express from "express";
import { logger } from "../../utils/logger";
import {
  listPrompts,
  getPrompt,
  upsertPrompt,
  deletePrompt,
} from "../../db/prompts";

export default function createPromptsRouter(): express.Router {
  const router = express.Router();

  // GET /api/admin/prompts
  router.get("/", async (_req, res) => {
    try {
      const prompts = await listPrompts();
      res.json(prompts);
    } catch (err) {
      logger.error("Erreur GET /api/admin/prompts :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // GET /api/admin/prompts/:key
  router.get("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const prompt = await getPrompt(key);
      if (!prompt) {
        return res.status(404).json({ error: "not_found" });
      }
      res.json(prompt);
    } catch (err) {
      logger.error("Erreur GET /api/admin/prompts/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // PUT /api/admin/prompts/:key  (création / mise à jour)
  router.put("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const { content, label, type } = req.body || {};

      if (typeof content !== "string" || content.trim() === "") {
        return res.status(400).json({ error: "invalid_content" });
      }

      const updated = await upsertPrompt(key, content, { label, type });
      res.json(updated);
    } catch (err) {
      logger.error("Erreur PUT /api/admin/prompts/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // (optionnel) DELETE /api/admin/prompts/:key
  router.delete("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      await deletePrompt(key);
      res.json({ ok: true });
    } catch (err) {
      logger.error("Erreur DELETE /api/admin/prompts/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  return router;
}
