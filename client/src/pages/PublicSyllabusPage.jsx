// src/pages/PublicSyllabusPage.jsx
import { useParams } from 'react-router-dom';
import { usePublicSyllabus } from '../hooks/usePublicSyllabus';
import Syllabus from '../components/Syllabus';

// ============================================
// STYLES GRAPHIQUES DÉTAILLÉS
// ============================================

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
    },
    centerBox: {
        textAlign: 'center',
        maxWidth: '28rem',
    },
    spinner: {
        width: '4rem',
        height: '4rem',
        border: '4px solid #e2e8f0',
        borderTopColor: '#6c3df4',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
    },
    loadingText: {
        fontSize: '1.125rem',
        color: '#64748b',
    },
    errorIcon: {
        fontSize: '5rem',
        marginBottom: '1.5rem',
    },
    errorTitle: {
        fontSize: '1.875rem',
        fontWeight: 700,
        color: '#1e293b',
        marginBottom: '1rem',
    },
    errorMessage: {
        fontSize: '1.125rem',
        color: '#64748b',
        marginBottom: '1rem',
        lineHeight: '1.6',
    },
    errorHint: {
        fontSize: '0.875rem',
        color: '#94a3b8',
        fontStyle: 'italic',
    },
    debugBox: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '1rem',
        border: '1px solid #e2e8f0',
        textAlign: 'left',
    },
    debugSummary: {
        cursor: 'pointer',
        fontWeight: 600,
        color: '#6c3df4',
    },
    debugContent: {
        marginTop: '0.5rem',
        fontSize: '0.75rem',
        color: '#475569',
        fontFamily: 'monospace',
    },
};

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const LoadingSpinner = () => (
    <div style={styles.container}>
        <div style={styles.centerBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>
                Chargement du syllabus...
            </p>
        </div>
    </div>
);

const ErrorIcon = ({ type }) => {
    const icons = {
        not_found: '🔒',
        invalid_token_format: '⚠️',
        token_missing: '❓',
        network_error: '🌐',
        default: '⚠️'
    };
    
    return (
        <div style={styles.errorIcon}>
            {icons[type] || icons.default}
        </div>
    );
};

const ErrorMessage = ({ error }) => {
    const config = {
        not_found: {
            title: 'Syllabus introuvable',
            message: 'Ce syllabus n\'existe pas ou n\'est plus publié.'
        },
        invalid_token_format: {
            title: 'Lien invalide',
            message: 'Le format du lien n\'est pas valide.'
        },
        token_missing: {
            title: 'Lien manquant',
            message: 'Aucun lien de syllabus n\'a été fourni.'
        },
        network_error: {
            title: 'Erreur réseau',
            message: 'Impossible de contacter le serveur.'
        },
        default: {
            title: 'Erreur serveur',
            message: 'Une erreur est survenue côté serveur.'
        }
    };

    const errorConfig = config[error] || config.default;

    return (
        <>
            <h2 style={styles.errorTitle}>
                {errorConfig.title}
            </h2>
            <p style={styles.errorMessage}>
                {errorConfig.message}
            </p>
            <p style={styles.errorHint}>
                Vérifiez le lien ou contactez votre formateur.
            </p>
        </>
    );
};

const DebugInfo = ({ token, error }) => {
    if (process.env.NODE_ENV !== 'development') return null;

    return (
        <details style={styles.debugBox}>
            <summary style={styles.debugSummary}>
                🔧 Debug Info
            </summary>
            <div style={styles.debugContent}>
                <p><strong>Token:</strong> {token || 'missing'}</p>
                <p><strong>Error:</strong> {error}</p>
            </div>
        </details>
    );
};

const ErrorDisplay = ({ error, token }) => (
    <div style={styles.container}>
        <div style={styles.centerBox}>
            <ErrorIcon type={error} />
            <ErrorMessage error={error} />
            <DebugInfo token={token} error={error} />
        </div>
    </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function PublicSyllabusPage() {
    const { token } = useParams();
    const { program, loading, error } = usePublicSyllabus(token);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} token={token} />;
    
    return <Syllabus program={program} />;
}

// Ajout de l'animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
if (!document.head.querySelector('style[data-public-syllabus]')) {
    styleSheet.setAttribute('data-public-syllabus', 'true');
    document.head.appendChild(styleSheet);
}

export default PublicSyllabusPage;