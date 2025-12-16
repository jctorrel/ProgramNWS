// src/components/public/Syllabus.jsx
import { createPortal } from 'react-dom';
import { useState, useRef } from 'react';
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

import TimelineMonths from './TimelineMonths.jsx';
import DeliverableMarker from './DeliverableMarker.jsx';

// ============================================
// CONFIGURATION & CONSTANTES
// ============================================

const COLORS = [
    '#ff4b4b', // Rouge vif
    '#ff9f43', // Orange
    '#ffc72c', // Jaune Moutarde
    '#28c76f', // Vert Émeraude
    '#0abde3', // Cyan
    '#3e82f7', // Bleu Royal
    '#5352ed', // Indigo
    '#a55eea', // Violet clair
    '#f368e0', // Rose Bonbon
    '#ff6b6b', // Saumon
    '#5f27cd', // Violet Profond
    '#10ac84', // Vert Sapin
    '#00d2d3', // Bleu Lagon
    '#54a0ff', // Bleu Ciel
    '#e1b12c', // Doré
    '#b33771', // Magenta foncé
    '#eb3b5a', // Rouge Rubis
    '#8854d0'  // Pourpre
];
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

export const getDaysFromSept1 = (dateInput) => {
    // 1. On sécurise l'objet Date
    const targetDate = new Date(dateInput);

    // 2. On reset les heures à minuit pour éviter les bugs de fuseau horaire/heures d'été
    // Cela permet de compter des jours "calendaires" pleins
    targetDate.setHours(12, 0, 0, 0); // On se met à midi pour éviter les décalages DST

    // 3. Déterminer l'année du "1er Septembre" de référence
    let startYear = targetDate.getFullYear();

    // Si on est entre Janvier (0) et Août (7), la rentrée était l'année d'avant
    if (targetDate.getMonth() < 8) { // 8 = Septembre
        startYear -= 1;
    }

    const startDate = new Date(startYear, 8, 1); // 1er Septembre (Mois 8)
    startDate.setHours(12, 0, 0, 0);

    // 4. Calcul de la différence
    const diffTime = targetDate - startDate;

    // 5. Conversion millisecondes -> jours
    // Math.round est important pour gérer les micro-décalages
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

const getPosition = (date) => {
    return (getDaysFromSept1(date) / 366) * 100;
};

const getTimelineMonths = () => {
    const months = [];
    for (let i = 9; i <= 12; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    for (let i = 1; i <= 8; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    return months;
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

const ModuleProgressBars = ({ modules, hoveredModule, setHoveredModule }) => {
    if (!modules?.length) return null;

    return (
        <div className="relative h-24 mb-14 mt-4 select-none">
            {modules.map((module, index) => {
                const color = COLORS[index % COLORS.length];
                const isHovered = hoveredModule === module.id;

                const startPos = module.start_month >= 9 ? module.start_month - 8 : module.start_month + 4;
                const endPos = module.end_month >= 9 ? module.end_month - 8 : module.end_month + 4;

                const left = (startPos - 1) * 100 / 12;
                const width = (endPos) * 100 / 12 - left;

                return (
                    <div
                        key={module.id || index}
                        className={`absolute rounded-lg transition-all duration-300 cursor-pointer shadow-sm
                            ${isHovered ? 'h-2 shadow-lg z-20' : 'h-1.5 z-10 hover:opacity-90'}
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
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800 rotate-180" />
                            {module.label}
                        </div>
                    )}
                    </div>
                );
            })}
        </div>
    );
};

const Timeline = ({ deliverables, modules, hoveredDeliverable, hoveredModule, setHoveredDeliverable, setHoveredModule }) => {
    const months = getTimelineMonths();

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 px-8 py-2 shadow-xl shadow-slate-200/50 mb-6 overflow-hidden">
            {/* Titre décoratif */}
            <div className="text-center mb-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Chronologie du programme</h3>
            </div>

            <div className="overflow-x-auto overflow-y-hidden pb-2 px-2">
                <div className="min-w-[800px] relative">
                    <TimelineMonths months={months} />

                    {/* Zone des marqueurs */}
                    <div className="relative h-5">
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
                    position: getPosition(deliv.date)
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