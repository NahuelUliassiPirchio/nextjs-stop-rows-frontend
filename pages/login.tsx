import { useRef, useState } from "react"
import Router from "next/router"
import Link from "next/link"
import Head from "next/head"

import useAuth from "@hooks/useAuth"
import {login as loginService} from '@services/auth'
import styles from "@styles/Home.module.css"

export default function Login() {
    const emailRef = useRef<HTMLInputElement >(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null)
    
    const {user, loading, login} = useAuth()

    if (user) Router.push("/app")

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!emailRef.current?.value || !passwordRef.current?.value) {
            setError("Please fill all fields")
            return
        }
        loginService({
            email: emailRef.current?.value,
            password: passwordRef.current?.value
        })
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            else {
                console.log(data);
                login(data.refreshToken, data.accessToken.token, data.accessToken.expiresIn)
                if(!loading) Router.push("/app")
            }
        })
        .catch(err => {
            if (err.message === "Failed to fetch") {
                setError("Server error")
            }
            else {
                setError(err.message)
            }
        })
        Router.push("/login")
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <main className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form className={styles.loginForm}>
                    <input type="email" name="email" placeholder="email" ref={emailRef} required/>
                    <input type="password" name="password" placeholder="*******" ref={passwordRef} required/>
                    <input className={styles.submit} type="submit" onClick={handleSubmit} value="Login"/>
                    <p>{"Don't have an account?"} <Link href="/signup">Sign Up</Link></p>
                </form>
            </main>
        </>
    )
}