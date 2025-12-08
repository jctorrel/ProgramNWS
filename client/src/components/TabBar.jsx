// client/src/components/TabBar.jsx
import React from "react";

function TabBar({ activeMode, onModeChange }) {
    const modes = [
        { id: "guided", label: "Mode Guidé", icon: "📚", description: "Modules du programme" },
        { id: "free", label: "Mode Libre", icon: "💬", description: "Discussion ouverte" }
    ];

    return (
        <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl border border-gray-200">
            {modes.map((mode) => (
                <button
                    key={mode.id}
                    onClick={() => onModeChange(mode.id)}
                    className={`
                        flex-1 px-4 py-2.5 rounded-xl font-medium text-sm
                        transition-all duration-200 
                        ${
                            activeMode === mode.id
                                ? "bg-white text-gray-900 shadow-md border border-gray-200/50"
                                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                        }
                    `}
                >
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-base">{mode.icon}</span>
                        <div className="flex flex-col items-start">
                            <span className="font-semibold">{mode.label}</span>
                            <span className={`text-[10px] ${activeMode === mode.id ? 'text-gray-500' : 'text-gray-400'}`}>
                                {mode.description}
                            </span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default TabBar;
