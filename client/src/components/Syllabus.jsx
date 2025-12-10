// src/components/Syllabus.jsx
import { useState } from 'react';

function Syllabus({ program }) {
    const [hoveredModule, setHoveredModule] = useState(null);
    const [hoveredDeliverable, setHoveredDeliverable] = useState(null);

    if (!program) {
        return (
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="text-center py-16">
                    <h2 className="text-3xl text-slate-800 mb-4">Aucun programme sélectionné</h2>
                    <p className="text-lg text-slate-500">Sélectionnez un programme pour voir son syllabus</p>
                </div>
            </div>
        );
    }

    // Palette de couleurs pour les modules (NWS colors)
    const colors = [
        { bg: 'bg-nws-yellow', text: 'text-nws-yellow', hex: '#ffc72c' },
        { bg: 'bg-nws-teal', text: 'text-nws-teal', hex: '#00c7b1' },
        { bg: 'bg-nws-red', text: 'text-nws-red', hex: '#ff4b4b' },
        { bg: 'bg-nws-purple', text: 'text-nws-purple', hex: '#6c3df4' },
    ];
    
    // Noms des mois
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    // Calculer les positions des livrables sur la timeline
    const getDeliverablePosition = (date) => {
        const delivDate = new Date(date);
        const month = delivDate.getMonth() + 1;
        
        let position;
        if (month >= 9) {
            position = ((month - 9) / 10) * 100;
        } else {
            position = ((month + 3) / 10) * 100;
        }
        return position;
    };

    // Formater la période du module
    const formatModulePeriod = (startMonth, endMonth) => {
        return `${monthNames[startMonth - 1]} - ${monthNames[endMonth - 1]}`;
    };

    // Formater la date d'un livrable
    const formatDeliverableDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    // Trouver les mois min et max pour la timeline
    const getTimelineRange = () => {
        const months = [];
        for (let i = 9; i <= 12; i++) months.push({ num: i, name: monthNames[i - 1] });
        for (let i = 1; i <= 6; i++) months.push({ num: i, name: monthNames[i - 1] });
        return months;
    };

    const months = getTimelineRange();

    // Collecter tous les livrables avec leurs infos
    const allDeliverables = [];
    program.modules?.forEach((module, index) => {
        const color = colors[index % colors.length];
        module.deliverables?.forEach(deliv => {
            if (deliv.date) {
                allDeliverables.push({
                    ...deliv,
                    color,
                    moduleId: module.id,
                    moduleLabel: module.label,
                    position: getDeliverablePosition(deliv.date)
                });
            }
        });
    });

    // Trouver l'icône pour un module
    const getModuleIcon = (label) => {
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('wordpress') || lowerLabel.includes('cms')) return '🌐';
        if (lowerLabel.includes('react') || lowerLabel.includes('vue') || lowerLabel.includes('angular')) return '⚛️';
        if (lowerLabel.includes('node') || lowerLabel.includes('backend') || lowerLabel.includes('api')) return '🔧';
        if (lowerLabel.includes('database') || lowerLabel.includes('sql') || lowerLabel.includes('mongo')) return '🗄️';
        if (lowerLabel.includes('design') || lowerLabel.includes('ui') || lowerLabel.includes('ux')) return '🎨';
        if (lowerLabel.includes('seo') || lowerLabel.includes('marketing')) return '📈';
        if (lowerLabel.includes('git') || lowerLabel.includes('github')) return '🔀';
        if (lowerLabel.includes('test')) return '🧪';
        if (lowerLabel.includes('security') || lowerLabel.includes('sécurité')) return '🔒';
        if (lowerLabel.includes('deploy') || lowerLabel.includes('devops')) return '🚀';
        if (lowerLabel.includes('mobile') || lowerLabel.includes('app')) return '📱';
        if (lowerLabel.includes('data') || lowerLabel.includes('analytics')) return '📊';
        return '📘';
    };

    // Stats
    const totalModules = program.modules?.length || 0;
    const totalDeliverables = program.modules?.reduce((sum, mod) => 
        sum + (mod.deliverables?.length || 0), 0) || 0;

    return (
        <div className="max-w-7xl mx-auto px-8 py-12">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-slate-800 mb-4">
                    📚 {program.label}
                </h1>
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-nws-purple to-nws-purple/80 
                              text-white rounded-full text-sm font-semibold mb-6">
                    {program.key}
                </div>
                {program.description && (
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
                        {program.description}
                    </p>
                )}
            </div>

            {/* Timeline Container */}
            <div className="mb-16">
                {/* Timeline avec mois et marqueurs */}
                <div className="mb-16 relative">
                    {/* Mois */}
                    <div className="flex justify-between mb-8 pb-4 relative">
                        {months.map((month, idx) => (
                            <div 
                                key={idx} 
                                className={`flex-1 text-center text-sm font-semibold relative
                                          ${idx < 7 ? 'text-nws-purple' : 'text-slate-300'}`}
                            >
                                {month.name}
                            </div>
                        ))}
                    </div>

                    {/* Track */}
                    <div className="relative h-16 mb-12">
                        {/* Progress bar */}
                        <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-100 rounded-full 
                                      transform -translate-y-1/2 overflow-hidden">
                            <div className="h-full w-[70%] bg-gradient-to-r from-nws-yellow via-nws-teal to-nws-red 
                                          rounded-full animate-in slide-in-from-left duration-1000"></div>
                        </div>

                        {/* Marqueurs de livrables */}
                        {allDeliverables.map((deliv, idx) => {
                            const isHovered = hoveredDeliverable === idx;
                            const isModuleHovered = hoveredModule === deliv.moduleId;
                            
                            return (
                                <div 
                                    key={idx}
                                    className="absolute top-1/2 transform -translate-x-1/2"
                                    style={{ left: `${deliv.position}%` }}
                                    onMouseEnter={() => {
                                        setHoveredDeliverable(idx);
                                        setHoveredModule(deliv.moduleId);
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredDeliverable(null);
                                        setHoveredModule(null);
                                    }}
                                >
                                    {/* Marqueur */}
                                    <div 
                                        className={`w-[18px] h-[18px] ${deliv.color.bg} rounded-full border-3 border-white 
                                                  shadow-md cursor-pointer transition-all duration-200 z-10
                                                  ${isHovered ? 'scale-[1.3] z-[100]' : 'scale-100 z-10'}`}
                                        style={{
                                            boxShadow: isHovered 
                                                ? `0 4px 12px ${deliv.color.hex}80` 
                                                : '0 2px 8px rgba(0,0,0,0.15)'
                                        }}
                                    >
                                        {/* Ligne de connexion */}
                                        <div 
                                            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 
                                                      w-0.5 h-10 ${deliv.color.bg} transition-opacity duration-200
                                                      ${isHovered ? 'opacity-40' : 'opacity-20'}`}
                                        ></div>
                                        
                                        {/* Tooltip au hover */}
                                        {isHovered && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 
                                                          mb-[50px] bg-white p-3 rounded-lg shadow-soft
                                                          min-w-[200px] pointer-events-none z-[1000]
                                                          animate-in fade-in slide-in-from-bottom-2 duration-200">
                                                <div className="text-xs font-bold text-nws-purple uppercase tracking-wide mb-1">
                                                    {deliv.moduleLabel}
                                                </div>
                                                <div className="text-sm font-semibold text-slate-800 mb-1">
                                                    {deliv.descriptif}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    {formatDeliverableDate(deliv.date)}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modules Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                     style={{ perspective: '1000px' }}>
                    {program.modules?.map((module, index) => {
                        const color = colors[index % colors.length];
                        const isHovered = hoveredModule === module.id;
                        
                        return (
                            <div 
                                key={module.id}
                                className={`bg-white rounded-xl p-8 border-t-4 ${color.bg}
                                          transition-all duration-300 shadow-md hover:shadow-soft
                                          ${isHovered 
                                            ? 'transform -translate-y-2' 
                                            : 'transform rotate-y-[-3deg]'}`}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    boxShadow: isHovered 
                                        ? `0 12px 40px ${color.hex}40` 
                                        : '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                                onMouseEnter={() => setHoveredModule(module.id)}
                                onMouseLeave={() => setHoveredModule(null)}
                            >
                                {/* Badge numéro + période */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-9 h-9 ${color.bg} rounded-full flex items-center 
                                                   justify-center text-white font-bold text-lg flex-shrink-0`}>
                                        {index + 1}
                                    </div>
                                    <div className={`text-sm font-bold ${color.text} uppercase tracking-wide`}>
                                        {formatModulePeriod(module.start_month, module.end_month)}
                                    </div>
                                </div>

                                {/* Titre */}
                                <div className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="text-2xl">{getModuleIcon(module.label)}</span>
                                    <span>{module.label}</span>
                                </div>

                                {/* Contenu */}
                                {module.content && module.content.length > 0 && (
                                    <div className="text-slate-600 leading-relaxed mb-6">
                                        {module.content.map((item, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <span className="text-slate-300 font-bold">•</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Livrables */}
                                {module.deliverables && module.deliverables.length > 0 && (
                                    <div className="mt-6 pt-6 border-t-2 border-slate-100">
                                        <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">
                                            📦 Livrables
                                        </div>
                                        {module.deliverables.map((deliv, i) => (
                                            <div key={i} 
                                                 className="flex items-center justify-between mb-3 p-2 
                                                          bg-slate-50 rounded-lg transition-colors hover:bg-slate-100">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="text-green-500 font-bold">✓</span>
                                                    <span className="text-sm text-slate-600 font-medium">
                                                        {deliv.descriptif}
                                                    </span>
                                                </div>
                                                {deliv.date && (
                                                    <div className={`text-xs font-bold ${color.text} whitespace-nowrap ml-2`}>
                                                        {formatDeliverableDate(deliv.date)}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="flex justify-center gap-16 p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
                <div className="text-center">
                    <div className="text-4xl font-bold text-nws-purple mb-2">{totalModules}</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                        Modules
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-nws-purple mb-2">{totalDeliverables}</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                        Livrables
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-4xl font-bold text-nws-purple mb-2">10</div>
                    <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold">
                        Mois
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Syllabus;