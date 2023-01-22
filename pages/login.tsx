import Router from "next/router"
import { useRef } from "react"
import useAuth from "../hooks/useAuth"
import styles from "../styles/Home.module.css"

export default function Login() {
    const emailRef = useRef<HTMLInputElement >(null)
    const passwordRef = useRef<HTMLInputElement>(null)   
    
    const {user, loading, login} = useAuth()
//    if (loading) return <div>Loading...</div>

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
                login(data.token, data.expires_in)
            }
        })
        .catch(err => {
            // set error
            alert(err)
        })
        Router.push("/login")
    }

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <form>
                <input type="email" placeholder="email" ref={emailRef} />
                <input type="password" placeholder="*******" ref={passwordRef} />
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    )
}