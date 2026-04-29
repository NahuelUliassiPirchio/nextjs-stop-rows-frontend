/**
 * apply action?
 * put/post
 * get shop
 */

import endpoints from "@common/endpoints"
import { NewShop, Shop } from "@common/types"
import Cookies from "js-cookie"
import { parseResponse } from "./http"

export async function  getShop(id: string){
    const res = await fetch(endpoints.shops.get(id))
    return await parseResponse(res)
}

type InsertShop = {
    method: 'PUT'
    shop: NewShop
} | {
    method: 'POST'
    shop: NewShop
}

export async function insertShop({method, shop}: InsertShop) {
    const accessToken = Cookies.get('accessToken')

    const {
        email, name, description, phone, website, address, logo, coords
    } = shop

    let shopURL = endpoints.shops.getShops
    if(method === 'PUT') shopURL += `/${shop.id}`
    return await fetch(shopURL, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`                
        },
        body: JSON.stringify({
            email,
            name,
            description,
            coords: [coords[0], coords[1]],
            phone,
            website,
            address,
            logo
        })
    })
    .then(parseResponse)
}