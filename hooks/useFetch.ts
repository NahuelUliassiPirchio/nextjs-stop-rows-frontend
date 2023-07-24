import { useState, useCallback } from 'react';

interface FetchData {
    fetcher: () => void;
    data: any;
    loading: boolean;
    error: any;
}

type FetchFunction = {
  fetchData: () => Promise<any>
}

function useFetch ({fetchData}: FetchFunction): FetchData {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetcher = useCallback(async () => {
    setLoading(true);
    try {
      const resData = await fetchData();
      setData(resData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  return { fetcher, data, loading, error };
}

export default useFetch;