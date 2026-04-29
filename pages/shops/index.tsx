import { useCallback, useRef, useState } from "react";
import Head from "next/head";

import { Shop } from "@common/types";
import Navbar from "@components/Navbar";
import ShopContainer from "@components/ShopContainer";
import ShopItem from "@components/ShopItem";
import ShopItemLoadingSkeleton from "@components/LoadingSkeletons/ShopItem.LoadingSkeleton";
import useGetShops from "@hooks/useShops";
import styles from '@styles/ShopsPage.module.css'

export default function ShopsPage() {
    const [page, setPage] = useState(1)
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
    const location = {lat: -34.609607, lng: -58.388660}
    const {loading, error, data: shops, hasMore} = useGetShops(page, location, true)

    const observer = useRef<IntersectionObserver>()
    const lastShopElementRef = useCallback((node: Element) => {
        if (loading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prevPage => prevPage + 1)
            }
        }, {threshold: 1})

        if(node) observer.current.observe(node)
    }, [hasMore, loading])

    return (
        <>
            <Head>
                <title>Shops | Stop Rows</title>
            </Head>
            <Navbar />
            <main className={styles.main}>
                <section className={styles.listPanel}>
                    <div className={styles.header}>
                        <div>
                            <p className={styles.eyebrow}>Open stores</p>
                            <h1>Shops</h1>
                            <p className={styles.description}>Find a store, check its page, or join the active row.</p>
                        </div>
                    </div>

                    {error && <h2 className={styles.message}>Error loading shops</h2>}

                    <ul className={styles.shopsList}>
                        {shops.map((shop, index) =>
                            <ShopItem
                                key={shop.id}
                                shop={shop}
                                ref={(index === shops.length - 1) ? lastShopElementRef : null}
                                onItemClick={setSelectedShop}
                            />
                        )}
                    </ul>

                    {hasMore && <ShopItemLoadingSkeleton/>}
                    {(!loading && !hasMore && shops.length === 0 && !error) && (
                        <h2 className={styles.message}>No stores found</h2>
                    )}
                </section>

                <aside className={styles.detailPanel}>
                    {selectedShop ? (
                        <>
                            <button
                                type="button"
                                className={styles.closeButton}
                                onClick={() => setSelectedShop(null)}
                            >
                                Back to list
                            </button>
                            <ShopContainer shop={selectedShop} />
                        </>
                    ) : (
                        <div className={styles.emptyDetail}>
                            <p className={styles.eyebrow}>Store details</p>
                            <h2>Select a shop</h2>
                            <p>Choose one from the list to preview its information here.</p>
                        </div>
                    )}
                </aside>
            </main>
        </>
    )
}