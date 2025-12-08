// src/components/admin/PromptsList.jsx

function PromptsList({ prompts, selectedKey, onSelect }) {
    if (prompts.length === 0) {
        return (
            <div style={styles.sidebar}>
                <h3 style={styles.sidebarTitle}>Liste des prompts</h3>
                <p style={styles.sidebarEmpty}>Aucun prompt trouvé.</p>
            </div>
        );
    }

    return (
        <div style={styles.sidebar}>
            <h3 style={styles.sidebarTitle}>Liste des prompts</h3>
            <ul style={styles.promptList}>
                {prompts.map((prompt) => (
                    <PromptItem
                        key={prompt.key}
                        prompt={prompt}
                        isActive={prompt.key === selectedKey}
                        onClick={() => onSelect(prompt.key)}
                    />
                ))}
            </ul>
        </div>
    );
}

function PromptItem({ prompt, isActive, onClick }) {
    const itemStyle = {
        ...styles.promptItem,
        ...(isActive ? styles.promptItemActive : {}),
    };

    return (
        <li style={itemStyle} onClick={onClick}>
            <div style={styles.promptKey}>{prompt.key}</div>
            {prompt.label && (
                <div style={styles.promptLabel}>{prompt.label}</div>
            )}
        </li>
    );
}

const styles = {
    sidebar: {
        width: "260px",
        borderRadius: "1rem",
        border: "1px solid #e5e7eb",
        backgroundColor: "#f9fafb",
        padding: "0.75rem",
        maxHeight: "400px",
        overflowY: "auto",
    },
    sidebarTitle: {
        margin: "0 0 0.5rem 0",
        fontSize: "0.9rem",
        fontWeight: 600,
        color: "#111827",
    },
    sidebarEmpty: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#6b7280",
    },
    promptList: {
        listStyle: "none",
        margin: 0,
        padding: 0,
    },
    promptItem: {
        padding: "0.4rem 0.5rem",
        borderRadius: "0.6rem",
        cursor: "pointer",
        marginBottom: "0.25rem",
        transition: "background-color 0.15s",
    },
    promptItemActive: {
        backgroundColor: "#e0f2fe",
    },
    promptKey: {
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#0f172a",
    },
    promptLabel: {
        fontSize: "0.75rem",
        color: "#6b7280",
        marginTop: "0.1rem",
    },
};

export default PromptsList;
