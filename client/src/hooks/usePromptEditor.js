// src/hooks/usePromptEditor.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer l'édition et la sauvegarde d'un prompt
 * @param {Object} initialPrompt - Le prompt sélectionné
 * @param {Function} onSave - Callback appelé après une sauvegarde réussie
 * @returns {Object} État et fonctions pour éditer le prompt
 */
export function usePromptEditor(initialPrompt, onSave) {
    const [form, setForm] = useState({
        key: "",
        label: "",
        type: "",
        content: "",
    });
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState(null);

    // Mettre à jour le formulaire quand le prompt sélectionné change
    useEffect(() => {
        if (initialPrompt) {
            setForm({
                key: initialPrompt.key,
                label: initialPrompt.label || "",
                type: initialPrompt.type || "",
                content: initialPrompt.content || "",
            });
            // Réinitialiser les messages lors du changement de prompt
            setSaveMessage("");
            setError(null);
        }
    }, [initialPrompt]);

    /**
     * Mettre à jour un champ du formulaire
     */
    const updateField = (name, value) => {
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Réinitialiser les messages lors de la modification
        setSaveMessage("");
        setError(null);
    };

    /**
     * Valider le formulaire avant sauvegarde
     */
    const validate = () => {
        if (!form.key) {
            setError("Aucune clé de prompt sélectionnée.");
            return false;
        }
        if (!form.content.trim()) {
            setError("Le contenu du prompt ne peut pas être vide.");
            return false;
        }
        return true;
    };

    /**
     * Sauvegarder le prompt
     */
    const save = async () => {
        if (!validate()) return;

        setSaving(true);
        setError(null);
        setSaveMessage("");

        try {
            const body = {
                content: form.content,
                label: form.label || undefined,
                type: form.type || undefined,
            };

            const updated = await apiFetch(`/api/admin/prompts/${form.key}`, {
                method: "PUT",
                body: JSON.stringify(body),
            });

            setSaveMessage("Prompt sauvegardé ✔");
            
            // Auto-clear le message après 3 secondes
            setTimeout(() => setSaveMessage(""), 3000);

            // Notifier le parent de la mise à jour
            if (onSave) {
                onSave(updated);
            }
        } catch (err) {
            setError(err?.message || "Erreur lors de la sauvegarde du prompt");
        } finally {
            setSaving(false);
        }
    };

    return {
        form,
        saving,
        saveMessage,
        error,
        updateField,
        save,
    };
}
