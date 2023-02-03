import Image from 'next/image';
import React from 'react';
import styles from '@styles/ShopItem.module.css'
import { Shop } from 'types';
import Link from 'next/link';
import Cookies from 'js-cookie';
import useAuth from '@hooks/useAuth';

const ShopItem = ({shop, onItemClick}, ref) => {

  const [data, setData] = React.useState<any>(null)
  const token = Cookies.get('access_token')
  const {user} = useAuth()

  const joinHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    const response = await fetch(`http://localhost:3001/rows/${shop.row}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({userId: user?.id})
    })
    const data = await response.json()
    setData(data)
    if (data.error) {
      alert(data.error)
    }
    
  }

  return (
    <div id={`shop-${shop.id}`} className={styles.shopContainer} onClick={()=> onItemClick(shop)} ref={ref}>
      <Image src={shop.logo} alt={shop.name} width={100} height={100} />
      <h2>{shop.name}</h2>
      <p>{shop.address}</p>
      {
        data && data.error && <p>{data.error}</p>
      }
      <div className={styles.buttonContainer}>
        <Link href={`/shops/${shop.id}`} className={styles.viewButton}>View page</Link>
        <button className={styles.joinButton} onClick={joinHandler}>Join</button>
      </div>
    </div>
  )
}

export default React.forwardRef(ShopItem)
