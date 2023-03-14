import { useEffect, useState } from 'react'
import styles from '@styles/Advertisement.module.css'

export default function Advertisement () {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const show = localStorage.getItem('advertisement')
    if (show !== 'false') {
      setShow(true)
    }
  }, [])

  const closeHandler = () => {
    setShow(false)
    localStorage.setItem('advertisement', 'false')
  }

  return (
    show ? (
      <section className={styles.advertisement}>
        <h2>WARINING!</h2>
        <button className={styles.close} onClick={closeHandler}>X</button>
        <p>
          THIS PAGE HAS BEEN MADE FOR EDUCATIONAL PURPOSES ONLY. IT IS NOT A REAL E-COMMERCE WEBSITE.
          ITS GOAL IS TO SHOWCASE MY SKILLS AS A WEB DEVELOPER. BUY FUNCTIONALITY IS NOT IMPLEMENTED.
        </p>
        <p>
          ESTA PÁGINA SE HA HECHO PARA FINES EDUCATIVOS ÚNICAMENTE. NO ES UN SITIO WEB DE COMERCIO ELECTRÓNICO REAL.
          SU OBJETIVO ES MOSTRAR MIS HABILIDADES COMO DESARROLLADOR WEB. LA FUNCIONALIDAD DE COMPRA NO ESTÁ IMPLEMENTADA.
        </p>
      </section>
    ) : null
  )
}
