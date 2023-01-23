import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from '@styles/ShopContainer.module.css'
import { Shop } from '../types'
import RowList from './RowList'

export default function ShopContainer({shop}: {shop: Shop}) {
  
  return (
    <div className={styles.container}>
      <div className={styles.shop}>
        <div className={styles.shopImage}>
          <Image src={shop.logo} alt={shop.name} width={200} height={200} />
        </div>
        <div className={styles.shopInfo}>
          <h1>{shop.name}</h1>
          <p>{shop.address}</p>
          <p>{shop.description}</p>
          <p>{shop.email}</p>
          <p>{shop.phone}</p>
          <p>{shop.website}</p>
        </div>
      </div>
        <div className={styles.shopRow}>
          <h2>Customers</h2>
          <RowList rowId={shop.row} />
        </div>
    </div>
  )
}