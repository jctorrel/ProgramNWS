// src/pages/PublicSyllabusPage.jsx
import { useParams } from 'react-router-dom';
import { usePublicSyllabus } from '../hooks/usePublicSyllabus';
import Syllabus from '../components/Syllabus';

function PublicSyllabusPage() {
    const { token } = useParams();
    const { program, loading, error } = usePublicSyllabus(token);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-nws-purple rounded-full 
                                  animate-spin mx-auto mb-4"></div>
                    <p className="text-lg text-slate-500">Chargement du syllabus...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const errorConfig = {
            not_found: {
                icon: '🔒',
                title: 'Syllabus introuvable',
                message: 'Ce syllabus n\'existe pas ou n\'est plus publié.'
            },
            invalid_token_format: {
                icon: '⚠️',
                title: 'Lien invalide',
                message: 'Le format du lien n\'est pas valide.'
            },
            token_missing: {
                icon: '❓',
                title: 'Lien manquant',
                message: 'Aucun lien de syllabus n\'a été fourni.'
            },
            network_error: {
                icon: '🌐',
                title: 'Erreur réseau',
                message: 'Impossible de contacter le serveur.'
            }
        };

        const config = errorConfig[error] || {
            icon: '⚠️',
            title: 'Erreur serveur',
            message: 'Une erreur est survenue côté serveur.'
        };

        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="text-8xl mb-6">{config.icon}</div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        {config.title}
                    </h2>
                    <p className="text-lg text-slate-500 mb-4 leading-relaxed">
                        {config.message}
                    </p>
                    <p className="text-sm text-slate-400 italic">
                        Vérifiez le lien ou contactez votre formateur.
                    </p>

                    {/* Debug en dev mode */}
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
                            <summary className="cursor-pointer font-semibold text-nws-purple">
                                🔧 Debug Info
                            </summary>
                            <div className="mt-2 text-xs text-slate-600 font-mono space-y-1">
                                <p><strong>Token:</strong> {token || 'missing'}</p>
                                <p><strong>Error:</strong> {error}</p>
                            </div>
                        </details>
                    )}
                </div>
            </div>
        );
    }

    return <Syllabus program={program} />;
}

export default PublicSyllabusPage;