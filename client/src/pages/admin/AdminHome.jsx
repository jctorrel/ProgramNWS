// src/pages/admin/AdminHome.jsx

import { useState } from "react";
import { usePrograms } from "../../hooks/usePrograms";
import { useProgramEditor } from "../../hooks/useProgramEditor";
import ProgramsList from "../../components/admin/ProgramsList";
import ProgramEditor from "../../components/admin/ProgramEditor";
import { AlertCircle, Loader2, LayoutDashboard } from "lucide-react";

function AdminHome() {
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
     * Note: Idéalement, à remplacer par un Modal plus tard
     */
    const handleCreate = async () => {
        setActionError(null);
        clearMessages();

        // On garde le prompt pour l'instant comme dans ta logique originale
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
            // Après suppression, on désélectionne
            selectProgram(null);
        } catch (error) {
            setActionError(error.message);
        }
    };

    // --- Rendu : État de chargement ---
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin text-nws-purple mb-4" />
                <p className="font-medium">Chargement des programmes...</p>
            </div>
        );
    }

    // --- Rendu : Erreur critique de chargement ---
    if (loadError) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 shrink-0" />
                    <div>
                        <h3 className="font-bold">Erreur de chargement</h3>
                        <p className="text-sm">{loadError}</p>
                    </div>
                </div>
            </div>
        );
    }

    // Combiner les erreurs d'action et de sauvegarde pour l'affichage
    const displayError = actionError || saveError;

    return (
        <section className="min-h-screen bg-slate-50/50 p-6 md:p-8">
            <div className="max-w-[1600px] mx-auto">
                
                {/* En-tête de la page */}
                <header className="mb-8 flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-nws-purple">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Administration des Programmes
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Gérez les syllabus, modules et cours de l'école.
                        </p>
                    </div>
                </header>

                {/* Bannière d'erreur contextuelle */}
                {displayError && (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                            <AlertCircle size={18} />
                            {displayError}
                        </div>
                    </div>
                )}

                {/* Layout Principal : Grille 2 colonnes (Sidebar / Main) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Colonne Gauche : Liste des Programmes */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <ProgramsList
                            programs={programs}
                            selectedKey={selectedProgram?.key}
                            onSelect={selectProgram}
                            onCreate={handleCreate}
                        />
                    </div>

                    {/* Colonne Droite : Éditeur */}
                    <div className="lg:col-span-8 xl:col-span-9">
                        <ProgramEditor
                            selectedProgram={selectedProgram}
                            onSave={save}
                            onDelete={handleDelete}
                            saving={saving}
                            saveMessage={saveMessage}
                            error={saveError}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdminHome;