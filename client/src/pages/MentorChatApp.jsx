// client/src/MentorChatApp.jsx
import React, { useState, useCallback } from "react";

import Header from "../components/Header.jsx";
import TabBar from "../components/TabBar.jsx";
import HelperBar from "../components/HelperBar.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import InputBar from "../components/InputBar.jsx";
import QuickActions from "../components/QuickActions.jsx";

import { useBackendHealth } from "../hooks/useBackendHealth";
import { useChatSession } from "../hooks/useChatSession";
import { useModules } from "../hooks/useModules";
import { useAdminSettings } from "../hooks/useAdminSettings";
import { getCurrentUserEmail } from "../utils/storage";
import { apiFetch } from "../utils/api.js";

function MentorChatApp() {
    const [studentEmail] = useState(getCurrentUserEmail);
    const [inputValue, setInputValue] = useState("");
    const [activeMode, setActiveMode] = useState("guided"); // "guided" ou "free"
    const [shouldShowModules, setShouldShowModules] = useState(true);

    // Hook pour les paramètres d'administration
    const { settings } = useAdminSettings();

    // Hook pour surveiller l'état du backend
    const { online, count, limit, incrementCount } = useBackendHealth(studentEmail);

    // Hook pour gérer la session de chat
    const {
        messages,
        isTyping,
        isLoading,
        error,
        handleUserMessage,
        handleFakeMessage,
        setInitialMessages,
    } = useChatSession(studentEmail, [], incrementCount);

    // Hook pour gérer les modules avec callback d'initialisation
    const handleModulesInitialized = useCallback(
        (initialMessages) => {
            setInitialMessages(initialMessages);
        },
        [setInitialMessages]
    );

    const { modules, clearModules } = useModules(handleModulesInitialized);

    /**
     * Gère le changement de mode
     */
    const handleModeChange = (newMode) => {
        setActiveMode(newMode);

        // En mode libre, on cache les modules
        // En mode guidé, on les réaffiche s'ils existent
        if (newMode === "free") {
            setShouldShowModules(false);
        } else {
            setShouldShowModules(true);
        }
    };

    /**
     * Gère le clic sur un module dans les QuickActions
     */
    const handleModuleClick = async (module) => {
        setShouldShowModules(false); // Cacher après sélection
        const data = await apiFetch("/api/program", {
            method: "POST",
            body: JSON.stringify({programID: "A1", moduleID: module.id, email: studentEmail}),
        });
        
        handleUserMessage("Bonjour, \n\n J'aimerais travailler sur le module : " + module.label +" (" + data.module + ")");
    };

    /**
     * Gère la soumission du formulaire
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const text = inputValue.trim();
        if (!text || isLoading) return;

        setInputValue("");

        // En mode guidé, on masque les modules après envoi
        if (activeMode === "guided") {
            setShouldShowModules(false);
        }

        await handleUserMessage(text, activeMode);
    };

    return (
        <div className="flex justify-center items-stretch min-h-screen p-4 md:p-[18px]">
            <div className="w-full max-w-[80%] bg-white rounded-3xl p-4 md:p-[18px] shadow-soft border border-gray-100 flex flex-col gap-2.5">
                <Header
                    online={online}
                    count={count}
                    limit={limit}
                />

                {/* Afficher TabBar uniquement si le mode libre est activé */}
                {settings.freeModeEnabled && (
                    <TabBar
                        activeMode={activeMode}
                        onModeChange={handleModeChange}
                    />
                )}

                <div className="grid grid-rows-[auto_1fr_auto] gap-2 flex-1 min-h-0">
                    <HelperBar
                        studentEmail={studentEmail}
                        mode={settings.freeModeEnabled ? activeMode : "guided"}
                    />

                    <ChatWindow messages={messages} isTyping={isTyping} />

                    <div>
                        {/* Afficher les QuickActions uniquement en mode guidé ET si shouldShowModules est true */}
                        {(!settings.freeModeEnabled || activeMode === "guided") && shouldShowModules && (
                            <QuickActions
                                modules={modules}
                                onModuleClick={handleModuleClick}
                            />
                        )}

                        <InputBar
                            value={inputValue}
                            onChange={setInputValue}
                            onSubmit={handleSubmit}
                            disabled={isLoading}
                            shouldShowModules={shouldShowModules}
                            placeholder={
                                settings.freeModeEnabled && activeMode === "free"
                                    ? "Posez n'importe quelle question..."
                                    : "Tapez votre message..."
                            }
                        />
                        {error && (
                            <div className="text-xs text-red-700 px-2 py-1 mt-1 bg-red-50 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentorChatApp;