/**
 * join
 * leaveRow
 * getRow
 */
import endpoints from "@common/endpoints";
import { Row } from "@common/types";
import Cookies from "js-cookie";
import { parseResponse } from "./http";

export async function leaveRow(rowId: string) {
    const token = Cookies.get('accessToken')
    const response = await fetch(endpoints.rows.leave(rowId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    return parseResponse(response)
}

export async function joinRow(rowId:string) {
    const token = Cookies.get('accessToken')

    const response = await fetch(endpoints.rows.join(rowId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    return parseResponse(response)
}

export async function getRow(rowId:string) {
  return await fetch(endpoints.rows.get(rowId), {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  })
  .then(parseResponse)
}
type EditRow = {
  row : Row
}
export async function updateRow({row}: EditRow) {
  const token = Cookies.get('accessToken');
  const {customers, status} = row

  return await fetch(endpoints.shops.put(row.shop.id.toString()), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      customers,
      status
    })
  })
  .then(parseResponse)
}

export async function applyRowActions({shopId, action}:{action:string, shopId: string}) {
  const token = Cookies.get('accessToken');

  let method: 'PUT' | 'DELETE' | 'POST' = 'PUT';
      if (action === 'finish') {
        method = 'DELETE';
      } else if (action === 'start') {
        method = 'POST';
      }
  return await fetch(endpoints.shops.applyAction(shopId, action), {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).then(parseResponse)
  
}