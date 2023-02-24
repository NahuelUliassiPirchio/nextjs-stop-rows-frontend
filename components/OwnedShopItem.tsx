import { useEffect, useState } from "react";

import { Shop, Row } from "types";
import RowList from "./RowList";
import Cookies from "js-cookie";
import useFetch from "@hooks/useFetch";
import ShopForm from "./ShopForm";
import styles from "@styles/OwnedShopItem.module.css";

export default function OwnedShopItem( {shop}:{shop:Shop}) {
    const [isFetching, setIsFetching] = useState(false);
    const [action, setAction] = useState('start');
    const [row, setRow] = useState<Row | null>(null);
    const [error, setError] = useState<Error|null>(null);
    
    const [edit, setEdit] = useState(false);
    const {data: initialRow, error: rowError, fetcher, loading: rowLoading} = useFetch(`http://localhost:3001/rows/${shop.row}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    
    useEffect(() => {
        if (shop.row) {
            fetcher();
            if (initialRow && !rowLoading) {
                setRow(initialRow);
            }
        }
    }, [])



    const token = Cookies.get('accessToken');

    const handleClick = async (newAction: string) => {
        setIsFetching(true);
        setAction(newAction);

        let method = 'PUT'
        if (newAction === 'finish') {
            method = 'DELETE';
        } else if (newAction === 'start') {
            method = 'POST';
        }

        try {
            const response = await fetch(`http://localhost:3001/shops/${shop.id}/rows/${newAction}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if(!response.ok) {
                throw new Error('Something went wrong');
            }
            const data = await response.json();
            if (newAction === 'finish') {
                setRow(null);
            } else setRow(data);
                
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
            <li className={styles.shopItem}>     
                
                <div className={styles.leftContainer}>
                    <p className={
                        shop.row ? styles.active : styles.inactive
                    }
                    >·</p>
                    <h3>{shop.name}</h3>
                    <p>{shop.address}</p>
                    {
                        !rowLoading && (
                            row && (
                                <p>{row.status}</p>
                            )
                        )
                    }
                </div>
                
                <div className={styles.rightContainer}>
                    {
                        row ? (
                            !rowLoading && (
                            <>
                                {
                                    row.status === 'open' ? (
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
                
            </li>
            <div className={styles.row}>
                {
                    shop.row && <RowList rowId={shop.row} />
                }
            </div>
        </>
    )
}