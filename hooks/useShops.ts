import { useEffect, useState } from "react"
import endpoints from "@common/endpoints"
import { Shop } from "@common/types"

const limit = 2

export default function useGetShops(page: number, location: {lat: number, lng: number}, all){
    const [hasMore,setHasMore] = useState(false)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    const [data,setData] = useState<Array<Shop>>([])

    useEffect(()=> {
        setLoading(true)
        setError('')

        const controller = new AbortController()
        const {signal} = controller

        const query = all ? `?limit=${limit}&page=${page}&status=open` : `?limit=${limit}&page=${page}&status=open&lat=${location.lat}&lng=${location.lng}`
        fetch(endpoints.shops.getShops + query, {
            signal
        })
        .then(res=> {
            if (!res.ok) throw Error(res.statusText)
            return res.json()
        })
        .then(jsonData => {
            if (jsonData.data.length < limit) setHasMore(false)
            else setHasMore(true)
            setData(prevData => {
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
    },[all, location.lat, location.lng, page])

    return {loading, error, hasMore, data}
}