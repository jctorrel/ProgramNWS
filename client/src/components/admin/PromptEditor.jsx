// src/components/admin/PromptEditor.jsx
import { ErrorMessage, SuccessMessage } from "./AdminStatus";

function PromptEditor({ form, saving, saveMessage, error, onFieldChange, onSave }) {
    if (!form.key) {
        return (
            <div style={styles.editor}>
                <p style={styles.info}>
                    Sélectionne un prompt dans la liste pour l'éditer.
                </p>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFieldChange(name, value);
    };

    return (
        <div style={styles.editor}>
            <h3 style={styles.editorTitle}>
                Édition du prompt : <code>{form.key}</code>
            </h3>

            <ErrorMessage message={error} />
            <SuccessMessage message={saveMessage} />

            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.field}>
                    <label style={styles.label} htmlFor="label">
                        Label (optionnel)
                    </label>
                    <input
                        id="label"
                        name="label"
                        type="text"
                        value={form.label}
                        onChange={handleChange}
                        style={styles.input}
                        placeholder="Prompt système mentor…"
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label} htmlFor="content">
                        Contenu du prompt
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        style={styles.textarea}
                        rows={16}
                        spellCheck={false}
                        placeholder="Entrez le contenu du prompt..."
                    />
                    <p style={styles.fieldHint}>
                        Utilisez la syntaxe <code>{"{variable}"}</code> pour insérer des variables dynamiques.
                    </p>
                </div>

                <div style={styles.actions}>
                    <button
                        type="submit"
                        style={{
                            ...styles.buttonPrimary,
                            ...(saving ? styles.buttonDisabled : {}),
                        }}
                        disabled={saving}
                    >
                        {saving ? "Sauvegarde…" : "Sauvegarder le prompt"}
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    editor: {
        flex: 1,
        borderRadius: "1rem",
        border: "1px solid #e5e7eb",
        padding: "0.75rem 1rem",
        backgroundColor: "#ffffff",
    },
    editorTitle: {
        margin: 0,
        marginBottom: "0.75rem",
        fontSize: "1rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
    label: {
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    input: {
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.4rem 0.6rem",
        fontSize: "0.9rem",
    },
    textarea: {
        borderRadius: "0.75rem",
        border: "1px solid #d1d5db",
        padding: "0.5rem 0.6rem",
        fontSize: "0.85rem",
        resize: "vertical",
        fontFamily: "monospace",
        lineHeight: 1.4,
    },
    fieldHint: {
        margin: 0,
        fontSize: "0.75rem",
        color: "#9ca3af",
    },
    actions: {
        marginTop: "0.25rem",
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
        transition: "background-color 0.2s, opacity 0.2s",
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
    },
    info: {
        fontSize: "0.9rem",
        color: "#64748b",
        textAlign: "center",
        padding: "2rem",
    },
};

export default PromptEditor;
