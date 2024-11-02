import { useState } from "react";
import { Shop } from "@common/types";

import styles from "@styles/ShopForm.module.css";
import { insertShop } from "@services/shops";

export default function ShopForm({ shop, setIsEditing }: { shop?: Shop, setIsEditing?: any }) {
    const [name, setName] = useState(shop?.name || '')
    const [email, setEmail] = useState(shop?.email || '')
    const [description, setDescription] = useState(shop?.description || '')
    const [phone, setPhone] = useState(shop?.phone || '')
    const [website, setWebsite] = useState(shop?.website || '')
    const [logo, setLogo] = useState(shop?.logo || '')
    const [address, setAddress] = useState(shop?.address || '')
    const [lng, setLng] = useState<number>(shop?.location.coordinates[0] || 0)
    const [lat, setLat] = useState<number>(shop?.location.coordinates[1] || 0)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        if (loading) return

        setLoading(true)
        const method = shop ? 'PUT' : 'POST'

        insertShop({
            method,
            shop:{
                email,
                name,
                description,
                coords: [lng, lat],
                phone,
                website,
                address,
                logo,
                id: shop?.id || undefined
            }
        })
        .then(data=>{
            if(data.error) throw new Error(data.error)
            setSuccess(`${data.name} successfully created`)
        })
        .catch(error => {
            setError(error.message)
        })
        .finally(()=>setLoading(false))
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
                required
            />
            <label htmlFor="email">Email</label>
            <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label htmlFor="description">Description</label>
            <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="location"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />

            <label htmlFor="lat">Latitude</label>
            <input
                type="number"
                id="lat"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
                required
            />
            <label htmlFor="lng">Longitude</label>
            <input
                type="number"
                id="lng"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
                required
            />
            
            <label htmlFor="phone">Phone</label>
            <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            <label htmlFor="website">Website</label>
            <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                required
            />
            <label htmlFor="logo">Logo</label>
            <input
                type="text"
                id="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                required
            />
            {
                shop ? (
                    <div className={styles.updateCancel}>
                        <button type="submit" onClick={handleSubmit}>Update</button>
                        <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
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