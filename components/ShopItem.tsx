import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import Router from 'next/router';

import useAuth from '@hooks/useAuth';
import styles from '@styles/ShopItem.module.css'
import { joinRow } from '@services/rows';

function ShopItem({shop, onItemClick}, ref) {
  const [data, setData] = React.useState<any>(null)
  const {user} = useAuth()
  
  const joinHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!user) return Router.push('/login')
    joinRow(shop.row)
    .then(data=>{
      setData(data)
      Router.reload()
    })
    .catch(err=> alert(err.message))
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onItemClick(shop)
    }
  }

  return (
    <li
      id={`shop-${shop.id}`}
      className={styles.shopContainer}
      onClick={()=> onItemClick(shop)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      ref={ref}
    >
      <Image src={shop.logo} alt={shop.name} width={100} height={100} unoptimized />
      <div className={styles.infoContainer}>
        <h2>{shop.name}</h2>
        <p>{shop.address}</p>
        {
          data && data.error && <p>{data.error}</p>
        }
        <div className={styles.buttonContainer}>
          <Link href={`/shops/${shop.id}`} className={styles.viewButton} onClick={(event) => event.stopPropagation()}>View page</Link>
          <button type="button" className={styles.joinButton} onClick={joinHandler}>Join row</button>
        </div>
      </div>
    </li>
  )
}

export default React.forwardRef(ShopItem)
