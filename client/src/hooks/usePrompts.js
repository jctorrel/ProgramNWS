// src/hooks/usePrompts.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer la liste des prompts et leur édition
 * @returns {Object} État et fonctions pour gérer les prompts
 */
export function usePrompts() {
    const [state, setState] = useState({
        prompts: [],
        loading: true,
        error: null,
        selectedPrompt: null,
    });

    // Charger la liste des prompts au montage
    useEffect(() => {
        let cancelled = false;

        async function loadPrompts() {
            try {
                const data = await apiFetch("/api/admin/prompts");
                
                if (cancelled) return;

                const promptsList = data || [];
                setState({
                    prompts: promptsList,
                    loading: false,
                    error: null,
                    // Sélectionner le premier prompt par défaut
                    selectedPrompt: promptsList.length > 0 ? promptsList[0] : null,
                });
            } catch (error) {
                if (cancelled) return;

                setState({
                    prompts: [],
                    loading: false,
                    error: error?.message || "Erreur lors du chargement des prompts",
                    selectedPrompt: null,
                });
            }
        }

        loadPrompts();

        return () => {
            cancelled = true;
        };
    }, []);

    /**
     * Sélectionner un prompt par sa clé
     */
    const selectPrompt = (key) => {
        const found = state.prompts.find((p) => p.key === key);
        if (found) {
            setState((prev) => ({
                ...prev,
                selectedPrompt: found,
            }));
        }
    };

    /**
     * Mettre à jour un prompt dans la liste après sauvegarde
     */
    const updatePrompt = (updatedPrompt) => {
        setState((prev) => ({
            ...prev,
            prompts: prev.prompts.map((p) =>
                p.key === updatedPrompt.key ? updatedPrompt : p
            ),
            selectedPrompt: updatedPrompt,
        }));
    };

    return {
        prompts: state.prompts,
        loading: state.loading,
        error: state.error,
        selectedPrompt: state.selectedPrompt,
        selectPrompt,
        updatePrompt,
    };
}
