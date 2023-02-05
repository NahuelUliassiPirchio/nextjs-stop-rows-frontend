import React from 'react';
import { Shop } from '../types';

import useAuth from '@hooks/useAuth';
import Menu from './Menu';
import styles from '@styles/OwnersMain.module.css'
import OwnedShopItem from './OwnedShopItem';
import Link from 'next/link';

export default function OwnersMain() {
    const { user, loading } = useAuth()

    if (loading) return <div>Loading...</div>

    const shops = user.shops
    return (
        <div className={styles.container}>
            <Menu name={user.name} />
            <div className={styles.main}>
                <div className={styles.shops}>
                    <h2>Your shops</h2>
                    <Link href='/new-shop'>+</Link>
                    <ul>
                        {shops.map((shop: Shop) => (
                            <OwnedShopItem key={shop.id} shop={shop} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}