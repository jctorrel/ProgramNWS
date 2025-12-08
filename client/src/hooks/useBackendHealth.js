// src/hooks/useBackendHealth.js
import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../utils/api";

export function useBackendHealth(studentEmail) {
    const [state, setState] = useState({
        online: false,
        count: 0,
        limit: 0,
    });

    useEffect(() => {
        let isMounted = true;

        async function checkBackendStatus() {
            try {
                const data = await apiFetch("/api/health", { 
                    method: "POST", 
                    body: JSON.stringify({ email: studentEmail }) 
                });

                if (!isMounted) return;

                if (!data?.ok) {
                    setState({
                        online: false,
                        count: 0,
                        limit: 0,
                    });
                    return;
                }

                setState({
                    online: true,
                    count: data.count,
                    limit: data.limit,
                });
            } catch (error) {
                if (!isMounted) return;

                setState({
                    online: false,
                    count: 0,
                    limit: 0,
                });
            }
        }

        checkBackendStatus();

        const handleOnline = () => checkBackendStatus();
        const handleOffline = () => {
            setState({
                online: false,
                count: 0,
                limit: 0,
            });
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            isMounted = false;
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [studentEmail]);

    const incrementCount = useCallback(() => {
        setState(prev => ({
            ...prev,
            count: prev.count + 1
        }));
    }, []);

    return { ...state, incrementCount };
}   