// src/routes/admin/programs.ts - VERSION COMPLÈTE avec publication
import express from "express";
import { logger } from "../../utils/logger";
import { AuthRequest } from "../../middleware/authMiddleware";
import {
  listPrograms,
  getProgram,
  upsertProgram,
  deleteProgram,
  publishProgram,
  unpublishProgram,
  regeneratePublishToken,
} from "../../db/programs";

export default function createProgramsRouter(): express.Router {
  const router = express.Router();

  // GET /api/admin/programs
  router.get("/", async (_req: AuthRequest, res) => {
    try {
      const programs = await listPrograms();
      res.json(programs);
    } catch (err) {
      logger.error("Erreur GET /api/admin/programs :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // GET /api/admin/programs/:key
  router.get("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const program = await getProgram(key);
      if (!program) {
        return res.status(404).json({ error: "not_found" });
      }
      res.json(program);
    } catch (err) {
      logger.error("Erreur GET /api/admin/programs/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // PUT /api/admin/programs/:key
  router.put("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      const body = req.body;

      if (typeof body !== "object" || !body) {
        return res.status(400).json({ error: "invalid_json" });
      }

      const updated = await upsertProgram(key, body);
      res.json(updated);
    } catch (err) {
      logger.error("Erreur PUT /api/admin/programs/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // DELETE /api/admin/programs/:key
  router.delete("/:key", async (req, res) => {
    try {
      const key = req.params.key;
      await deleteProgram(key);
      res.json({ ok: true });
    } catch (err) {
      logger.error("Erreur DELETE /api/admin/programs/:key :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // ==========================================
  // ROUTES DE PUBLICATION
  // ==========================================

  // POST /api/admin/programs/:key/publish
  // Publie un programme et génère un token
  router.post("/:key/publish", async (req, res) => {
    try {
      const key = req.params.key;

      // Vérifier que le programme existe
      const program = await getProgram(key);
      if (!program) {
        return res.status(404).json({ error: "not_found" });
      }

      // Publier et générer le token
      const { publishToken, publishedAt } = await publishProgram(key);

      logger.info(`Programme ${key} publié avec le token ${publishToken}`);

      res.json({
        ok: true,
        publishToken,
        publishedAt,
        publicUrl: `/syllabus/${publishToken}`
      });
    } catch (err) {
      logger.error("Erreur POST /api/admin/programs/:key/publish :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // POST /api/admin/programs/:key/unpublish
  // Dépublie un programme
  router.post("/:key/unpublish", async (req, res) => {
    try {
      const key = req.params.key;

      // Vérifier que le programme existe
      const program = await getProgram(key);
      if (!program) {
        return res.status(404).json({ error: "not_found" });
      }

      await unpublishProgram(key);

      logger.info(`Programme ${key} dépublié`);

      res.json({ ok: true });
    } catch (err) {
      logger.error("Erreur POST /api/admin/programs/:key/unpublish :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  // POST /api/admin/programs/:key/regenerate-token
  // Régénère le token de publication
  router.post("/:key/regenerate-token", async (req, res) => {
    try {
      const key = req.params.key;

      // Vérifier que le programme existe
      const program = await getProgram(key);
      if (!program) {
        return res.status(404).json({ error: "not_found" });
      }

      const newToken = await regeneratePublishToken(key);

      logger.info(`Token régénéré pour le programme ${key}: ${newToken}`);

      res.json({
        ok: true,
        publishToken: newToken,
        publicUrl: `/syllabus/${newToken}`
      });
    } catch (err) {
      logger.error("Erreur POST /api/admin/programs/:key/regenerate-token :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  return router;
}