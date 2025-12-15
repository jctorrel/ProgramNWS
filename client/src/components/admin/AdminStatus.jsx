// src/components/admin/AdminStatus.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldX, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-nws-purple animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500 animate-pulse">
                Vérification des droits...
            </p>
        </div>
    );
}

export function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl border border-red-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
            {/* Icône d'alerte */}
            <div className="mx-auto w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-5">
                <ShieldX size={28} />
            </div>

            {/* Titre et explication */}
            <h2 className="text-xl font-bold text-slate-900 mb-2">
                Accès refusé
            </h2>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Votre compte n'est pas autorisé à accéder à l'espace d'administration. 
                Veuillez contacter un responsable si vous pensez qu'il s'agit d'une erreur.
            </p>

            {/* Bouton de retour */}
            <button 
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200 border border-slate-200"
            >
                <ArrowLeft size={16} />
                Retour à l'application
            </button>
        </div>
    );
}

export function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 p-4 mt-4 rounded-xl bg-red-50 border border-red-100 text-red-700 animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">
                {message}
            </div>
        </div>
    );
}

export function SuccessMessage({ message }) {
    if (!message) return null;

    return (
        <div className="flex items-start gap-3 p-4 mt-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 animate-in fade-in slide-in-from-top-1">
            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-medium">
                {message}
            </div>
        </div>
    );
}