// src/components/public/Syllabus.jsx

import { useState } from 'react';

// ============================================
// CONFIGURATION
// ============================================

const COLORS_HEX = ['#ffc72c', '#00c7b1', '#ff4b4b', '#6c3df4'];
const MONTH_NAMES = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

// ============================================
// FONCTIONS UTILS
// ============================================

const getModuleIcon = (label) => {
    const lower = label.toLowerCase();
    if (lower.includes('wordpress') || lower.includes('cms')) return '🌐';
    if (lower.includes('react') || lower.includes('vue')) return '⚛️';
    if (lower.includes('node') || lower.includes('backend')) return '🔧';
    if (lower.includes('database') || lower.includes('sql')) return '🗄️';
    if (lower.includes('design') || lower.includes('ui')) return '🎨';
    if (lower.includes('seo') || lower.includes('marketing')) return '📈';
    if (lower.includes('git')) return '🔀';
    if (lower.includes('test')) return '🧪';
    if (lower.includes('security')) return '🔒';
    if (lower.includes('deploy')) return '🚀';
    if (lower.includes('mobile')) return '📱';
    return '📘';
};

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
    return month >= 9 ? ((month - 9) / 10) * 100 : ((month + 3) / 10) * 100;
};

const getTimelineMonths = () => {
    const months = [];
    for (let i = 9; i <= 12; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    for (let i = 1; i <= 8; i++) months.push({ num: i, name: MONTH_NAMES[i - 1] });
    return months;
};

const getLastActiveMonth = (modules) => {
    if (!modules || modules.length === 0) return 7; // Par défaut 70% (7 sur 10 mois)
    
    let maxPosition = 0;
    
    modules.forEach(module => {
        const endMonth = module.end_month;
        
        // Convertir le mois en position dans l'année scolaire
        // Sept=1, Oct=2, Nov=3, Déc=4, Jan=5, Fév=6, Mar=7, Avr=8, Mai=9, Juin=10
        const position = endMonth >= 9 
            ? endMonth - 8    // Sept(9)→1, Oct(10)→2, Nov(11)→3, Déc(12)→4
            : endMonth + 4;   // Jan(1)→5, Fév(2)→6, Mar(3)→7, Avr(4)→8, Mai(5)→9, Juin(6)→10
        
        maxPosition = Math.max(maxPosition, position);
    });
    
    return maxPosition;
};

// ============================================
// STYLES INLINE (pour les détails graphiques)
// ============================================

const inlineStyles = {
    container: {
        maxWidth: '1900px',
        margin: '0 auto',
        padding: '1rem 0.75rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        textAlign: 'center',
    },
    title: {
        fontSize: '3rem',
        fontWeight: 700,
        color: '#1e293b',
    },
    programKey: {
        display: 'inline-block',
        padding: '0.5rem 1.5rem',
        background: '#6c3df4',
        color: 'white',
        borderRadius: '2rem',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '1.5rem',
    },
    description: {
        fontSize: '1.2rem',
        color: '#64748b',
        maxWidth: '800px',
        margin: '0 auto',
        lineHeight: '1',
    },
};

// ============================================
// COMPOSANTS RÉUTILISABLES
// ============================================

const Header = ({ program }) => (
    <div style={inlineStyles.header}>
        <h1 style={inlineStyles.title}>📚 {program.label}</h1>
        <div style={inlineStyles.programKey}>{program.key}</div>
        {program.description && (
            <p style={inlineStyles.description}>{program.description}</p>
        )}
    </div>
);

const TimelineMonths = ({ months, modules }) => {
    const lastActiveMonth = getLastActiveMonth(modules);

    return (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
    }}>
        {months.map((month, idx) => (
            <div
                key={idx}
                className={`
                    flex-1 text-center text-sm font-semibold relative
                    ${idx < lastActiveMonth ? 'text-[#6c3df4]' : 'text-[#cbd5e1]'}
                    
                    after:content-[''] 
                    after:absolute 
                    after:-translate-x-1/2
                    after:w-1 
                    after:h-3 
                    after:left-1/2 
                    after:-bottom-5
                    ${idx < lastActiveMonth ? 'after:bg-[#6c3df4]' : 'after:bg-[#cbd5e1]'}
                `}
            >
                {month.name}
            </div>
        ))}
    </div>
)};

const ModuleProgressBars = ({ modules, hoveredModule, setHoveredModule }) => {
    if (!modules || modules.length === 0) return null;

    return (
        <div style={{
            position: 'relative',
            height: '80px',
            marginBottom: '2rem',
        }}>
            {/* Barre de fond grise */}
            <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '8px',
                background: '#e5e7eb',
                borderRadius: '4px',
            }} />
            
            {modules.map((module, index) => {
                const colors = ['#ffc72c', '#00c7b1', '#ff4b4b', '#6c3df4'];
                const color = colors[index % colors.length];
                const isHovered = hoveredModule === module.id;
                
                const startPos = module.start_month >= 9 
                    ? module.start_month - 8 
                    : module.start_month + 4;
                const endPos = module.end_month >= 9 
                    ? module.end_month - 8 
                    : module.end_month + 4;
                
                const left = ((startPos - 1) / 10) * 100;
                const width = ((endPos - startPos + 1) / 10) * 100;
                
                return (
                    <div
                        key={module.id || index}
                        style={{
                            position: 'absolute',
                            top: `${index * 16}px`,
                            left: `${left}%`,
                            width: `${width}%`,
                            height: isHovered ? '14px' : '10px', // 👈 Grossit au hover
                            background: color,
                            borderRadius: '4px',
                            boxShadow: isHovered 
                                ? `0 4px 15px ${color}80` // 👈 Ombre plus forte
                                : `0 2px 8px ${color}60`,
                            zIndex: isHovered ? 20 : 10, // 👈 Passe au premier plan
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            animation: `slideInBar 1s ease-out ${index * 0.15}s backwards`,
                        }}
                        onMouseEnter={() => setHoveredModule(module.id)} // 👈 Hover
                        onMouseLeave={() => setHoveredModule(null)}
                    >
                        {/* Tooltip au hover */}
                        {isHovered && (
                            <div style={{
                                position: 'absolute',
                                bottom: '120%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#1e293b',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                zIndex: 1000,
                                pointerEvents: 'none',
                                animation: 'fadeIn 0.2s ease',
                            }}>
                                📚 {module.label}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 0,
                                    height: 0,
                                    borderLeft: '6px solid transparent',
                                    borderRight: '6px solid transparent',
                                    borderTop: '6px solid #1e293b',
                                }} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const DeliverableTooltip = ({ deliv }) => (
    <div style={{
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: '50px',
        background: 'white',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        minWidth: '200px',
        pointerEvents: 'none',
        zIndex: 1000,
    }}>
        <div style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#6c3df4',
            marginBottom: '0.25rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
        }}>
            {deliv.moduleLabel}
        </div>
        <div style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: '#1e293b',
            marginBottom: '0.25rem',
        }}>
            {deliv.descriptif}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {formatDate(deliv.date)}
        </div>
    </div>
);

const DeliverableMarker = ({ deliv, isHovered, onHover, onLeave }) => (
    <div
        style={{
            position: 'absolute',
            top: '50%',
            left: `${deliv.position}%`,
        }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
    >
        <div
            style={{
                position: 'absolute',
                top: '50%',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: deliv.color,
                border: '3px solid white',
                transform: isHovered ? 'translateX(-50%) scale(1.3)' : 'translateX(-50%) scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: isHovered ? `0 4px 12px ${deliv.color}80` : '0 2px 8px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                zIndex: isHovered ? 100 : 10,
            }}
        >
            {/* Ligne de connexion */}
            <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '2px',
                height: '40px',
                background: deliv.color,
                opacity: isHovered ? 0.4 : 0.2,
                transition: 'opacity 0.2s ease',
            }} />

            {isHovered && <DeliverableTooltip deliv={deliv} />}
        </div>
    </div>
);

const Timeline = ({ deliverables, modules, hoveredDeliverable, hoveredModule, setHoveredDeliverable, setHoveredModule }) => {
    const months = getTimelineMonths();

    return (
        <div style={{
            position: 'relative',
            padding: '2rem 0',
            overflowX: 'auto',
            overflowY: 'visible',
        }}>
            <TimelineMonths months={months} />

            <ModuleProgressBars 
                modules={modules}
                hoveredModule={hoveredModule}
                setHoveredModule={setHoveredModule}
            />
            
            {/* Marqueurs de livrables */}
            <div style={{ position: 'relative', marginTop: '1rem' }}>
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
        </div>
    );
};

const ModuleHeader = ({ index, color, period }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '20%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: '1.1rem',
            flexShrink: 0,
        }}>
            {index + 1}
        </div>
        <div style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: color,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
        }}>
            {period}
        </div>
    </div>
);

const ModuleTitle = ({ label }) => (
    <div style={{
        fontSize: '1.3rem',
        fontWeight: 700,
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
    }}>
        <span style={{ fontSize: '1.5rem' }}>{getModuleIcon(label)}</span>
        <span>{label}</span>
    </div>
);

const ModuleContent = ({ content }) => {
    if (!content || content.length === 0) return null;

    return (
        <div style={{
            fontSize: '0.95rem',
            color: '#475569',
            lineHeight: '1.6',
        }}>
            {content.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#cbd5e1', fontWeight: 700 }}>•</span>
                    <span>{item}</span>
                </div>
            ))}
        </div>
    );
};

const DeliverableItem = ({ deliv, color }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.75rem',
        padding: '0.5rem',
        background: '#f8fafc',
        borderRadius: '0.5rem',
        transition: 'background 0.2s ease',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1rem' }}>✓</span>
            <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                {deliv.descriptif}
            </span>
        </div>
        {deliv.date && (
            <div style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: color,
                whiteSpace: 'nowrap',
                marginLeft: '0.5rem',
            }}>
                {formatDate(deliv.date)}
            </div>
        )}
    </div>
);

const ModuleDeliverables = ({ deliverables, color }) => {
    if (!deliverables || deliverables.length === 0) return null;

    return (
        <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: '2px solid #f1f5f9',
        }}>
            <div style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#64748b',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
            }}>
                📦 Livrables
            </div>
            {deliverables.map((deliv, i) => (
                <DeliverableItem key={i} deliv={deliv} color={color} />
            ))}
        </div>
    );
};

const ModuleCard = ({ module, index, color, isHovered, onHover, onLeave }) => (
    <div
        style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '2rem',
            borderTop: `4px solid ${color}`,
            transition: 'all 0.3s ease',
            transformStyle: 'preserve-3d',
            transform: isHovered ? 'rotateY(0deg) translateY(-8px)' : 'rotateY(-3deg)',
            boxShadow: isHovered
                ? `0 12px 40px ${color}40`
                : '0 4px 20px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
    >
        <ModuleHeader
            index={index}
            color={color}
            period={formatPeriod(module.start_month, module.end_month)}
        />
        <ModuleTitle label={module.label} />
        <ModuleContent content={module.content} />
        <ModuleDeliverables deliverables={module.deliverables} color={color} />
    </div>
);

const Stats = ({ totalModules, totalDeliverables }) => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '4rem',
        paddingBottom: '4rem',
        margin: '2rem 10rem 5rem 10rem',
        borderBottom: '#f1f5f9 solid 3px'
    }}>
        {[
            { value: totalModules, label: 'Modules' },
            { value: totalDeliverables, label: 'Livrables' },
            { value: 10, label: 'Mois' }
        ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    color: '#6c3df4',
                }}>
                    {stat.value}
                </div>
                <div style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                }}>
                    {stat.label}
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = () => (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#1e293b', marginBottom: '1rem' }}>
            Aucun programme sélectionné
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#64748b' }}>
            Sélectionnez un programme pour voir son syllabus
        </p>
    </div>
);

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

function Syllabus({ program }) {
    const [hoveredModule, setHoveredModule] = useState(null);
    const [hoveredDeliverable, setHoveredDeliverable] = useState(null);

    if (!program) {
        return (
            <div style={inlineStyles.container}>
                <EmptyState />
            </div>
        );
    }

    // Collecter tous les livrables avec leurs infos
    const allDeliverables = [];
    program.modules?.forEach((module, index) => {
        const color = COLORS_HEX[index % COLORS_HEX.length];
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

    // Stats
    const totalModules = program.modules?.length || 0;
    const totalDeliverables = program.modules?.reduce((sum, mod) =>
        sum + (mod.deliverables?.length || 0), 0) || 0;

    return (
        <div style={inlineStyles.container}>
            <Header program={program} />
            <Stats
                totalModules={totalModules}
                totalDeliverables={totalDeliverables}
            />

            <div style={{ margin: '1rem', background: '#fafafa', border: '#e5e7eb solid 1px', padding: '2rem', borderRadius: '5rem' }}>
                <Timeline
                    deliverables={allDeliverables}
                    hoveredDeliverable={hoveredDeliverable}
                    setHoveredDeliverable={setHoveredDeliverable}
                    setHoveredModule={setHoveredModule}
                    modules={program.modules}
                />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2rem',
                    perspective: '1000px',
                }}>
                    {program.modules?.map((module, index) => {
                        const color = COLORS_HEX[index % COLORS_HEX.length];
                        return (
                            <ModuleCard
                                key={module.id}
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

// Ajout de l'animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes progressFill {
        from { width: 0%; }
        to { width: var(--progress-width); }
    }
    
    @keyframes slideInBar {
        from {
            width: 0%;
            opacity: 0;
        }
        to {
            width: 100%;
            opacity: 1;
        }
    }
`;
if (!document.head.querySelector('style[data-syllabus]')) {
    styleSheet.setAttribute('data-syllabus', 'true');
    document.head.appendChild(styleSheet);
}

export default Syllabus;