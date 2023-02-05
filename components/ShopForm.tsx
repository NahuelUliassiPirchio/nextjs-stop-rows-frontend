import { useState } from "react";
import { Shop } from "types";
import styles from "@styles/ShopForm.module.css";


export default function ShopForm({ shop, setEdit }: { shop?: Shop, setEdit?: any }) {
    const [name, setName] = useState(shop?.name || '')
    const [description, setDescription] = useState(shop?.description || '')
    // const [location, setLocation] = useState(shop?.location || '')
    const [phone, setPhone] = useState(shop?.phone || '')
    const [website, setWebsite] = useState(shop?.website || '')
    const [logo, setLogo] = useState(shop?.logo || '')
    const [address, setAddress] = useState(shop?.address || '')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        let shopURL = 'http://localhost:3001/shops'
        let method = 'POST'
        if (shop) {
            method = 'PUT'
            shopURL += `/${shop.id}`
        }

        setLoading(true)

        fetch(shopURL, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                // location,
                phone,
                website,
                logo
            })
        }).then(res => {
            setLoading(false)
            if (res.ok) {
                setSuccess('Shop created successfully')
            } else {
                setError('Error creating shop')
            }
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
            <label htmlFor="description">Description</label>
            <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            {/* <label htmlFor="location">Location</label>
            <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
            /> */}
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
            <label htmlFor="address">Address</label>
            <input
                type="text"
                id="address"
                value={address}
            />
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            {
                shop ? (
                    <div>
                        <button type="submit" onClick={handleSubmit}>Update</button>
                        <button type="button" onClick={() => setEdit(false)}>Cancel</button>
                    </div>
                ) : (
                        <button type="submit" onClick={handleSubmit}>Create</button>
                )
            }
        </form>
    )
}