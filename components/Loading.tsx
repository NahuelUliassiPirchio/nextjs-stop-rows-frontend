import styles from '@styles/Loading.module.css'

type LoadingProps = {
  title?: string
  message?: string
  fullScreen?: boolean
}

export default function Loading({
  title = 'Loading',
  message = 'Please wait a moment.',
  fullScreen = false,
}: LoadingProps) {
    const loadingClassName = fullScreen
      ? `${styles.loading} ${styles.fullScreen}`
      : styles.loading

    return (
      <div className={loadingClassName} role="status" aria-live="polite">
        <div className={styles.card}>
          <div className={styles.loader} aria-hidden="true"></div>
          <div className={styles.copy}>
            <p className={styles.title}>{title}</p>
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </div>
      </div>
    )
}