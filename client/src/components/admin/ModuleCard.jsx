// src/components/admin/ModuleCard.jsx
import { useState } from 'react';
import { MOIS, generateSlug } from '../../utils/constants';

function ModuleCard({ 
    module, 
    index, 
    onChange, 
    onRemove, 
    onDuplicate,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getMonthLabel = (monthNum) => {
        return MOIS.find(m => m.value === monthNum)?.label || monthNum;
    };

    const handleLabelChange = (newLabel) => {
        onChange(index, 'label', newLabel);
        // Générer automatiquement l'ID si vide OU si c'était le slug de l'ancien label
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
        <div 
            style={{
                ...styles.card,
                ...(isDragging ? styles.cardDragging : {})
            }}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
        >
            <div style={styles.header}>
                <span style={styles.dragHandle} title="Glisser pour réordonner">
                    ⋮⋮
                </span>

                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={styles.expandButton}
                >
                    {isExpanded ? '▼' : '▷'}
                </button>

                <div style={styles.headerInfo}>
                    <h5 style={styles.title}>
                        {module.label || `Module ${index + 1}`}
                    </h5>
                    <span style={styles.period}>
                        {getMonthLabel(module.start_month)} → {getMonthLabel(module.end_month)}
                    </span>
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={() => onDuplicate(index)}
                        style={styles.iconButton}
                        title="Dupliquer ce module"
                    >
                        📋
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
                <div style={styles.content}>
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
                                    {MOIS.map(m => (
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
                                    {MOIS.map(m => (
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
                                style={styles.textarea}
                                rows={4}
                                placeholder="Installation, configuration et déploiement&#10;Gestion des plugins&#10;Thèmes personnalisés"
                            />
                        </label>
                        <p style={styles.hint}>
                            💡 Un élément par ligne. Ces contenus décrivent ce qui sera enseigné dans le module.
                        </p>
                    </div>

                    {/* Livrables */}
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
    card: {
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.6rem',
        overflow: 'hidden',
        transition: 'all 0.2s',
    },
    cardDragging: {
        opacity: 0.5,
        border: '2px dashed #3b82f6',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        padding: '0.8rem 1rem',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
    },
    dragHandle: {
        cursor: 'grab',
        fontSize: '1rem',
        color: '#9ca3af',
        userSelect: 'none',
        padding: '0.2rem',
    },
    expandButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        padding: '0.2rem',
        color: '#6b7280',
    },
    headerInfo: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
    },
    title: {
        margin: 0,
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#1e293b',
    },
    period: {
        fontSize: '0.75rem',
        color: '#6b7280',
        padding: '0.2rem 0.6rem',
        background: '#f3f4f6',
        borderRadius: '0.3rem',
        fontWeight: 500,
    },
    actions: {
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
    content: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    field: {
        flex: 1,
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
};

export default ModuleCard;