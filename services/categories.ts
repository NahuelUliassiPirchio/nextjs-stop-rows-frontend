import endpoints from "@common/endpoints"
import { Category } from "@common/types"
import { parseResponse } from "./http"

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
    const res = await fetch(endpoints.categories.getCategories, { signal })
    return await parseResponse<Category[]>(res)
}
