import Cookies from "js-cookie"
import useAuth from "./useAuth"
import useFetch from "./useFetch"


const useAuthFetch = (url: string, options: RequestInit = {}) => {
    const token = Cookies.get('accessToken')

    const fetchOptions = {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    }

    return useFetch(url, fetchOptions)
}

export default useAuthFetch