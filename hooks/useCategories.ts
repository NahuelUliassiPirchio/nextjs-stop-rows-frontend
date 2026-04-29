import { useEffect, useState } from "react"
import { Category } from "@common/types"
import { getCategories } from "@services/categories"

export default function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()

        setLoading(true)
        setError('')

        getCategories(controller.signal)
            .then(setCategories)
            .catch(err => {
                if (err.name === 'AbortError') return
                setError(err.message)
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false)
            })

        return () => {
            controller.abort()
        }
    }, [])

    return { categories, error, loading }
}
