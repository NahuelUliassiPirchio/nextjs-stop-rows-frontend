import { memo, useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import styles from "@styles/ShopForm.module.css";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""

const containerStyle = {
    width: "100%",
    height: "18rem",
}

type Location = {
    lat: number
    lng: number
}

type LocationPickerProps = {
    value: Location
    onChange: (location: Location) => void
}

function LocationPicker({ value, onChange }: LocationPickerProps) {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: apiKey,
    })
    const [map, setMap] = useState<any>(null)

    const handlePick = useCallback((event: any) => {
        const lat = event.latLng?.lat()
        const lng = event.latLng?.lng()

        if (typeof lat === "number" && typeof lng === "number") {
            const nextLocation = { lat, lng }
            onChange(nextLocation)
            map?.panTo(nextLocation)
        }
    }, [map, onChange])

    const handleLoad = useCallback((map: any) => {
        map.setZoom(15)
        setMap(map)
    }, [])

    if (!isLoaded) {
        return <div className={styles.mapPlaceholder}>Loading map...</div>
    }

    return (
        <GoogleMap
            mapContainerClassName={styles.locationMap}
            mapContainerStyle={containerStyle}
            center={value}
            onClick={handlePick}
            onLoad={handleLoad}
            options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
            }}
        >
            <Marker
                key={`${value.lat}-${value.lng}`}
                position={value}
                draggable
                animation={window.google.maps.Animation.DROP}
                icon={{
                    url: "/icons/location-pin.svg",
                    scaledSize: new window.google.maps.Size(34, 34),
                    anchor: new window.google.maps.Point(17, 34),
                }}
                onDragEnd={handlePick}
                title="Selected shop location"
            />
        </GoogleMap>
    )
}

export default memo(LocationPicker)
