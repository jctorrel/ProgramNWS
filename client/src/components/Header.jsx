// client/src/components/Header.jsx
import React from "react";
import StatusBadge from "./StatusBadge";

function Header({ online, count, limit }) {
    return (
        <header className="relative flex items-center gap-3.5 px-3 py-2.5 rounded-[20px] overflow-hidden bg-gradient-to-br from-nws-yellow/14 via-nws-teal/12 to-nws-purple/16 border border-indigo-300/26">
            {/* Barre colorée en bas */}
            <div className="absolute left-0 right-0 bottom-0 h-[3px] bg-gradient-to-r from-nws-yellow via-nws-teal via-nws-purple to-nws-red opacity-90" />

            {/* Logo */}
            <img
                src="/logo.svg"
                alt="Normandie Web School Logo"
                className="w-[120px] h-auto"
            />

            {/* Titre */}
            <div className="flex flex-col gap-[1px]">
                <h1 className="text-lg font-bold tracking-[0.02em] m-0">
                    NWS Mentor AI
                </h1>
                <span className="text-[11px] text-gray-500">
                    Votre assistant pédagogique intelligent
                </span>
            </div>

            {/* Badge statut (caché sur mobile) */}
            <StatusBadge
                online={online}
                count={count}
                limit={limit}
            />
        </header>
    );
}

export default Header;
