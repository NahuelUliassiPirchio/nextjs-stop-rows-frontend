import useAuth from "./useAuth"
import useFetch from "./useFetch"


const useAuthFetch = (url: string, options: RequestInit = {}) => {
    const { user } = useAuth()

    const fetchOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${user?.accessToken}`
        }
    }

    return useFetch(url, fetchOptions)
}

export default useAuthFetch