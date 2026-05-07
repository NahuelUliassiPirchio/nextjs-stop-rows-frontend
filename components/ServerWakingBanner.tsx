import styles from '@styles/ServerWakingBanner.module.css';

export default function ServerWakingBanner() {
    return (
        <div className={styles.banner} role="status" aria-live="polite">
            <div className={styles.spinner} />
            <p className={styles.text}>
                <strong>Waking up the server...</strong>{' '}
                The service sleeps during inactive periods to optimize resources for the current traffic. Ready in a few seconds.
            </p>
        </div>
    );
}
