// src/pages/admin/AdminPromptsSection.jsx
import { usePrompts } from "../../hooks/usePrompts";
import { usePromptEditor } from "../../hooks/usePromptEditor";
import PromptsList from "../../components/admin/PromptsList";
import PromptEditor from "../../components/admin/PromptEditor";

function AdminPromptsSection() {
    const {
        prompts,
        loading,
        error: loadError,
        selectedPrompt,
        selectPrompt,
        updatePrompt,
    } = usePrompts();

    const {
        form,
        saving,
        saveMessage,
        error: saveError,
        updateField,
        save,
    } = usePromptEditor(selectedPrompt, updatePrompt);

    if (loading) {
        return (
            <div style={styles.container}>
                <p style={styles.loadingText}>Chargement de la liste des prompts…</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div style={styles.container}>
                <p style={styles.errorText}>Erreur : {loadError}</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <p style={styles.description}>
                Gère ici les différents prompts utilisés par le mentor. Sélectionne un
                prompt dans la liste, modifie son contenu, puis sauvegarde.
            </p>

            <div style={styles.layout}>
                <PromptsList
                    prompts={prompts}
                    selectedKey={selectedPrompt?.key}
                    onSelect={selectPrompt}
                />

                <PromptEditor
                    form={form}
                    saving={saving}
                    saveMessage={saveMessage}
                    error={saveError}
                    onFieldChange={updateField}
                    onSave={save}
                />
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: "1rem",
    },
    description: {
        margin: 0,
        marginBottom: "1rem",
        fontSize: "0.9rem",
        color: "#6b7280",
    },
    layout: {
        display: "flex",
        gap: "1rem",
        alignItems: "stretch",
    },
    loadingText: {
        fontSize: "0.9rem",
        color: "#64748b",
    },
    errorText: {
        fontSize: "0.9rem",
        color: "#ef4444",
    },
};

export default AdminPromptsSection;
