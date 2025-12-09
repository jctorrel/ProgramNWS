// src/utils/programs.ts

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
  deliverables?: Deliverable[];
};

export type Program = {
  key: string;
  label: string;
  description?: string;
  modules: ProgramModule[];
  objectives?: string;
  level?: string;
  resources?: string[];
};

export type Programs = Record<string, Program>;

export async function getActiveModules(
  program: Program,
  date: Date = new Date()
): Promise<ProgramModule[]> {
  const currentMonth = date.getMonth() + 1; 

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