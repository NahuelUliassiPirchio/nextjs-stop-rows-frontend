import ShopForm from "@components/ShopForm"
import useAuthGuard from "@hooks/useAuthGuard"
import Head from "next/head"

export default function NewShop() {
    useAuthGuard('/login', 'owner')
    
    return (
        <>
            <Head>
                <title>New Shop</title>
            </Head>
            <ShopForm />
        </>
    )
}