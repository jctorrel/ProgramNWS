// src/components/admin/ProgramEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { ErrorMessage, SuccessMessage } from "./AdminStatus";
import ProgramKeySelector from './ProgramKeySelector';
import ModuleCard from './ModuleCard';
import { generateUniqueId, parseKey, generateKey, isValidDate } from '../../utils/constants';

function ProgramEditor({
    selectedProgram,
    saving,
    saveMessage,
    error,
    onSave,
    onDelete,
}) {
    const [formData, setFormData] = useState({
        key: '',
        label: '',
        description: '',
        modules: []
    });
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const modulesEndRef = useRef(null);

    // Charger le programme sélectionné
    useEffect(() => {
        if (selectedProgram) {
            const modulesWithIds = (selectedProgram.modules || []).map(mod => ({
                ...mod,
                _uniqueId: mod._uniqueId || generateUniqueId()
            }));

            const programData = {
                key: selectedProgram.key || '',
                label: selectedProgram.label || '',
                description: selectedProgram.description || '',
                modules: modulesWithIds
            };

            // Décomposer la clé
            const { year, filiere } = parseKey(selectedProgram.key);
            setSelectedYear(year);
            setSelectedFiliere(filiere);

            setFormData(programData);
            setOriginalData(JSON.parse(JSON.stringify(programData)));
            setIsDirty(false);
        }
    }, [selectedProgram]);

    // Générer automatiquement la clé
    useEffect(() => {
        const generatedKey = generateKey(selectedYear, selectedFiliere);
        if (generatedKey) {
            setFormData(prev => ({ ...prev, key: generatedKey }));
        }
    }, [selectedYear, selectedFiliere]);

    // Détecter les modifications
    useEffect(() => {
        if (originalData) {
            const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
            setIsDirty(hasChanges);
        }
    }, [formData, originalData]);

    if (!selectedProgram) {
        return (
            <div style={styles.editor}>
                <p style={styles.emptyText}>
                    Sélectionne un programme dans la liste pour l'éditer
                </p>
            </div>
        );
    }

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyChange = ({ year, filiere }) => {
        setSelectedYear(year);
        setSelectedFiliere(filiere);
    };

    const handleModuleChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map((mod, i) =>
                i === index ? { ...mod, [field]: value } : mod
            )
        }));
    };

    const addModule = () => {
        const newModule = {
            _uniqueId: generateUniqueId(),
            id: '',
            label: '',
            start_month: 9,
            end_month: 9,
            content: [],
            deliverables: []
        };

        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, newModule]
        }));

        setTimeout(() => {
            modulesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const duplicateModule = (index) => {
        const moduleToDuplicate = formData.modules[index];
        const duplicatedModule = {
            ...JSON.parse(JSON.stringify(moduleToDuplicate)),
            _uniqueId: generateUniqueId(),
            label: `${moduleToDuplicate.label} (copie)`,
            id: `${moduleToDuplicate.id}-copy`
        };

        setFormData(prev => ({
            ...prev,
            modules: [
                ...prev.modules.slice(0, index + 1),
                duplicatedModule,
                ...prev.modules.slice(index + 1)
            ]
        }));
    };

    const removeModule = (index) => {
        const moduleName = formData.modules[index].label || `Module ${index + 1}`;
        if (window.confirm(`Supprimer le module "${moduleName}" ?\nCette action est irréversible.`)) {
            setFormData(prev => ({
                ...prev,
                modules: prev.modules.filter((_, i) => i !== index)
            }));
        }
    };

    // Drag & Drop handlers
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newModules = [...formData.modules];
        const draggedItem = newModules[draggedIndex];
        newModules.splice(draggedIndex, 1);
        newModules.splice(index, 0, draggedItem);

        setFormData(prev => ({ ...prev, modules: newModules }));
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        // Validation de la clé
        if (!selectedYear) {
            alert('❌ Veuillez sélectionner une année');
            return;
        }
        
        if (selectedYear !== '1' && !selectedFiliere) {
            alert('❌ Veuillez sélectionner une filière pour cette année');
            return;
        }
        
        if (!formData.key) {
            alert('❌ La clé du programme n\'a pas pu être générée');
            return;
        }
        
        // Validation des dates de livrables
        let hasInvalidDates = false;
        formData.modules.forEach((mod) => {
            mod.deliverables?.forEach((deliv, delivIndex) => {
                if (deliv.date && !isValidDate(deliv.date)) {
                    hasInvalidDates = true;
                    alert(`Date invalide dans le module "${mod.label}", livrable ${delivIndex + 1}`);
                }
            });
        });

        if (hasInvalidDates) return;

        // Nettoyer les données avant sauvegarde
        const cleanedData = {
            ...formData,
            modules: formData.modules.map(mod => {
                const { _uniqueId, ...moduleData } = mod;
                return {
                    ...moduleData,
                    content: moduleData.content.filter(line => line.trim()),
                    deliverables: (moduleData.deliverables || []).filter(d => 
                        d.descriptif.trim() || d.date
                    )
                };
            })
        };
        
        onSave(cleanedData);
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        setIsDirty(false);
    };

    const handleReset = () => {
        if (window.confirm('Annuler toutes les modifications ?')) {
            setFormData(JSON.parse(JSON.stringify(originalData)));
            const { year, filiere } = parseKey(originalData.key);
            setSelectedYear(year);
            setSelectedFiliere(filiere);
            setIsDirty(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`⚠️ ATTENTION ⚠️\n\nSupprimer le programme "${formData.label}" ?\n\nCette action est IRRÉVERSIBLE et supprimera :\n- Le programme\n- Tous ses modules\n- Tous les livrables\n\nÊtes-vous sûr ?`)) {
            onDelete(selectedProgram.key);
        }
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `program_${formData.key}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImportJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    
                    const modulesWithIds = (imported.modules || []).map(mod => ({
                        ...mod,
                        _uniqueId: generateUniqueId()
                    }));

                    // Décomposer la clé importée
                    const { year, filiere } = parseKey(imported.key);
                    setSelectedYear(year);
                    setSelectedFiliere(filiere);

                    setFormData({
                        key: imported.key || '',
                        label: imported.label || '',
                        description: imported.description || '',
                        modules: modulesWithIds
                    });
                    alert('✅ Données importées avec succès !');
                } catch (err) {
                    alert('❌ Erreur lors de l\'importation : fichier JSON invalide');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <div style={styles.editor}>
            {/* Toolbar */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <h3 style={styles.title}>
                        Programme : <code>{selectedProgram.key}</code>
                        {isDirty && <span style={styles.dirtyIndicator}>●</span>}
                    </h3>
                </div>

                <div style={styles.headerRight}>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        style={{
                            ...styles.toolbarButton,
                            ...styles.saveButton,
                            ...(saving ? styles.buttonDisabled : {})
                        }}
                        disabled={saving}
                        title="Sauvegarder"
                    >
                        {saving ? '⏳' : '💾'} Sauvegarder
                    </button>

                    {isDirty && (
                        <button
                            type="button"
                            style={{...styles.toolbarButton, ...styles.resetButton}}
                            onClick={handleReset}
                            disabled={saving}
                            title="Annuler les modifications"
                        >
                            ↩️ Annuler
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleImportJSON}
                        style={styles.toolbarButton}
                        title="Importer JSON"
                    >
                        📥
                    </button>
                    <button
                        type="button"
                        onClick={handleExportJSON}
                        style={styles.toolbarButton}
                        title="Exporter JSON"
                    >
                        📤
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowJsonPreview(!showJsonPreview)}
                        style={styles.toolbarButton}
                        title={showJsonPreview ? 'Voir le formulaire' : 'Voir le JSON'}
                    >
                        {showJsonPreview ? '📝' : '👁️'}
                    </button>

                    <div style={styles.divider}></div>

                    <button
                        type="button"
                        style={{...styles.toolbarButton, ...styles.deleteButton}}
                        onClick={handleDelete}
                        disabled={saving}
                        title="Supprimer le programme"
                    >
                        🗑️ Supprimer
                    </button>
                </div>
            </div>

            <ErrorMessage message={error} />
            <SuccessMessage message={saveMessage} />

            {showJsonPreview ? (
                <div style={styles.jsonPreview}>
                    <pre style={styles.jsonCode}>
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={styles.form}>
                    {/* Informations générales */}
                    <section style={styles.section}>
                        <h4 style={styles.sectionTitle}>📋 Informations générales</h4>

                        <ProgramKeySelector
                            year={selectedYear}
                            filiere={selectedFiliere}
                            onChange={handleKeyChange}
                            generatedKey={formData.key}
                        />

                        <div style={styles.field}>
                            <label style={styles.label}>
                                Nom du programme *
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => handleFieldChange('label', e.target.value)}
                                    style={styles.input}
                                    placeholder="ex: Année 1 - Développeur des métiers du numérique"
                                    required
                                />
                            </label>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>
                                Description
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleFieldChange('description', e.target.value)}
                                    style={styles.textarea}
                                    rows={3}
                                    placeholder="Description du programme (optionnel)"
                                />
                            </label>
                        </div>
                    </section>

                    {/* Modules */}
                    <section style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h4 style={styles.sectionTitle}>📚 Modules ({formData.modules.length})</h4>
                            <button
                                type="button"
                                onClick={addModule}
                                style={styles.addButton}
                            >
                                + Ajouter un module
                            </button>
                        </div>

                        {formData.modules.length === 0 ? (
                            <p style={styles.emptyModules}>
                                Aucun module. Clique sur "Ajouter un module" pour commencer.
                            </p>
                        ) : (
                            <div style={styles.modulesList}>
                                {formData.modules.map((module, index) => (
                                    <ModuleCard
                                        key={module._uniqueId}
                                        module={module}
                                        index={index}
                                        totalModules={formData.modules.length}
                                        onChange={handleModuleChange}
                                        onRemove={removeModule}
                                        onDuplicate={duplicateModule}
                                        onDragStart={handleDragStart}
                                        onDragOver={handleDragOver}
                                        onDragEnd={handleDragEnd}
                                        isDragging={draggedIndex === index}
                                    />
                                ))}
                                <div ref={modulesEndRef} />
                            </div>
                        )}
                    </section>
                </form>
            )}
        </div>
    );
}

const styles = {
    editor: {
        flex: 1,
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        borderRadius: '0.8rem',
        background: 'white',
        maxHeight: 'calc(100vh - 12rem)',
        overflowY: 'auto',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    headerRight: {
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
    },
    title: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    },
    dirtyIndicator: {
        color: '#f59e0b',
        fontSize: '1.5rem',
    },
    toolbarButton: {
        padding: '0.5rem 1rem',
        background: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
    },
    saveButton: {
        background: '#2563eb',
        color: 'white',
        border: '1px solid #1d4ed8',
    },
    resetButton: {
        background: '#f59e0b',
        color: 'white',
        border: '1px solid #d97706',
    },
    deleteButton: {
        background: '#dc2626',
        color: 'white',
        border: '1px solid #b91c1c',
    },
    divider: {
        width: '1px',
        height: '2rem',
        background: '#d1d5db',
        margin: '0 0.25rem',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
    },
    section: {
        padding: '1.5rem',
        background: '#f9fafb',
        borderRadius: '0.8rem',
        border: '1px solid #e5e7eb',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    sectionTitle: {
        margin: 0,
        marginBottom: '1rem',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1e293b',
    },
    field: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        fontSize: '0.85rem',
        fontWeight: 500,
        color: '#374151',
        marginBottom: '0.4rem',
    },
    input: {
        width: '100%',
        padding: '0.6rem',
        marginTop: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        fontSize: '0.9rem',
        transition: 'border-color 0.2s',
    },
    textarea: {
        width: '100%',
        padding: '0.6rem',
        marginTop: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        fontSize: '0.9rem',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    addButton: {
        padding: '0.5rem 1rem',
        background: '#10b981',
        color: 'white',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'background-color 0.2s',
    },
    modulesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    emptyModules: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.9rem',
        padding: '2rem',
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '0.95rem',
        padding: '2rem',
    },
    jsonPreview: {
        background: '#1e293b',
        borderRadius: '0.6rem',
        padding: '1rem',
        maxHeight: '500px',
        overflowY: 'auto',
    },
    jsonCode: {
        color: '#e2e8f0',
        fontSize: '0.8rem',
        margin: 0,
        fontFamily: 'monospace',
    },
};

export default ProgramEditor;