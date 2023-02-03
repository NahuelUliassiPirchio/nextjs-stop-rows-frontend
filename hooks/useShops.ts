import { useEffect, useState } from "react"
import { Shop } from "types"

const limit = 3

export default function useGetShops(page: number, location: {lat: number, lng: number}){
    const [hasMore,setHasMore] = useState(true)
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    const [data,setData] = useState<Array<Shop>>([])

    useEffect(()=> {
        setLoading(true)
        setError('')

        const controller = new AbortController()
        const signal = controller.signal

        fetch(`http://localhost:3001/shops?limit=${limit}&page=${page}&lng=${location.lng}&lat=${location.lat}`, {
            signal
        })
        .then(res=> {
            if (!res.ok) return setError(res.statusText)
            return res.json()
        })
        .then(jsonData => {
            if (jsonData.data.length < limit) setHasMore(false)
            setData(prevData => {
                return [...prevData, ...jsonData.data]
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
    },[page,location])

    return {loading, error, hasMore, data}
}