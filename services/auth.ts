/**
 * signup
 * refresh
 * profile (get/put)
 * login
 */

import endpoints from "@common/endpoints"
import Cookies from "js-cookie"

type LoginCredentials = {
    email: string
    password: string
}

type Profile = {
    email: string
    username: string
    name: string
}

export async function login({email, password}: LoginCredentials) {
    return fetch(endpoints.auth.login, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    })
    .then(res => {
        // console.log(email,password)
        // if (res.status === 401) {
        //     throw new Error("Invalid credentials")
        // }
        // else if (res.status === 500) {
        //     throw new Error("Server error")
        // }
        // else if (res.status === 400) {
        //     throw new Error("Bad request")
        // }
        return res.json()
    })
}

export async function getProfile() {
    const accessToken = Cookies.get("accessToken")
    return await fetch(endpoints.profile, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
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
        return res.json()
    })
}

export async function refreshToken() {
    return await fetch(endpoints.auth.refresh, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
}

export async function uploadProfile({name, username, email}:Profile) {
    const accessToken = Cookies.get("accessToken")

    return await fetch(endpoints.profile, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            name,
            username,
            email,
        })
    })
    .then(res=>{
        if (res.status === 401) {
            throw new Error("Invalid credentials")
        }
        else if (res.status === 500) {
            throw new Error("Server error")
        }
        else if (res.status === 400) {
            throw new Error("Bad request")
        }
        return res.json()
    })
}

type SignUpData = {
    name:string
    username:string
    email:string
    password:string
    role: 'customer' | 'owner'
}
export async function signUp(data:SignUpData) {
    return await fetch(endpoints.auth.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...data
        })
    })
    .then(res => res.json())
}