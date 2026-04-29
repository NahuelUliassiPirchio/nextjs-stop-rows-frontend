import { memo, useCallback, useMemo, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Shop } from '@common/types';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const ShopMarker = memo(function ShopMarker({shop, icon, onMarkerClick}: {shop: Shop, icon: any, onMarkerClick: (shop: Shop) => void}) {
  const position = useMemo(() => ({
    lat: shop.location.coordinates[1],
    lng: shop.location.coordinates[0],
  }), [shop.location.coordinates])

  const label = useMemo(() => ({
    text: shop.name,
    fontSize: '12px',
    fontWeight: 'bold',
  }), [shop.name])

  const handleClick = useCallback(() => {
    onMarkerClick(shop)
  }, [onMarkerClick, shop])

  return (
    <Marker
      position={position}
      icon={icon}
      title={shop.name + ' - ' + shop.address}
      label={label}
      onClick={handleClick}
    >
      <p>{shop.name}</p>
    </Marker>
  )
})

function Map({shops = [], onMarkerClick,setIsLoaded, center}: {shops: Shop[], onMarkerClick: (shop: Shop) => void, setIsLoaded: (isLoaded: boolean) => void, center: {lat: number, lng: number}}) {const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })

  const [map, setMap] = useState(null)
  const markerIcon = useMemo(() => {
    if (!isLoaded) return null

    return {
      url: '/icons/market.svg',
      scaledSize: new window.google.maps.Size(40, 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 20),
      labelOrigin: new window.google.maps.Point(20, -5)
    }
  }, [isLoaded])

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
            <ShopMarker
              key={shop.id}
              shop={shop}
              icon={markerIcon}
              onMarkerClick={onMarkerClick}
            />
          )
        })
      }
        <></>
      </GoogleMap>
  ) : <></>
}

export default memo(Map)
