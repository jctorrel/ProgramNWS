// src/components/public/Syllabus.jsx
import { useState } from 'react';
import {
    Code2,
    Database,
    Palette,
    Globe,
    Layout,
    Server,
    Smartphone,
    ShieldCheck,
    Terminal,
    CheckCircle2,
    Box,
    Calendar,
    BookOpen,
    Layers
} from 'lucide-react';

// ============================================
// CONFIGURATION & CONSTANTES
// ============================================

const COLORS = ['#ffc72c', '#00c7b1', '#ff4b4b', '#6c3df4'];
const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// Mapping des icônes selon le titre du module
const getModuleIcon = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes('wordpress') || lower.includes('cms')) return Globe;
    if (lower.includes('react') || lower.includes('vue') || lower.includes('front')) return Code2;
    if (lower.includes('node') || lower.includes('backend')) return Server;
    if (lower.includes('database') || lower.includes('sql')) return Database;
    if (lower.includes('design') || lower.includes('ui')) return Palette;
    if (lower.includes('seo') || lower.includes('marketing')) return Layout;
    if (lower.includes('git') || lower.includes('terminal')) return Terminal;
    if (lower.includes('mobile')) return Smartphone;
    if (lower.includes('security')) return ShieldCheck;
    return BookOpen;
};

// ============================================
// HELPERS
// ============================================

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const formatPeriod = (startMonth, endMonth) => {
    return `${MONTH_NAMES[startMonth - 1]} - ${MONTH_NAMES[endMonth - 1]}`;
};

const getDeliverablePosition = (date) => {
    const delivDate = new Date(date);
    const month = delivDate.getMonth() + 1;
    // Année scolaire : Sept(9) -> Juin(6)
    return month >= 9 ? ((month - 9) / 10) * 100 : ((month + 3) / 10) * 100;
};

const getTimelineMonths = () => {
    const months = [];
    for (let i = 9; i <= 12; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    for (let i = 1; i <= 8; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    return months;
};

const getLastActiveMonth = (modules) => {
    if (!modules || modules.length === 0) return 7;
    let maxPosition = 0;
    modules.forEach(module => {
        const endMonth = module.end_month;
        const position = endMonth >= 9 ? endMonth - 8 : endMonth + 4;
        maxPosition = Math.max(maxPosition, position);
    });
    return maxPosition;
};

// ============================================
// SOUS-COMPOSANTS
// ============================================

const Header = ({ program }) => (
    <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 text-nws-purple rounded-2xl mb-4 shadow-sm border border-indigo-100">
            <BookOpen size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {program.label}
        </h1>
        <div className="inline-block px-4 py-1.5 bg-nws-purple text-white rounded-full font-mono font-bold text-sm shadow-md shadow-purple-200 mb-6">
            {program.key}
        </div>
        {program.description && (
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                {program.description}
            </p>
        )}
    </div>
);

const Stats = ({ totalModules, totalDeliverables }) => (
    <div className="flex flex-wrap justify-center gap-8 md:gap-16 pb-12 mb-12 border-b border-slate-200">
        {[
            { value: totalModules, label: 'Modules', icon: Layers },
            { value: totalDeliverables, label: 'Livrables', icon: Box },
            { value: 10, label: 'Mois', icon: Calendar }
        ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center group">
                <div className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-nws-purple transition-colors">
                    {stat.value}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <stat.icon size={14} />
                    {stat.label}
                </div>
            </div>
        ))}
    </div>
);

const TimelineMonths = ({ months, lastActiveMonth }) => (
    <div className="flex justify-between mb-4 px-2">
        <div className="absolute top-5 left-0 w-full h-2 bg-slate-100 rounded-full" />
        {months.map((month, idx) => {
            const isActive = idx < lastActiveMonth;
            return (
                <div key={idx} className="flex flex-col items-center flex-1 relative group">
                    <span className={`text-sm font-bold mb-3 transition-colors duration-300 ${isActive ? 'text-nws-purple' : 'text-slate-300'}`}>
                        {month.name}
                    </span>
                    {/* Tick mark */}
                    <div className={`w-0.5 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-nws-purple' : 'bg-slate-200'}`} />
                </div>
            );
        })}
    </div>
);

const ModuleProgressBars = ({ modules, hoveredModule, setHoveredModule }) => {
    if (!modules?.length) return null;

    return (
        <div className="relative h-24 mb-8 select-none">
            {/* Background Track */}


            {modules.map((module, index) => {
                const color = COLORS[index % COLORS.length];
                const isHovered = hoveredModule === module.id;

                const startPos = module.start_month >= 9 ? module.start_month - 8 : module.start_month + 4;
                const endPos = module.end_month >= 9 ? module.end_month - 8 : module.end_month + 4;

                const left = ((startPos - 1) / 10) * 100;
                const width = ((endPos - startPos + 1) / 10) * 100;

                return (
                    <div
                        key={module.id || index}
                        className={`absolute rounded-lg transition-all duration-300 cursor-pointer shadow-sm
                            ${isHovered ? 'h-2.5 shadow-lg z-20' : 'h-1.5 z-10 hover:opacity-90'}
                        `}
                        style={{
                            top: `${index * 10}px`,
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: color,
                            transform: isHovered ? 'scaleY(1.1)' : 'scaleY(1)',
                        }}
                        onMouseEnter={() => setHoveredModule(module.id)}
                        onMouseLeave={() => setHoveredModule(null)}
                    >
                        {/* Tooltip on Hover */}
                        {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 z-50">
                                {module.label}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const DeliverableMarker = ({ deliv, isHovered, onHover, onLeave }) => {
    // Logique pour éviter que l'infobulle ne sorte de l'écran (Scrollbar horizontale)
    let tooltipPositionClass = "-translate-x-1/2 left-1/2"; // Défaut : centré
    let tooltipArrowClass = "left-1/2 -translate-x-1/2";

    if (deliv.position < 10) {
        tooltipPositionClass = "left-0 translate-x-0"; // Aligné gauche
        tooltipArrowClass = "left-4";
    } else if (deliv.position > 90) {
        tooltipPositionClass = "right-0 translate-x-0 left-auto"; // Aligné droite
        tooltipArrowClass = "right-4 left-auto";
    }

    return (
        <div
            className="absolute top-0 group z-30" // Retrait du top-1/2 pour un contrôle précis
            style={{ left: `${deliv.position}%` }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Ligne de connexion (Ajustée pour remonter vers la barre) */}
            <div
                className={`absolute bottom-full left-1/2 -translate-x-1/2 w-0.5 bg-current transition-all duration-300 origin-bottom
                    ${isHovered ? 'h-8 opacity-100' : 'h-4 opacity-40 group-hover:h-6'}
                `}
                style={{ color: deliv.color, marginBottom: '2px' }}
            />

            {/* Point (Dot) */}
            <div
                className={`relative w-3.5 h-3.5 -mt-2 rounded-full border-[3px] border-white shadow-md transition-all duration-300 cursor-pointer
                    ${isHovered ? 'scale-150 ring-2 ring-offset-2 ring-indigo-100' : 'scale-100 group-hover:scale-110'}
                `}
                style={{ backgroundColor: deliv.color }}
            >
                {/* Tooltip Livrable */}
                {isHovered && (
                    <div
                        className={`absolute bottom-[200%] ${tooltipPositionClass} w-64 p-4 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-100 z-[100] animate-in slide-in-from-bottom-2 duration-200`}
                    >
                        <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: deliv.color }}>
                            {deliv.moduleLabel}
                        </div>
                        <div className="text-sm font-bold text-slate-800 leading-tight mb-1">
                            {deliv.descriptif}
                        </div>
                        <div className="text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2 py-0.5 rounded mt-1">
                            {formatDate(deliv.date)}
                        </div>

                        {/* Flèche du tooltip */}
                        <div className={`absolute -bottom-1.5 w-3 h-3 bg-white border-b border-r border-slate-100 transform rotate-45 ${tooltipArrowClass}`} />
                    </div>
                )}
            </div>
        </div>
    );
};

const Timeline = ({ deliverables, modules, hoveredDeliverable, hoveredModule, setHoveredDeliverable, setHoveredModule }) => {
    const months = getTimelineMonths();
    const lastActiveMonth = getLastActiveMonth(modules);

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl shadow-slate-200/50 mb-16 overflow-hidden">
            {/* Titre décoratif */}
            <div className="text-center mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chronologie du programme</h3>
            </div>

            <div className="overflow-x-auto overflow-y-hidden pb-2 px-2">
                <div className="min-w-[800px] relative">
                    <TimelineMonths months={months} lastActiveMonth={lastActiveMonth} />

                    {/* Zone des marqueurs */}
                    <div className="relative h-2">
                        {deliverables.map((deliv, idx) => (
                            <DeliverableMarker
                                key={idx}
                                deliv={deliv}
                                isHovered={hoveredDeliverable === idx}
                                onHover={() => {
                                    setHoveredDeliverable(idx);
                                    setHoveredModule(deliv.moduleId);
                                }}
                                onLeave={() => {
                                    setHoveredDeliverable(null);
                                    setHoveredModule(null);
                                }}
                            />
                        ))}
                    </div>

                    <ModuleProgressBars
                        modules={modules}
                        hoveredModule={hoveredModule}
                        setHoveredModule={setHoveredModule}
                    />
                </div>
            </div>
        </div>
    );
};

const ModuleCard = ({ module, index, color, isHovered, onHover, onLeave }) => {
    const Icon = getModuleIcon(module.label);

    return (
        <div
            className={`bg-white rounded-2xl p-6 md:p-8 border border-slate-100 transition-all duration-300 group
                ${isHovered ? 'shadow-2xl -translate-y-2 ring-1 ring-slate-200' : 'shadow-sm hover:shadow-lg hover:-translate-y-1'}
            `}
            style={{ borderTop: `4px solid ${color}` }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* En-tête Card */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: color }}
                >
                    {index + 1}
                </div>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color }}>
                        {formatPeriod(module.start_month, module.end_month)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Icon className="w-5 h-5 opacity-70" />
                        {module.label}
                    </h3>
                </div>
            </div>

            {/* Contenu */}
            {module.content && module.content.length > 0 && (
                <div className="space-y-2 mb-8">
                    {module.content.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-slate-600 text-sm leading-relaxed">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Livrables Section */}
            {module.deliverables && module.deliverables.length > 0 && (
                <div className="mt-auto pt-6 border-t border-slate-50">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Box size={14} /> Livrables attendus
                    </h4>
                    <div className="space-y-3">
                        {module.deliverables.map((deliv, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 group-hover:bg-slate-50/80 transition-colors">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-700">{deliv.descriptif}</span>
                                </div>
                                {deliv.date && (
                                    <span className="text-xs font-bold px-2 py-1 rounded bg-white text-slate-500 border border-slate-100 whitespace-nowrap ml-2">
                                        {formatDate(deliv.date)}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function Syllabus({ program }) {
    const [hoveredModule, setHoveredModule] = useState(null);
    const [hoveredDeliverable, setHoveredDeliverable] = useState(null);

    if (!program) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <BookOpen size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Aucun programme</h2>
                <p className="text-slate-500">Sélectionnez un programme pour visualiser son syllabus.</p>
            </div>
        );
    }

    // Préparation des données (Livrables à plat pour la timeline)
    const allDeliverables = [];
    program.modules?.forEach((module, index) => {
        const color = COLORS[index % COLORS.length];
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

    const totalModules = program.modules?.length || 0;
    const totalDeliverables = program.modules?.reduce((sum, mod) => sum + (mod.deliverables?.length || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <div className="max-w-[1600px] mx-auto px-4 py-12 md:py-20">

                <Header program={program} />

                <Stats
                    totalModules={totalModules}
                    totalDeliverables={totalDeliverables}
                />

                <Timeline
                    deliverables={allDeliverables}
                    modules={program.modules}
                    hoveredDeliverable={hoveredDeliverable}
                    hoveredModule={hoveredModule}
                    setHoveredDeliverable={setHoveredDeliverable}
                    setHoveredModule={setHoveredModule}
                />

                {/* Grid Modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {program.modules?.map((module, index) => {
                        const color = COLORS[index % COLORS.length];
                        return (
                            <ModuleCard
                                key={module.id || index}
                                module={module}
                                index={index}
                                color={color}
                                isHovered={hoveredModule === module.id}
                                onHover={() => setHoveredModule(module.id)}
                                onLeave={() => setHoveredModule(null)}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    );
}

export default Syllabus;