import { memo, useCallback, useState } from 'react'
import { GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: -34.641440,
  lng: -58.563948
};

function Map({markers}: {markers: any}) {
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
        zoom={9}
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
        markers && markers.map((marker: any) => {
          return (
            <Marker
              key={marker.id}
              position={{lat: marker.location.coordinates[0], lng: marker.location.coordinates[1]}}
              label={marker.name}
              onClick={() => {
                console.log(marker);
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
