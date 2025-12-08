// client/src/components/QuickActions.jsx
import React from "react";

function QuickActions({ modules, onModuleClick }) {
    if (!modules || modules.length === 0) {
        return null;
    }

    return (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
            <h3 className="m-0 mb-3 text-[11px] uppercase tracking-wider text-gray-500 font-semibold text-center">
                📚 Modules disponibles
            </h3>
            <div className="flex flex-wrap gap-2.5 justify-center">
                {modules.map((module, index) => (
                    <button
                        key={index}
                        onClick={() => onModuleClick(module)}
                        className="group relative border border-indigo-200 rounded-xl px-4 py-2 text-[13px] font-medium cursor-pointer bg-white text-gray-700 transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-1"
                    >
                        <span className="relative z-10">{module.label}</span>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-100/0 to-purple-100/0 group-hover:from-indigo-100/50 group-hover:to-purple-100/30 transition-all duration-200" />
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuickActions;
