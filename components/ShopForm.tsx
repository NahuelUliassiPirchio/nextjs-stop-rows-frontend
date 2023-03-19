import { useState } from "react";
import { Shop } from "@common/types";
import endpoints from "@common/endpoints";

import styles from "@styles/ShopForm.module.css";
import Cookies from "js-cookie";

export default function ShopForm({ shop, setEdit }: { shop?: Shop, setEdit?: any }) {
    const [name, setName] = useState(shop?.name || '')
    const [email, setEmail] = useState(shop?.email || '')
    const [description, setDescription] = useState(shop?.description || '')
    const [phone, setPhone] = useState(shop?.phone || '')
    const [website, setWebsite] = useState(shop?.website || '')
    const [logo, setLogo] = useState(shop?.logo || '')
    const [address, setAddress] = useState(shop?.address || '')
    const [lng, setLng] = useState(shop?.location.coordinates[0] || '')
    const [lat, setLat] = useState(shop?.location.coordinates[1] || '')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (loading) return
        if (!lat || !lng || !name || !description || !phone || !website || !logo || !address || !email ) return setError('Please fill in all fields')
        console.log(address);
        
        setLoading(true)
        let shopURL = endpoints.shops.getShops
        let method = 'POST'
        if (shop) {
            method = 'PUT'
            shopURL += `/${shop.id}`
        }
        console.log(shopURL);

        fetch(shopURL, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get('accessToken')}`                
            },
            body: JSON.stringify({
                email,
                name,
                description,
                coords: [lng, lat],
                phone,
                website,
                address,
                logo
            })
        }).then(res => {
            setLoading(false)
            if (res.ok) {
                setSuccess('Action successful')
            } else {
                throw new Error('Error handling shop status')
            }
            console.log(res);
        })
        .catch(_ => {
            setLoading(false)
            setError('Error handling shop status')
        })
    }

    const formStyle = shop ? styles.editForm : styles.createForm
    return (
        <form className={`${styles.shopForm} ${formStyle}`}>
            <label htmlFor="name">Name</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="description">Description</label>
            <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <label htmlFor="lat">Latitude</label>
            <input
                type="number"
                id="lat"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
            />
            <label htmlFor="lng">Longitude</label>
            <input
                type="number"
                id="lng"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
            />
            
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <label htmlFor="website">Website</label>
            <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
            />
            <label htmlFor="logo">Logo</label>
            <input
                type="text"
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
            />
            {
                shop ? (
                    <div className={styles.updateCancel}>
                        <button type="submit" onClick={handleSubmit}>Update</button>
                        <button type="button" onClick={() => setEdit(false)}>Cancel</button>
                    </div>
                ) : (
                        <button type="submit" onClick={handleSubmit}>Create</button>
                )
            }
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
        </form>
    )
}