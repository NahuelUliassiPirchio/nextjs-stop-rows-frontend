import { memo, useCallback, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Shop } from '@common/types';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

const containerStyle = {
  width: '100%',
  height: '100vh'
};

function Map({shops = [], onMarkerClick,setIsLoaded, center}: {shops: Shop[], onMarkerClick: (shop: Shop) => void, setIsLoaded: (isLoaded: boolean) => void, center: {lat: number, lng: number}}) {const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map: any) {
    map.setZoom(14.5);
    setIsLoaded(true)

    setMap(map)
  }, [setIsLoaded])

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
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
              position={{lat: shop.location.coordinates[1], lng: shop.location.coordinates[0]}}
              icon={{
                url: '/images/market.svg',
                scaledSize: new window.google.maps.Size(40, 40),
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(20, 20),
                labelOrigin: new window.google.maps.Point(20, -5)
              }}
              title={shop.name + ' - ' + shop.address}
              label={{
                text: shop.name,
                fontSize: '12px',
                fontWeight: 'bold'
              }}
              options={{
                animation: window.google.maps.Animation.DROP
              }}
              onClick={() => {
                onMarkerClick(shop)
              }}
            >
              <p>{shop.name}</p>
            </Marker>
          )
        })
      }
        <></>
      </GoogleMap>
  ) : <></>
}

export default memo(Map)
