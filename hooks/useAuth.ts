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

        const expirationDate = parseInt(Cookie.get("expirationDate") || "0")
        if (expirationDate * 1000 < Date.now()) {
            logout()
            return
        }

        fetch("http://localhost:3001/profile", {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })  
            .then(res => {
                if (!res.ok) throw new Error("Not authorized")
                return res.json()
            })
            .then(data => {
                setUser(data)
            })
            .catch(err => {
                if (err.message === "Not authorized") {
                    logout()
                }                
            })
            .finally(() => {
                setLoading(false)
            }
        )
    }, []);

    const login = (accessToken: string, expirationDate: string) => {
        setLoading(true)
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
            .finally(() => {
                setLoading(false)
            }
        )
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