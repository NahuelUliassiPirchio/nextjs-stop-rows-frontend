import { useEffect, useState } from "react";
import Cookie from "js-cookie";

const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = Cookie.get("accessToken")
        if (!accessToken) {
            setLoading(false)
            return
        }

        // const expirationDate = new Date(Cookie.get("expirationDate") as string)
        // if (expirationDate < new Date()) {
        //     logout()
        //     return
        // }

        fetch("http://localhost:3001/profile", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })  
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
        setLoading(false)
    }, []);

    const login = (accessToken: string, expirationDate: string) => {
        Cookie.set("accessToken", accessToken)
        Cookie.set("expirationDate", expirationDate)

        fetch("http://localhost:3001/profile", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setUser(data)
            })
        setLoading(false)
    }

    const logout = () => {
        Cookie.remove("accessToken")
        Cookie.remove("expirationDate")
        setLoading(false)
        setUser(null)
    }

    return { user, login, logout, loading };
};

export default useAuth;