// src/components/admin/PublishModal.jsx
import { useState, useEffect } from 'react';

function PublishModal({ program, onClose, onPublish, onUnpublish, onRegenerateToken }) {
    const [publishing, setPublishing] = useState(false);
    const [copied, setCopied] = useState(false);

    // Construire l'URL complète du syllabus
    const getSyllabusUrl = () => {
        if (!program.publishToken) return '';
        const baseUrl = window.location.origin;
        return `${baseUrl}/syllabus/${program.publishToken}`;
    };

    const syllabusUrl = getSyllabusUrl();

    const handlePublish = async () => {
        setPublishing(true);
        await onPublish();
        setPublishing(false);
    };

    const handleUnpublish = async () => {
        if (window.confirm('⚠️ Dépublier ce syllabus ?\n\nLe lien actuel ne fonctionnera plus et devra être régénéré.')) {
            setPublishing(true);
            await onUnpublish();
            setPublishing(false);
        }
    };

    const handleRegenerateToken = async () => {
        if (window.confirm('⚠️ Régénérer le token ?\n\nL\'ancien lien ne fonctionnera plus. Vous devrez partager le nouveau lien.')) {
            setPublishing(true);
            await onRegenerateToken();
            setPublishing(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(syllabusUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Fermer avec Escape
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto shadow-soft animate-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-800">
                        📤 Publication du syllabus
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Program Info */}
                    <div className="text-center mb-8 p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm font-bold text-nws-purple mb-2">
                            {program.key}
                        </div>
                        <div className="text-lg text-slate-800 font-medium">
                            {program.label}
                        </div>
                    </div>

                    {!program.published ? (
                        // Pas encore publié
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔒</div>
                            <p className="text-lg text-slate-800 font-medium mb-2">
                                Ce programme n'est pas encore publié.
                            </p>
                            <p className="text-slate-500 mb-8 leading-relaxed">
                                La publication génère un lien unique sécurisé que vous pourrez partager.
                            </p>
                            <button
                                onClick={handlePublish}
                                disabled={publishing}
                                className="px-8 py-4 bg-nws-purple text-white rounded-xl font-semibold text-lg
                                         hover:bg-nws-purple/90 active:scale-95
                                         disabled:opacity-50 disabled:cursor-not-allowed
                                         transition-all shadow-button hover:shadow-button-hover"
                            >
                                {publishing ? '⏳ Publication...' : '📤 Publier le syllabus'}
                            </button>
                        </div>
                    ) : (
                        // Déjà publié
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center font-semibold">
                                ✅ Publié le {new Date(program.publishedAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>

                            {/* Link Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-slate-800">
                                    Lien de partage :
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={syllabusUrl}
                                        readOnly
                                        onClick={(e) => e.target.select()}
                                        className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl
                                                 font-mono text-sm bg-slate-50
                                                 focus:outline-none focus:border-nws-purple focus:bg-white
                                                 transition-all"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-3 rounded-xl font-semibold text-white transition-all min-w-[3rem]
                                                  ${copied 
                                                    ? 'bg-green-500 hover:bg-green-600' 
                                                    : 'bg-nws-purple hover:bg-nws-purple/90'
                                                  }`}
                                    >
                                        {copied ? '✓' : '📋'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 italic">
                                    Partagez ce lien avec vos étudiants. Seules les personnes avec ce lien peuvent accéder au syllabus.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleRegenerateToken}
                                    disabled={publishing}
                                    className="flex-1 px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold
                                             hover:bg-amber-600 active:scale-95
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-all"
                                >
                                    🔄 Régénérer le lien
                                </button>
                                <button
                                    onClick={handleUnpublish}
                                    disabled={publishing}
                                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold
                                             hover:bg-red-600 active:scale-95
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-all"
                                >
                                    🔒 Dépublier
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t-2 border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold
                                 hover:bg-slate-200 active:scale-95 transition-all"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PublishModal;