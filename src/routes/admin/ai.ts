// routes/admin/ai.js
import express from "express";
import type OpenAI from "openai";
import { logger } from "../../utils/logger";
import getEnv from "../../utils/env";
import { AuthRequest } from "../../middleware/authMiddleware";

const AI_MODEL = getEnv("AI_MODEL");
const prompt: string = `Tu es un assistant IA spécialisé dans la modification de programmes académiques.
Tu reçois un programme au format JSON et des instructions de l'utilisateur.
RÈGLES IMPORTANTES :
1. Retourne UNIQUEMENT le JSON modifié, sans texte avant ou après
2. Conserve la structure exacte du JSON
3. Ne modifie que ce qui est demandé
4. Les mois sont des nombres : 1=Jan, 2=Fév, ..., 9=Sep, 12=Déc
5. Les dates des livrables au format YYYY-MM-DD
6. Génère des IDs uniques pour les nouveaux modules (ex: Charte Graphique => charte-graphique)
7. Garde tous les champs existants, même si non modifiés`;

export default function createAIRouter(openai: OpenAI): express.Router {
  const router = express.Router();

  router.post("/", async (_req: AuthRequest, res) => {
    try {

      const { program, message } = _req.body;
      if (!program || !message) {
        throw new Error("Instructions and program are required for AI.");
      }
      const openaiOk = await testOpenAIConnection(openai);

      const reply = await openai.responses.create({
        model: AI_MODEL,
        instructions: prompt,
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: message
              },
              {
                type: "input_text",
                text: JSON.stringify(program)
              }
            ]
          }
        ]
      });

      // Si ok => 200, sinon => 503
      res.status(openaiOk ? 200 : 503).json({ ok: true, program: reply.output_text});
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