import SignUpForm from "@components/SignUpForm";
import Link from "next/link";
import styles from "@styles/Home.module.css";
import Head from "next/head";

export default function SignUpPage() {
    return (
        <>
            <Head>
                <title>Sign Up</title>
            </Head>
            <main className={styles.container}>
                <h1>Sign Up</h1>
                <SignUpForm />
                <p>Already have an account? <Link href='/login'>Log in</Link></p>
            </main>
        </>
    )
}