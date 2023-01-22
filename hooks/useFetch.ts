import { SetStateAction, useEffect, useState } from "react";


const useFetch = (url: string, fetchOptions: RequestInit) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchUrl = async () => {
        setLoading(true);
        try {
            const res = await fetch(url,{
                ...fetchOptions,
                headers: {
                    ...fetchOptions.headers,
                }
            });
            const json = await res.json();
            setData(json);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrl();
    }, []);

    return { data, error, loading };
}

export default useFetch;