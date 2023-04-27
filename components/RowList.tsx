import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';

import { Row } from '@common/types';
import endpoints from '@common/endpoints';
import useFetch from '@hooks/useFetch';
import styles from '@styles/RowList.module.css'
import RowListLoadingSkeleton from './LoadingSkeletons/RowListLoadingSkeleton';

export default function RowList({rowId, displayIfNull, owner}: {rowId: string, displayIfNull?: boolean, owner?: boolean}){

    const [row, setRow] = useState<Row>();
    const {data, error, loading, fetcher: fetchRows} = useFetch(endpoints.rows.get(rowId))

    useEffect(() => {
        fetchRows()
    }, [])

    useEffect(() => {
        if (data) {
            setRow(data)
        }
    }, [data])

    const deleteHandler = (id: string) => {
      if (!row) return;
      const token = Cookies.get('accessToken');
      fetch(endpoints.shops.put(row.shop.id.toString()), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customers: row?.customers.filter(item => item.user.id !== id)
        })
      })
      .then(res => {
          if (!res.ok) {
            throw new Error('Something went wrong')
          }
          return res.json()
        })
        .then(_ => {
          fetchRows()
        })
        .catch(err => {
          console.log(err)
        })
    }

    if (loading) return (
      <div className={styles.row}>
        {
          ...Array(3).fill(0).map((_, index) => (
            <RowListLoadingSkeleton key={index} owner={owner} />
          ))
        }
      </div>
      )
    if (error) return <p>{error}</p>
    return (
        <div className={styles.row}>
          {displayIfNull && <h2>{row?.shop?.name}</h2>}
          <button className={styles.refreshButton} onClick={() => fetchRows()}>
            <Image src="/refresh.svg" alt="refresh" width={20} height={20} />
            Refresh
          </button>
          <h3>Row Status: <p className={ row?.status === 'open' ? styles.openRow : styles.closedRow}>{row ? row.status : 'closed'}</p></h3>
          {  
          row?.customers?.length ? (
            row.customers.map( (item, index) => (
              <div key={index} className={styles.rowItem}>
                <p>{index + 1}°</p>
                <p className={styles.customerName}>{item.user.name}</p>
                {owner && <button className={styles.deleteButton} onClick={()=>deleteHandler(item.user.id)}>X</button>}
              </div>
            ))
          ) : (
            !displayIfNull && 
            (<div className={styles.row}>
              <p>No customers in this row</p>
            </div>)
          )}
      </div>
    )
}