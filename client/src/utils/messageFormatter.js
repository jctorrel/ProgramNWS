// src/utils/messageFormatter.js

const MONTHS = [
    "",
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
];

const INIT_MESSAGE =
    "Bonjour 👋\n\n" +
    "Je suis le mentor pédagogique de la Normandie Web School. \n\n " +
    "Sur quoi souhaites-tu travailler ? \n\n" +
    "# **_↓↓ Utilise la barre de navigation pour choisir l'un des modules disponibles↓↓_**";

const DEFAULT_WELCOME_MESSAGE =
    "Bonjour 👋\n" +
    "Je suis ton mentor pédagogique numérique. " +
    "Sur quoi souhaites-tu travailler aujourd'hui ?\n";

/**
 * Construit le message initial à partir de la liste de modules
 * Fonction pure → facile à tester
 * @param {Array} modules - Liste des modules du programme
 * @returns {string} Message formaté avec la liste des modules
 */
export function buildInitMessage(modules) {
    if (modules && modules.length > 0)
        return INIT_MESSAGE;
    else return DEFAULT_WELCOME_MESSAGE;
}

/**
 * Crée un message pour le chat
 * @param {number} id - ID du message
 * @param {string} sender - "user" ou "mentor"
 * @param {string} content - Contenu du message
 * @returns {Object} Objet message
 */
export function createMessage(id, sender, content) {
    return {
        id,
        sender,
        content,
    };
}

/**
 * Génère un message d'erreur par défaut
 * @returns {string} Message d'erreur formaté
 */
export function getDefaultErrorMessage() {
    return "Une erreur est survenue lors de la réponse du mentor. Réessaie plus tard.";
}
