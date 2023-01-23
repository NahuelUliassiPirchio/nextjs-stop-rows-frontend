import useAuth from "@hooks/useAuth";
import useAuthGuard from "@hooks/useAuthGuard";
import { useState } from "react";
import styles from "@styles/Profile.module.css";

export default function Profile() {
    const { user, loading } = useAuth()
    const [areDisabled, setAreDisabled] = useState(true)
    
    useAuthGuard('/')

    const handleUpdate = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setAreDisabled(!areDisabled)
    }

    const handleSave = async (e: React.SyntheticEvent) => {
        const token = localStorage.getItem('token')
        await fetch('http://localhost:3000/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: e.target.name.value,
                username: e.target.username.value,
                email: e.target.email.value,
            })
        })
    }
    
    return (
        loading ? (
            <div className={styles.loading}>
                    <h1>Loading...</h1>
                </div>
            ) : (
                    user && (
                        <div className={styles.profile}>
                            <h1>Profile</h1>
                            <form className={styles.profileForm}>
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" defaultValue={user.name} disabled={areDisabled} />
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" id="username" defaultValue={user.username} disabled={areDisabled} />
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" defaultValue={user.email} disabled={areDisabled} />
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" defaultValue="********" disabled={areDisabled} />
                                <input type="submit" value="Change" onClick={handleUpdate} hidden={!areDisabled}/>
                                <input type="submit" value="Save" disabled={areDisabled} />
                            </form>
                        </div>
                    )
            )
    )
}
