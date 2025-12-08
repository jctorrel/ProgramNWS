// src/routes/admin/programs.ts
import express from "express";
import { logger } from "../../utils/logger";
import {
  listPrograms,
  getProgram,
  upsertProgram,
  deleteProgram,
} from "../../db/programs";

export default function createProgramsRouter(): express.Router {
  const router = express.Router();

  // GET /api/admin/programs
  router.get("/", async (_req, res) => {
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

  return router;
}
