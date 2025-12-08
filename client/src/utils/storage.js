// src/utils/storage.js

/**
 * Récupère l'utilisateur courant depuis le localStorage de manière sûre
 * @returns {Object|null} L'objet utilisateur ou null
 */
export function getCurrentUser() {
    try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        
        const user = JSON.parse(raw);
        return user;
    } catch (error) {
        console.error("Erreur lors de la lecture du localStorage:", error);
        return null;
    }
}

/**
 * Récupère l'email de l'utilisateur courant
 * @returns {string} L'email ou une chaîne vide
 */
export function getCurrentUserEmail() {
    const user = getCurrentUser();
    return user?.email || "";
}
