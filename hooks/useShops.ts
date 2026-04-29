import { useEffect, useState } from "react"
import endpoints from "@common/endpoints"
import { Shop } from "@common/types"
import { parseResponse } from "@services/http"

const limit = 2

export default function useGetShops(page: number, location: {lat: number, lng: number}, all, category = ''){
    const [hasMore,setHasMore] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    const [data,setData] = useState<Array<Shop>>([])

    useEffect(()=> {
        setLoading(true)
        setError('')
        if (page === 1) setData([])

        const controller = new AbortController()
        const {signal} = controller

        const params = new URLSearchParams({
            limit: String(limit),
            page: String(page),
            status: 'open',
        })

        if (!all) {
            params.set('lat', String(location.lat))
            params.set('lng', String(location.lng))
        }

        if (category) {
            params.set('category', category)
        }

        fetch(`${endpoints.shops.getShops}?${params.toString()}`, {
            signal
        })
        .then(parseResponse)
        .then(jsonData => {
            if (jsonData.data.length < limit) setHasMore(false)
            else setHasMore(true)
            setData(prevData => {
                if (page === 1) return jsonData.data

                const uniqueProp = 'id'

                const mergedData = [...prevData, ...jsonData.data].reduce((acc, current) => {
                    if(!acc.some((item: Shop) => item[uniqueProp] === current[uniqueProp])) {
                        acc.push(current)
                    }
                    return acc
                }, [])

                return mergedData;
            })
            setLoading(false)
        })
        .catch(err => {
            if (err.name === 'AbortError') return
            setError(err.message)
            setLoading(false)
        })

        return () => {
            controller.abort()
        }
    },[all, category, location.lat, location.lng, page])

    return {loading, error, hasMore, data}
}