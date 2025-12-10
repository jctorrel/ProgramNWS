// src/hooks/usePublicSyllabus.js
import { useEffect, useState } from "react";

/**
 * Hook pour charger un syllabus publié via son token
 * @param {string} token - Token de publication du programme
 * @returns {Object} État du chargement du syllabus
 */
export function usePublicSyllabus(token) {
    const [state, setState] = useState({
        program: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        // Reset si le token change
        setState({
            program: null,
            loading: true,
            error: null,
        });

        // Validation du token
        if (!token) {
            setState({
                program: null,
                loading: false,
                error: "token_missing",
            });
            return;
        }

        // Validation du format du token (64 caractères hexadécimaux)
        if (!/^[a-f0-9]{64}$/i.test(token)) {
            console.error("❌ Token invalide:", token);
            setState({
                program: null,
                loading: false,
                error: "invalid_token_format",
            });
            return;
        }

        // Charger le syllabus
        loadSyllabus(token);
    }, [token]);

    /**
     * Charge le syllabus depuis l'API publique
     */
    const loadSyllabus = async (token) => {
        try {
            console.log("🔍 Chargement du syllabus avec token:", token);
            
            // Utiliser fetch direct (route publique, pas d'auth)
            const response = await fetch(`/api/syllabus/${token}`);
            
            console.log("📡 Response status:", response.status);

            // Gérer les différentes erreurs
            if (!response.ok) {
                let errorCode = "server_error";
                
                if (response.status === 404) {
                    errorCode = "not_found";
                } else if (response.status === 400) {
                    errorCode = "invalid_token";
                }

                // Essayer de lire le body pour plus d'infos
                try {
                    const errorData = await response.json();
                    console.error("❌ Error data:", errorData);
                    
                    setState({
                        program: null,
                        loading: false,
                        error: errorData.error || errorCode,
                    });
                } catch {
                    setState({
                        program: null,
                        loading: false,
                        error: errorCode,
                    });
                }
                return;
            }

            // Parse la réponse
            const data = await response.json();
            console.log("✅ Syllabus chargé:", data);

            setState({
                program: data,
                loading: false,
                error: null,
            });
        } catch (error) {
            console.error("❌ Erreur lors du chargement:", error);
            
            setState({
                program: null,
                loading: false,
                error: error?.message || "network_error",
            });
        }
    };

    /**
     * Recharge le syllabus
     */
    const reload = () => {
        if (token) {
            loadSyllabus(token);
        }
    };

    return {
        program: state.program,
        loading: state.loading,
        error: state.error,
        reload,
    };
}