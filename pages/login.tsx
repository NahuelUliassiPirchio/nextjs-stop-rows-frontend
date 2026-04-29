import { FormEvent, useRef, useState } from "react"
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const {user, login} = useAuth()

    if (user) Router.push("/app")

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return

        if (!emailRef.current?.value || !passwordRef.current?.value) {
            setError("Please fill all fields")
            return
        }
        
        setError(null)
        setIsSubmitting(true)

        try {
            const data = await loginService({
                email: emailRef.current.value,
                password: passwordRef.current.value
            })

            if (data.error) {
                setError(data.error)
                return
            }

            login(data.refreshToken, data.accessToken.token, data.accessToken.expiresIn)
            Router.push("/app")
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected error"

            if (message === "Failed to fetch") {
                setError("Server error")
            }
            else {
                setError(message)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <main className={styles.container}>
                <h1 className={styles.title}>Login</h1>
                {error && <p className={styles.error}>{error}</p>}
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <input type="email" name="email" placeholder="email" ref={emailRef} required/>
                    <input type="password" name="password" placeholder="*******" ref={passwordRef} required/>
                    <input className={styles.submit} type="submit" disabled={isSubmitting} value={isSubmitting ? "Signing in..." : "Login"}/>
                    {isSubmitting && <p className={styles.loadingMessage}>Checking your credentials and opening your app...</p>}
                    <p>{"Don't have an account?"} <Link href="/signup">Sign Up</Link></p>
                </form>
            </main>
        </>
    )
}