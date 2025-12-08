// client/src/components/HelperBar.jsx
import React from "react";

function HelperBar({ studentEmail, mode = "guided" }) {
    const helpText = mode === "free" 
        ? "💡 Mode discussion libre :: Posez toutes vos questions"
        : "💡 Mode guidé :: sélectionnez un module et échangez avec le mentor";

    return (
        <div className="text-xs text-gray-500 px-2.5 py-2 rounded-[14px] bg-gray-50 border border-gray-200/90 flex justify-between items-center gap-2 flex-wrap">
            <span>
                Connecté en tant que {" "}
                <span className="font-semibold text-nws-purple">
                    {studentEmail}
                </span>
            </span>
            <span className="text-[10px] opacity-70">
                {helpText}
            </span>
        </div>
    );
}

export default HelperBar;
