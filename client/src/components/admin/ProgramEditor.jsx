// src/components/admin/ProgramEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { 
    Save, 
    Trash2, 
    Upload, 
    Download, 
    FileJson, 
    Code, 
    RotateCcw, 
    Plus, 
    Share2, 
    CheckCircle,
    FileText,
    Layers
} from 'lucide-react';

import { ErrorMessage, SuccessMessage } from "./AdminStatus";
import { useAI } from "../../hooks/useAI";
import ProgramKeySelector from './ProgramKeySelector';
import ModuleCard from './ModuleCard';
import InputBar from './InputBar';
import { generateUniqueId, parseKey, generateKey, isValidDate } from '../../utils/constants';
import PublishModal from './PublishModal';

function ProgramEditor({
    selectedProgram,
    saving,
    saveMessage,
    error,
    onSave,
    onDelete,
    publishProgram,
    unpublishProgram,
    regeneratePublishToken,
}) {
    // --- STATE & LOGIC (Inchangé) ---
    const [formData, setFormData] = useState({
        key: '',
        label: '',
        description: '',
        modules: []
    });
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [originalData, setOriginalData] = useState(null);
    const [showJsonPreview, setShowJsonPreview] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const modulesEndRef = useRef(null);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishStatus, setPublishStatus] = useState({
        published: false,
        publishToken: null,
        publishedAt: null
    });
    const [inputValue, setInputValue] = useState('');
    const { modifyProgram, loading } = useAI();

    // Charger le programme sélectionné
    useEffect(() => {
        if (selectedProgram) {
            const modulesWithIds = (selectedProgram.modules || []).map(mod => ({
                ...mod,
                _uniqueId: mod._uniqueId || generateUniqueId()
            }));

            const programData = {
                key: selectedProgram.key || '',
                label: selectedProgram.label || '',
                description: selectedProgram.description || '',
                modules: modulesWithIds
            };

            const { year, filiere } = parseKey(selectedProgram.key);
            setSelectedYear(year);
            setSelectedFiliere(filiere);

            setFormData(programData);
            setOriginalData(JSON.parse(JSON.stringify(programData)));
            setIsDirty(false);
        }
    }, [selectedProgram]);

    // Générer automatiquement la clé
    useEffect(() => {
        const generatedKey = generateKey(selectedYear, selectedFiliere);
        if (generatedKey) {
            setFormData(prev => ({ ...prev, key: generatedKey }));
        }
    }, [selectedYear, selectedFiliere]);

    // Détecter les modifications
    useEffect(() => {
        if (originalData) {
            const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
            setIsDirty(hasChanges);
        }
    }, [formData, originalData]);

    // Charger le statut de publication
    useEffect(() => {
        if (selectedProgram) {
            setPublishStatus({
                published: selectedProgram.published || false,
                publishToken: selectedProgram.publishToken || null,
                publishedAt: selectedProgram.publishedAt || null
            });
        }
    }, [selectedProgram]);

    if (!selectedProgram) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-[calc(100vh-6rem)] text-slate-400 bg-white rounded-2xl border border-slate-200 shadow-sm m-1">
                <Layers size={48} className="mb-4 text-slate-200" />
                <p className="text-lg font-medium text-slate-500">Aucun programme sélectionné</p>
                <p className="text-sm">Sélectionnez un programme dans la liste pour commencer l'édition.</p>
            </div>
        );
    }

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleKeyChange = ({ year, filiere }) => {
        setSelectedYear(year);
        setSelectedFiliere(filiere);
    };

    const handleModuleChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            modules: prev.modules.map((mod, i) =>
                i === index ? { ...mod, [field]: value } : mod
            )
        }));
    };

    const addModule = () => {
        const newModule = {
            _uniqueId: generateUniqueId(),
            id: '',
            label: '',
            start_month: 9,
            end_month: 9,
            content: [],
            deliverables: []
        };

        setFormData(prev => ({
            ...prev,
            modules: [...prev.modules, newModule]
        }));

        setTimeout(() => {
            modulesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const duplicateModule = (index) => {
        const moduleToDuplicate = formData.modules[index];
        const duplicatedModule = {
            ...JSON.parse(JSON.stringify(moduleToDuplicate)),
            _uniqueId: generateUniqueId(),
            label: `${moduleToDuplicate.label} (copie)`,
            id: `${moduleToDuplicate.id}-copy`
        };

        setFormData(prev => ({
            ...prev,
            modules: [
                ...prev.modules.slice(0, index + 1),
                duplicatedModule,
                ...prev.modules.slice(index + 1)
            ]
        }));
    };

    const removeModule = (index) => {
        const moduleName = formData.modules[index].label || `Module ${index + 1}`;
        if (window.confirm(`Supprimer le module "${moduleName}" ?\nCette action est irréversible.`)) {
            setFormData(prev => ({
                ...prev,
                modules: prev.modules.filter((_, i) => i !== index)
            }));
        }
    };

    // Drag & Drop handlers
    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newModules = [...formData.modules];
        const draggedItem = newModules[draggedIndex];
        newModules.splice(draggedIndex, 1);
        newModules.splice(index, 0, draggedItem);

        setFormData(prev => ({ ...prev, modules: newModules }));
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (!selectedYear) {
            alert('❌ Veuillez sélectionner une année');
            return;
        }

        if (selectedYear !== '1' && !selectedFiliere) {
            alert('❌ Veuillez sélectionner une filière pour cette année');
            return;
        }

        if (!formData.key) {
            alert('❌ La clé du programme n\'a pas pu être générée');
            return;
        }

        let hasInvalidDates = false;
        formData.modules.forEach((mod) => {
            mod.deliverables?.forEach((deliv, delivIndex) => {
                if (deliv.date && !isValidDate(deliv.date)) {
                    hasInvalidDates = true;
                    alert(`Date invalide dans le module "${mod.label}", livrable ${delivIndex + 1}`);
                }
            });
        });

        if (hasInvalidDates) return;

        const cleanedData = {
            ...formData,
            modules: formData.modules.map(mod => {
                const { _uniqueId, ...moduleData } = mod;
                return {
                    ...moduleData,
                    content: moduleData.content.filter(line => line.trim()),
                    deliverables: (moduleData.deliverables || []).filter(d =>
                        d.descriptif.trim() || d.date
                    )
                };
            })
        };

        onSave(cleanedData);
        setOriginalData(JSON.parse(JSON.stringify(formData)));
        setIsDirty(false);
    };

    const handleReset = () => {
        if (window.confirm('Annuler toutes les modifications ?')) {
            setFormData(JSON.parse(JSON.stringify(originalData)));
            const { year, filiere } = parseKey(originalData.key);
            setSelectedYear(year);
            setSelectedFiliere(filiere);
            setIsDirty(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`⚠️ ATTENTION ⚠️\n\nSupprimer le programme "${formData.label}" ?\n\nCette action est IRRÉVERSIBLE.`)) {
            onDelete(selectedProgram.key);
        }
    };

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(formData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `program_${formData.key}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleImportJSON = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);
                    const modulesWithIds = (imported.modules || []).map(mod => ({
                        ...mod,
                        _uniqueId: generateUniqueId()
                    }));

                    const { year, filiere } = parseKey(imported.key);
                    setSelectedYear(year);
                    setSelectedFiliere(filiere);

                    setFormData({
                        key: imported.key || '',
                        label: imported.label || '',
                        description: imported.description || '',
                        modules: modulesWithIds
                    });
                } catch (err) {
                    alert('❌ Erreur lors de l\'importation : fichier JSON invalide');
                    console.error(err);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handlePublish = async () => {
        try {
            await publishProgram(selectedProgram.key);
        } catch (err) {
            console.error('Erreur publication:', err);
            alert(`❌ ${err.message}`);
        }
    };

    const handleUnpublish = async () => {
        try {
            await unpublishProgram(selectedProgram.key);
            setShowPublishModal(false);
        } catch (err) {
            console.error('Erreur dépublication:', err);
            alert(`❌ ${err.message}`);
        }
    };

    const handleRegenerateToken = async () => {
        try {
            await regeneratePublishToken(selectedProgram.key);
        } catch (err) {
            console.error('Erreur régénération:', err);
            alert(`❌ ${err.message}`);
        }
    };

    const handleAISubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || loading) return;

        const result = await modifyProgram(inputValue, formData);

        if (result.success) {
            setFormData(result.program);
            setIsDirty(true);
            setInputValue('');
        } else {
            alert(`Erreur: ${result.error}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
            
            {/* --- HEADER FIXE (TOOLBAR) --- */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border-b border-slate-100 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            {selectedProgram.key}
                            {isDirty && (
                                <span className="flex h-3 w-3 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">Edition en cours</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Groupe Actions Fichier */}
                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <button onClick={handleImportJSON} className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all" title="Importer JSON">
                            <Upload size={18} />
                        </button>
                        <button onClick={handleExportJSON} className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-md transition-all" title="Exporter JSON">
                            <Download size={18} />
                        </button>
                        <button onClick={() => setShowJsonPreview(!showJsonPreview)} className={`p-2 rounded-md transition-all ${showJsonPreview ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-white'}`} title="Voir JSON brut">
                            {showJsonPreview ? <Code size={18} /> : <FileJson size={18} />}
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 mx-1 hidden xl:block"></div>

                    {/* Groupe Actions Principales */}
                    <div className="flex items-center gap-2">
                        {isDirty && (
                            <button 
                                onClick={handleReset} 
                                disabled={saving}
                                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-sm font-medium transition-colors"
                            >
                                <RotateCcw size={16} />
                                <span className="hidden sm:inline">Annuler</span>
                            </button>
                        )}
                        
                        <button
                            onClick={() => setShowPublishModal(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                                ${selectedProgram?.published 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" 
                                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                                }
                            `}
                        >
                            {selectedProgram?.published ? <CheckCircle size={16} /> : <Share2 size={16} />}
                            {selectedProgram?.published ? 'Publié' : 'Publier'}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white shadow-sm transition-all active:scale-95
                                ${saving 
                                    ? "bg-slate-400 cursor-not-allowed" 
                                    : isDirty 
                                        ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200" 
                                        : "bg-slate-800 hover:bg-slate-900"
                                }
                            `}
                        >
                            <Save size={18} />
                            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                        </button>
                    </div>

                    <div className="w-px h-8 bg-slate-200 mx-1 hidden xl:block"></div>

                    <button
                        onClick={handleDelete}
                        disabled={saving}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer le programme"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* --- CONTENU DÉFILANT --- */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50">
                <div className="max-w-5xl mx-auto space-y-6">
                    
                    <ErrorMessage message={error} />
                    <SuccessMessage message={saveMessage} />

                    {showJsonPreview ? (
                        <div className="bg-slate-900 rounded-xl p-4 shadow-inner border border-slate-700">
                            <pre className="text-xs md:text-sm text-emerald-400 font-mono overflow-auto max-h-[60vh]">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            
                            {/* SECTION 1: INFOS GÉNÉRALES */}
                            <section>
                                <ProgramKeySelector
                                    year={selectedYear}
                                    filiere={selectedFiliere}
                                    onChange={handleKeyChange}
                                    generatedKey={formData.key}
                                />

                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                                        Informations Publiques
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nom du programme <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.label}
                                                onChange={(e) => handleFieldChange('label', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all text-sm"
                                                placeholder="ex: Année 1 - Développeur des métiers du numérique"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Description courte
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => handleFieldChange('description', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-nws-purple focus:ring-4 focus:ring-nws-purple/10 outline-none transition-all text-sm min-h-[100px] resize-y"
                                                placeholder="Objectifs pédagogiques globaux..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* SECTION 2: MODULES */}
                            <section className="relative">
                                <div className="flex items-center justify-between mb-4 sticky top-0 z-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-bold text-slate-800">
                                            Modules du programme
                                        </h4>
                                        <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                            {formData.modules.length}
                                        </span>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={addModule}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                                    >
                                        <Plus size={18} />
                                        Ajouter un module
                                    </button>
                                </div>

                                {formData.modules.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 bg-slate-50/50">
                                        <Layers size={48} className="mb-2 opacity-50" />
                                        <p className="font-medium">Ce programme est vide.</p>
                                        <button type="button" onClick={addModule} className="mt-2 text-emerald-600 hover:underline">
                                            Ajouter le premier module
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 pb-20">
                                        {formData.modules.map((module, index) => (
                                            <ModuleCard
                                                key={module._uniqueId}
                                                module={module}
                                                index={index}
                                                totalModules={formData.modules.length}
                                                onChange={handleModuleChange}
                                                onRemove={removeModule}
                                                onDuplicate={duplicateModule}
                                                onDragStart={handleDragStart}
                                                onDragOver={handleDragOver}
                                                onDragEnd={handleDragEnd}
                                                isDragging={draggedIndex === index}
                                            />
                                        ))}
                                        <div ref={modulesEndRef} />
                                    </div>
                                )}
                            </section>
                        </form>
                    )}
                </div>
            </div>

            {/* --- AI INPUT BAR (FIXED BOTTOM) --- */}
            <div className="p-4 bg-white border-t border-slate-200 z-20">
                <div className="max-w-5xl mx-auto">
                    <InputBar
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleAISubmit}
                        disabled={loading}
                        shouldShowModules={false}
                        placeholder={loading
                            ? "L'IA travaille sur votre programme..."
                            : "✨ Demandez à l'IA de modifier le programme (ex: 'Ajoute un livrable SQL au module BDD')"
                        }
                    />
                </div>
            </div>

            {/* --- MODALS --- */}
            {showPublishModal && selectedProgram && (
                <PublishModal
                    program={selectedProgram}
                    onClose={() => setShowPublishModal(false)}
                    onPublish={handlePublish}
                    onUnpublish={handleUnpublish}
                    onRegenerateToken={handleRegenerateToken}
                />
            )}
        </div>
    );
}

export default ProgramEditor;