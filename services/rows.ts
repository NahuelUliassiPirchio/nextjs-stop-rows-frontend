/**
 * join
 * leaveRow
 * getRow
 */
import endpoints from "@common/endpoints";
import { Row } from "@common/types";
import Cookies from "js-cookie";

export async function leaveRow(rowId: string) {
    const token = Cookies.get('accessToken')
    const response = await fetch(endpoints.rows.leave(rowId), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    })
    return response.json()
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
    if (!response.ok) {
      throw new Error('Something went wrong')
    }
    return response.json()
}

export async function getRow(rowId:string) {
  return await fetch(endpoints.rows.get(rowId), {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  })
  .then(res=> res.json())
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
  .then(res => res.json())
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
  }).then(res=>{
    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    return res.json();
  })
  
}