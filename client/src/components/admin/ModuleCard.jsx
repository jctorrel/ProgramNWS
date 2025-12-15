// src/components/admin/ModuleCard.jsx
import React, { useState } from 'react';
import { 
    GripVertical, 
    ChevronRight, 
    ChevronDown,
    Copy, 
    Trash2, 
    Package, 
    Calendar, 
    Plus, 
    X 
} from 'lucide-react';
import { MOIS, generateSlug } from '../../utils/constants';

function ModuleCard({ 
    module, 
    index, 
    onChange, 
    onRemove, 
    onDuplicate,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getMonthLabel = (monthNum) => {
        return MOIS.find(m => m.value === monthNum)?.label || monthNum;
    };

    const handleLabelChange = (newLabel) => {
        onChange(index, 'label', newLabel);
        // Générer automatiquement l'ID si vide OU si c'était le slug de l'ancien label
        if (!module.id || module.id === generateSlug(module.label)) {
            onChange(index, 'id', generateSlug(newLabel));
        }
    };

    // --- Gestion des Livrables ---
    const addDeliverable = () => {
        const newDeliverables = [
            ...(module.deliverables || []),
            { descriptif: '', date: '' }
        ];
        onChange(index, 'deliverables', newDeliverables);
    };

    const updateDeliverable = (delivIndex, field, value) => {
        const newDeliverables = module.deliverables.map((deliv, i) =>
            i === delivIndex ? { ...deliv, [field]: value } : deliv
        );
        onChange(index, 'deliverables', newDeliverables);
    };

    const removeDeliverable = (delivIndex) => {
        const newDeliverables = module.deliverables.filter((_, i) => i !== delivIndex);
        onChange(index, 'deliverables', newDeliverables);
    };

    return (
        <div 
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`
                group relative bg-white rounded-xl border transition-all duration-200
                ${isDragging 
                    ? "opacity-40 border-dashed border-nws-purple ring-2 ring-nws-purple/20 shadow-none scale-[0.99]" 
                    : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
                }
            `}
        >
            {/* --- HEADER (Toujours visible) --- */}
            <div className="flex items-center gap-3 p-3 pl-2">
                
                {/* Drag Handle */}
                <div 
                    className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Maintenir pour déplacer"
                >
                    <GripVertical size={20} />
                </div>

                {/* Bouton Toggle Accordéon */}
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <ChevronRight 
                        size={20} 
                        className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} 
                    />
                </button>

                {/* Info Principale */}
                <div 
                    className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h5 className="font-semibold text-slate-800 text-sm sm:text-base">
                        {module.label || <span className="text-slate-400 italic">Nouveau module</span>}
                    </h5>
                    
                    {/* Badge Période */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        <Calendar size={12} />
                        <span>
                            {getMonthLabel(module.start_month)} → {getMonthLabel(module.end_month)}
                        </span>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDuplicate(index); }}
                        className="p-2 text-slate-400 hover:text-nws-purple hover:bg-purple-50 rounded-lg transition-colors"
                        title="Dupliquer"
                    >
                        <Copy size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* --- CONTENU (Visible si Expanded) --- */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-in slide-in-from-top-2 duration-200">
                    <hr className="border-slate-100 mb-4" />
                    
                    <div className="space-y-4">
                        {/* Ligne 1 : Nom & ID */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-7 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Nom du module <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={module.label}
                                    onChange={(e) => handleLabelChange(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all"
                                    placeholder="ex: React Avancé"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-5 space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    ID Unique <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={module.id}
                                    onChange={(e) => onChange(index, 'id', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm font-mono focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all"
                                    placeholder="react-avance"
                                    required
                                />
                            </div>
                        </div>

                        {/* Ligne 2 : Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Début
                                </label>
                                <div className="relative">
                                    <select
                                        value={module.start_month}
                                        onChange={(e) => onChange(index, 'start_month', parseInt(e.target.value))}
                                        className="w-full appearance-none px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all cursor-pointer"
                                    >
                                        {MOIS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                    Fin
                                </label>
                                <div className="relative">
                                    <select
                                        value={module.end_month}
                                        onChange={(e) => onChange(index, 'end_month', parseInt(e.target.value))}
                                        className="w-full appearance-none px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all cursor-pointer"
                                    >
                                        {MOIS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Ligne 3 : Contenu */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex justify-between">
                                <span>Contenu</span>
                            </label>
                            <textarea
                                value={module.content?.join('\n') || ''}
                                onChange={(e) => onChange(index, 'content', e.target.value.split('\n'))}
                                rows={4}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all resize-y min-h-[100px]"
                                placeholder={"Introduction au sujet\nInstallation des outils\nPremier projet"}
                            />
                        </div>

                        {/* Zone Livrables */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    <Package size={14} className="text-nws-purple" />
                                    Livrables attendus
                                </label>
                                <button
                                    type="button"
                                    onClick={addDeliverable}
                                    className="text-xs font-medium text-nws-purple hover:text-purple-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-100 transition-colors"
                                >
                                    <Plus size={14} />
                                    Ajouter
                                </button>
                            </div>

                            {(!module.deliverables || module.deliverables.length === 0) ? (
                                <div className="text-center py-4 text-slate-400 text-sm italic border border-dashed border-slate-200 rounded-lg">
                                    Aucun livrable défini pour ce module
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {module.deliverables.map((deliverable, delivIndex) => (
                                        <div key={delivIndex} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                                            <input
                                                type="text"
                                                value={deliverable.descriptif}
                                                onChange={(e) => updateDeliverable(delivIndex, 'descriptif', e.target.value)}
                                                className="flex-[2] w-full text-sm px-2 py-1.5 rounded border border-transparent hover:border-slate-200 focus:border-nws-purple focus:outline-none transition-colors"
                                                placeholder="Titre du rendu (ex: Dépôt GitHub)"
                                            />
                                            <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                                            <input
                                                type="datetime-local"
                                                value={deliverable.date}
                                                onChange={(e) => updateDeliverable(delivIndex, 'date', e.target.value)}
                                                className="flex-1 w-full text-xs text-slate-600 px-2 py-1.5 rounded border border-transparent hover:border-slate-200 focus:border-nws-purple focus:outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeDeliverable(delivIndex)}
                                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors self-end sm:self-center"
                                                title="Supprimer ce livrable"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ModuleCard;