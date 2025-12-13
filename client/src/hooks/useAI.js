// client/src/hooks/useAIModification.js
import { useState } from 'react';
import { apiFetch } from '../utils/api';

export function useAI() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const modifyProgram = async (userMessage, currentProgram) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiFetch('/api/admin/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    program: currentProgram,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la modification');
            }
            
            // Parser le JSON retourné par l'IA
            let modifiedProgram;
            try {
                // Si l'IA retourne du JSON dans un champ "response" ou directement
                modifiedProgram = JSON.parse(response.program);
            } catch (parseError) {
                throw new Error('Format de réponse invalide de l\'IA');
            }

            setLoading(false);
            return { success: true, program: modifiedProgram };

        } catch (err) {
            console.error('Erreur modification IA:', err);
            setError(err.message);
            setLoading(false);
            return { success: false, error: err.message };
        }
    };

    return {
        modifyProgram,
        loading,
        error,
    };
}