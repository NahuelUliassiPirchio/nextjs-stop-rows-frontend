import React, { useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Router from 'next/router';
import Head from 'next/head';

import { Shop } from '@common/types';
import ShopItem from './ShopItem';

import useAuth from '@hooks/useAuth';
import Map from './Map'
import Menu from './Menu';
import RowList from './RowList';
import useGetShops from '@hooks/useShops';
import Loading from './Loading';
import endpoints from '@common/endpoints';
import styles from '@styles/CustomersMain.module.css'
import Advertisement from './Advertisement';

export default function CustomersMain() {
  const { user, loading } = useAuth()

  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null)
  const [selectedMarker, setSelectedMarker] = React.useState<Shop | null>(null)

  const initialLocation = {lat: -34.609607, lng: -58.388660}
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [center, setCenter] = React.useState(initialLocation)
  const [location, setLocation] = React.useState(initialLocation)
  
  const allParam = Router.query.all
  const [page, setPage] = React.useState(1)
  const {loading: shopsLoading, error, data: shops, hasMore} = useGetShops(page, location, allParam)

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
    if(isLoaded){
      window.navigator.geolocation.getCurrentPosition((position) => {
          setCenter({lat: position.coords.latitude, lng: position.coords.longitude})
          setLocation({lat: position.coords.latitude, lng: position.coords.longitude})
      },
      (error) => {
        console.log(error)
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000})
    }
  }, [isLoaded])

  const observer = React.useRef<IntersectionObserver>()
  const lastShopElementRef = React.useCallback((node: Element) => {
    if (shopsLoading) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {      
      if (entries[0].isIntersecting && hasMore && !shopsLoading) {
        setPage(prevPage => prevPage + 1)
      }
    }, {threshold: 1})
    
    if(node) observer.current.observe(node)
  }, [hasMore, shopsLoading])

  const token = Cookies.get('accessToken')

  const leaveHandler = async () => {
    const response = await fetch(endpoints.rows.leave(user?.row), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    const data = await response.json()
    if (data.error) {
      return alert(data.error)
    }
    alert('You have left the row')
    Router.reload()
  }

  return (
    <>
      <Advertisement />
      <Head>
        <title>Stop Rows</title>
      </Head>
      <div className={styles.container}>
        <aside className={styles.aside}>
          <h1>Shops</h1>
          {
            error && <h2 className={styles.message}>Error loading shops</h2>
          }
          {
            shops && shops.map( (shop:any, index: number) => 
              <ShopItem key={shop.id} shop={shop} ref={
                (index === shops.length - 1) ? lastShopElementRef : null} onItemClick={handleShopClick} />
            )
          }
          {hasMore && <Loading />}
          {(!hasMore && shops.length===0 && !error) && (
            <>
              <h2 className={styles.message}>No stores found in your area</h2>
              <u><Link className={styles.message} href="/?all=true"> Find all stores </Link></u>
            </>
          )}
        </aside>
        <main>
          {
            loading ? <Loading/> : (
                user ? (
                  <Menu name={user.name}/>
                ) : (
                  <Link className={styles.signUp} href="/login"> Sign in </Link>
                )
            )
          }
          <Map shops={shops} onMarkerClick={handleMarkerClick} center={center} setIsLoaded={setIsLoaded}/>
          {
            loading ? <Loading/> : (
              user?.row && (
                <div className={styles.activeRowList}>
                  <RowList rowId={user.row} displayIfNull={false} />
                  <button className={styles.leaveButton} onClick={leaveHandler}>Leave row</button>
                </div>
              )
            )
          }
        </main>
      </div>
    </>
  )
}