// routes/chat.js
import express from "express";

import { getStudentSummary, createStudentSummary } from "../db/summaries";
import { logger } from "../utils/logger";
import render from "../utils/prompts";
import { getProgramPrompt } from "../utils/programs";
import getEnv from "../utils/env";
import { AuthRequest } from "../middleware/authMiddleware";
import { incrementAndCheckMonthlyUsage } from "../db/usage";

const MENTOR_MODEL = getEnv("MENTOR_MODEL");
const monthlyLimit = parseInt(getEnv("STUDENT_MONTHLY_MESSAGE_LIMIT", "100"));

export default function createChatRouter(args: any): express.Router {
    const router = express.Router();

    router.post("/chat", async (_req: AuthRequest, res) => {
        try {
            const { email, message, programID, mode } = _req.body;

            if (!email || !message || !programID || !mode) {
                return res
                    .status(400)
                    .json({ reply: "email, message, programID et mode sont requis." });
            }

            const usage = await incrementAndCheckMonthlyUsage(email, monthlyLimit);
            if (!usage.allowed) {
                return res.status(429).json({
                    error: "monthly_quota_exceeded",
                    message:
                        "Tu as atteint le nombre maximum d'échanges autorisés pour ce mois.",
                    limit: usage.limit,
                    count: usage.count,
                    period: usage.period,
                });
            }

            // Construction du prompt
            const previousSummary: string = await getStudentSummary(email);
            const systemPrompt: string = await getSystemPrompt(args, email, programID, previousSummary, mode, _req);

            // OpenAI
            const reply = await args.openai.responses.create({
                model: MENTOR_MODEL,
                instructions: systemPrompt,
                input: message
            });
            const mentorReply: string = reply.output_text.trim();

            // Réponse du mentor
            res.json({ mentorReply });

            // Création du résumé
            await createStudentSummary(args.summarySystemTemplate, email, message, mentorReply);
        } catch (err) {
            logger.error("Erreur /api/chat :", err);

            return res.status(500).json({
                reply:
                    "Je rencontre un problème technique. Réessaie dans un moment ou signale-le à l'équipe."
            });
        }
    });

    return router;
}

async function getSystemPrompt(args: any, email: string, programID: string, summary: string, mode: string, req: AuthRequest): Promise<string> {
    const program_context = await getProgramPrompt(programID, req);

    // Mode discussion libre
    if (mode === "free") {
        return `Tu es un assistant pédagogique en mode discussion libre.
                Tu peux répondre à toutes les questions de l'étudiant, même si elles sortent du cadre du programme.
                Voici les informations sur le résumé de ses interactions précédentes avec toi :
                ${summary || "- Aucun historique significatif pour l'instant."}`;
    }

    // Mode mentor
    return render(args.mentorSystemTemplate, {
        "email": email,
        "school_name": args.mentorConfig.school_name,
        "tone": args.mentorConfig.tone,
        "rules": args.mentorConfig.rules,
        "summary": summary || "- Aucun historique significatif pour l'instant.",
        "program": program_context
    });
}
