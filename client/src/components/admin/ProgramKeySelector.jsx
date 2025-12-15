// src/components/admin/ProgramKeySelector.jsx
import React from 'react';
import { ChevronDown, Info, Key, Fingerprint } from 'lucide-react';
import { ANNEES, FILIERES } from '../../utils/constants';

function ProgramKeySelector({ year, filiere, onChange, generatedKey }) {
    
    const handleYearChange = (newYear) => {
        onChange({
            year: newYear,
            filiere: newYear === '1' ? '' : filiere
        });
    };

    const handleFiliereChange = (newFiliere) => {
        onChange({
            year,
            filiere: newFiliere
        });
    };

    const isYearOne = year === '1';

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold text-sm uppercase tracking-wider">
                <Fingerprint size={18} className="text-nws-purple" />
                Configuration du Programme
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Sélecteur ANNÉE --- */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">
                        Année du cursus <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            value={year}
                            onChange={(e) => handleYearChange(e.target.value)}
                            className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all cursor-pointer shadow-sm hover:border-slate-400"
                            required
                        >
                            <option value="">-- Choisir une année --</option>
                            {ANNEES.map(a => (
                                <option key={a.value} value={a.value}>
                                    {a.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* --- Sélecteur FILIÈRE --- */}
                <div className="space-y-2">
                    <label className={`block text-sm font-medium transition-colors ${isYearOne ? 'text-slate-400' : 'text-slate-700'}`}>
                        Filière de spécialisation {!isYearOne && <span className="text-red-500">*</span>}
                    </label>
                    
                    <div className="relative">
                        <select
                            value={filiere}
                            onChange={(e) => handleFiliereChange(e.target.value)}
                            disabled={isYearOne}
                            className={`
                                w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border text-sm outline-none transition-all shadow-sm
                                ${isYearOne 
                                    ? "bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed" 
                                    : "bg-white border-slate-300 text-slate-900 cursor-pointer hover:border-slate-400 focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10"
                                }
                            `}
                            required={!isYearOne}
                        >
                            <option value="">
                                {isYearOne ? 'Pas de filière (Tronc commun)' : '-- Choisir une filière --'}
                            </option>
                            {FILIERES.map(f => (
                                <option key={f.code} value={f.code}>
                                    {f.label} ({f.code})
                                </option>
                            ))}
                        </select>
                        <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isYearOne ? 'text-slate-300' : 'text-slate-400'}`} size={18} />
                    </div>

                    {/* Hint pour Année 1 */}
                    {isYearOne && (
                        <div className="flex items-start gap-2 mt-2 text-xs text-cyan-600 bg-cyan-50 p-2 rounded-lg border border-cyan-100 animate-in fade-in slide-in-from-top-1">
                            <Info size={14} className="mt-0.5 shrink-0" />
                            <span>L'année 1 est un tronc commun, elle ne nécessite pas de sélection de filière.</span>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Affichage de la CLÉ GÉNÉRÉE --- */}
            {generatedKey && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Key size={16} />
                        <span>Identifiant unique du programme :</span>
                    </div>
                    
                    <div className="group relative overflow-hidden rounded-lg px-4 py-2 bg-nws-purple">
                        <code className="relative font-mono text-base font-bold text-white tracking-wider">
                            {generatedKey}
                        </code>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProgramKeySelector;