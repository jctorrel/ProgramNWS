// src/hooks/useChatSession.js
import { useState, useCallback } from "react";
import { apiFetch } from "../utils/api";
import { createMessage, getDefaultErrorMessage } from "../utils/messageFormatter";

const PROGRAM_ID = "A1";

export function useChatSession(studentEmail, initialMessages = [], onMessageSent = null) {
    const [messages, setMessages] = useState(initialMessages);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const addUserMessage = useCallback((text) => {
        setMessages((prev) => [
            ...prev,
            createMessage(prev.length + 1, "user", text),
        ]);
    }, []);

    const addMentorMessage = useCallback((text) => {
        setMessages((prev) => [
            ...prev,
            createMessage(prev.length + 1, "mentor", text),
        ]);
    }, []);

    const setInitialMessages = useCallback((newMessages) => {
        setMessages(newMessages);
    }, []);

    const sendMessage = useCallback(
        async (message, mode = "guided") => {
            const payload = {
                email: studentEmail,
                message,
                programID: PROGRAM_ID,
                mode,
            };

            try {
                setIsLoading(true);
                setIsTyping(true);
                setError("");

                const data = await apiFetch("/api/chat", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });

                const mentorText = data?.mentorReply || getDefaultErrorMessage();
                addMentorMessage(mentorText);
                
                // ⭐ Incrémenter le count après un envoi réussi
                if (onMessageSent) {
                    onMessageSent();
                }
            } catch (err) {
                console.error("Erreur lors de l'appel à /api/chat", err);
                setError(
                    "Impossible de contacter le mentor. Vérifie ta connexion ou réessaie plus tard."
                );
                addMentorMessage(getDefaultErrorMessage());
            } finally {
                setIsLoading(false);
                setIsTyping(false);
            }
        },
        [studentEmail, addMentorMessage, onMessageSent]
    );

    const handleUserMessage = useCallback(
        async (text, mode = "guided") => {
            const trimmedText = text.trim();
            if (!trimmedText || isLoading) return;

            addUserMessage(trimmedText);
            await sendMessage(trimmedText, mode);
        },
        [isLoading, addUserMessage, sendMessage]
    );

    const handleFakeMessage = useCallback(
        async (text, mode = "guided") => {
            const trimmedText = text.trim();
            if (!trimmedText || isLoading) return;

            addUserMessage(trimmedText, mode);
        },
        [isLoading, addUserMessage]
    );

    return {
        messages,
        isTyping,
        isLoading,
        error,
        addUserMessage,
        addMentorMessage,
        setInitialMessages,
        sendMessage,
        handleUserMessage,
        handleFakeMessage
    };
}