import { useCallback, useEffect, useMemo, useState } from "react";

import { Shop } from "types";
import styles from "@styles/OwnedShopItem.module.css";
import useAuthFetch from "@hooks/useAuthFetch";
import RowList from "./RowList";
import Cookies from "js-cookie";
import useFetch from "@hooks/useFetch";
import ShopForm from "./ShopForm";

export default function OwnedShopItem( {shop}:{shop:Shop}) {
    const [isFetching, setIsFetching] = useState(false);
    const [action, setAction] = useState('start');
    const [data, setData] = useState(null);
    const [error, setError] = useState<Error|null>(null);
    
    
    const [status, setStatus] = useState(shop.row ? 'active' : 'inactive')
    const [edit, setEdit] = useState(false);
    const {data: row, error: rowError, fetcher, loading: rowLoading} = useFetch(`http://localhost:3001/rows/${shop.row}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    

    //TODO: fix this
    useEffect(() => {
        if (shop.row) {
            fetcher();
            if (row) {
                setStatus(row.status);
            }
        }
    }, [shop.row, status])



    const token = Cookies.get('accessToken');

    const handleClick = async (newAction: string) => {
        setIsFetching(true);
        setAction(newAction);
        const method = newAction === 'start' ? 'POST' : (newAction === 'finish' ? 'DELETE' : 'PUT');
        try {
            const response = await fetch(`http://localhost:3001/shops/${shop.id}/rows/${newAction}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            // console.log(data);
            
            setData(data);
            setStatus(data.message);
        } catch (error: any) {
            setError(error);
        } finally {
            setIsFetching(false);
        }
    }

    return (
        <>
        {
            isFetching && <p>{action}ing...</p>
        }
        {
            error && <p>{error.message}</p>
        }
            <div className={styles.shopItem}>     
                <p className={
                    shop.row ? styles.active : styles.inactive
                }
                >·</p>
                <h3>{shop.name}</h3>
                <p>{shop.address}</p>
                {
                    shop.row ? (
                        !rowLoading && (
                        <>
                            {
                                status === 'open' ? (
                                    <button className={styles.stop} onClick={()=>handleClick('stop')}>Stop</button>
                                ) : (
                                    <button className={styles.start} onClick={()=>handleClick('resume')}>Resume</button>
                                )
                            }
                            <button className={styles.stop} onClick={()=>handleClick('finish')}>Finish</button>
                        </>
                        )
                    ) : (
                        <button className={styles.start} onClick={()=>handleClick('start')}>Start</button>
                    )
                }
                <button className={styles.edit} onClick={()=>setEdit(true)}>Edit</button>
                {
                    edit && <ShopForm shop={shop} setEdit={setEdit} />
                }
                
            </div>
            <div className={styles.row}>
                {
                    shop.row && <RowList rowId={shop.row} />
                }
            </div>
        </>
    )
}