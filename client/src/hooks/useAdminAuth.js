// src/hooks/useAdminAuth.js
import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

/**
 * Hook personnalisé pour gérer l'authentification admin et le chargement de la config
 * @returns {Object} État de l'authentification et configuration
 */
export function useAdminAuth() {
    const [state, setState] = useState({
        loading: true,
        isAdmin: false,
        error: null,
        config: {
            school_name: "",
            tone: "",
            rules: "",
        },
    });

    useEffect(() => {
        let cancelled = false;

        async function checkAdminAndLoadConfig() {
            try {
                const cfg = await apiFetch("/api/admin/config");
                
                if (cancelled) return;

                setState({
                    loading: false,
                    isAdmin: true,
                    error: null,
                    config: {
                        school_name: cfg.school_name || "",
                        tone: cfg.tone || "",
                        rules: cfg.rules || "",
                    },
                });
            } catch (error) {
                if (cancelled) return;

                const errorMessage = error?.message || "Erreur d'accès à l'administration";
                
                setState({
                    loading: false,
                    isAdmin: false,
                    error: errorMessage,
                    config: {
                        school_name: "",
                        tone: "",
                        rules: "",
                    },
                });
            }
        }

        checkAdminAndLoadConfig();

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}
