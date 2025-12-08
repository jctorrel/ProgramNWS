// client/src/hooks/useAdminSettings.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "mentor_admin_settings";

const DEFAULT_SETTINGS = {
    freeModeEnabled: true, // Par défaut activé
};

/**
 * Hook pour gérer les paramètres d'administration
 * Persiste les paramètres dans localStorage et écoute les changements
 */
export function useAdminSettings() {
    const [settings, setSettings] = useState(() => {
        // Charger depuis localStorage au montage
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error);
        }
        return DEFAULT_SETTINGS;
    });

    // Écouter les changements de localStorage (pour sync entre onglets/composants)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    const newSettings = JSON.parse(e.newValue);
                    setSettings({ ...DEFAULT_SETTINGS, ...newSettings });
                } catch (error) {
                    console.error("Erreur lors de la lecture du changement:", error);
                }
            }
        };

        // Écouter les événements storage (changements dans d'autres onglets)
        window.addEventListener('storage', handleStorageChange);

        // Polling pour détecter les changements dans le même onglet
        const interval = setInterval(() => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const newSettings = JSON.parse(stored);
                    setSettings(prev => {
                        // Ne mettre à jour que si différent
                        if (JSON.stringify(prev) !== JSON.stringify(newSettings)) {
                            return { ...DEFAULT_SETTINGS, ...newSettings };
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Erreur polling settings:", error);
            }
        }, 500); // Vérifier toutes les 500ms

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    // Sauvegarder dans localStorage à chaque changement
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error("Erreur lors de la sauvegarde des paramètres:", error);
        }
    }, [settings]);

    /**
     * Met à jour les paramètres
     */
    const updateSettings = (newSettings) => {
        setSettings(newSettings);
    };

    /**
     * Réinitialise les paramètres par défaut
     */
    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    return {
        settings,
        updateSettings,
        resetSettings,
    };
}
