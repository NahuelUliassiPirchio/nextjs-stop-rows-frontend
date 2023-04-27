import styles from "@styles/LoadingSkeleton.module.css";

export default function ShopItemLoadingSkeleton() {
    return (
        <div className={styles.shopContainer}>
            <div className={`${styles.shopImage} ${styles.skeleton}`} />
            <h2 className={`${styles.skeleton}`}></h2>
            <p className={`${styles.skeleton}`}></p>
            <p className={`${styles.skeleton}`}></p>
            <div className={styles.buttons}>
            </div>
        </div>
    )
}