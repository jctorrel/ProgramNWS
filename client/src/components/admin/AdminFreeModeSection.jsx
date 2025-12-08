// src/components/admin/AdminFreeModeSection.jsx
import React, { useState, useEffect } from "react";

function AdminFreeModeSection() {
    const [freeModeEnabled, setFreeModeEnabled] = useState(true);
    const [saveStatus, setSaveStatus] = useState("");

    // Charger la configuration au montage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("mentor_admin_settings");
            if (stored) {
                const settings = JSON.parse(stored);
                setFreeModeEnabled(settings.freeModeEnabled ?? true);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des paramètres:", error);
        }
    }, []);

    // Sauvegarder la configuration
    const handleToggle = () => {
        const newValue = !freeModeEnabled;
        setFreeModeEnabled(newValue);

        try {
            const settings = {
                freeModeEnabled: newValue
            };
            localStorage.setItem("mentor_admin_settings", JSON.stringify(settings));
            setSaveStatus("✓ Sauvegardé");
            setTimeout(() => setSaveStatus(""), 2000);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde:", error);
            setSaveStatus("✗ Erreur");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h3 style={styles.title}>
                        💬 Mode Discussion Libre
                    </h3>
                    <p style={styles.description}>
                        Permettre aux étudiants de poser des questions en dehors des modules du programme
                    </p>
                </div>
                {saveStatus && (
                    <span style={styles.saveStatus}>
                        {saveStatus}
                    </span>
                )}
            </div>

            <div style={styles.content}>
                <div style={styles.switchContainer}>
                    <div style={styles.switchInfo}>
                        <span style={styles.switchLabel}>
                            {freeModeEnabled ? "Activé" : "Désactivé"}
                        </span>
                        <span style={styles.switchSubtext}>
                            {freeModeEnabled 
                                ? "Les étudiants voient 2 onglets : Mode Guidé + Mode Libre"
                                : "Les étudiants voient uniquement le Mode Guidé"
                            }
                        </span>
                    </div>
                    
                    <button
                        onClick={handleToggle}
                        style={{
                            ...styles.toggle,
                            backgroundColor: freeModeEnabled ? "#00c7b1" : "#cbd5e1"
                        }}
                    >
                        <span
                            style={{
                                ...styles.toggleKnob,
                                transform: freeModeEnabled ? "translateX(24px)" : "translateX(2px)"
                            }}
                        />
                    </button>
                </div>

                {freeModeEnabled && (
                    <div style={styles.infoBox}>
                        <p style={styles.infoText}>
                            <strong>ℹ️ Mode Libre activé :</strong> Les étudiants peuvent basculer entre :
                        </p>
                        <ul style={styles.infoList}>
                            <li><strong>Mode Guidé</strong> : Questions liées aux modules du programme</li>
                            <li><strong>Mode Libre</strong> : Discussion ouverte sur tous les sujets</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        backgroundColor: "#f8fafc",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        border: "1px solid #e2e8f0",
        marginTop: "1.5rem",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem",
    },
    title: {
        margin: "0 0 0.25rem 0",
        fontSize: "1.1rem",
        fontWeight: "600",
        color: "#1e293b",
    },
    description: {
        margin: 0,
        fontSize: "0.85rem",
        color: "#64748b",
        lineHeight: "1.4",
    },
    saveStatus: {
        fontSize: "0.85rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "999px",
        backgroundColor: "#dcfce7",
        color: "#166534",
        fontWeight: "500",
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
    },
    switchContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        border: "1px solid #e2e8f0",
    },
    switchInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
    },
    switchLabel: {
        fontSize: "0.95rem",
        fontWeight: "600",
        color: "#1e293b",
    },
    switchSubtext: {
        fontSize: "0.8rem",
        color: "#64748b",
    },
    toggle: {
        position: "relative",
        width: "52px",
        height: "28px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        flexShrink: 0,
        padding: 0,
    },
    toggleKnob: {
        position: "absolute",
        top: "2px",
        left: 0,
        width: "24px",
        height: "24px",
        backgroundColor: "white",
        borderRadius: "50%",
        transition: "transform 0.2s",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    infoBox: {
        backgroundColor: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "0.5rem",
        padding: "0.875rem",
    },
    infoText: {
        margin: "0 0 0.5rem 0",
        fontSize: "0.85rem",
        color: "#1e40af",
    },
    infoList: {
        margin: 0,
        paddingLeft: "1.25rem",
        fontSize: "0.8rem",
        color: "#1e40af",
        lineHeight: "1.6",
    },
};

export default AdminFreeModeSection;
