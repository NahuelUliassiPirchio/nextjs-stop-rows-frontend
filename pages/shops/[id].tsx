// get id from url, fetch shop data from api, pass shop data to ShopItem component

import { Shop } from "../../types"
import ShopContainer from "../../components/ShopContainer"

export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:3001/shops/${context.params.id}`)
    const shop = await res.json()
    
    return {
        props: {
         shop
        }
    }
    }

export default function ShopPage({shop}: {shop: Shop}) {
    return (
        <ShopContainer shop={shop} />
    )
}