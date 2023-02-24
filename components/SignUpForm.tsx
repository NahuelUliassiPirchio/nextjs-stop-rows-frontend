import { useState } from "react"
import styles from "@styles/Home.module.css"
import useAuth from "@hooks/useAuth"
import Router from "next/router"

export default function SignUpForm() {
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('customer')
    const [error, setError] = useState('')

    const { loading, login } = useAuth()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        
        if (!(name && username && email && password && confirmPassword)) return setError('Please fill in all fields')
        if(password !== confirmPassword) return setError('Passwords do not match')

        const res = await fetch('http://localhost:3001/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                role
            })
        })
        const data = await res.json()
        if (data.error) {
            setError(data.message)
        } else {
            setError('')
            login(data.refreshToken, data.accessToken.token, data.accessToken.expiresIn)
            if(!loading) Router.push("/")
        }
    }

    return (
        <form>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} />
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} />
            <label htmlFor="confirmPassword">Confirm password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} />
            <label htmlFor="role">Role</label>
            <select name="role" id="role" onChange={e => setRole(e.target.value)}>
                <option value="customer">Customer</option>
                <option value="owner">Owner</option>
            </select>
            <p className={styles.error}>{error}</p>
            <input className={styles.submit} type="submit" value="Sign Up" onClick={handleSubmit} />
        </form>
    )
}