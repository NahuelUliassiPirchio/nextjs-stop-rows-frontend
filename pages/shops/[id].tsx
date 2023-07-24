import Head from "next/head"
import { Shop } from "@common/types"
import ShopContainer from "@components/ShopContainer"
import { getShop } from "services/shops";

export async function getServerSideProps(context) {
    let shop: Shop | null = null;
    try {
        shop = await getShop(context.params.id)
    } catch (error) {
        console.log(error)
    }
    
    return {
        props: {
         shop
        }
    }
}

export default function ShopPage({shop}: {shop: Shop}) {
    if (!shop) {
        return <h1 style={
            {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }
        }>Shop not found</h1>
    }
    return (
        <>
            <Head>
                <title>{shop.name}</title>
            </Head>
            <ShopContainer shop={shop} />
        </>
    )
}