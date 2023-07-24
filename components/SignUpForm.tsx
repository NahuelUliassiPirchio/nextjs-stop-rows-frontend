import { useState } from "react"
import Router from "next/router"
import Link from "next/link"
import styles from "@styles/Home.module.css"
import useAuth from "@hooks/useAuth"
import { signUp } from "@services/auth"
import { Role } from "@common/types"

export default function SignUpForm() {
    const [name, setName] = useState<string>('')
    const [username, setUsername] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [role, setRole] = useState<Role>('customer')
    const [error, setError] = useState('')

    const { loading, login } = useAuth()

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        
        if (!(name && username && email && password && confirmPassword)) return setError('Please fill in all fields')
        if(password !== confirmPassword) return setError('Passwords do not match')


        signUp({
            name,
            username,
            email,
            password,
            role
        })
        .then(data=>{
            if (data.error) {
                setError(data.message)
            } else {
                setError('')
                login(data.refreshToken, data.accessToken.token, data.accessToken.expiresIn)
                if(!loading) Router.push("/")
            }
        })
        .catch(error=> setError('Server error'))
    }

    return (
        <form>
            <label htmlFor="name">Name</label>
            <input type="text" name="name" id="name" onChange={e => setName(e.target.value)} required/>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" onChange={e => setUsername(e.target.value)} required/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={e => setEmail(e.target.value)} required/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" onChange={e => setPassword(e.target.value)} required/>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input type="password" name="confirmPassword" id="confirmPassword" onChange={e => setConfirmPassword(e.target.value)} required/>
            <label htmlFor="role">Role</label>
            <select name="role" id="role" onChange={e => setRole(e.target.value as Role)}>
                <option value="customer">Customer</option>
                <option value="owner">Owner</option>
            </select>
            <p className={styles.error}>{error}</p>
            <input className={styles.submit} type="submit" value="Sign Up" onClick={handleSubmit} />
            <p>Already have an account? <Link href='/login'>Log in</Link></p>
        </form>
    )
}