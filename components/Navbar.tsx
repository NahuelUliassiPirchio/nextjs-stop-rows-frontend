import Image from "next/image";
import Link from "next/link";

import StopRowsLogo from '@public/images/StopRowsLogo.svg'
import styles from '@styles/Landing.module.css'

export default function Navbar() {
    return (
        <header className={styles.header}>
            <Link href="/" aria-label="Stop Rows home">
                <Image className={styles.logo} src={StopRowsLogo} alt="Stop Rows' logo" width={90} height={90} />
            </Link>
            <ul className={styles.linksContainer}>
                <li>
                    <Link href='/app'>App</Link>
                </li>
                <li><Link href='/shops'>Shops</Link></li>
                <li><Link href='/#about'>About</Link></li>
            </ul>
            <Link className={styles.signInButton} href="/login">Sign in</Link>
        </header>
    )
}
