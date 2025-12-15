// src/components/Login.jsx
import React, { useEffect, useState } from "react";
import { GraduationCap, AlertCircle, Loader2 } from "lucide-react";

function Login() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Nettoyage au cas où le script existe déjà
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (existingScript) existingScript.remove();

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };

        function initGoogle() {
            if (!window.google) return;

            google.accounts.id.initialize({
                client_id: "615384218256-nq12r22v6dhc7t4g76o8r15if1vs85tm.apps.googleusercontent.com",
                callback: handleCredentialResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    theme: "filled_blue",
                    size: "large",
                    shape: "pill",
                    width: 280,
                    logo_alignment: "left"
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

                localStorage.setItem("access_token", data.token);
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                window.location.href = "/";
            } catch (e) {
                console.error(e);
                setError(e.message || "Une erreur est survenue lors de la connexion.");
            } finally {
                setLoading(false);
            }
        }
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-50 font-sans">
            
            {/* --- Décors d'arrière-plan (Blobs animés) --- */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-nws-purple/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-nws-teal/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
            
            <div className="relative z-10 w-full max-w-[420px] p-6">
                
                {/* --- Carte de connexion --- */}
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] rounded-[32px] p-8 sm:p-10 text-center">
                    
                    {/* Logo / Icône */}
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-nws-purple to-nws-teal rounded-2xl flex items-center justify-center shadow-lg mb-6 text-white rotate-3 hover:rotate-6 transition-transform duration-300">
                         {/* Tu peux remettre <img src="/logo.svg" /> ici si tu préfères */}
                        <GraduationCap size={32} />
                    </div>

                    {/* Titres */}
                    <h1 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">
                        Bienvenue sur Mentor AI
                    </h1>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Votre assistant pédagogique intelligent pour la <br className="hidden sm:block"/>
                        <span className="font-semibold text-nws-purple">Normandie Web School</span>.
                    </p>

                    {/* Zone d'erreur */}
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 text-left animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Zone de chargement / Bouton */}
                    <div className="min-h-[50px] flex items-center justify-center relative">
                        {loading ? (
                            <div className="flex flex-col items-center gap-2 text-nws-purple">
                                <Loader2 className="animate-spin" size={24} />
                                <span className="text-xs font-medium text-slate-400">Vérification des accès...</span>
                            </div>
                        ) : (
                            <div id="googleSignInDiv" className="w-full flex justify-center transition-opacity hover:opacity-95" />
                        )}
                    </div>

                    {/* Footer de la carte */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">
                            Accès réservé @normandiewebschool.fr
                        </p>
                    </div>
                </div>

                {/* Copyright bas de page */}
                <p className="text-center text-slate-400 text-xs mt-8 opacity-60">
                    &copy; {new Date().getFullYear()} NWS Mentor AI. Tous droits réservés.
                </p>
            </div>
        </div>
    );
}

export default Login;