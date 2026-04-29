import { useState } from "react";
import { Shop } from "@common/types";

import LocationPicker from "./LocationPicker";
import styles from "@styles/ShopForm.module.css";
import { insertShop } from "@services/shops";

const defaultLocation = {lat: -34.609607, lng: -58.388660}

export default function ShopForm({ shop, setIsEditing }: { shop?: Shop, setIsEditing?: any }) {
    const [name, setName] = useState(shop?.name || '')
    const [email, setEmail] = useState(shop?.email || '')
    const [description, setDescription] = useState(shop?.description || '')
    const [phone, setPhone] = useState(shop?.phone || '')
    const [website, setWebsite] = useState(shop?.website || '')
    const [logo, setLogo] = useState(shop?.logo || '')
    const [address, setAddress] = useState(shop?.address || '')
    const [lng, setLng] = useState<number>(shop?.location.coordinates[0] || defaultLocation.lng)
    const [lat, setLat] = useState<number>(shop?.location.coordinates[1] || defaultLocation.lat)

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLocationChange = (location: {lat: number, lng: number}) => {
        setLat(Number(location.lat.toFixed(6)))
        setLng(Number(location.lng.toFixed(6)))
    }

    const handleCoordinateInput = (value: string, onChange: (coordinate: number) => void) => {
        const coordinate = parseFloat(value)

        if (!Number.isNaN(coordinate)) {
            onChange(coordinate)
        }
    }

    const handleUseCurrentLocation = () => {
        if (!window.navigator.geolocation) {
            setError('Geolocation is not available in this browser')
            return
        }

        window.navigator.geolocation.getCurrentPosition((position) => {
            handleLocationChange({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            })
        }, () => {
            setError('Unable to get your current location')
        })
    }

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
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
            />

            <div className={styles.locationPicker}>
                <div className={styles.locationHeader}>
                    <div>
                        <h2>Shop location</h2>
                        <p>Click the map or drag the marker to set the coordinates.</p>
                    </div>
                    <button type="button" onClick={handleUseCurrentLocation}>Use my location</button>
                </div>
                <LocationPicker value={{lat, lng}} onChange={handleLocationChange} />
            </div>

            <label htmlFor="lat">Latitude</label>
            <input
                type="number"
                id="lat"
                step="any"
                value={lat}
                onChange={(e) => handleCoordinateInput(e.target.value, setLat)}
                required
            />
            <label htmlFor="lng">Longitude</label>
            <input
                type="number"
                id="lng"
                step="any"
                value={lng}
                onChange={(e) => handleCoordinateInput(e.target.value, setLng)}
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