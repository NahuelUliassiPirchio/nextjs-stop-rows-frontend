/**
 * signup
 * refresh
 * profile (get/put)
 * login
 */

import endpoints from "@common/endpoints"
import Cookies from "js-cookie"
import { parseResponse } from "./http"

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
    .then(parseResponse)
}

export async function getProfile() {
    const accessToken = Cookies.get("accessToken")
    return await fetch(endpoints.profile, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
    })
    .then(parseResponse)
}

export async function refreshToken() {
    const refreshToken = Cookies.get("refreshToken")

    return await fetch(endpoints.auth.refresh, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(parseResponse)
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
    .then(parseResponse)
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
    .then(parseResponse)
}