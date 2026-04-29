import { useEffect, useState } from 'react';
import Image from 'next/image';

import { Row } from '@common/types';
import useFetch from '@hooks/useFetch';
import styles from '@styles/RowList.module.css'
import RowListLoadingSkeleton from './LoadingSkeletons/RowListLoadingSkeleton';
import { getRow, updateRow } from '@services/rows';

export default function RowList({rowId, displayIfNull, owner}: {rowId: string, displayIfNull?: boolean, owner?: boolean}){
    const [row, setRow] = useState<Row>();
    const {data, error, loading, fetcher: fetchRows} = useFetch({
      fetchData: () => getRow(rowId)})

    useEffect(() => {
        fetchRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (data) {
            setRow(data)
        }
    }, [data])

    const deleteHandler = (id: string) => {
      if (!row) return;
      updateRow({
        row: {
          ...row,
          customers: row?.customers.filter(item => item.user.id !== id)
        }
      })
      .then(resData => {
        console.log(resData)
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
          <div className={styles.rowHeader}>
            <div className={styles.rowStatus}>
              <span>Row status</span>
              <strong className={ row?.status === 'open' ? styles.openRow : styles.closedRow}>{row ? row.status : 'closed'}</strong>
            </div>
            <button type="button" className={styles.refreshButton} onClick={() => fetchRows()}>
              <Image src="/refresh.svg" alt="" width={20} height={20} />
              Refresh
            </button>
          </div>
          <div className={styles.rowCustomers}>
            {  
            row?.customers?.length ? (
              row.customers.map( (item, index) => (
                <div key={index} className={`${styles.rowItem} ${index === 0 ? styles.firstRowItem : ''}`}>
                  <p>{index + 1}°</p>
                  <p className={styles.customerName}>{item.user.name}</p>
                  {owner && <button type="button" className={styles.deleteButton} onClick={()=>deleteHandler(item.user.id)} aria-label={`Remove ${item.user.name} from row`}>X</button>}
                </div>
              ))
            ) : (
              !displayIfNull && 
              (<div className={styles.rowEmpty}>
                <p>No customers in this row</p>
              </div>)
            )}
          </div>
      </div>
    )
}