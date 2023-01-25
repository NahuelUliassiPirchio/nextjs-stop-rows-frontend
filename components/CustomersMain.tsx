import React, { useEffect } from 'react';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Link from 'next/link';
import ShopItem from './ShopItem';
import { Shop } from '../types';

import useAuth from '@hooks/useAuth';
import Map from './Map'
import Menu from './Menu';
import styles from '@styles/CustomersMain.module.css'
import RowList from './RowList';
import { GoogleMap } from '@react-google-maps/api';
import Cookies from 'js-cookie';

// export async function getServersideProps(): GetServerSideProps {
//   const res = await fetch('http://localhost:3000/api/shops')
//   const shops = await res.json()
//   console.log(shops);
  
//   return {
//     props: {
//       shops
//     }
//   }
// }

function CustomersMain() {
  const { user, loading } = useAuth()

  const [shops, setShops] = React.useState<Shop[]>([])
  const [markers, setMarkers] = React.useState<Shop[]>([])
  const [mapRef, setMapRef] = React.useState<GoogleMap | null>(null)

  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null)
  const [selectedMarker, setSelectedMarker] = React.useState<Shop | null>(null)

  useEffect(() => {
    if (selectedMarker) {
      setSelectedShop(selectedMarker)
    }
  }, [selectedMarker])

  useEffect(() => {
    if (selectedShop) {
      setSelectedMarker(selectedShop)
      console.log(selectedShop);
      
      // if (mapRef) {
      //   mapRef.panTo({lat: 0, lng: -50})
      // }
    }
  }, [selectedShop, mapRef])

  const handleMarkerClick = (shop:Shop) => {
    setSelectedMarker(shop)
  }

  const handleShopClick = (shop:Shop) => {
    setSelectedShop(shop)
  }

  React.useEffect(() => {
    fetch('http://localhost:3001/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data)
      })

  }, [])

  const token = Cookies.get('access_token')

  const leaveHandler = async () => {
    const response = await fetch(`http://localhost:3001/rows/${user?.row}/leave`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({userId: user?.id})
    })
    const data = await response.json()
    if (data.error) {
      alert(data.error)
    }
  }

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <h1>Shops</h1>
        {
          shops && shops.map( (shop:any) => (
            <ShopItem key={shop.id} shop={shop} onItemClick={handleShopClick}  />
          ))
        }
      </aside>
      <main>
        {
          loading ? <div>Loading...</div> : (
              user ? (
                <Menu name={user.name}/>
              ) : (
                <Link className={styles.signUp} href="/login"> Sign in </Link>
              )
          )
        }
        <Map shops={shops} selectedMarker={selectedMarker} onMarkerClick={handleMarkerClick} setMapRef={setMapRef}/>
        {
          loading ? <div>Loading...</div> : (
            user?.row && (
              <div className={styles.activeRowList}>
                <RowList rowId={user.row} displayIfNull={false} />
                <button onClick={leaveHandler}>Leave row</button>
              </div>
            )
          )
        }
      </main>
    </div>
  )
}

export default CustomersMain