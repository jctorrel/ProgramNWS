// src/components/admin/AdminStatus.jsx
import { useNavigate } from "react-router-dom";

export function LoadingState() {
    return (
        <p style={styles.info}>Vérification des droits…</p>
    );
}

export function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div style={styles.errorBox}>
            <p style={styles.errorTitle}>Accès refusé</p>
            <p style={styles.errorText}>
                Votre compte n'est pas autorisé à accéder à l'administration.
            </p>
            <button 
                style={styles.buttonSecondary} 
                onClick={() => navigate("/")}
            >
                ← Retour à l'application
            </button>
        </div>
    );
}

export function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <p style={styles.errorTextSmall}>
            Une erreur est survenue : {message}
        </p>
    );
}

export function SuccessMessage({ message }) {
    if (!message) return null;

    return (
        <p style={styles.successText}>
            {message}
        </p>
    );
}

const styles = {
    info: {
        fontSize: "0.9rem",
        color: "#64748b",
    },
    errorBox: {
        borderRadius: "1rem",
        padding: "1rem 1.25rem",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        marginTop: "0.5rem",
        marginBottom: "1rem",
    },
    errorTitle: {
        margin: 0,
        fontWeight: 600,
        color: "#b91c1c",
        marginBottom: "0.25rem",
    },
    errorText: {
        margin: 0,
        fontSize: "0.9rem",
        color: "#991b1b",
        marginBottom: "0.75rem",
    },
    errorTextSmall: {
        marginTop: "0.5rem",
        fontSize: "0.8rem",
        color: "#ef4444",
    },
    successText: {
        marginTop: "0.5rem",
        fontSize: "0.85rem",
        color: "#16a34a",
    },
    buttonSecondary: {
        padding: "0.5rem 0.9rem",
        borderRadius: "999px",
        border: "1px solid #cbd5f5",
        backgroundColor: "#f8fafc",
        fontSize: "0.85rem",
        cursor: "pointer",
    },
};
