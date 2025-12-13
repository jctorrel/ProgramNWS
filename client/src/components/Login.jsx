// src/components/Login.jsx
import { useEffect, useState } from "react";

function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };

        function initGoogle() {
            if (!window.google) return;

            google.accounts.id.initialize({
                client_id: "710051575210-v97n9m4jmro2mb7f6l2nn00pl4jovq8j.apps.googleusercontent.com",
                callback: handleCredentialResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    theme: "outline",
                    size: "large",
                    shape: "pill",
                    width: 260,
                }
            );
        }

        async function handleCredentialResponse(response) {
            setError("");
            setLoading(true);
            try {
                const idToken = response.credential;

                const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Erreur d'authentification");
                }

                // On stocke le token retourné par ton backend
                localStorage.setItem("access_token", data.token);
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                // Redirection vers l’app (MentorChatApp)
                window.location.href = "/";
            } catch (e) {
                setError(e.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
            }
        }
    }, []);

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Connexion</h1>
                <p style={styles.subtitle}>
                    Accès réservé aux comptes <strong>@normandiewebschool.fr</strong>
                </p>

                <div id="googleSignInDiv" style={styles.buttonContainer} />

                {loading && <p style={styles.info}>Connexion en cours…</p>}
                {error && <p style={styles.error}>{error}</p>}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
            "radial-gradient(circle at top, #e0f2fe 0, #f8fafc 40%, #e5e7eb 100%)",
        padding: "1rem",
    },
    card: {
        backgroundColor: "white",
        borderRadius: "1.5rem",
        boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
        padding: "2.5rem 2rem",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    title: {
        margin: 0,
        marginBottom: "0.75rem",
        fontSize: "1.8rem",
        fontWeight: 700,
        color: "#0f172a",
    },
    subtitle: {
        margin: 0,
        marginBottom: "1.5rem",
        fontSize: "0.95rem",
        color: "#6b7280",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1rem",
    },
    info: {
        fontSize: "0.85rem",
        color: "#6b7280",
        marginTop: "0.5rem",
    },
    error: {
        fontSize: "0.85rem",
        color: "#b91c1c",
        marginTop: "0.5rem",
    },
};

export default Login;
