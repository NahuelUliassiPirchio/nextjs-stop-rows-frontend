import Router from "next/router"
import { useEffect } from "react"
import useAuth from "./useAuth"


const useAuthGuard = (redirectPath: string) => {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (!loading && !user) {
            Router.push(redirectPath)
        }
    }
    , [user, loading])

}

export default useAuthGuard