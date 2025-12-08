// src/db/usage.ts
import { getDb } from "./db";

export interface StudentUsage {
  email: string;
  period: string; // ex: "2025-03"
  count: number;
  createdAt: Date;
  updatedAt: Date;
}

// Petit helper pour calculer "AAAA-MM"
function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1; // 0-11
  const monthStr = month.toString().padStart(2, "0");
  return `${year}-${monthStr}`;
}

/**
 * Vérifie le compteur d'un étudiant pour le mois courant
 * sans l'incrémenter.
 */
export async function CheckMonthlyUsage(
  email: string,
  monthlyLimit: number
): Promise<{ allowed: boolean; count: number; limit: number; period: string }> {
  const db = getDb();
  const period = getCurrentPeriod();

  // On récupère le document existant sans le modifier
  const result = await db
    .collection<StudentUsage>("student_usage")
    .findOne({ email, period });

  // Si aucun document n'existe, l'utilisateur n'a pas encore fait de requêtes
  const currentCount = result?.count ?? 0;
  const allowed = currentCount < monthlyLimit;

  return {
    allowed,
    count: currentCount,
    limit: monthlyLimit,
    period,
  };
}

/**
 * Incrémente le compteur d'un étudiant pour le mois courant
 * et renvoie si c'est encore autorisé ou non.
 */
export async function incrementAndCheckMonthlyUsage(
  email: string,
  monthlyLimit: number
): Promise<{ allowed: boolean; count: number; limit: number; period: string }> {
  const db = getDb();
  const period = getCurrentPeriod();
  const now = new Date();

  // On incrémente d'abord
  const result = await db
    .collection<StudentUsage>("student_usage")
    .findOneAndUpdate(
      { email, period },
      {
        $inc: { count: 1 },
        $set: { updatedAt: now },
        $setOnInsert: {
          email,
          period,
          createdAt: now,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

  if (! result) {
    return { allowed: false, count: monthlyLimit + 1, limit: monthlyLimit, period };
  }

  const currentCount = result.count;

  const allowed = currentCount <= monthlyLimit;
  
  return {
    allowed,
    count: currentCount,
    limit: monthlyLimit,
    period,
  };
}
