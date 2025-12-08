// src/components/admin/AdminSection.jsx

function AdminSection({ title, description, children, muted = false }) {
    return (
        <section style={muted ? styles.sectionMuted : styles.section}>
            <h2 style={styles.sectionTitle}>{title}</h2>
            {description && (
                <p style={styles.sectionHelp}>{description}</p>
            )}
            {children}
        </section>
    );
}

const styles = {
    section: {
        marginTop: "1.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #e5e7eb",
    },
    sectionMuted: {
        marginTop: "1.5rem",
        paddingTop: "1.5rem",
        borderTop: "1px dashed #e5e7eb",
        opacity: 0.8,
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
};

export default AdminSection;
