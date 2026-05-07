import '@styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useRef } from 'react'
import useServerStatus from '@hooks/useServerStatus'
import ServerWakingBanner from '@components/ServerWakingBanner'

export default function App({ Component, pageProps }: AppProps) {
  const serverStatus = useServerStatus();
  const wasWaking = useRef(false);

  useEffect(() => {
    if (serverStatus === 'waking') wasWaking.current = true;
    if (serverStatus === 'online' && wasWaking.current) window.location.reload();
  }, [serverStatus]);

  return (
    <>
      {serverStatus === 'waking' && <ServerWakingBanner />}
      <Component {...pageProps} />
    </>
  );
}
