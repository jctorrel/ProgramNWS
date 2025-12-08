// src/components/admin/ProgramEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { ErrorMessage, SuccessMessage } from "./AdminStatus";

// Fonction pour générer un slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .normalize('NFD') // Décompose les caractères accentués
        .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
        .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
        .trim()
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/-+/g, '-'); // Évite les tirets multiples
}

function ProgramEditor({
    selectedProgram,
    saving,
    saveMessage,
    error,
    onSave,
    onDelete,
}) {
    console.log('🎯 ProgramEditor reçoit selectedProgram:', selectedProgram);
    const [formData, setFormData] = useState({
        key: '',
        label: '',
        description: '',
        modules: []
    });

    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const modulesEndRef = useRef(null);

    useEffect(() => {
        console.log('📝 useEffect déclenché avec selectedProgram:', selectedProgram); // ✅ Ajoute ça
        if (selectedProgram) {
            setFormData({
                key: selectedProgram.key || '',
                label: selectedProgram.label || '',
                description: selectedProgram.description || '',
                modules: selectedProgram.modules || []
            });
            console.log('✅ formData mis à jour'); // ✅ Et ça
        }
    }, [selectedProgram]);

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

    const handleModuleChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map((mod, i) =>
                i === index ? { ...mod, [field]: value } : mod
            )
        }));
    };

    const addModule = () => {
        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, {
                id: '',
                label: '',
                start_month: 9,
                end_month: 9,
                content: [],
                deliverables: []
            }]
        }));

        // Scroll vers le bas après un court délai
        setTimeout(() => {
            modulesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const removeModule = (index) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== index)
        }));
    };

    const moveModule = (index, direction) => {
        const newModules = [...formData.modules];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newModules.length) {
            [newModules[index], newModules[newIndex]] = [newModules[newIndex], newModules[index]];
            setFormData(prev => ({ ...prev, modules: newModules }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Nettoyer les content avant sauvegarde
        const cleanedData = {
            ...formData,
            modules: formData.modules.map(mod => ({
                ...mod,
                content: mod.content.filter(line => line.trim())
            }))
        };
        onSave(cleanedData);
    };

    const handleDelete = () => {
        if (window.confirm(`Supprimer le programme "${formData.label}" ?`)) {
            onDelete(selectedProgram.key);
        }
    };

    return (
        <div style={styles.editor}>
            <div style={styles.header}>
                <h3 style={styles.editorTitle}>
                    Programme : <code>{selectedProgram.key}</code>
                </h3>
                <button
                    type="button"
                    onClick={() => setShowJsonPreview(!showJsonPreview)}
                    style={styles.previewButton}
                >
                    {showJsonPreview ? '📝 Formulaire' : '👁️ JSON'}
                </button>
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

                        <div style={styles.field}>
                            <label style={styles.label}>
                                Clé du programme *
                                <input
                                    type="text"
                                    value={formData.key}
                                    onChange={(e) => handleFieldChange('key', e.target.value)}
                                    style={styles.input}
                                    placeholder="ex: A1, A2, B1"
                                    required
                                />
                            </label>
                        </div>

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
                                        key={module.id || index}
                                        module={module}
                                        index={index}
                                        totalModules={formData.modules.length}
                                        onChange={handleModuleChange}
                                        onRemove={removeModule}
                                        onMove={moveModule}
                                    />
                                ))}
                                <div ref={modulesEndRef} />
                            </div>
                        )}
                    </section>

                    {/* Actions */}
                    <div style={styles.actions}>
                        <button
                            type="submit"
                            style={{
                                ...styles.saveButton,
                                ...(saving ? styles.buttonDisabled : {})
                            }}
                            disabled={saving}
                        >
                            {saving ? '⏳ Sauvegarde…' : '💾 Sauvegarder'}
                        </button>

                        <button
                            type="button"
                            style={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={saving}
                        >
                            🗑️ Supprimer
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

// Composant pour chaque module
function ModuleCard({ module, index, totalModules, onChange, onRemove, onMove }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const months = [
        { value: 1, label: 'Janvier' },
        { value: 2, label: 'Février' },
        { value: 3, label: 'Mars' },
        { value: 4, label: 'Avril' },
        { value: 5, label: 'Mai' },
        { value: 6, label: 'Juin' },
        { value: 7, label: 'Juillet' },
        { value: 8, label: 'Août' },
        { value: 9, label: 'Septembre' },
        { value: 10, label: 'Octobre' },
        { value: 11, label: 'Novembre' },
        { value: 12, label: 'Décembre' },
    ];

    const getMonthLabel = (monthNum) => {
        return months.find(m => m.value === monthNum)?.label || monthNum;
    };

    const handleLabelChange = (newLabel) => {
        onChange(index, 'label', newLabel);
        // Générer automatiquement l'ID si vide ou si c'était un slug de l'ancien label
        if (!module.id || module.id === generateSlug(module.label)) {
            onChange(index, 'id', generateSlug(newLabel));
        }
    };

    const addDeliverable = () => {
        const newDeliverables = [
            ...(module.deliverables || []),
            { descriptif: '', date: '' }
        ];
        onChange(index, 'deliverables', newDeliverables);
    };

    const updateDeliverable = (delivIndex, field, value) => {
        const newDeliverables = module.deliverables.map((deliv, i) =>
            i === delivIndex ? { ...deliv, [field]: value } : deliv
        );
        onChange(index, 'deliverables', newDeliverables);
    };

    const removeDeliverable = (delivIndex) => {
        const newDeliverables = module.deliverables.filter((_, i) => i !== delivIndex);
        onChange(index, 'deliverables', newDeliverables);
    };

    return (
        <div style={styles.moduleCard}>
            <div style={styles.moduleHeader}>
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={styles.expandButton}
                >
                    {isExpanded ? '▼' : '▶'}
                </button>

                <div style={styles.moduleHeaderInfo}>
                    <h5 style={styles.moduleTitle}>
                        {module.label || `Module ${index + 1}`}
                    </h5>
                    <span style={styles.modulePeriod}>
                        {getMonthLabel(module.start_month)} → {getMonthLabel(module.end_month)}
                    </span>
                </div>

                <div style={styles.moduleActions}>
                    <button
                        type="button"
                        onClick={() => onMove(index, 'up')}
                        disabled={index === 0}
                        style={{
                            ...styles.iconButton,
                            ...(index === 0 ? styles.iconButtonDisabled : {})
                        }}
                        title="Monter"
                    >
                        ↑
                    </button>
                    <button
                        type="button"
                        onClick={() => onMove(index, 'down')}
                        disabled={index === totalModules - 1}
                        style={{
                            ...styles.iconButton,
                            ...(index === totalModules - 1 ? styles.iconButtonDisabled : {})
                        }}
                        title="Descendre"
                    >
                        ↓
                    </button>
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        style={styles.removeButton}
                        title="Supprimer"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div style={styles.moduleContent}>
                    {/* Nom et ID inversés */}
                    <div style={styles.row}>
                        <div style={{ ...styles.field, flex: 3 }}>
                            <label style={styles.label}>
                                Nom du module *
                                <input
                                    type="text"
                                    value={module.label}
                                    onChange={(e) => handleLabelChange(e.target.value)}
                                    style={styles.input}
                                    placeholder="ex: Wordpress"
                                    required
                                />
                            </label>
                        </div>

                        <div style={{ ...styles.field, flex: 2 }}>
                            <label style={styles.label}>
                                ID du module *
                                <input
                                    type="text"
                                    value={module.id}
                                    onChange={(e) => onChange(index, 'id', e.target.value)}
                                    style={styles.input}
                                    placeholder="Auto-généré depuis le nom"
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.field}>
                            <label style={styles.label}>
                                Mois de début *
                                <select
                                    value={module.start_month}
                                    onChange={(e) => onChange(index, 'start_month', parseInt(e.target.value))}
                                    style={styles.select}
                                    required
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>
                                Mois de fin *
                                <select
                                    value={module.end_month}
                                    onChange={(e) => onChange(index, 'end_month', parseInt(e.target.value))}
                                    style={styles.select}
                                    required
                                >
                                    {months.map(m => (
                                        <option key={m.value} value={m.value}>
                                            {m.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>
                            Contenu du module (un élément par ligne)
                            <textarea
                                value={module.content?.join('\n') || ''}
                                onChange={(e) => onChange(
                                    index,
                                    'content',
                                    e.target.value.split('\n')
                                )}
                                style={styles.textareaSmall}
                                rows={4}
                                placeholder="Installation, configuration et déploiement&#10;Gestion des plugins&#10;Thèmes personnalisés"
                            />
                        </label>
                        <p style={styles.hint}>
                            💡 Un élément par ligne. Ces contenus décrivent ce qui sera enseigné dans le module.
                        </p>
                    </div>

                    {/* Section Deliverables */}
                    <div style={styles.deliverablesSection}>
                        <div style={styles.deliverableHeader}>
                            <label style={styles.label}>📦 Livrables</label>
                            <button
                                type="button"
                                onClick={addDeliverable}
                                style={styles.addDeliverableButton}
                            >
                                + Ajouter un livrable
                            </button>
                        </div>

                        {(!module.deliverables || module.deliverables.length === 0) ? (
                            <p style={styles.emptyDeliverables}>
                                Aucun livrable pour ce module.
                            </p>
                        ) : (
                            <div style={styles.deliverablesList}>
                                {module.deliverables.map((deliverable, delivIndex) => (
                                    <div key={delivIndex} style={styles.deliverableItem}>
                                        <div style={styles.deliverableFields}>
                                            <input
                                                type="text"
                                                value={deliverable.descriptif}
                                                onChange={(e) => updateDeliverable(delivIndex, 'descriptif', e.target.value)}
                                                style={{ ...styles.input, flex: 2 }}
                                                placeholder="Descriptif du livrable"
                                            />
                                            <input
                                                type="datetime-local"
                                                value={deliverable.date}
                                                onChange={(e) => updateDeliverable(delivIndex, 'date', e.target.value)}
                                                style={{ ...styles.input, flex: 1 }}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDeliverable(delivIndex)}
                                            style={styles.removeDeliverableButton}
                                            title="Supprimer ce livrable"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
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
    },
    editorTitle: {
        margin: 0,
        fontSize: '1.1rem',
        fontWeight: 600,
        color: '#0f172a',
    },
    previewButton: {
        padding: '0.4rem 0.8rem',
        background: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        fontSize: '0.85rem',
        transition: 'all 0.2s',
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
    row: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '0.5rem',
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
    select: {
        width: '100%',
        padding: '0.6rem',
        marginTop: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        fontSize: '0.9rem',
        background: 'white',
        cursor: 'pointer',
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
    textareaSmall: {
        width: '100%',
        padding: '0.5rem',
        marginTop: '0.3rem',
        borderRadius: '0.5rem',
        border: '1px solid #d1d5db',
        fontSize: '0.85rem',
        fontFamily: 'inherit',
        resize: 'vertical',
    },
    hint: {
        margin: '0.3rem 0 0 0',
        fontSize: '0.75rem',
        color: '#6b7280',
        fontStyle: 'italic',
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
    moduleCard: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.6rem',
        overflow: 'hidden',
    },
    moduleHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.8rem 1rem',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
    },
    expandButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '0.2rem',
        color: '#6b7280',
    },
    moduleHeaderInfo: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    moduleTitle: {
        margin: 0,
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#1e293b',
    },
    modulePeriod: {
        fontSize: '0.75rem',
        color: '#6b7280',
        padding: '0.2rem 0.6rem',
        background: '#f3f4f6',
        borderRadius: '0.3rem',
        fontWeight: 500,
    },
    moduleActions: {
        display: 'flex',
        gap: '0.4rem',
    },
    iconButton: {
        width: '2rem',
        height: '2rem',
        background: '#f3f4f6',
        border: '1px solid #d1d5db',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    iconButtonDisabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
    },
    removeButton: {
        width: '2rem',
        height: '2rem',
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    },
    moduleContent: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
    },
    deliverablesSection: {
        marginTop: '1rem',
        padding: '1rem',
        background: '#f9fafb',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
    },
    deliverableHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.8rem',
    },
    addDeliverableButton: {
        padding: '0.4rem 0.8rem',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 500,
        transition: 'background-color 0.2s',
    },
    deliverablesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
    },
    deliverableItem: {
        display: 'flex',
        gap: '0.6rem',
        alignItems: 'center',
    },
    deliverableFields: {
        flex: 1,
        display: 'flex',
        gap: '0.6rem',
    },
    removeDeliverableButton: {
        width: '2rem',
        height: '2rem',
        background: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#dc2626',
        flexShrink: 0,
    },
    emptyDeliverables: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.85rem',
        padding: '1rem',
        fontStyle: 'italic',
    },
    emptyModules: {
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.9rem',
        padding: '2rem',
        fontStyle: 'italic',
    },
    actions: {
        display: 'flex',
        gap: '1rem',
        paddingTop: '1rem',
        borderTop: '2px solid #e5e7eb',
    },
    saveButton: {
        padding: '0.7rem 1.5rem',
        background: '#2563eb',
        color: 'white',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.95rem',
        transition: 'background-color 0.2s',
    },
    deleteButton: {
        padding: '0.7rem 1.5rem',
        background: '#dc2626',
        color: 'white',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 500,
        fontSize: '0.95rem',
        transition: 'background-color 0.2s',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
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