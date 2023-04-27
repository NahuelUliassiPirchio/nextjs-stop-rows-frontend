import styles from "@styles/LoadingSkeleton.module.css";

export default function OwnedShopItemLoadingSkeleton({key}: {key: number}) {
    return (
        <div className={styles.container} key={key}>
            <li className={styles.shopItem}>     
                <div className={styles.leftContainer}>
                    <h3 className={styles.skeleton}></h3>
                    <p className={styles.skeleton}></p>
                </div>
                
                <div className={styles.rightContainer}>
                    <div className={`${styles.button} ${styles.skeleton}`}></div>
                    <div className={`${styles.button} ${styles.skeleton}`}></div>
                </div>
                
            </li>
        </div>
    )
}