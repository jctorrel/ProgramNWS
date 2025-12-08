// src/db/summaries.ts
import render from "../utils/prompts";
import { getDb } from "./db";
import getEnv from "../utils/env";
import { openai } from "../app";

const SUMMARY_MODEL = getEnv("SUMMARY_MODEL");

export async function getStudentSummary(email: string): Promise<string> {
  const db = getDb();
  const doc = await db.collection("student_summaries").findOne({ email });
  return doc?.summary || "- Aucun historique significatif pour l'instant -";
}

export async function createStudentSummary(template: string, email: string, lastUserMessage: string, lastMentorReply: string): Promise<void> {
  const previous = await getStudentSummary(email);

  const systemPrompt = render(template, {
    "previous_summary": previous,
    "last_user_message": lastUserMessage,
    "last_assistant_reply": lastMentorReply
  });

  try {
    const completion = await openai.responses.create({
      model: SUMMARY_MODEL,
      input: systemPrompt
    });

    const newSummary = completion.output_text.trim();
    await upsertStudentSummary(email, newSummary);
  } catch (err) {
    console.error("❌ Erreur updateStudentSummary (OpenAI) :", err);
  }
}

async function upsertStudentSummary(email: string, summary: string): Promise<void> {
  const db = getDb();
  await db.collection("student_summaries").updateOne(
    { email },
    { $set: { email, summary, updatedAt: new Date() } },
    { upsert: true }
  );
}
