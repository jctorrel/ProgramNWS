// client/src/components/admin/InputBar.jsx
import React, { useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";

function InputBar({ 
    value, 
    onChange, 
    onSubmit, 
    disabled, 
    shouldShowModules, 
    placeholder = "Décrivez les modifications à apporter au programme..." 
}) {
    const textareaRef = useRef(null);

    // Si on doit cacher la barre (ex: sélection de contexte), on ne rend rien
    if (shouldShowModules) return null;

    // Ajustement automatique de la hauteur du textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [value]);

    const handleKeyDown = (e) => {
        // Envoi avec Entrée (sans Shift)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) {
                onSubmit(e);
            }
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white border-t border-slate-100">
            <form
                onSubmit={onSubmit}
                className={`
                    relative flex items-end gap-2 p-2 rounded-2xl border transition-all duration-200
                    ${disabled 
                        ? "bg-slate-50 border-slate-200" 
                        : "bg-white border-slate-300 shadow-sm focus-within:border-nws-purple focus-within:ring-4 focus-within:ring-nws-purple/10"
                    }
                `}
            >
                {/* Zone de texte auto-extensible */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="
                        w-full max-h-[200px] py-3 pl-4 pr-12
                        bg-transparent border-none outline-none resize-none
                        text-sm text-slate-800 placeholder:text-slate-400
                        disabled:cursor-not-allowed
                    "
                    style={{ minHeight: "44px" }}
                />

                {/* Bouton d'action (Positionné en bas à droite) */}
                <div className="absolute right-2 bottom-2">
                    <button
                        type="submit"
                        disabled={disabled || !value.trim()}
                        className={`
                            flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200
                            ${disabled || !value.trim()
                                ? "bg-transparent text-slate-300 cursor-not-allowed"
                                : "bg-gradient-to-br from-nws-purple to-nws-teal text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                            }
                        `}
                        title="Envoyer les instructions (Entrée)"
                    >
                        {disabled && value.trim() ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            value.trim() ? <Send size={16} className="ml-0.5" /> : <Sparkles size={16} opacity={0.5} />
                        )}
                    </button>
                </div>
            </form>
            
            {/* Petit helper text pour les admins */}
            <div className="flex justify-between px-2 mt-2">
                <span className="text-[10px] text-slate-400">
                    Shift + Entrée pour une nouvelle ligne
                </span>
                <span className="text-[10px] text-slate-400">
                    Mode Édition
                </span>
            </div>
        </div>
    );
}

export default InputBar;