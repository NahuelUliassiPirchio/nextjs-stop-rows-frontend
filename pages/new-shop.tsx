import ShopForm from "@components/ShopForm"
import useAuthGuard from "@hooks/useAuthGuard"
import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import backArrow from "public/icons/back-arrow.svg"

export default function NewShop() {
    useAuthGuard('/login', 'owner')
    
    return (
        <>
            <Head>
                <title>New Shop</title>
            </Head>
            <Link href={'/app'}>
                <Image src={backArrow} alt="back arrow" />
            </Link>
            <ShopForm />
        </>
    )
}