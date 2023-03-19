import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Shop } from '@common/types';
import useAuth from '@hooks/useAuth';
import Menu from './Menu';
import OwnedShopItem from './OwnedShopItem';
import Loading from './Loading';
import styles from '@styles/OwnersMain.module.css'

export default function OwnersMain() {
    const { user, loading } = useAuth()

    if (loading) return <Loading/>

    const shops = user.shops
    return (
        <>
            <Head>
                <title>Your Shops</title>
            </Head>
            <main className={styles.container}>
                <Menu name={user.name} />
                <div className={styles.main}>
                    <ul className={styles.shops}>
                        <h2 className={styles.title}>Your shops</h2>
                        <Link href='/new-shop' className={styles.newShop}>+</Link>
                        <ul>
                            {shops.map((shop: Shop) => (
                                <OwnedShopItem key={shop.id} shop={shop} />
                            ))}
                        </ul>
                    </ul>
                </div>
            </main>
        </>
    )
}