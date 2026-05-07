import { useState, useEffect } from 'react';

type ServerStatus = 'checking' | 'waking' | 'online';

const WAKE_THRESHOLD_MS = 3000;

function useServerStatus(): ServerStatus {
    const [status, setStatus] = useState<ServerStatus>('checking');

    useEffect(() => {
        const controller = new AbortController();
        const wakeTimer = setTimeout(() => setStatus('waking'), WAKE_THRESHOLD_MS);

        const ping = async () => {
            try {
                const res = await fetch(`${process.env.API_URL}/health`, {
                    signal: controller.signal,
                });
                if (res.ok) {
                    clearTimeout(wakeTimer);
                    setStatus('online');
                }
            } catch {
                // aborted on unmount — no-op
            }
        };

        ping();

        return () => {
            controller.abort();
            clearTimeout(wakeTimer);
        };
    }, []);

    return status;
}

export default useServerStatus;
