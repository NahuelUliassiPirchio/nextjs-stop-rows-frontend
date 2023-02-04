import React, { useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

import { Shop } from '../types';
import ShopItem from './ShopItem';

import useAuth from '@hooks/useAuth';
import Map from './Map'
import Menu from './Menu';
import styles from '@styles/CustomersMain.module.css'
import RowList from './RowList';
import useGetShops from '@hooks/useShops';
import Loading from './Loading';

function CustomersMain() {
  const { user, loading } = useAuth()

  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null)
  const [selectedMarker, setSelectedMarker] = React.useState<Shop | null>(null)

  const [center, setCenter] = React.useState({lat: -34.609607, lng: -58.388660})
  const [location, setLocation] = React.useState({lat: -34.609607, lng: -58.388660})
  
  const [page, setPage] = React.useState(1)
  const {loading: shopsLoading, error, data: shops, hasMore} = useGetShops(page, location)

  useEffect(() => {
    if (selectedMarker) {
      setSelectedShop(selectedMarker)
    }
  }, [selectedMarker])

  useEffect(() => {
    if (selectedShop) {
      setSelectedMarker(selectedShop)
      setCenter({lat: selectedShop.location.coordinates[1], lng: selectedShop.location.coordinates[0]})
    }
  }, [selectedShop])

  const handleMarkerClick = (shop:Shop) => {
    setSelectedMarker(shop)
    const shopItem = document.getElementById(`shop-${shop.id}`)
    if (shopItem) {
      shopItem.scrollIntoView({behavior: 'smooth'})
    }
  }

  const handleShopClick = (shop:Shop) => {
    setSelectedShop(shop)
    const shopItem = document.getElementById(`shop-${shop.id}`)
    if (shopItem) {
      shopItem.scrollIntoView({behavior: 'smooth'})
    }
  }

  React.useEffect(() => {
    window.navigator.geolocation.watchPosition((position) => {
        setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
        setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
    })
  }, [])

  const observer = React.useRef<IntersectionObserver>()
  const lastShopElementRef = React.useCallback(node => {
    if (shopsLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      
      
      if (entries[0].isIntersecting && hasMore && !shopsLoading) {
        console.log(entries);
        setPage(prevPage => prevPage + 1)
      }
    }, {threshold: 1})
    if(node) observer.current.observe(node)
  }, [hasMore, shopsLoading])

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
        <>
          <h1>Shops</h1>
          {
            shops && shops.map( (shop:any, index: number) => {
              if (index === shops.length - 1) {
                return <ShopItem key={shop.id} shop={shop} ref={lastShopElementRef} onItemClick={handleShopClick} />
              } else {
                return <ShopItem key={shop.id} shop={shop} onItemClick={handleShopClick} ref={null} />
              }
            })
          }
          {hasMore && <Loading />}
        </>
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
        <Map shops={shops} selectedMarker={selectedMarker} onMarkerClick={handleMarkerClick} center={center}/>
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