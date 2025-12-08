// src/pages/AdminHome.jsx
import { useNavigate } from "react-router-dom";

import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useAdminConfig } from "../../hooks/useAdminConfig";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminSection from "../../components/admin/AdminSection";
import ConfigForm from "../../components/admin/ConfigForm";
import AdminPromptsSection from "./AdminPromptsSection";
import AdminProgramsSection from "./AdminProgramsSection";
import AdminFreeModeSection from "../../components/admin/AdminFreeModeSection";
import { LoadingState, AccessDenied } from "../../components/admin/AdminStatus";

function AdminHome() {
    const navigate = useNavigate();
    const { loading, isAdmin, error: authError, config: initialConfig } = useAdminAuth();
    const { 
        config, 
        saving, 
        saveMessage, 
        error: saveError, 
        updateField, 
        saveConfig 
    } = useAdminConfig(initialConfig);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <AdminHeader />

                <button
                    type="button"
                    style={styles.buttonSecondary}
                    onClick={() => navigate("/")}
                >
                    ← Retour à l'application
                </button>

                {loading && <LoadingState />}

                {!loading && !isAdmin && <AccessDenied />}

                {!loading && isAdmin && (
                    <>
                        <ConfigForm
                            config={config}
                            saving={saving}
                            saveMessage={saveMessage}
                            error={saveError}
                            onFieldChange={updateField}
                            onSave={saveConfig}
                        />

                        {/* Section Mode Libre */}
                        <AdminSection title="Interface Étudiants">
                            <AdminFreeModeSection />
                        </AdminSection>

                        <AdminSection title="Prompts">
                            <AdminPromptsSection />
                        </AdminSection>

                        <AdminProgramsSection />
                    </>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "radial-gradient(circle at top, #e0f2fe 0, #f8fafc 40%, #e5e7eb 100%)",
        padding: "1rem",
        fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "1.5rem",
        padding: "2rem",
        maxWidth: "900px",
        width: "100%",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
    },
    buttonSecondary: {
        padding: "0.5rem 0.9rem",
        borderRadius: "999px",
        border: "1px solid #cbd5f5",
        backgroundColor: "#f8fafc",
        fontSize: "0.85rem",
        cursor: "pointer",
        transition: "background-color 0.2s",
    },
};

export default AdminHome;
