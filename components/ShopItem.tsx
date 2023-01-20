import Image from 'next/image';
import React from 'react';
import styles from '../styles/ShopItem.module.css'

export default function ShopItem( {shop} ) {
  return (
    <div className={styles.shopContainer}>
      <Image src={shop.logo} alt={shop.name} width={100} height={100} />
      <h2>{shop.name}</h2>
      <p>{shop.address}</p>
    </div>
  )
}
