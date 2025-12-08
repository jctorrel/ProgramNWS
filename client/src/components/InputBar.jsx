// client/src/components/InputBar.jsx
import React from "react";

function InputBar({ value, onChange, onSubmit, disabled, shouldShowModules, placeholder = "Tapez votre message..." }) {
    if (shouldShowModules) {
        return null;
    }
    return (
        <form
            onSubmit={onSubmit}
            className="flex items-center gap-2 p-2 rounded-[18px] bg-gray-50 border border-gray-200"
        >
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 px-2.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 text-[13px] outline-none transition-all duration-150 placeholder:text-gray-500 focus:border-nws-purple focus:ring-1 focus:ring-nws-purple/12 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={disabled || !value.trim()}
                className="px-3.5 py-1.5 rounded-full border-none text-xs font-semibold bg-gradient-to-br from-nws-purple to-nws-teal text-white cursor-pointer inline-flex items-center gap-1.5 shadow-button transition-all duration-150 whitespace-nowrap hover:translate-y-[-1px] hover:shadow-button-hover disabled:opacity-55 disabled:cursor-default disabled:shadow-none disabled:transform-none"
            >
                <span className="text-[13px] translate-y-[0.5px]">✉</span>
                <span>Envoyer</span>
            </button>
        </form>
    );
}

export default InputBar;
