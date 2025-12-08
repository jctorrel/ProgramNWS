// src/hooks/usePrograms.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer la liste des programmes
 * @returns {Object} État et fonctions pour gérer les programmes
 */
export function usePrograms() {
    const [state, setState] = useState({
        programs: [],
        loading: true,
        error: null,
        selectedProgram: null,
    });

    // Charger la liste des programmes au montage
    useEffect(() => {
        loadPrograms();
    }, []);

    /**
     * Charge la liste des programmes depuis l'API
     */
    const loadPrograms = async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const list = await apiFetch("/api/admin/programs");
            
            setState(prev => ({
                ...prev,
                programs: list,
                loading: false,
                // Conserver la sélection si le programme existe toujours
                selectedProgram: prev.selectedProgram 
                    ? list.find(p => p.key === prev.selectedProgram.key) || null
                    : null,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                programs: [],
                loading: false,
                error: error?.message || "Erreur lors du chargement des programmes",
                selectedProgram: null,
            }));
        }
    };

    /**
     * Sélectionne un programme par sa clé
     */
    const selectProgram = (key) => {
    console.log('selectProgram appelé avec key:', key); // ✅ Ajoute ça
    setState(prev => {
        console.log('Programs disponibles:', prev.programs); // ✅ Et ça
        const program = prev.programs.find((p) => p.key === key);
        console.log('Programme trouvé:', program); // ✅ Et ça
        if (program) {
            return {
                ...prev,
                selectedProgram: program,
            };
        }
        return prev;
    });
};

    /**
     * Crée un nouveau programme
     */
    const createProgram = async (key) => {
        if (!key || !key.trim()) {
            throw new Error("La clé du programme est requise");
        }

        try {
            await apiFetch(`/api/admin/programs/${key}`, {
                method: "PUT",
                body: JSON.stringify({
                    key,
                    label: "",
                    description: "",
                    modules: [],
                }),
            });

            // Recharger la liste
            const list = await apiFetch("/api/admin/programs");
            const newProgram = list.find(p => p.key === key);
            
            setState(prev => ({
                ...prev,
                programs: list,
                selectedProgram: newProgram || null,
            }));
        } catch (error) {
            throw new Error(
                error?.message || "Impossible de créer le programme"
            );
        }
    };

    /**
     * Supprime un programme
     */
    const deleteProgram = async (key) => {
        if (!key) {
            throw new Error("Aucun programme sélectionné");
        }

        try {
            await apiFetch(`/api/admin/programs/${key}`, {
                method: "DELETE",
            });

            // Recharger la liste et déselectionner
            await loadPrograms();
            
            setState(prev => ({
                ...prev,
                selectedProgram: null,
            }));
        } catch (error) {
            throw new Error(
                error?.message || "Impossible de supprimer le programme"
            );
        }
    };

    /**
     * Met à jour un programme dans la liste après sauvegarde
     */
    const refreshPrograms = async () => {
        try {
            const list = await apiFetch("/api/admin/programs");
            setState(prev => {
                // Conserver la sélection en retrouvant le programme mis à jour
                const updatedSelected = prev.selectedProgram
                    ? list.find(p => p.key === prev.selectedProgram.key)
                    : null;
                
                return {
                    ...prev,
                    programs: list,
                    selectedProgram: updatedSelected,
                };
            });
        } catch (error) {
            console.error("Erreur lors du rafraîchissement:", error);
        }
    };

    return {
        programs: state.programs,
        loading: state.loading,
        error: state.error,
        selectedProgram: state.selectedProgram,
        selectProgram,
        createProgram,
        deleteProgram,
        refreshPrograms,
    };
}