// src/pages/admin/AdminProgramsSection.jsx
import { useState } from "react";
import { usePrograms } from "../../hooks/usePrograms";
import { useProgramEditor } from "../../hooks/useProgramEditor";
import ProgramsList from "../../components/admin/ProgramsList";
import ProgramEditor from "../../components/admin/ProgramEditor";

function AdminProgramsSection() {
    const [actionError, setActionError] = useState(null);

    const {
        programs,
        loading,
        error: loadError,
        selectedProgram,
        selectProgram,
        createProgram,
        deleteProgram: deleteProgramFromList,
        refreshPrograms,
    } = usePrograms();

    const {
        saving,
        saveMessage,
        error: saveError,
        save,
        deleteProgram,
        clearMessages,
    } = useProgramEditor(refreshPrograms);

    /**
     * Gère la création d'un nouveau programme
     */
    const handleCreate = async () => {
        setActionError(null);
        clearMessages();

        const key = prompt("Clé du nouveau programme (ex: A2, B1…) :");
        if (!key) return;

        try {
            await createProgram(key.trim());
        } catch (error) {
            setActionError(error.message);
        }
    };

    /**
     * Gère la suppression d'un programme
     */
    const handleDelete = async (programKey) => {
        setActionError(null);

        try {
            await deleteProgram(programKey);
            // Après suppression, désélectionner le programme
            selectProgram(null);
        } catch (error) {
            setActionError(error.message);
        }
    };

    if (loading) {
        return (
            <section style={styles.section}>
                <h2 style={styles.title}>Programmes</h2>
                <p style={styles.loadingText}>Chargement…</p>
            </section>
        );
    }

    // Afficher l'erreur de chargement
    if (loadError) {
        return (
            <section style={styles.section}>
                <h2 style={styles.title}>Programmes</h2>
                <p style={styles.errorText}>{loadError}</p>
            </section>
        );
    }

    // Combiner les erreurs d'action et de sauvegarde
    const displayError = actionError || saveError;

    
    console.log('selectedProgram dans AdminProgramsSection:', selectedProgram); 
    return (
        <section style={styles.section}>
            <h2 style={styles.title}>Programmes</h2>
            <p style={styles.help}>
                Sélectionne un programme dans la liste pour l'éditer.
            </p>

            {displayError && <p style={styles.errorText}>{displayError}</p>}

            <div style={styles.layout}>
                <ProgramsList
                    programs={programs}
                    selectedKey={selectedProgram?.key}
                    onSelect={selectProgram}
                    onCreate={handleCreate}
                />

                <ProgramEditor
                    selectedProgram={selectedProgram}
                    onSave={save}
                    onDelete={handleDelete}
                    saving={saving}
                    saveMessage={saveMessage}
                    error={saveError}
                />
            </div>
        </section>
    );
}

const styles = {
    section: {
        marginTop: "1.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
    },
    title: {
        margin: 0,
        marginBottom: "0.5rem",
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    help: {
        marginTop: 0,
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
        color: "#dc2626",
        marginTop: "0.5rem",
    },
    successText: {
        fontSize: "0.9rem",
        color: "#16a34a",
        marginTop: "0.5rem",
    },
};

export default AdminProgramsSection;