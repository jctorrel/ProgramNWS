// src/components/DeliverableMarker.jsx

import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// Fonction utilitaire simple pour formater la date
const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

const DeliverableMarker = ({ deliv, isHovered, onHover, onLeave }) => {
    const markerRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    // Calcul de la position
    const updatePosition = () => {
        if (markerRef.current) {
            const rect = markerRef.current.getBoundingClientRect();
            setTooltipPos({
                x: rect.left + rect.width / 2,
                y: rect.top - 40
            });
        }
    };

    const handleInteractionStart = () => {
        updatePosition();
        onHover();
    };

    return (
        <>
            <div
                ref={markerRef}
                className="absolute top-1 z-20 -translate-x-1/2 group outline-none"
                style={{ left: `${deliv.position}%` }}
                onMouseEnter={handleInteractionStart}
                onMouseLeave={onLeave}
                onFocus={handleInteractionStart} // Support Clavier
                onBlur={onLeave} // Support Clavier
                role="button"
                aria-label={`Livrable : ${deliv.moduleLabel}`}
            >
                <div className="absolute inset-0 -m-4 rounded-full bg-transparent cursor-pointer z-10" />
                <div 
                    className={`
                        absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] 
                        origin-bottom transition-all duration-300 ease-out
                        ${isHovered ? 'h-8 opacity-100' : 'h-4 opacity-50 group-hover:h-6 group-hover:opacity-75'}
                    `}
                    style={{ backgroundColor: deliv.color }}
                />

                {/* 3. VISUEL : POINT (CERCLE) */}
                <div className="relative z-20">
                    {/* Halo d'effet au survol */}
                    <div 
                        className={`
                            absolute inset-0 rounded-full opacity-20 transition-transform duration-500
                            ${isHovered ? 'scale-[3]' : 'scale-0'}
                        `}
                        style={{ backgroundColor: deliv.color }}
                    />
                    
                    {/* Le point blanc central */}
                    <div
                        className={`
                            w-3 h-3 rounded-full bg-white border-[3px] shadow-sm transition-all duration-300
                            ${isHovered ? 'scale-125 shadow-md' : 'group-hover:scale-110'}
                        `}
                        style={{ 
                            borderColor: deliv.color,
                            boxShadow: isHovered ? `0 0 0 2px rgba(255,255,255,1), 0 0 10px ${deliv.color}` : 'none'
                        }}
                    />
                </div>
            </div>

            {/* --- PORTAL DE L'INFOBULLE --- */}
            {isHovered && createPortal(
                <div 
                    className="fixed z-[9999] pointer-events-none flex flex-col items-center"
                    style={{ 
                        left: tooltipPos.x, 
                        top: tooltipPos.y,
                        transform: 'translate(-50%, -100%)' 
                    }}
                >
                    {/* Contenu de la Tooltip */}
                    <div className="bg-white rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-3 w-60 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        
                        {/* En-tête : Badge module */}
                        <div className="flex items-center justify-between mb-2">
                            <span 
                                className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${deliv.color}20`, color: deliv.color }}
                            >
                                {deliv.moduleLabel}
                            </span>
                        </div>

                        {/* Titre */}
                        <p className="text-sm font-semibold text-slate-800 leading-snug mb-2">
                            {deliv.descriptif}
                        </p>

                        {/* Pied : Date */}
                        <div className="flex items-center text-xs text-slate-500 bg-slate-50 rounded px-2 py-1">
                            <span className="mr-1.5 opacity-70">📅</span>
                            <span className="font-medium">{formatDate(deliv.date)}</span>
                        </div>
                    </div>

                    {/* Petite flèche en bas (Triangle CSS) pour pointer vers le marqueur */}
                    <div 
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] -mt-[1px]"
                        style={{ borderTopColor: 'white', filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.05))' }}
                    />
                </div>,
                document.body
            )}
        </>
    );
};

export default DeliverableMarker;