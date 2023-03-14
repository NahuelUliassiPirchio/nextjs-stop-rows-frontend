import Image from 'next/image'
import { Shop } from '@common/types'
import RowList from './RowList'
import styles from '@styles/ShopContainer.module.css'

export default function ShopContainer({shop}: {shop: Shop}) {
  
  return (
    <section className={styles.container}>
      <div className={styles.shop}>
        <Image className={styles.shopImage} src={shop.logo} alt={shop.name} width={150} height={150} />
        <div className={styles.shopInfo}>
          <h2>Shop Info:</h2>
          <h1>{shop.name}</h1>
          <p>{shop.address}</p>
          <p>{shop.description}</p>
          <p>{shop.email}</p>
          <p>{shop.phone}</p>
          <p>{shop.website}</p>
        </div>
      </div>
      <div className={styles.shopRow}>
        <h2>Row</h2>
        <RowList rowId={shop.row} />
      </div>
    </section>
  )
}