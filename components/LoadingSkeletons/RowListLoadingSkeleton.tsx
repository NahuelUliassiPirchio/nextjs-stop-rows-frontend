import styles from "@styles/LoadingSkeleton.module.css";

export default function RowListLoadingSkeleton({owner}: {owner?: boolean}) {
    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <p className={styles.skeleton}></p>
                <h3 className={styles.skeleton}></h3>
                {owner && <p className={styles.skeleton}></p>}
            </div>
        </div>
    )
}