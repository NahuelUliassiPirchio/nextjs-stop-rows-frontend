import Router from "next/router"
import Link from "next/link"
import { useRef, useState } from "react"
import useAuth from "@hooks/useAuth"
import styles from "@styles/Home.module.css"

export default function Login() {
    const emailRef = useRef<HTMLInputElement >(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    
    const {user, loading, login} = useAuth()

    if (user) Router.push("/")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await fetch("http://localhost:3001/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email: emailRef.current?.value,
                    password: passwordRef.current?.value
                }
            )
        })
        .then(res => {
            if (res.status === 401) {
                throw new Error("Invalid credentials")
            }
            else if (res.status === 500) {
                throw new Error("Server error")
            }
            else if (res.status === 400) {
                throw new Error("Bad request")
            }
            return res.json()})
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            else {
                console.log(data);
                login(data.refreshToken, data.accessToken.token, data.accessToken.expiresIn)
                if(!loading) Router.push("/")
            }
        })
        .catch(err => {
            setError(err.message)
        })
        Router.push("/login")
    }

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            {error && <p className={styles.error}>{error}</p>}
            <form className={styles.loginForm}>
                <input type="email" placeholder="email" ref={emailRef} />
                <input type="password" placeholder="*******" ref={passwordRef} />
                <input className={styles.submit} type="submit" onClick={handleSubmit} value="Login"/>
            </form>
            <p>{"Don't have an account?"} <Link href="/signup">Sign Up</Link></p>
        </div>
    )
}