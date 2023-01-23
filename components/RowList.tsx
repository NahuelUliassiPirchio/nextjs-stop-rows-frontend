import { useEffect, useState } from 'react';
import styles from '@styles/RowList.module.css'
import { Row } from '../types';

export default function RowList({rowId}: {rowId: string}){
    const [row, setRow] = useState<Row>();

    useEffect(() => {
        fetch(`http://localhost:3001/rows/${rowId}`)
            .then(res => res.json())
            .then(data => {
              console.log(data);
              
              return setRow(data)
            })
    }
    , [rowId])

    return (
        <div className={styles.row}>
          {  
          row?.customers ? (
            row.customers.map( (item, index) => (
              <div key={index} className={styles.rowItem}>
                <p>{index}</p>
                <p className={styles.customerName}>{item.user.name}</p>
              </div>
            ))
          ) : (
            <div className={styles.row}>
              <p>No customers in this row</p>
            </div>
          )}
      </div>
    )
}