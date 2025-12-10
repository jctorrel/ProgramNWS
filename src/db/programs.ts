// src/db/programs.ts
import { logger } from "../utils/logger";
import { getDb } from "./db";
import crypto from 'crypto';

export interface Deliverable {
  descriptif: string;
  date: string; // Format: YYYY-MM-DDTHH:mm ou YYYY-MM-DD
}

export interface ProgramModule {
  id: string;
  label: string;
  start_month: number;
  end_month: number;
  content: string[];
  deliverables?: Deliverable[];
}

export interface Program {
  key: string;
  label: string;
  description?: string;
  modules: ProgramModule[];
  objectives?: string;
  resources?: string[];
  published?: boolean;
  publishToken?: string | null;
  publishedAt?: Date | null;
  updatedAt: Date;
  createdAt: Date;
}

const COLLECTION = "programs";

/**
 * Liste des programmes
 */
export async function listPrograms(): Promise<Program[]> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).find().sort({ key: 1 }).toArray();
}

/**
 * Récupérer un programme par clé
 */
export async function getProgram(key: string): Promise<Program | null> {
  const db = getDb();
  return db.collection<Program>(COLLECTION).findOne({ key });
}

/**
 * Mettre à jour ou créer un programme
 */
export async function upsertProgram(key: string, data: Partial<Program>): Promise<Program> {
  const db = getDb();
  const now = new Date();

  const { label, description, objectives, level, resources, modules } = data;

  // Validation basique
  if (!label) {
    throw new Error("Le champ 'label' est requis");
  }
  if (!modules || !Array.isArray(modules)) {
    throw new Error("Le champ 'modules' est requis et doit être un tableau");
  }

  const update = {
    $set: {
      key,
      label,
      description: description || "",
      modules,
      updatedAt: now,
      // Champs optionnels (pour rétrocompatibilité)
      ...(objectives !== undefined && { objectives }),
      ...(level !== undefined && { level }),
      ...(resources !== undefined && { resources }),
    },
    $setOnInsert: {
      createdAt: now,
    },
  };
  
  const result = await db
    .collection<Program>(COLLECTION)
    .findOneAndUpdate(
      { key }, 
      update, 
      { 
        upsert: true, 
        returnDocument: "after" 
      }
    );

  if (!result || !result.key) {
    logger.error("Échec upsertProgram() pour la clé :", key);
    throw new Error("Échec upsertProgram()");
  }

  logger.info(`Programme ${key} ${data.createdAt ? 'créé' : 'mis à jour'} avec succès`);

  return result;
}

/**
 * Supprimer un programme
 */
export async function deleteProgram(key: string): Promise<void> {
  const db = getDb();
  const result = await db.collection(COLLECTION).deleteOne({ key });
  
  if (result.deletedCount === 0) {
    logger.warn(`Aucun programme trouvé pour la suppression avec la clé : ${key}`);
  } else {
    logger.info(`Programme ${key} supprimé avec succès`);
  }
}

/**
 * Récupérer tous les modules actifs d'un programme pour une date donnée
 */
export async function getActiveModulesForProgram(
  key: string,
  date: Date = new Date()
): Promise<ProgramModule[]> {
  const program = await getProgram(key);
  
  if (!program) {
    return [];
  }

  const currentMonth = date.getMonth() + 1; // JS: 0 = janvier → +1

  return program.modules.filter((module) => {
    const start = module.start_month;
    const end = module.end_month;

    // cas normal (ex: 9 → 11)
    if (start <= end) {
      return currentMonth >= start && currentMonth <= end;
    }

    // cas chevauchement d'année (ex: 9 → 8)
    return currentMonth >= start || currentMonth <= end;
  });
}

/**
 * Récupérer un module spécifique d'un programme
 */
export async function getProgramModule(
  programKey: string,
  moduleId: string
): Promise<ProgramModule | null> {
  const program = await getProgram(programKey);
  
  if (!program) {
    return null;
  }

  return program.modules.find((m) => m.id === moduleId) || null;
}

// ========================================
// FONCTIONS DE PUBLICATION
// ========================================

/**
 * Génère un token de publication sécurisé
 */
export function generatePublishToken(): string {
  return crypto.randomBytes(32).toString('hex'); // 64 caractères
}

/**
 * Publie un programme et génère un token
 */
export async function publishProgram(key: string): Promise<{ publishToken: string; publishedAt: Date }> {
  const db = getDb();
  const publishToken = generatePublishToken();
  const publishedAt = new Date();

  await db.collection<Program>(COLLECTION).updateOne(
    { key },
    {
      $set: {
        published: true,
        publishToken,
        publishedAt
      }
    }
  );

  logger.info(`Programme ${key} publié avec le token ${publishToken}`);

  return { publishToken, publishedAt };
}

/**
 * Dépublie un programme
 */
export async function unpublishProgram(key: string): Promise<void> {
  const db = getDb();
  
  await db.collection<Program>(COLLECTION).updateOne(
    { key },
    {
      $set: {
        published: false,
        publishToken: null,
        publishedAt: null
      }
    }
  );

  logger.info(`Programme ${key} dépublié`);
}

/**
 * Régénère le token de publication
 */
export async function regeneratePublishToken(key: string): Promise<string> {
  const db = getDb();
  const publishToken = generatePublishToken();

  await db.collection<Program>(COLLECTION).updateOne(
    { key },
    {
      $set: {
        publishToken,
        publishedAt: new Date()
      }
    }
  );

  logger.info(`Token régénéré pour le programme ${key}: ${publishToken}`);

  return publishToken;
}

/**
 * Récupère un programme publié par son token
 */
export async function getProgramByToken(token: string): Promise<Program | null> {
  const db = getDb();
  
  const program = await db.collection<Program>(COLLECTION).findOne({
    publishToken: token,
    published: true
  });

  return program;
}

/**
 * Vérifie si un programme est publié
 */
export async function isProgramPublished(key: string): Promise<boolean> {
  const db = getDb();
  
  const program = await db.collection<Program>(COLLECTION).findOne({ 
    key, 
    published: true 
  });
  
  return !!program;
}