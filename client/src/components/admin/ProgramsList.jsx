// src/components/admin/ProgramsList.jsx
import React from 'react';
import { 
    Plus, 
    Trash2, 
    BookOpen, 
    Layers, 
    Search 
} from 'lucide-react';

function ProgramsList({ programs, selectedKey, onSelect, onCreate, onDelete }) {
    
    // Logique de tri conservée
    const sortedPrograms = [...programs].sort((a, b) => {
        const getYear = (key) => {
            const match = key?.match(/^A(\d)/);
            return match ? parseInt(match[1]) : 999;
        };
        
        const yearA = getYear(a.key);
        const yearB = getYear(b.key);
        
        if (yearA !== yearB) return yearA - yearB;
        return (a.key || '').localeCompare(b.key || '');
    });

    return (
        <div className="w-full md:w-72 flex flex-col gap-4 h-[calc(100vh-8rem)]">
            
            {/* --- HEADER SIDEBAR --- */}
            <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <BookOpen size={20} className="text-nws-purple" />
                    Programmes
                </h3>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                    {programs.length}
                </span>
            </div>

            {/* --- BOUTON CRÉATION --- */}
            <button 
                onClick={onCreate}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2.5 rounded-lg font-medium transition-colors shadow-sm active:scale-95"
            >
                <Plus size={18} />
                Nouveau programme
            </button>

            {/* --- LISTE DÉFILANTE --- */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {programs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center h-48 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl p-4">
                        <Layers size={40} className="mb-3 text-slate-300" />
                        <p className="font-medium text-slate-600 mb-1">Aucun programme</p>
                        <p className="text-xs">Crée le premier pour commencer l'édition</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
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

    return (
        <li 
            onClick={onClick}
            className={`
                group relative flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all border
                ${isActive 
                    ? "bg-purple-50 border-purple-200 shadow-sm ring-1 ring-purple-100" 
                    : "bg-white border-transparent hover:border-slate-200 hover:bg-slate-50"
                }
            `}
        >
            <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                    {/* Badge Clé (ex: A1, A2DW) */}
                    <span className={`
                        text-xs font-bold px-1.5 py-0.5 rounded
                        ${isActive ? 'bg-white text-nws-purple' : 'bg-slate-100 text-slate-600'}
                    `}>
                        {program.key}
                    </span>

                    {/* Badge Module Count */}
                    {program.modules && program.modules.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                            <Layers size={10} />
                            {program.modules.length}
                        </span>
                    )}
                </div>

                <span className={`text-sm font-medium truncate leading-tight ${isActive ? 'text-purple-900' : 'text-slate-700'}`}>
                    {program.label || <span className="italic opacity-50">(Sans nom)</span>}
                </span>
            </div>
            
            {/* Bouton Supprimer (Visible si actif ou au hover) */}
            <button
                onClick={handleDelete}
                className={`
                    p-1.5 rounded-lg transition-all
                    ${isActive 
                        ? "text-purple-300 hover:text-red-500 hover:bg-white" 
                        : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50"
                    }
                `}
                title="Supprimer ce programme"
            >
                <Trash2 size={16} />
            </button>
        </li>
    );
}

export default ProgramsList;