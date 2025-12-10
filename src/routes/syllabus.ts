// src/routes/public/syllabus.ts
import express from "express";
import { logger } from "../utils/logger";
import { getProgramByToken } from "../db/programs";

export default function createSyllabusRouter(): express.Router {
  const router = express.Router();

  // GET /api/syllabus/:token
  // Route publique pour accéder à un syllabus avec son token
  router.get("/:token", async (req, res) => {
    try {
      const token = req.params.token;

      // Validation basique du token (64 caractères hexadécimaux)
      if (!/^[a-f0-9]{64}$/i.test(token)) {
        return res.status(400).json({ error: "invalid_token_format" });
      }

      // Récupérer le programme publié
      const program = await getProgramByToken(token);

      if (!program) {
        return res.status(404).json({ error: "not_found_or_not_published" });
      }

      // Retourner le programme sans les infos sensibles
      const publicProgram = {
        key: program.key,
        label: program.label,
        description: program.description,
        modules: program.modules,
        publishedAt: program.publishedAt
      };

      res.json(publicProgram);
    } catch (err) {
      logger.error("Erreur GET /api/syllabus/:token :", err);
      res.status(500).json({ error: "internal_error" });
    }
  });

  return router;
}