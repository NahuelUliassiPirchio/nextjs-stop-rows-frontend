import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { getProfile, refreshToken as refreshAccessToken } from "@services/auth";

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
            
            refreshAccessToken()
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

        getProfile()
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

        getProfile()
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