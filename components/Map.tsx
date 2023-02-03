import { memo, useCallback, useEffect, useState } from 'react'
import { GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Shop } from 'types';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

const containerStyle = {
  width: '100%',
  height: '100vh'
};

function Map({shops = [], selectedMarker, onMarkerClick, center}: {shops: Shop[], selectedMarker: Shop | null, onMarkerClick: (shop: Shop) => void, center: {lat: number, lng: number}}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map:any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={8}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: 'greedy',
            zoomControlOptions: {
                position: window.google.maps.ControlPosition.LEFT_BOTTOM
            },
        }
        }
      >
      {
        shops && shops.map((shop: Shop) => {
          return (
            <Marker
              key={shop.id}
              position={{lat: shop.location.coordinates[0], lng: shop.location.coordinates[1]}}
              label={shop.name}
              onClick={() => {
                onMarkerClick(shop)
              }}
            />
          )
        })
      }
        <></>
      </GoogleMap>
  ) : <></>
}

export default memo(Map)
