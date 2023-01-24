import { useState, useCallback } from 'react';

interface FetchData {
    fetcher: () => void;
    data: any;
    loading: boolean;
    error: any;
}

const useFetch = (url: string, options: RequestInit = {}): FetchData => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetcher = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(url, options);
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  return { fetcher, data, loading, error };
}

export default useFetch;