// src/components/admin/AdminHeader.jsx
import { getCurrentUserEmail } from "../../utils/storage";

function AdminHeader() {
    const userEmail = getCurrentUserEmail();

    return (
        <header style={styles.header}>
            <div>
                <h1 style={styles.title}>Administration</h1>
                <p style={styles.subtitle}>
                    Interface de gestion du mentor IA
                </p>
            </div>
            {userEmail && (
                <div style={styles.userBadge}>
                    <span style={styles.userLabel}>Connecté :</span>
                    <span style={styles.userEmail}>{userEmail}</span>
                </div>
            )}
        </header>
    );
}

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1.5rem",
    },
    title: {
        margin: 0,
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#0f172a",
    },
    subtitle: {
        margin: 0,
        marginTop: "0.25rem",
        fontSize: "0.95rem",
        color: "#6b7280",
    },
    userBadge: {
        padding: "1rem 1.5rem",
        borderRadius: "999px",
        backgroundColor: "#f1f5f9",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
    userLabel: {
        fontSize: "0.7rem",
        color: "#94a3b8",
    },
    userEmail: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#0f172a",
    },
};

export default AdminHeader;
