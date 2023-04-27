import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

import { Shop } from '@common/types';
import useAuth from '@hooks/useAuth';
import Menu from './Menu';
import OwnedShopItem from './OwnedShopItem';
import OwnedShopItemLoadingSkeleton from './LoadingSkeletons/OwnedShopItemLoadingSkeleton';

import styles from '@styles/OwnersMain.module.css'

export default function OwnersMain() {
    const { user, loading } = useAuth()

    let skeletonItems = Array(6).fill(0).map((_, index) => (
        <OwnedShopItemLoadingSkeleton key={index} />
    ))

    return (
        <>
            <Head>
                <title>Your Shops</title>
            </Head>
            <main className={styles.container}>
                { !loading && <Menu name={user.name} />}
                <div className={styles.main}>
                    <ul className={styles.shops}>
                        <h1 className={styles.title}>Your shops</h1>
                        <Link href='/new-shop' className={styles.newShop}>+</Link>
                        <ul>
                            {loading ? (
                                skeletonItems
                            ) : (
                                user.shops.map((shop: Shop) => (
                                    <OwnedShopItem key={shop.id} shop={shop} />
                                ))
                            )}
                        </ul>
                    </ul>
                </div>
            </main>
        </>
    )
}