// src/utils/programs.ts
import { logger } from "./logger";
import render from "./prompts";
import { getPromptContent } from "../db/prompts";
import getEnv from "./env";
import { getProgram } from "../db/programs";
import { AuthRequest } from "../middleware/authMiddleware";

export type Deliverable = {
  descriptif: string;
  date: string; // Format: YYYY-MM-DDTHH:mm ou YYYY-MM-DD
};

export type ProgramModule = {
  id: string;
  label: string;
  start_month: number;
  end_month: number;
  content: string[];
  deliverables?: Deliverable[]; // Optionnel pour rétrocompatibilité
};

export type Program = {
  key: string;
  label: string;
  description?: string;
  modules: ProgramModule[];
  // Champs optionnels pour rétrocompatibilité
  objectives?: string;
  level?: string;
  resources?: string[];
};

export type Programs = Record<string, Program>;

const programsPromptTemplate = getEnv("PROGRAMS_PROMPT_TEMPLATE");

export async function getActiveModules(
  program: Program,
  date: Date = new Date()
): Promise<ProgramModule[]> {
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
 * Récupère les livrables à venir pour un module donné
 */
export function getUpcomingDeliverables(
  module: ProgramModule,
  date: Date = new Date()
): Deliverable[] {
  if (!module.deliverables || module.deliverables.length === 0) {
    return [];
  }

  const now = date.getTime();
  
  return module.deliverables
    .filter((deliverable) => {
      if (!deliverable.date) return false;
      const deliverableDate = new Date(deliverable.date).getTime();
      return deliverableDate >= now;
    })
    .sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}

/**
 * Formate un livrable pour l'affichage
 */
function formatDeliverable(deliverable: Deliverable): string {
  const date = new Date(deliverable.date);
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  return `${deliverable.descriptif} (échéance: ${dateStr})`;
}

export async function getProgramPrompt(
  programID: string,
  req: AuthRequest,
  date: Date = new Date()
): Promise<string> {
  if (!req.session.initialized) {
    const program = await getProgram(programID);

    if (!program || !Array.isArray(program.modules)) {
      logger.error(`Programme introuvable ou invalide pour l'ID : ${programID}`);
      return "";
    }

    const programSystemTemplate: string | null = await getPromptContent(
      programsPromptTemplate
    );
    const modules: ProgramModule[] = await getActiveModules(program, date);

    if (!programSystemTemplate) {
      logger.error(`Prompt programme introuvable pour la clé : ${programsPromptTemplate}`);
      throw new Error(`Prompt programme introuvable pour la clé : ${programsPromptTemplate}`);
    }

    // Construction du contexte des modules avec deliverables
    const modulesContext = modules.map((module) => {
      let moduleStr = `- ${module.label} : ${module.content.join(", ")}`;
      
      // Ajout des livrables à venir si présents
      const upcomingDeliverables = getUpcomingDeliverables(module, date);
      if (upcomingDeliverables.length > 0) {
        const deliverablesStr = upcomingDeliverables
          .map((d) => `  • ${formatDeliverable(d)}`)
          .join("\n");
        moduleStr += `\n  Livrables à venir :\n${deliverablesStr}`;
      }
      
      return moduleStr;
    }).join("\n");

    return render(programSystemTemplate, {
      program_label: program.label,
      program_description: program.description || "",
      program_objective: program.objectives || "",
      program_level: program.level || "",
      program_resources: program.resources?.join(", ") || "",
      program_modules: modulesContext,
    });
  } else {
    return !req.session.module ? "" : "Focus : " + moduleToString(req.session.module, date);
  }
}

function moduleToString(module: ProgramModule, date: Date = new Date()): string {
  let result = `${module.label} (${module.content.join(', ')})`;
  
  // Ajout des livrables à venir
  const upcomingDeliverables = getUpcomingDeliverables(module, date);
  if (upcomingDeliverables.length > 0) {
    result += `\nLivrables à venir : ${upcomingDeliverables
      .map((d) => formatDeliverable(d))
      .join(', ')}`;
  }
  
  return result;
}