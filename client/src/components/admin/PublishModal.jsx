// src/components/admin/PublishModal.jsx
import { useState, useEffect, useRef } from 'react';
import { 
    X, 
    Share, 
    Lock, 
    CheckCircle2, 
    Clipboard, 
    Check, 
    RefreshCw, 
    ExternalLink,
    AlertTriangle
} from 'lucide-react';

// Bouton uniformisé avec le reste de l'admin
const ModalButton = ({ variant = 'primary', loading = false, icon: Icon, children, className = '', ...props }) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]";
    
    const variants = {
        // Style "Action principale NWS"
        primary: "bg-nws-purple text-white hover:bg-purple-700 shadow-sm shadow-purple-200/50 border border-transparent",
        // Style "Succès"
        success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200/50 border border-transparent",
        // Style "Attention / Secondaire fort"
        warning: "bg-amber-500 text-white hover:bg-amber-600 shadow-sm shadow-amber-200/50 border border-transparent",
        // Style "Danger"
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300",
        // Style "Neutre"
        secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={loading}
            {...props}
        >
            {loading ? (
                <RefreshCw size={18} className="animate-spin" />
            ) : Icon ? (
                <Icon size={18} />
            ) : null}
            <span>{loading ? 'Traitement...' : children}</span>
        </button>
    );
};

// En-tête du programme (style "Card" léger)
const ProgramInfo = ({ program }) => (
    <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200/60 flex items-start gap-3">
        <div className="shrink-0 p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-nws-purple">
            <ExternalLink size={20} />
        </div>
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Programme</span>
                <code className="px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700 text-xs font-mono font-bold">
                    {program.key}
                </code>
            </div>
            <h3 className="text-base font-semibold text-slate-900 leading-tight">
                {program.label}
            </h3>
        </div>
    </div>
);

// Badge de statut (style "Alerte succès")
const StatusBadge = ({ publishedAt }) => {
    const date = new Date(publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div className="text-sm">
                <span className="font-semibold block">Programme publié en ligne</span>
                <span className="text-emerald-700/80 text-xs">Visible depuis le {date}</span>
            </div>
        </div>
    );
};

// Champ de lien avec bouton de copie intégré
const LinkInput = ({ value, copied, onCopy }) => {
    const inputRef = useRef(null);

    const handleFocus = () => inputRef.current?.select();

    return (
        <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Lien d'accès public :</label>
            <div className="flex relative rounded-lg shadow-sm">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    readOnly
                    onClick={handleFocus}
                    className="block w-full pr-12 pl-4 py-3 font-mono text-sm text-slate-600 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-nws-purple/20 focus:border-nws-purple focus:bg-white transition-colors"
                />
                <button
                    type="button"
                    onClick={onCopy}
                    className={`absolute inset-y-1 right-1 flex items-center justify-center w-10 rounded-md transition-all ${
                        copied 
                            ? 'bg-emerald-500 text-white' 
                            : 'text-slate-400 hover:text-nws-purple hover:bg-slate-100'
                    }`}
                    title="Copier le lien"
                >
                    {copied ? <Check size={18} /> : <Clipboard size={18} />}
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-start gap-1.5">
                <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber-500" />
                <span>Partagez ce lien pour donner accès au syllabus (ne nécessite pas de compte).</span>
            </p>
        </div>
    );
};

// État Non Publié
const UnpublishedState = ({ onPublish, publishing }) => (
    <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
            <Lock size={32} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Ce programme est privé
        </h3>
        <p className="text-slate-500 mb-8 leading-relaxed max-w-sm mx-auto text-sm">
            La publication génère un lien d'accès unique et sécurisé.
        </p>
        <ModalButton
            variant="primary"
            icon={Share}
            loading={publishing}
            onClick={onPublish}
            className="w-full sm:w-auto"
        >
            Publier le syllabus maintenant
        </ModalButton>
    </div>
);

// État Publié
const PublishedState = ({ 
    syllabusUrl, 
    copied, 
    publishing,
    onCopy, 
    onRegenerateToken, 
    onUnpublish,
    publishedAt 
}) => (
    <div>
        <StatusBadge publishedAt={publishedAt} />
        <LinkInput value={syllabusUrl} copied={copied} onCopy={onCopy} />
        
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-100">
            <ModalButton
                variant="secondary" // Changé en secondaire pour moins d'agressivité visuelle
                icon={RefreshCw}
                loading={publishing}
                onClick={onRegenerateToken}
                className="flex-1 text-slate-600 hover:text-amber-700 hover:border-amber-300 hover:bg-amber-50"
            >
                Régénérer le lien
            </ModalButton>
            <ModalButton
                variant="danger"
                icon={Lock}
                loading={publishing}
                onClick={onUnpublish}
                className="flex-1"
            >
                Dépublier (Rendre privé)
            </ModalButton>
        </div>
    </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function PublishModal({ program, onClose, onPublish, onUnpublish, onRegenerateToken }) {
    const [publishing, setPublishing] = useState(false);
    const [copied, setCopied] = useState(false);

    // Construction de l'URL
    // Utilisation de window.location.origin pour s'adapter au localhost ou à la prod
    const domain = window.location.origin;
    const syllabusUrl = program.publishToken 
        ? `${domain}/syllabus/${program.publishToken}`
        : 'Lien indisponible';

    const handlePublish = async () => {
        setPublishing(true);
        await onPublish();
        setPublishing(false);
    };

    const handleUnpublish = async () => {
        // On pourrait utiliser un vrai modal de confirmation ici plus tard
        if (window.confirm('⚠️ Attention : Dépublier rendra le lien actuel invalide immédiatement.\n\nContinuer ?')) {
            setPublishing(true);
            await onUnpublish();
            setPublishing(false);
        }
    };

    const handleRegenerateToken = async () => {
        if (window.confirm('⚠️ Attention : L\'ancien lien ne fonctionnera plus.\nVous devrez renvoyer le nouveau lien aux étudiants.\n\nRégénérer ?')) {
            setPublishing(true);
            await onRegenerateToken();
            setPublishing(false);
        }
    };

    const handleCopyLink = () => {
        if (!program.publishToken) return;
        navigator.clipboard.writeText(syllabusUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Fermeture avec Echap
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        // Overlay Backdrop Blur
        <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 md:p-6 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Modal Container */}
            <div 
                className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-900/20 animate-in slide-in-from-bottom-4 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Share className="text-nws-purple" size={20} />
                        Publication
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                        aria-label="Fermer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <ProgramInfo program={program} />

                    {!program.published ? (
                        <UnpublishedState 
                            onPublish={handlePublish} 
                            publishing={publishing} 
                        />
                    ) : (
                        <PublishedState
                            syllabusUrl={syllabusUrl}
                            copied={copied}
                            publishing={publishing}
                            onCopy={handleCopyLink}
                            onRegenerateToken={handleRegenerateToken}
                            onUnpublish={handleUnpublish}
                            publishedAt={program.publishedAt}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
                    <ModalButton variant="secondary" onClick={onClose}>
                        Fermer
                    </ModalButton>
                </div>
            </div>
        </div>
    );
}

export default PublishModal;