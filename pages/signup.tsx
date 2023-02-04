import SignUpForm from "@components/SignUpForm";
import Link from "next/link";
import styles from "@styles/Home.module.css";

export default function SignUpPage() {
    return (
        <div className={styles.container}>
            <h1>Sign Up</h1>
            <SignUpForm />
            <p>Already have an account? <Link href='/login'>Log in</Link></p>
        </div>
    )
}