import Image from 'next/image';
import React from 'react';
import styles from '@styles/ShopItem.module.css'
import { Shop } from '@common/types';
import Link from 'next/link';
import Cookies from 'js-cookie';
import useAuth from '@hooks/useAuth';
import Router from 'next/router';
import endpoints from '@common/endpoints';

const ShopItem = ({shop, onItemClick}, ref) => {

  const [data, setData] = React.useState<any>(null)
  const {user} = useAuth()
  
  const joinHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!user) return Router.push('/login')
    const token = Cookies.get('accessToken')

    const response = await fetch(endpoints.rows.join(shop.row), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if (!response.ok) {
      console.log(response);
      alert('Something went wrong')
    }
    const data = await response.json()
    setData(data)

    Router.reload()
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
