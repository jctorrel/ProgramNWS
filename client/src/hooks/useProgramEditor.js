// src/hooks/useProgramEditor.js
import { useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer l'édition d'un programme
 * Compatible avec le nouveau ProgramEditor structuré
 * 
 * @param {Function} onSaveSuccess - Callback appelé après une sauvegarde réussie
 * @returns {Object} État et fonctions pour éditer le programme
 */
export function useProgramEditor(onSaveSuccess) {
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState(null);

    /**
     * Sauvegarde le programme via l'API
     * @param {Object} programData - Les données du programme à sauvegarder
     */
    const save = async (programData) => {
        if (!programData?.key) {
            setError("La clé du programme est requise");
            return;
        }

        // Validation basique
        if (!programData.label) {
            setError("Le nom du programme est requis");
            return;
        }

        if (!programData.modules || !Array.isArray(programData.modules)) {
            setError("Le programme doit contenir au moins un module");
            return;
        }

        setSaving(true);
        setError(null);
        setSaveMessage("");

        try {
            await apiFetch(`/api/admin/programs/${programData.key}`, {
                method: "PUT",
                body: JSON.stringify(programData),
            });

            setSaveMessage("Programme sauvegardé ✔");
            
            // Auto-clear le message après 3 secondes
            setTimeout(() => setSaveMessage(""), 3000);

            // Notifier le parent pour rafraîchir la liste
            if (onSaveSuccess) {
                await onSaveSuccess();
            }
        } catch (err) {
            setError(err?.message || "Erreur lors de la sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    /**
     * Supprime un programme
     * @param {string} programKey - La clé du programme à supprimer
     */
    const deleteProgram = async (programKey) => {
        if (!programKey) {
            setError("La clé du programme est requise");
            return;
        }

        setSaving(true);
        setError(null);
        setSaveMessage("");

        try {
            await apiFetch(`/api/admin/programs/${programKey}`, {
                method: "DELETE",
            });

            setSaveMessage("Programme supprimé ✔");
            
            // Auto-clear le message après 3 secondes
            setTimeout(() => setSaveMessage(""), 3000);

            // Notifier le parent pour rafraîchir la liste
            if (onSaveSuccess) {
                await onSaveSuccess();
            }
        } catch (err) {
            setError(err?.message || "Erreur lors de la suppression");
        } finally {
            setSaving(false);
        }
    };

    /**
     * Réinitialise les messages d'erreur et de succès
     */
    const clearMessages = () => {
        setError(null);
        setSaveMessage("");
    };

    return {
        saving,
        saveMessage,
        error,
        save,
        deleteProgram,
        clearMessages,
    };
}