// src/components/admin/ProgramsList.jsx

function ProgramsList({ programs, selectedKey, onSelect, onCreate, onDelete }) {
    const sortedPrograms = [...programs].sort((a, b) => {
        // Extraire l'année de la clé (A1, A2DW, etc.)
        const getYear = (key) => {
            const match = key?.match(/^A(\d)/);
            return match ? parseInt(match[1]) : 999;
        };
        
        const yearA = getYear(a.key);
        const yearB = getYear(b.key);
        
        if (yearA !== yearB) return yearA - yearB;
        
        // Si même année, trier par filière
        return (a.key || '').localeCompare(b.key || '');
    });

    return (
        <div style={styles.sidebar}>
            <div style={styles.header}>
                <h3 style={styles.title}>Programmes</h3>
                <span style={styles.count}>{programs.length}</span>
            </div>

            <button style={styles.createButton} onClick={onCreate}>
                + Nouveau programme
            </button>

            {programs.length === 0 ? (
                <div style={styles.emptyState}>
                    <p style={styles.emptyIcon}>📚</p>
                    <p style={styles.emptyText}>Aucun programme</p>
                    <p style={styles.emptyHint}>
                        Crée ton premier programme pour commencer
                    </p>
                </div>
            ) : (
                <ul style={styles.list}>
                    {sortedPrograms.map((program) => (
                        <ProgramItem
                            key={program.key}
                            program={program}
                            isActive={program.key === selectedKey}
                            onClick={() => onSelect(program.key)}
                            onDelete={() => onDelete(program.key)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

function ProgramItem({ program, isActive, onClick, onDelete }) {
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm(`Supprimer le programme "${program.label}" ?\n\nCette action est irréversible.`)) {
            onDelete();
        }
    };

    const itemStyle = {
        ...styles.item,
        ...(isActive ? styles.activeItem : {}),
    };

    return (
        <li style={itemStyle}>
            <div style={styles.itemContent} onClick={onClick}>
                <div style={styles.itemHeader}>
                    <span style={styles.programKey}>{program.key}</span>
                    {program.modules && program.modules.length > 0 && (
                        <span style={styles.moduleCount}>
                            {program.modules.length} module{program.modules.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <span style={styles.programLabel}>
                    {program.label || "(sans nom)"}
                </span>
            </div>
            
            {isActive && (
                <button
                    style={styles.deleteButton}
                    onClick={handleDelete}
                    title="Supprimer ce programme"
                >
                    🗑️
                </button>
            )}
        </li>
    );
}

const styles = {
    sidebar: {
        width: "280px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "0.8rem",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxHeight: "calc(100vh - 12rem)",
        overflowY: "auto",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "0.5rem",
    },
    title: {
        margin: 0,
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#1e293b",
    },
    count: {
        padding: "0.2rem 0.5rem",
        background: "#e0f2fe",
        color: "#0369a1",
        borderRadius: "0.4rem",
        fontSize: "0.75rem",
        fontWeight: 600,
    },
    createButton: {
        width: "100%",
        padding: "0.6rem",
        background: "#10b981",
        border: "none",
        borderRadius: "0.5rem",
        color: "white",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "0.9rem",
        transition: "background-color 0.2s",
    },
    list: {
        listStyle: "none",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
    },
    item: {
        padding: "0.75rem",
        borderRadius: "0.5rem",
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "all 0.15s",
        border: "1px solid transparent",
        background: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
    },
    activeItem: {
        background: "#e0f2fe",
        fontWeight: 500,
        border: "1px solid #0ea5e9",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    itemContent: {
        display: "flex",
        flexDirection: "column",
        gap: "0.3rem",
        flex: 1,
    },
    itemHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "0.5rem",
    },
    programKey: {
        fontSize: "0.8rem",
        fontWeight: 700,
        color: "#0ea5e9",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    moduleCount: {
        fontSize: "0.7rem",
        color: "#6b7280",
        background: "#f3f4f6",
        padding: "0.15rem 0.4rem",
        borderRadius: "0.3rem",
    },
    programLabel: {
        fontSize: "0.85rem",
        color: "#1e293b",
        lineHeight: "1.3",
    },
    deleteButton: {
        background: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "1rem",
        padding: "0.3rem",
        borderRadius: "0.3rem",
        transition: "all 0.2s",
        opacity: 0.6,
    },
    emptyState: {
        textAlign: "center",
        padding: "2rem 1rem",
    },
    emptyIcon: {
        fontSize: "3rem",
        margin: "0 0 0.5rem 0",
    },
    emptyText: {
        margin: "0 0 0.5rem 0",
        fontSize: "0.9rem",
        color: "#6b7280",
        fontWeight: 500,
    },
    emptyHint: {
        margin: 0,
        fontSize: "0.8rem",
        color: "#9ca3af",
        fontStyle: "italic",
    },
};

export default ProgramsList;