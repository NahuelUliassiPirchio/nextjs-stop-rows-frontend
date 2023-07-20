import Image from 'next/image'
import { Shop } from '@common/types'
import RowList from './RowList'
import styles from '@styles/ShopContainer.module.css'

export default function ShopContainer({shop}: {shop: Shop}) {
  
  return (
    <section className={styles.container}>
      <div className={styles.shop}>
        <Image className={styles.shopImage} src={shop.logo} alt={shop.name} width={200} height={200} />
        <div className={styles.shopInfo}>
          <h1>{shop.name}</h1>
          <p className={styles.description}>{shop.description}</p>

          <ul>
            <li><Image src='/icons/location-pin.svg'width={20} height={20} alt='location'/><p>{shop.address}</p></li>
            <li><Image src='/icons/email.svg'width={20} height={20} alt='email'/><p>{shop.email}</p></li>
            <li><Image src='/icons/phone.svg'width={20} height={20} alt='phone'/><p>{shop.phone}</p></li>
            <li><Image src='/icons/www.svg'width={20} height={20} alt='website'/><p>{shop.website}</p></li>
          </ul>
        </div>
      </div>
      <div className={styles.shopRow}>
        <h2>Row</h2>
        <RowList rowId={shop.row} />
      </div>
    </section>
  )
}