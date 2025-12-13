// src/components/admin/PublishModal.jsx
import { useState, useEffect } from 'react';

// ============================================
// STYLES GRAPHIQUES DÉTAILLÉS
// ============================================

const styles = {
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn 0.2s ease-out',
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: '1rem',
        maxWidth: '42rem',
        width: '100%',
        margin: '0 1rem',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
        animation: 'slideInFromBottom 0.3s ease-out',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        borderBottom: '2px solid #f1f5f9',
    },
    title: {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1e293b',
    },
    closeButton: {
        width: '2rem',
        height: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.5rem',
        color: '#94a3b8',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    },
    body: {
        padding: '2rem',
    },
    programInfo: {
        textAlign: 'center',
        marginBottom: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '1rem',
    },
    programKey: {
        fontSize: '0.875rem',
        fontWeight: 700,
        color: '#6c3df4',
        marginBottom: '0.5rem',
    },
    programLabel: {
        fontSize: '1.125rem',
        color: '#1e293b',
        fontWeight: 500,
    },
    statusBadge: {
        backgroundColor: '#f0fdf4',
        color: '#15803d',
        padding: '0.75rem',
        borderRadius: '1rem',
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '0.9rem',
    },
    linkSection: {
        marginTop: '1.5rem',
    },
    linkLabel: {
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: '#1e293b',
        marginBottom: '0.5rem',
    },
    linkInput: {
        flex: 1,
        padding: '0.75rem 1rem',
        border: '2px solid #e2e8f0',
        borderRadius: '1rem',
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s ease',
    },
    button: {
        padding: '0.75rem 1.5rem',
        borderRadius: '1rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        border: 'none',
        fontSize: '1rem',
    },
    buttonPrimary: {
        background: 'linear-gradient(135deg, #6c3df4 0%, #5b32d6 100%)',
        color: 'white',
        boxShadow: '0 8px 22px rgba(108, 61, 244, 0.35)',
    },
    buttonSuccess: {
        backgroundColor: '#10b981',
        color: 'white',
    },
    buttonWarning: {
        backgroundColor: '#f59e0b',
        color: 'white',
    },
    buttonDanger: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
    buttonSecondary: {
        backgroundColor: '#f1f5f9',
        color: '#64748b',
    },
    footer: {
        padding: '1.5rem',
        borderTop: '2px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'flex-end',
    },
};

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const Button = ({ variant = 'primary', loading = false, children, style, ...props }) => {
    const variantStyles = {
        primary: { ...styles.buttonPrimary },
        success: { ...styles.buttonSuccess },
        warning: { ...styles.buttonWarning },
        danger: { ...styles.buttonDanger },
        secondary: { ...styles.buttonSecondary },
    };

    const hoverStyle = variant === 'primary' 
        ? { boxShadow: '0 11px 30px rgba(108, 61, 244, 0.5)' }
        : {};

    return (
        <button
            style={{
                ...styles.button,
                ...variantStyles[variant],
                ...style,
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
            onMouseEnter={(e) => {
                if (!loading && variant === 'primary') {
                    Object.assign(e.target.style, hoverStyle);
                }
            }}
            onMouseLeave={(e) => {
                if (!loading && variant === 'primary') {
                    e.target.style.boxShadow = '0 8px 22px rgba(108, 61, 244, 0.35)';
                }
            }}
            {...props}
        >
            {loading ? '⏳ Chargement...' : children}
        </button>
    );
};

const ProgramInfo = ({ program }) => (
    <div style={styles.programInfo}>
        <div style={styles.programKey}>{program.key}</div>
        <div style={styles.programLabel}>{program.label}</div>
    </div>
);

const StatusBadge = ({ publishedAt }) => {
    const date = new Date(publishedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div style={styles.statusBadge}>
            ✅ Publié le {date}
        </div>
    );
};

const LinkInput = ({ value, copied, onCopy }) => (
    <div style={styles.linkSection}>
        <label style={styles.linkLabel}>Lien de partage :</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
                type="text"
                value={value}
                readOnly
                onClick={(e) => e.target.select()}
                onFocus={(e) => {
                    e.target.style.borderColor = '#6c3df4';
                    e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.backgroundColor = '#f8fafc';
                }}
                style={styles.linkInput}
            />
            <Button
                variant={copied ? 'success' : 'primary'}
                onClick={onCopy}
                style={{ minWidth: '3rem' }}
            >
                {copied ? '✓' : '📋'}
            </Button>
        </div>
        <p style={{
            fontSize: '0.75rem',
            color: '#64748b',
            marginTop: '0.5rem',
            fontStyle: 'italic',
        }}>
            Partagez ce lien avec vos étudiants. Seules les personnes avec ce lien peuvent accéder au syllabus.
        </p>
    </div>
);

const UnpublishedState = ({ onPublish, publishing }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        <p style={{
            fontSize: '1.125rem',
            color: '#1e293b',
            fontWeight: 500,
            marginBottom: '0.5rem',
        }}>
            Ce programme n'est pas encore publié.
        </p>
        <p style={{
            color: '#64748b',
            marginBottom: '2rem',
            lineHeight: '1.6',
        }}>
            La publication génère un lien unique sécurisé que vous pourrez partager.
        </p>
        <Button
            variant="primary"
            loading={publishing}
            onClick={onPublish}
            style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}
        >
            📤 Publier le syllabus
        </Button>
    </div>
);

const PublishedState = ({ 
    syllabusUrl, 
    copied, 
    publishing,
    onCopy, 
    onRegenerateToken, 
    onUnpublish,
    publishedAt 
}) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <StatusBadge publishedAt={publishedAt} />
        <LinkInput value={syllabusUrl} copied={copied} onCopy={onCopy} />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
                variant="warning"
                loading={publishing}
                onClick={onRegenerateToken}
                style={{ flex: 1 }}
            >
                🔄 Régénérer le lien
            </Button>
            <Button
                variant="danger"
                loading={publishing}
                onClick={onUnpublish}
                style={{ flex: 1 }}
            >
                🔒 Dépublier
            </Button>
        </div>
    </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function PublishModal({ program, onClose, onPublish, onUnpublish, onRegenerateToken }) {
    const [publishing, setPublishing] = useState(false);
    const [copied, setCopied] = useState(false);

    const syllabusUrl = program.publishToken 
        ? `${window.location.origin}/syllabus/${program.publishToken}`
        : '';

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

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={styles.header}>
                    <h2 style={styles.title}>📤 Publication du syllabus</h2>
                    <button
                        onClick={onClose}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f1f5f9';
                            e.target.style.color = '#475569';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#94a3b8';
                        }}
                        style={styles.closeButton}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={styles.body}>
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
                <div style={styles.footer}>
                    <Button variant="secondary" onClick={onClose}>
                        Fermer
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Ajout des animations CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(1rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
if (!document.head.querySelector('style[data-publish-modal]')) {
    styleSheet.setAttribute('data-publish-modal', 'true');
    document.head.appendChild(styleSheet);
}

export default PublishModal;