import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import Router from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Map from './Map'

import { Shop } from '@common/types';
import ShopItem from './ShopItem';

import useAuth from '@hooks/useAuth';
import Menu from './Menu';
import useGetShops from '@hooks/useShops';
import RowList from './RowList';
import Loading from './Loading';
import endpoints from '@common/endpoints';
import Advertisement from './Advertisement';
import styles from '@styles/CustomersMain.module.css'
import ShopItemLoadingSkeleton from './LoadingSkeletons/ShopItem.LoadingSkeleton';

export default function CustomersMain() {
  const { user, loading } = useAuth()

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<Shop | null>(null)

  const initialLocation = {lat: -34.609607, lng: -58.388660}
  const [isLoaded, setIsLoaded] = useState(false)
  const [center, setCenter] = useState(initialLocation)
  const [location, setLocation] = useState(initialLocation)

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  
  const allParam = Router.query.all
  const [page, setPage] = useState(1)
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

  useEffect(() => {
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

  const observer = useRef<IntersectionObserver>()
  const lastShopElementRef = useCallback((node: Element) => {
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
        <aside className={`${styles.aside} ${bottomSheetOpen && styles.open}`}>
          <button className={styles.toggleBottomSheetButton} onClick={() => setBottomSheetOpen(!bottomSheetOpen)}>
            <Image src="/icons/collapse-arrow.svg" alt={`${bottomSheetOpen ? 'Open' : 'Close'} bottom sheet`} width={30} height={30} />
          </button>
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
          {hasMore && <ShopItemLoadingSkeleton/>}
          {(!hasMore && shops.length===0 && !error) && (
            <>
              <h2 className={styles.message}>No stores found in your area</h2>
              <u><Link className={styles.message} href="/?all=true"> Find all stores </Link></u>
            </>
          )}
        </aside>
        <main className={styles.main}>
          {
            loading ? <Loading/> : (
                user ? (
                  <Menu name={user.name}/>
                ) : (
                  <Link className={styles.signUp} href="/login"> Sign in </Link>
                )
            )
          }
          <div className={styles.mapContainer}>
            <Map shops={shops} onMarkerClick={handleMarkerClick} center={center} setIsLoaded={setIsLoaded}/>
          </div>
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