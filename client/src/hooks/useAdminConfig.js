// src/hooks/useAdminConfig.js
import { useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer la sauvegarde et mise à jour de la configuration
 * @param {Object} initialConfig - Configuration initiale
 * @returns {Object} État et fonctions pour gérer la configuration
 */
export function useAdminConfig(initialConfig) {
    const [config, setConfig] = useState(initialConfig);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [error, setError] = useState(null);

    const updateField = (name, value) => {
        setConfig((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Réinitialiser les messages lors de la modification
        setSaveMessage("");
        setError(null);
    };

    const saveConfig = async () => {
        setSaving(true);
        setSaveMessage("");
        setError(null);

        try {
            const body = {
                school_name: config.school_name,
                tone: config.tone,
                rules: config.rules,
            };

            const saved = await apiFetch("/api/admin/config", {
                method: "PUT",
                body: JSON.stringify(body),
            });

            setConfig({
                school_name: saved.school_name || "",
                tone: saved.tone || "",
                rules: saved.rules || "",
            });

            setSaveMessage("Configuration sauvegardée ✔");
            
            // Auto-clear le message de succès après 3 secondes
            setTimeout(() => setSaveMessage(""), 3000);
        } catch (err) {
            setError(err?.message || "Erreur lors de la sauvegarde de la config");
        } finally {
            setSaving(false);
        }
    };

    return {
        config,
        saving,
        saveMessage,
        error,
        updateField,
        saveConfig,
    };
}
