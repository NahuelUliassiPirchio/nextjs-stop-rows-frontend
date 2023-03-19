import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import endpoints from "@common/endpoints";

const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accessToken = Cookie.get("accessToken")
        if (!accessToken) {
            setLoading(false)
            return
        }

        const expirationDate = parseInt(Cookie.get("expirationDate") || "")

        if (expirationDate < Date.now()) {
            const refreshToken = Cookie.get("refreshToken")
            if (!refreshToken) {
                logout()
                return
            }
            fetch(endpoints.auth.refresh, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.accessToken) {
                    Cookie.set("accessToken", data.accessToken)
                    Cookie.set("expirationDate", data.expirationDate)
                } else {
                    logout()
                }
            })
            .catch( _ => {
                logout()
            }
        )
        }

        fetch(endpoints.profile, {
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

    const login = (refreshToken: string, accessToken: string, expiresIn: string) => {
        setLoading(true)

        const expirationDate = Date.now() + Number(expiresIn) * 1000

        Cookie.set("refreshToken", refreshToken)
        Cookie.set("accessToken", accessToken)
        Cookie.set("expirationDate", expirationDate.toString())

        fetch(endpoints.profile, {
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
        Cookie.remove("refreshToken")
        Cookie.remove("accessToken")
        Cookie.remove("expirationDate")
        setLoading(false)
        setUser(null)
    }

    return { user, login, logout, loading };
};

export default useAuth;