import Head from "next/head";
import { useState } from "react";

import useAuth from "@hooks/useAuth";
import useAuthGuard from "@hooks/useAuthGuard";
import Loading from "@components/Loading";
import endpoints from "@common/endpoints";
import styles from "@styles/Profile.module.css";

export default function Profile() {
    const { user, loading } = useAuth()
    const [areDisabled, setAreDisabled] = useState(true)
    
    useAuthGuard('/')

    const handleUpdate = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setAreDisabled(!areDisabled)
    }

    const handleSave = async (e) => {
        const token = localStorage.getItem('token')
        await fetch(endpoints.profile, {
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
        <>
        <Head>
            <title>Profile</title>
        </Head>
        {
        loading ? (
            <Loading/>
            ) : (
                    user && (
                        <div className={styles.container}>
                            <h1>Profile</h1>
                            <form className={styles.profileForm}>
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" defaultValue={user.name} disabled={areDisabled} required/>
                                <label htmlFor="username">Username</label>
                                <input type="text" name="username" id="username" defaultValue={user.username} disabled={areDisabled} required/>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" defaultValue={user.email} disabled={areDisabled} required/>
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" id="password" defaultValue="********" disabled={areDisabled} required/>
                                <input type="submit" value="Change" onClick={handleUpdate} hidden={!areDisabled}/>
                                <input type="submit" value="Save" onClick={handleSave} disabled={areDisabled} />
                            </form>
                        </div>
                    )
            )
        }</>
    )
}
