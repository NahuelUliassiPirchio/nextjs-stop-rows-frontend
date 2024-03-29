import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

import StopRowsLogo from '@public/images/StopRowsLogo.svg'
import LandingBG from '@public/images/LandingBG.png'
import styles from '@styles/Landing.module.css'

export default function LandingPage() {
    return(
    <>
        <Head>
            <title>Stop Rows</title>
        </Head>
        <header className={styles.header}>
            <Image className={styles.logo} src={StopRowsLogo} alt="Stop Rows' logo" width={90} height={90} />
            <ul className={styles.linksContainer}>
                <li>
                    <Link href='/app'>App</Link>
                </li>
                <li><Link href='/shops'>Shops</Link></li>
                <li><Link href='/#about'>About</Link></li>
            </ul>
            <Link className={styles.signInButton} href="/login">Sign in</Link>
        </header>
        <main className={styles.main}>
            <div className={styles.infoContainer}>
                <h1>Use your time more efficiently and enjoy your life</h1>
                <h3>With our app you can take lines remotely and save your valuable time for the things you love to do.</h3>
                <Link className={styles.appLink} href='/app'>
                    {'Check stores near you >'}
                </Link>
                <p>
                    <b>If you&apos;re a customer</b>, you can create your account and explore your favorite businesses on the map.<br/><br/>
                    <b>If you&apos;re a store owner</b>, sign up as an owner and register your store on our application. You&apos;ll have the flexibility to set your hours and manage your customers, opening and closing your store as needed.
                </p>
            </div>
            <figure className={styles.imageContainer}>
                <Image className={styles.heroImage} src={LandingBG} alt="Background" width={400} height={300}/>
            </figure>
            
        </main>
        <footer id="about" className={styles.footer}>
                <h4>Stop Rows</h4>
                <p>I had this idea when in high school a teacher asked me to do a project and, at that time, I spent large amounts of time sitting in line at the bank. The possible solution that came to me was to make a remote queue system. This is not a real application, it was made for learning purposes.</p>
            <ul className={styles.socialMediaContainer}>
                <li><Link href='uliassipirchio@gmail.com' target="_blank">Gmail</Link></li>
                <li><Link href='https://linkedin.com/in/uliassipirchio' target="_blank">LinkedIn</Link></li>
                <li><Link href='https://github.com/nahueluliassipirchio' target="_blank">GitHub</Link></li>
            </ul>
            <p>Copyright ©2023</p>
        </footer>
    </>
    )
}