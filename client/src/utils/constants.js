// src/utils/constants.js

export const FILIERES = [
    { code: 'DW', label: 'Développement web' },
    { code: 'CG', label: 'Communication graphique' },
    { code: 'C&MD', label: 'Communication et Marketing digital' }
];

export const ANNEES = [
    { value: '1', label: 'Année 1' },
    { value: '2', label: 'Année 2' },
    { value: '3', label: 'Année 3' },
    { value: '4', label: 'Année 4' },
    { value: '5', label: 'Année 5' }
];

export const MOIS = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' },
];

// Utilitaires
export function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

export function generateUniqueId() {
    return `module_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// Décomposer une clé (format: "A1", "A2DW", "A3C&MD")
export function parseKey(key) {
    if (!key || !key.startsWith('A')) {
        return { year: '', filiere: '' };
    }

    const withoutA = key.substring(1);
    
    if (withoutA === '1') {
        return { year: '1', filiere: '' };
    }
    
    const yearMatch = withoutA.match(/^(\d)/);
    if (yearMatch) {
        const year = yearMatch[1];
        const filiere = withoutA.substring(1);
        return { year, filiere };
    }
    
    return { year: '', filiere: '' };
}

// Générer une clé (format: "A1" ou "A2DW")
export function generateKey(year, filiere) {
    if (!year) return '';
    if (year === '1') return 'A1';
    if (!filiere) return '';
    return `A${year}${filiere}`;
}