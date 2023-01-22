import Map from './Map'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
import ShopItem from './ShopItem';
import { Shop } from '../types';

import styles from '../styles/CustomersMain.module.css'

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

function CustomersMain(  ) {
  const [shops, setShops] = React.useState<Shop[]>([])
  const [markers, setMarkers] = React.useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = React.useState<Shop | null>(null)

  React.useEffect(() => {
    fetch('http://localhost:3001/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data)
        console.log(data);
        
        const markers = data.map( (shop:Shop) => ({
          id: shop.id,
          name: shop.name,
          address: shop.address,
          location: shop.location
        }))
        setMarkers(markers)
      })

  }, [])

  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <h1>Shops</h1>
        {
          shops && shops.map( (shop:any) => (
            <ShopItem key={shop.id} shop={shop} />
          ))
        }
      </aside>
      <main>
        <Map markers={markers}/>
      </main>
    </div>
  )
}

export default CustomersMain