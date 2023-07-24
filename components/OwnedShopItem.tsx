import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";

import { Shop, Row } from "@common/types";
import RowList from "./RowList";
import useFetch from "@hooks/useFetch";
import endpoints from "@common/endpoints";
import ShopForm from "./ShopForm";
import styles from "@styles/OwnedShopItem.module.css";
import { applyRowActions, getRow } from "@services/rows";

export default function OwnedShopItem({ shop }: { shop: Shop }) {
    const [isFetching, setIsFetching] = useState(false);
    const [currentAction, setCurrentAction] = useState<'start' | 'stop' | 'resume' | 'finish'>('start');
    const [row, setRow] = useState<Row | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isEditing, setIsEditing] = useState(false);
  
    const { data: initialRow, error: rowError, fetcher, loading: rowLoading } = useFetch({
      fetchData: () => getRow(shop.row),
    });
  
    useEffect(() => {
      if (shop.row) {
        fetcher();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shop.row]);
  
    useEffect(() => {
      if (initialRow && !rowLoading) {
        setRow(initialRow);
      }
    }, [initialRow, rowLoading]);
    
    const handleAction = async (newAction: 'start' | 'stop' | 'resume' | 'finish') => {
      setIsFetching(true);
      setCurrentAction(newAction);
  
      applyRowActions({
        shopId: shop.id,
        action: newAction
      })
      .then(data => {
          if (newAction === 'finish') {
            setRow(null);
          } else {
            setRow(data);
          }
      })
      .catch(error=> setError(error))
      .finally(()=>setIsFetching(false))
    };
  
    return (
      <div className={styles.container}>
        {isFetching && <p>{currentAction}ing...</p>}
        {error && <p>{error.message}</p>}
        <li className={styles.shopItem}>
          <div className={styles.leftContainer}>
            <h2
              className={`${styles.status} ${row ? styles.active : styles.inactive}`}
            >
              ·
            </h2>
            <h3>{shop.name}</h3>
            <p>{shop.address}</p>
          </div>
  
          <div className={styles.rightContainer}>
            {row ? (
              <>
                {row?.status === 'open' ? (
                  <button
                    className={styles.stop}
                    onClick={() => handleAction('stop')}
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    className={styles.start}
                    onClick={() => handleAction('resume')}
                  >
                    Resume
                  </button>
                )}
                <button
                  className={styles.stop}
                  onClick={() => handleAction('finish')}
                >
                  Finish
                </button>
              </>
            ) : (
              <button
                className={styles.start}
                onClick={() => handleAction('start')}
              >
                Start
              </button>
            )}
            <Image
              className={styles.edit}
              src="/icons/edit.svg"
              alt="Edit Row"
              width={20}
              height={20}
              onClick={() => setIsEditing(!isEditing)}
            />
            {isEditing && <ShopForm shop={shop} setIsEditing={setIsEditing} />}
          </div>
        </li>
        <div className={styles.row}>
          {shop.row && <RowList rowId={shop.row} owner={true} />}
        </div>
      </div>
    );
  }