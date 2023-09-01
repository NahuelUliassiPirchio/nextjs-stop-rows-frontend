import Image from "next/image";
import styles from '@styles/ShopsPage.module.css'

export default function ShopsPage() {
    return <main className={styles.main}>
        <Image src='https://www.clipartmax.com/png/full/265-2655834_work-in-progress-icon.png' alt="Working progress photo" width={300} height={300} priority/>
    </main>
}