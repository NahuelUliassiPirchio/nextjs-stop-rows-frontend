import { useState, useEffect } from 'react';

type ServerStatus = 'checking' | 'waking' | 'online';

const WAKE_THRESHOLD_MS = 3000;
const RETRY_INTERVAL_MS = 5000;
const MAX_RETRIES = 10;

function useServerStatus(): ServerStatus {
    const [status, setStatus] = useState<ServerStatus>('checking');

    useEffect(() => {
        const controller = new AbortController();
        let retryTimer: ReturnType<typeof setTimeout>;
        let attempts = 0;

        const wakeTimer = setTimeout(() => {
            console.log('[ServerStatus] threshold reached → waking');
            setStatus('waking');
        }, WAKE_THRESHOLD_MS);

        const ping = async () => {
            if (controller.signal.aborted) return;
            attempts++;
            console.log(`[ServerStatus] ping attempt ${attempts}/${MAX_RETRIES}`, `${process.env.API_URL}/health`);

            try {
                const res = await fetch(`${process.env.API_URL}/health`, {
                    signal: controller.signal,
                });
                console.log('[ServerStatus] response', res.status, res.ok);
                if (res.ok) {
                    clearTimeout(wakeTimer);
                    setStatus('online');
                    console.log('[ServerStatus] status → online');
                    return;
                }
                console.warn('[ServerStatus] non-ok response, will retry');
            } catch (err) {
                if (controller.signal.aborted) return;
                console.warn('[ServerStatus] fetch error, will retry', err);
            }

            if (attempts < MAX_RETRIES) {
                retryTimer = setTimeout(ping, RETRY_INTERVAL_MS);
            } else {
                console.warn('[ServerStatus] max retries reached, giving up');
                clearTimeout(wakeTimer);
                setStatus('online');
            }
        };

        ping();

        return () => {
            controller.abort();
            clearTimeout(wakeTimer);
            clearTimeout(retryTimer);
        };
    }, []);

    return status;
}

export default useServerStatus;
