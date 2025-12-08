// src/hooks/useModules.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { buildInitMessage, createMessage } from "../utils/messageFormatter";

const PROGRAM_ID = "A1"; // Identifiant du programme à utiliser

const DEFAULT_MESSAGES = [
    createMessage(
        1,
        "mentor",
        "Bonjour 👋\n" +
            "Je suis ton mentor pédagogique numérique. " +
            "Sur quoi souhaites-tu travailler aujourd'hui ?\n"
    ),
];

/**
 * Hook personnalisé pour gérer les modules et l'initialisation
 * @param {Function} onInitialized - Callback appelé avec le message initial
 * @returns {Object} État des modules
 */
export function useModules(onInitialized) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchInitialConversation() {
            try {
                setLoading(true);

                const data = await apiFetch("/api/init", {
                    method: "POST",
                    body: JSON.stringify({ programID: PROGRAM_ID }),
                });

                if (!isMounted) return;

                if (!data?.modules || !Array.isArray(data.modules)) {
                    console.warn("Format inattendu de /api/init");
                    setModules([]);
                    if (onInitialized) {
                        onInitialized(DEFAULT_MESSAGES);
                    }
                    return;
                }

                setModules(data.modules);

                // Construire le message initial avec les modules
                const finalMessage = buildInitMessage(data.modules);
                const initialMessages = [createMessage(1, "mentor", finalMessage)];

                if (onInitialized) {
                    onInitialized(initialMessages);
                }
            } catch (err) {
                console.error("Erreur lors de l'appel à /api/init", err);
                
                if (!isMounted) return;

                setError(err?.message || "Erreur lors du chargement des modules");
                setModules([]);

                // Fallback aux messages par défaut
                if (onInitialized) {
                    onInitialized(DEFAULT_MESSAGES);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchInitialConversation();

        return () => {
            isMounted = false;
        };
    }, [onInitialized]);

    /**
     * Masque les modules
     */
    const clearModules = () => {
        setModules([]);
    };

    return {
        modules,
        loading,
        error,
        clearModules,
    };
}
