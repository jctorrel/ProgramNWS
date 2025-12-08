// src/components/admin/ConfigForm.jsx
import { useState, useEffect } from 'react';
import { ErrorMessage, SuccessMessage } from "./AdminStatus";
import { apiFetch } from "../../utils/api";

function ConfigForm({ config, saving, saveMessage, error, onFieldChange, onSave }) {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    // Charger la configuration au montage du composant
    useEffect(() => {
        const loadConfig = async () => {
            setLoading(true);
            setLoadError(null);
            
            try {
                const data = await apiFetch('/api/admin/config', {method: 'GET'});

                if (!data) {
                    throw new Error(`Erreur HTTP: ${data.status}`);
                }

                Object.keys(data).forEach(key => {
                    if (data[key] !== undefined) {
                        onFieldChange(key, data[key]);
                    }
                });
            } catch (err) {
                console.error('Erreur lors du chargement de la configuration:', err);
                setLoadError(err.message || 'Impossible de charger la configuration');
            } finally {
                setLoading(false);
            }
        };

        loadConfig();
    }, []); // Se lance une seule fois au montage

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFieldChange(name, value);
    };

    // Afficher un loader pendant le chargement
    if (loading) {
        return (
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Configuration générale</h2>
                <div style={styles.loader}>
                    <p>Chargement de la configuration...</p>
                </div>
            </section>
        );
    }

    return (
        <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Configuration générale</h2>
            <p style={styles.sectionHelp}>
                Paramètres globaux utilisés par le mentor.
            </p>

            {/* Afficher l'erreur de chargement si elle existe */}
            {loadError && (
                <div style={styles.loadError}>
                    ⚠️ Erreur de chargement : {loadError}
                    <button 
                        onClick={() => window.location.reload()} 
                        style={styles.reloadButton}
                    >
                        Recharger
                    </button>
                </div>
            )}

            <ErrorMessage message={error} />

            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.field}>
                    <label style={styles.label} htmlFor="school_name">
                        Nom de l'école
                    </label>
                    <input
                        id="school_name"
                        name="school_name"
                        type="text"
                        value={config.school_name || ''}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Normandie Web School"
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label} htmlFor="tone">
                        Tonalité du mentor
                    </label>
                    <input
                        id="tone"
                        name="tone"
                        type="text"
                        value={config.tone || ''}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="concis, professionnel, bienveillant…"
                    />
                    <p style={styles.fieldHint}>
                        Par exemple : <em>"concis, professionnel"</em>
                    </p>
                </div>

                <div style={styles.field}>
                    <label style={styles.label} htmlFor="rules">
                        Règles globales
                    </label>
                    <textarea
                        id="rules"
                        name="rules"
                        value={config.rules || ''}
                        onChange={handleChange}
                        style={styles.textarea}
                        rows={4}
                        placeholder="les règles que le mentor doit toujours respecter"
                    />
                    <p style={styles.fieldHint}>
                        Keep it short and simple !
                    </p>
                </div>

                <div style={styles.actions}>
                    <button
                        type="submit"
                        style={{
                            ...styles.buttonPrimary,
                            opacity: saving ? 0.6 : 1,
                            cursor: saving ? 'not-allowed' : 'pointer',
                        }}
                        disabled={saving}
                    >
                        {saving ? "Sauvegarde…" : "Sauvegarder la config"}
                    </button>
                </div>

                <SuccessMessage message={saveMessage} />
            </form>
        </section>
    );
}

const styles = {
    section: {
        marginTop: "1.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
    },
    sectionTitle: {
        margin: 0,
        marginBottom: "0.5rem",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    sectionHelp: {
        margin: 0,
        marginBottom: "1rem",
        fontSize: "0.9rem",
        color: "#6b7280",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    input: {
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.5rem 0.75rem",
        fontSize: "0.9rem",
    },
    textarea: {
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.5rem 0.75rem",
        fontSize: "0.9rem",
        resize: "vertical",
        fontFamily: "inherit",
    },
    fieldHint: {
        margin: 0,
        fontSize: "0.8rem",
        color: "#9ca3af",
    },
    actions: {
        display: "flex",
        gap: "0.5rem",
        alignItems: "center",
    },
    buttonPrimary: {
        padding: "0.5rem 1rem",
        borderRadius: "999px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "0.9rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
    loader: {
        padding: "2rem",
        textAlign: "center",
        color: "#6b7280",
    },
    loadError: {
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "1rem",
        color: "#991b1b",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    reloadButton: {
        padding: "0.25rem 0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid #fecaca",
        backgroundColor: "white",
        color: "#991b1b",
        fontSize: "0.85rem",
        cursor: "pointer",
    },
};

export default ConfigForm;