import Router from "next/router"
import { useEffect } from "react"
import useAuth from "./useAuth"


const useAuthGuard = (redirectPath: string) => {
    const { user } = useAuth()

    useEffect(() => {
        if (!user) {
            Router.push(redirectPath)
        }
    }, [user, redirectPath])
}

export default useAuthGuard